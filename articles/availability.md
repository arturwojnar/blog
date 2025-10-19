---
cover: /articles/availability/cover.webp
author:
  name: Artur Wojnar
date: 2024-07-24T00:00:00.000Z
title: "Comparing Time Availability archetype implementations"
description: "How to implement a time-based resource reservation system, assuming high traffic?"
layout: ../layouts/article.njk
tags:
  - software-architecture
  - archetypes
  - postgresql
  - software-development
  - domain-driven-design
  - design-principles
  - availability-archetype
canonical: https://www.knowhowcode.dev/articles/availability
excerpt: "An Archetype is a defined solution to a business problem. The Time Availability answers the question: Can I schedule resource X between D1 and D2?."
readingTime: 20
slug: availability
---

<img class="cover-image article-image" src="/public/articles/availability/cover.webp" alt="" loading="eager" fetchpriority="high" />

### Comparing Time Availability archetype implementations

#### Finding a tailored performant solution


### Before we start...

This article is a direct follow-up to [Jakub Pilimon’s](https://x.com/jakubpilimon?lang=en) workshop “_Domain-Driven Design with functional elements_”, where we had a chance to mull over one of the _Time Availability_ archetype’s implementations.

🔎_This workshop wouldn’t have been possible_ _without_ [_Mateusz Kubaszek_](https://www.linkedin.com/in/🧙-mateusz-kubaszek-58306466/) _and his_ [_Order Of Devs community_](https://discord.gg/efwHbdJp)_._

Along with [Kamil Kiełbasa](https://bd90.pl/), I discovered that this problem can also be solved by one _PostgreSQL’s_ _GiST_ constraint. Kamil also made a nice summary of it on [his blog](https://bd90.pl/system-rezerwacji-w-5-minut/) (for Polish readers).

Lastly, I summarised Jakub’s workshop at my company, where one of my colleagues, [Wojciech Ryczko](https://www.linkedin.com/in/wojciech-ryczko/), pointed out something simple and obvious, yet maybe not as evident as you will see later if you keep reading. Wojciech said this problem can be handled simply with _SELECT_ and _WHERE_ clauses. I was like — “_Yeah, it can be… but it’s pointless!_”.

_**We all came together to question how slow the other two solutions are compared to the “best” option**_ _explained by Jakub_ (Jakub learned about that at one of the _DDD_ conferences).

**And sometimes, you’re pleasantly surprised by how kind people can be.** [Łukasz Rynek](https://www.linkedin.com/in/lukasz-rynek/) is definitely one of those people! He graciously met with me and Mateusz Kubaszek to discuss his large-scale solution. 🎉🥰

**To all of you mentioned here, huge huggy thanks for the inspiration and late-night** **chit-chat.**

🔎_Everything described here, including test results, can be found in my_ [_GitHub repository_](https://github.com/arturwojnar/examples/blob/main/postgresql-availability)_._

### **What is the Time Availability archetype?**

_An Archetype_ is a defined **solution to a business problem**._The Time Availability_ answers the question: “_Can I schedule resource X between D1 and D2?_”.

<p>
  <img class="article-image" src="/public/articles/availability/1.webp" alt="" loading="eager" fetchpriority="high" />
  <em class="image-description">Image 1. Oops! Can't be in two places at the same time!</em>
</p>


Certainly, you bumped into this problem class. *Can I book that cottage house for the upcoming weekend? Can I "book" the babysitter, Alice, for this evening? Can I schedule a Bali massage with Nu Luh next Wednesday at 16:00? Can I have this doctor's call at 14:15-14:30?*

Look at *Image 2*. **It's a generic object's representation of the archetype**.\
A `ResourceLock` represents a single, continuous lock on a resource. The first solution relies on multiple granular 15-minute time slots that constitute locks. The other two solutions use *locks* with single time slots (their length can be as long as you want; business-wise, they are reservations). Generally, it's all about the consistency unit of our aggregate.

`ResourceAvailability` is our `RootAggregate`. It is responsible for creating *locks* and determining whether a resource is available. Its key quality is that it allows us to decide the scope of data we want to keep consistent (as it is for `ResourceLock`)---it depends on what resource availability means to us.

For instance, if we are interested in reservations of doctors' visits, which depend on doctors' calendars, then the *resource availability* will be a single doctor's visit, whereas the consistency scope will also be on the level of single appointments. If we create something like *Airbnb*, many users can try to make bookings for the same apartment at different date ranges so that booking dates can conflict. Thus, the *consistency scope* will be all bookings (locks) for a given apartment (resource).

Here, I will focus on the latter case. Our primary technical challenge is *multiple simultaneous attempts to lock or unlock* the same resource.

<img class="article-image" src="/public/articles/availability/2.webp" alt="" loading="eager" fetchpriority="high" />

Image 2. Object-oriented representation of the TimeAvailability archetype.

Let's dive into three technical solutions for the *Root Aggregate* implementation of the *Time Availability* archetype.

### High-level considerations

Invariants I'm defining for further consideration are:

-   *A resource can have 0 or multiple locks*
-   *Locking is making a reservation for a resource for a specific time period aligned to 15 minutes so that you can start the reservation at 16:45 but not at 16:40*
-   *A reservation can be made by one requester*
-   *Locking can't be done for less than 15 minutes*
-   *Unlocking can be done by the same person who made the locking*
-   *When unlocked at specific dates, the resource can be locked again by another requester*

Quality attributes are:

-   *Lock attempts of the same resource can happen at the same time*
-   *At the same time, there can be over a million different locks*
-   *Per one minute, over 1000 lock or unlock requests can happen*
-   *The longest lock shouldn't be greater than 30 hours*

Implementing the given requirements, such as guaranteeing 15-minute alignments, is straightforward. However, there are two major problems to solve. **The first is how to detect *overlapping locks***. **The second is handling *concurrent access***, ensuring that, for example, two identical requests won't create *duplicate locks*. We need to *reject* conflicting locks. The preferable *concurrency control method,* in this case, is *pessimistic locking*.

The boundary of our *Root Aggregate* is all *locks* for a given resource; otherwise, we won't be able to detect overlaps.

I tested how the solutions would work when detecting conflicts on the app side, but this required loading a significant amount of data within a single *Aggregate*, significantly impacting performance.

**After juggling various implementations, I realized that the optimal way to implement this *Aggregate* is entirely on the *RDBMS/Repository* side** (just like [Jakub Pilimon](https://www.linkedin.com/in/jakub-pilimon-449b7984/) claimed)**.** This approach aligns with the *Root Aggregate* definition as a *write model* that *enforces consistency* and protects *transactional boundaries*. Additionally, it allows us to meet *non-functional* requirements regarding the amount of data.

🔎 *I like Scott Millett and Nick Tune's definition from the Patterns, Principles and Practices of Domain-Driven Design. ISBN 978--1--118--71470--6, page 320, chapter 14. It goes: "Domain-Driven Design has the Aggregate pattern to ensure consistency and to define transactional concurrency boundaries for object graphs".*

🔎*I have to explain myself. I feel I must! I use (now partially) Prisma in my examples because I just wanted to try it out.* ***Generally, I'm strongly against any ORM*** *except simple CRUD cases. But you know that engineer's curiosity... Long story short --- avoid Prisma as it lacks many features and sets you far away from the database; Also, its migration tool just... su*ks! It's more reasonable to pick up* [*DrizzleORM* ](https://github.com/drizzle-team/drizzle-orm)*if you need an ORM.\
I'm much* keener *on an advanced wrapper like* [*porsager/postgres*](https://github.com/porsager/postgres)*. I migrated to it, and the world is again green, sunny and beautiful.*

### Testing

All test cases for all three solutions are analogous. Here, I'm presenting the tests for *time slots* for context and reference. If you are interested, you'll find other test cases on my GitHub repository, linked in the corresponding sections later.

```typescript
import { describe, expect, test } from '@jest/globals'
import { PrismaClient } from '@prisma/client'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import util from 'util'
import { TimeSlot, TimeSlotRepository } from './timeslots'

describe(`time slots`, () => {
  jest.setTimeout(60000)

  const resourceId1 = 1000
  const resourceId2 = 2000
  const requester1 = `artur`
  const timeslots = [
    new TimeSlot(new Date(`2024-05-22 10:00:00`), new Date(`2024-05-22 10:15:00`), resourceId1, requester1),
    new TimeSlot(new Date(`2024-05-22 10:15:00`), new Date(`2024-05-22 10:30:00`), resourceId1, requester1),
    new TimeSlot(new Date(`2024-05-22 10:30:00`), new Date(`2024-05-22 10:35:00`), resourceId1, requester1),
    new TimeSlot(new Date(`2024-05-22 10:45:00`), new Date(`2024-05-22 11:00:00`), resourceId1, requester1),
  ]

  let prisma: PrismaClient
  let container: StartedPostgreSqlContainer

  beforeAll(async () => {
    container = await new PostgreSqlContainer().start()
    const datasourceUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}?schema=public`
    prisma = new PrismaClient({ datasourceUrl })
    await prisma.$connect()
    await runMigrations(datasourceUrl)
  })

  afterAll(async () => {
    await prisma.$disconnect()
    await container.stop()
  })

  test(`time slots can be added`, async () => {
    const repo = new TimeSlotRepository(prisma)

    await repo.createMany(timeslots)
    const result = await repo.find(resourceId1)

    expect(result.length).toBe(4)
    expect(result).toEqual(
      timeslots.map((data) => ({
        ...data,
        id: expect.any(Number),
      })),
    )
  })

  test(`can't add an overlapping timeslot`, async () => {
    const repo = new TimeSlotRepository(prisma)

    await expect(() => repo.lock(timeslots)).rejects.toThrowError()
  })

  test(`the same time slots can be added but for different resource`, async () => {
    const repo = new TimeSlotRepository(prisma)

    await repo.lock([
      new TimeSlot(new Date(`2024-05-22 10:00:00`), new Date(`2024-05-22 10:15:00`), resourceId2, requester1),
      new TimeSlot(new Date(`2024-05-22 10:15:00`), new Date(`2024-05-22 10:30:00`), resourceId2, requester1),
      new TimeSlot(new Date(`2024-05-22 10:30:00`), new Date(`2024-05-22 10:35:00`), resourceId2, requester1),
      new TimeSlot(new Date(`2024-05-22 10:45:00`), new Date(`2024-05-22 11:00:00`), resourceId2, requester1),
    ])
    const result = await repo.find(resourceId2)

    expect(result.length).toBe(4)
    expect(result).toEqual(
      timeslots.map((data) => ({
        ...data,
        resourceId: resourceId2,
        id: expect.any(Number),
      })),
    )
  })

  test(`slots can be unlocked`, async () => {
    const repo = new TimeSlotRepository(prisma)

    await repo.unlock(resourceId1, requester1)

    const result = await repo.find(resourceId1)

    expect(result).toEqual(
      timeslots.map((data) => ({
        ...data,
        id: expect.any(Number),
        locked: false,
      })),
    )
  })

  test(`slots can be locked again`, async () => {
    const repo = new TimeSlotRepository(prisma)

    await repo.createMany(timeslots)
    const result = await repo.find(resourceId1)

    expect(result).toEqual(
      timeslots.map((data) => ({
        ...data,
        locked: true,
        id: expect.any(Number),
      })),
    )
  })
})
```

### "Timeslots solution"

**This solution is well-suited for reading and writing because it's backed by a simple index**, as seen in *Image 3*. Locks are split into 15-minute (the size is just an example) time slots, allowing us to build a unique *B-tree* (*non-clustered*) index on the `resourceId` and the `startTime`. This enables us to catch collisions since only 15-minute time slots can be saved.

<img class="article-image" src="/public/articles/availability/3.webp" alt="" loading="eager" fetchpriority="high" />

Image 3. Unique index handles "conflicts".

**As you can surely notice, that handy solution comes at a price.** What if we switch business-wise to one-minute or 20-minute time slots? What if things change, and at some point, we'd like to have one-hour or one-day time slots to cut down on data amount? Then, it turns out, the solution is not very flexible, and to fulfil domain challenges over time, we will be forced to bend our architecture to its extent. Presumably, with this specific approach, we won't be able to be as flexible as with the other two ways.

The table and the related indexes have been created with the PSQL:

```sql
CREATE TABLE "TimeSlot" (
    "id" SERIAL NOT NULL,
    "requesterId" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TimeSlot_resourceId_requesterId_idx" ON "TimeSlot"("resourceId", "requesterId");
CREATE INDEX "TimeSlot_resourceId_idx" ON "TimeSlot"("resourceId");
CREATE UNIQUE INDEX "TimeSlot_resourceId_startTime_key" ON "TimeSlot"("resourceId", "startTime");
CREATE UNIQUE INDEX "TimeSlot_resourceId_startTime_locked_key" ON "TimeSlot"("resourceId", "startTime", "locked");
```

Here's the implementation of the *lock* method belonging to a *TimeSlotRepository*:

```typescript
async lock(
  slots: TimeSlot[]
) {
  const values: Array<[string, number, Date, Date]> = slots.map((slot) => [
    slot.requesterId,
    slot.resourceId,
    slot.startTime,
    slot.endTime,
  ])

  await this._sql.begin(async (sql) => {
    await sql.unsafe(`
      LOOK AT THE NEXT LISTING FOR FORMATTED SQL 😄
    `)
  })
}
```

```sql
DO $$
DECLARE
    slot JSONB;
    v_locked BOOLEAN;
BEGIN
    FOR slot IN SELECT * FROM jsonb_array_elements('${JSON.stringify(values)}'::jsonb)
    LOOP
        INSERT INTO "TimeSlot" ("requesterId", "resourceId", "startTime", "endTime", "locked")
        VALUES (
          slot->>0,
          (slot->>1)::INTEGER,
          (slot->>2)::TIMESTAMPTZ,
          (slot->>3)::TIMESTAMPTZ,
          True
        )
        ON CONFLICT ("resourceId", "startTime")
        DO UPDATE SET "startTime" = EXCLUDED."startTime",
            "endTime" = EXCLUDED."endTime",
            "requesterId" = EXCLUDED."requesterId",
            "locked"=True
        WHERE "TimeSlot"."locked"=False
        RETURNING "TimeSlot"."locked" INTO v_locked;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'CONFLICT';
        END IF;
    END LOOP;
END $$;
```

So, we either `INSERT` if a given time slot doesn't exist, or we `UPDATE` to lock the time slot again. The `ON-CONFLICT` pattern used in the above SQL is equivalent to the `UPSERT` operation. If this clause ends up with no result, meaning neither `INSERT` nor `UPDATE` was done, it indicates a conflict occurred.

Oh, of course, there has to be also some code to convert *a date range* into *time slots* like this:

```typescript
const TO_MINUTES = 60000

function getSlotsForDateRange(requesterId: string, from: Date, to: Date) {
  // Calculate slots required
  if ((from.getTime() / TO_MINUTES) % 15 !== 0) {
    throw new Error(`The date has to be a multiple of 15 minutes`)
  }
  if ((to.getTime() / TO_MINUTES) % 15 !== 0) {
    throw new Error(`The date has to be a multiple of 15 minutes`)
  }

  const durationMinutes = (to.getTime() - from.getTime()) / TO_MINUTES
  const slotsRequired = Math.ceil(durationMinutes / timeSlotSize)

  return Array(slotsRequired)
    .fill(0)
    .map((_, i) => {
      const startTime = new Date(from.getTime() + i * timeSlotSize * TO_MINUTES)
      const endTime = new Date(startTime.getTime() + timeSlotSize * TO_MINUTES)
      return new TimeSlot(startTime, endTime, this.resourceId, requesterId)
    })
}
```

To *unlock,* we should rely on *startTime* on which the index is placed:

```typescript
async unlock(resourceId: number, requesterId: string, startTime?: Date, endTime?: Date) {
  const startDates = Array((endTime.getTime() - startTime.getTime()) / (15 * 60000))
    .fill(0)
    .map((_, i) =>
      dayjs(startTime)
        .add(15 * i, 'minutes')
        .toDate()
        .toISOString(),
    )
  const result = await this._sql`
    UPDATE "TimeSlot"
    SET "locked" = false
    WHERE "resourceId" = ${resourceId}
    AND "requesterId" = ${requesterId}
    AND "startTime" IN (${this._sql(startDates)})
  `
  return result.count
}
```

### "The SELECT solution"

The obvious solution is a `SELECT FOR UPDATE` query with a `WHERE` clause checking for overlapping dates. **However, we can't manipulate the** `**locked**`**column this time because we don't have time slots, only entire reservations.** It's unlikely that all users will be locking and unlocking the same date ranges every time. Therefore, when a *reservation* is unlocked, it is marked as *deleted* and, consequently, can't be reused later.

You can find the tests here, and the full implementation is [here](https://github.com/arturwojnar/examples/blob/main/postgresql-availability/src/select/select-timeslots.ts).
The table and the related indexes have been created with the PSQL:

```sql
CREATE TABLE "TimeSlot2" (
    "id" SERIAL NOT NULL,
    "requesterId" TEXT NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TimeSlot2_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TimeSlot2_resourceId_requesterId_idx" ON "TimeSlot2"("resourceId", "requesterId");
CREATE INDEX "TimeSlot2_resourceId_idx" ON "TimeSlot2"("resourceId");
CREATE UNIQUE INDEX "TimeSlot2_resourceId_dates_deleted_idx" ON "TimeSlot2"("resourceId", "startTime", "endTime", "deleted");
```

*Locking* implementation:

```sql
DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT 1 AS "count"
  INTO v_count
  FROM "TimeSlot2" t
  WHERE "t"."resourceId"=${resourceId}
    AND "t"."startTime" < '${to.toISOString()}'
    AND "t"."endTime" > '${from.toISOString()}'
    AND "t"."deleted"=False
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    RAISE EXCEPTION 'CONFLICT';
  END IF;

  INSERT INTO "TimeSlot2" ("requesterId", "resourceId", "startTime", "endTime", "deleted")
  VALUES (
    '${requesterId}',
    ${resourceId},
    '${from.toISOString()}',
    '${to.toISOString()}',
    False
  );

END $$;
```

The query analysis shows that the database engine utilized the *B-tree index* placed on the `resourceId` column and planned a *Bitmap Index Scan* for this query, which is not bad. The entire table is not scanned; the bitmap structure keeps pointers found during the index scan and in the end, because of the `LIMIT`, only one row is locked. As the [pganalyze docs](https://pganalyze.com/docs/explain/scan-nodes/bitmap-index-scan) say:

> You can think of a bitmap index scan as a middle ground between a sequential scan and an index scan. Like an index scan, it scans an index to determine exactly what data it needs to fetch, but like a sequential scan, it takes advantage of data being easier to read in bulk.

> The bitmap index scan actually operates in tandem with a Bitmap Heap Scan: it does not fetch the data itself. Instead of producing the rows directly, the bitmap index scan constructs a bitmap of potential row locations. It feeds this data to a parent Bitmap Heap Scan, which can decode the bitmap to fetch the underlying data, grabbing data page by page.

<img class="article-image" src="/public/articles/availability/4.webp" alt="" loading="eager" fetchpriority="high" />

Image 4. Bitmap Index Scan for the *SELECT FOR UPDATE* query.

*Unlocking* looks this way:

```typescript
async unlock(resourceId: number, requesterId: string, startTime: Date, endTime: Date) {
  try {
    const result = await this._sql`
      UPDATE "TimeSlot2"
      SET "deleted" = true
      WHERE "requesterId" = ${requesterId}
      AND "resourceId" = ${resourceId}
      AND "startTime"=${startTime.toISOString()}
      AND "endTime"=${endTime.toISOString()}
    `
    return result.count
  } catch (error) {
    console.error('Error unlocking timeslot:', error)
    throw error
  }
}
```

It is worth noting that the two covered implementations rely on unlocking, which is a simple `UPDATE` using dedicated indexes. Thus, their performance results will likely be similar.

### "The GiST solution"

The [*GiST* ](https://www.postgresql.org/docs/8.1/gist.html)(*Generalized Search Tree*) is one of PostgreSQL's indexes that can be combined with a set of constraints. **The interesting one for us is the exclusion constraint, an extension of uniqueness, but with that difference, the exclusion guarantees that no two rows overlap.**

In the listing below, you can see how a table with an exclusion constraint can be created. The configuration possibilities are quite impressive. I ensured that the `resourceId` was taken into account and compared by exact equality (*operator "="*), and the `date_range` was compared by checking for overlap (*operator "&&"*). Additionally, only rows within the *GiST* index with falsy `deleted` values can be found as colliding.

```sql
-- create the extension first
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE "timeslot3" (
    "id" SERIAL NOT NULL,
    "requesterid" TEXT,
    "resourceid" INTEGER,
    "date_range" tsrange,
    "deleted" BOOLEAN,
    CONSTRAINT "timeslot3_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "timeslot3_excl" EXCLUDE USING GIST
    (
        "resourceid" WITH =,
        "date_range" WITH &&
    ) WHERE ("deleted" IS FALSE)
);

CREATE UNIQUE INDEX "TimeSlot3_resourceId_daterange_deleted"
 ON "timeslot3"("requesterid", "resourceid", "date_range", "deleted");
```

Please note that the `timeslot3_resourceId_daterange` index is applied to a set of most of the existing columns (`requesterid`, `resourceid`, `date_range`) to satisfy the access pattern for unlocking.

*Locking* and *unlocking* is then easy:

```typescript
async lock({ requesterId, resourceId, date_range }: TimeSlot) {
  await this._prisma.$executeRawUnsafe(`
    INSERT INTO "timeslot3" (requesterId, resourceId, date_range, deleted)
      VALUES (
        '${requesterId}',
        ${resourceId},
        daterange('${date_range[0].toISOString()}', '${date_range[1].toISOString()}', '[]'), False)
  `)
}

async unlock(requesterid: string, resourceid: number, startTime?: Date, endTime?: Date) {
  return await this._prisma.$executeRawUnsafe(`
    UPDATE "timeslot3" SET "deleted"=True
    WHERE "requesterid"='${requesterid}' AND
      "resourceid"=${resourceid} AND
      "deleted"=False AND
      "date_range"=tsrange('${startTime.toISOString()}', '${endTime.toISOString()}', '[)')
  `)
}
```

The SQLs for this solution are the easiest ones because we rely only on the GiST index with the exclusion, no jumble and no puzzles.

### Comparing performance

To examine which solution performs the best, I defined four metrics:

1.  *Average time to successfully add a new lock (lock, aka reservation)*
2.  *Average time to fail when adding a new lock (conflict)*
3.  *Average time to unlock*
4.  *Average time to lock the same resource again*

Initially, I generated 10,000 locks and obtained comparable results for all three methods. Therefore, I finally decided to conduct tests with the following set:

-   *1,000 resources*
-   *Each resource has 1,000 locks*
-   *Each reservation lasts 30 hours (120 time slots for the first solution)*

Initially, I generated 10,000 locks and obtained comparable results for all three methods. Therefore, I finally decided to conduct tests with the following set:

-   1,000 resources
-   Each resource has 1,000 locks
-   Each reservation lasts 30 hours (120 time slots for the first solution)

That gives 120 million rows for the first solution and a million for the other two.

<img class="article-image" src="/public/articles/availability/5.webp" alt="" loading="eager" fetchpriority="high" />

Image 5. Comparison of the average time of operations of all three solutions for a million reservations.

**Basically, we can confidently say that all three solutions are equally efficient.** A million rows is not a small amount, so it should have shown significant differences in performance. But it didn't. What's more perplexing is that, with my current knowledge, I can't explain why the second solution (the "*SELECT*" one) appeared so effective.

I bumped up the number of rows for the *SELECT* and *GIST* solutions to 120 million to make them more comparable to the first solution regarding the absolute number of tuples. *But, again, the implementations don't diverge from each other.*

Unfortunately, this means I have to do more tests. Nothing proves more about the quality of our solution than reliability while *concurrent access*.

### Comparing performance on concurrent access

Let's test how our solutions will cope under medium load. Imagine that 10-thousand simultaneous requests to lock a resource happen.

<img class="article-image" src="/public/articles/availability/6.webp" alt="" loading="eager" fetchpriority="high" />

Image 6. 10000 new reservations done concurrently.

**Without a shred of doubt, all three functions do well and are comparable** (if your client is OK with a request taking a second and a half).

**And how do things look for a million simultaneous requests?** **The proportions remained consistent** (Image 6), but the average time surged to the minute level, from one and a half to over three minutes. On this scale, the GiST solution has the most noticeable advantage. However, if your system is expected to handle this kind of load regularly, then your customer likely won't appreciate these results.

In that situation, you can test your implementation on *a* *vertically scaled PostgreSQL* instance and see how more *physical memory* and *vCPU* impact the performance. If the results still won't be satisfying, then maybe the *immediate consistency* solution is not for you, and your attention should be drawn toward a [compensation mechanism](https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction) for a [Write-Ahead Log pattern](https://martinfowler.com/articles/patterns-of-distributed-systems/write-ahead-log.html) implementation, that is, for bigger loads.

Additionally, consider tailoring your solution to your specific business case, which may have particular requirements to help narrow down some scenarios, such as predefined appointments. Lastly, you can explore a solution based on specialized tooling (see the next chapter).

<img class="article-image" src="/public/articles/availability/7.webp" alt="" loading="eager" fetchpriority="high" />

*Image 7. A million new reservations done concurrently.*

**I also performed tests for concurrent access for unlocking --- the results are good and acceptable even for a million simultaneous requests.** But I knew the results upfront. I'm not a Nostradamus --- all of the implementations are straightforward and rely on indexes, and they come down to a single `UPDATE` statement. The performance of *the time slot solution* depends on how many slots are updated at once.

### Solutions based on tooling

So far, I've only been focusing on "traditional" solutions based on a relationship database, varying in a consistency unit ("small" timeslots consisting of a reservation or whole reservations). The closest solution to this subtopic is the GiST one.

These days, we read about more and more tools that resolve a particular problem. **Despite not being the biggest fan of solutions driven based on a specific technology, I do see at least a few strong proses of "*Technology Driven Development*"**. One of those is that someone has already done that. If we're fine with the license, deploying, maintaining, potential outages, and difficult-to-oversee future changes in this dependency, and if you're dedicated to expertise in this tool (often a superficial understanding of your 3rd party technology is not enough), then maybe it's a way to go.

What technologies can we use for our case?

[Łukasz Rynek](https://www.linkedin.com/in/lukasz-rynek/), a Tech Leader at [Docplanner](https://docplanner.tech/) (on the Polish market known as "*Znany Lekarz*"), was kind to help me understand their approach. *The Docplanner* system helps you find a specialist and book a visit at a convenient time. Specialists are ranked depending on many factors to suit the best patients' needs.

First, Łukasz mentioned that their solution is not as generic as I described. What we've been primarily focusing on in this article is a system in which users can try to reserve whatever time range they want to, and the system cares about the consistency of all of that. As I wrote in "*What is the Time Availability archetype?*" this is a case when users rely on someone else's calendars that are predefined in the system. Hence, the users compete for those predefined slots to change them into their bookings.

🔎*If you're interested in the Docplanner company and their work, please visit their* [*Medium blog*](https://medium.com/docplanner-tech)*.*

Secondly, Łukasz said **they work in a highly distributed system where possible reservations and available visits are managed by** [**Elasticsearch**](https://www.elastic.co/elasticsearch). Although most operations leave the system in a consistent state, sometimes it's not. It is an *eventually consistent* solution; some deviations and unwanted effects are mitigated with compensation.

**Mateusz Kubaszek, whom I mentioned initially, suggested that Apache Flink can handle the problem successfully** (quoting the docs---"Stateful Computations over Data Streams"). We can use Flink's capabilities to process and analyse streaming data to achieve the desired functionality in Apache Flink, where no two timeslots can overlap. The idea is to maintain a state that keeps track of the current time slots and checks for overlaps whenever a new request occurs (by continuous processing streams).

🔎*At the time of writing, Microsoft SQL Server doesn't have a dedicated index/constraint to exclude conflicting date-time ranges. The same goes for MongoDB.*

**What else can be done?** We can implement a mechanism that if the load is too big, let's say --- it goes under a million simultaneous requests. Then, it switches from immediate consistency to something else. We can gather incrementing logs ([Write-Ahead Log Pattern](https://martinfowler.com/articles/patterns-of-distributed-systems/write-ahead-log.html)) for that more intense time period and analyze them by a separate process, which aims to generate results that will eventually transform into target locks or be rejected.

You can always seek for further database optimizations.

**Do you have other ideas? Or have you already done it somehow? Please share!**

### Summary

If you had pointed a gun to my head demanding a short, most likely safe option for your project that doesn't experience a million concurrent requests at the same time the whole time, I'd say try with PostgreSQL and a GiST index with an exclusion constraint.

But I don't have any gun at my head, and I have still some time 🙂

It all comes (as it mostly does) to your business case. Let's remember our example with booking predefined slots. That's a perfect limitation of all possible time slots. Maybe your domain allows you to create one-month upfront slots where users can reserve 15-minute time slots, but only between 9 A.M and 5 P.M., That can be *a car repair shop* type of business. Depending on the *service type*, whether a seasonal tyre change or a more complicated air conditioning cleaning, users can book a visit with duration and time varying depending on the service type.

I'm pretty convinced that many domains work that way.

If reservations are more generic without any boundaries dictated by the business and you cannot cheat on the immediate consistency, then all of the solutions I've brought up can be valid.

Time slots are clever because they perfectly fit database engine indexes. From that perspective, they feel like a well-sharpened knife, especially when you can narrow the number of slots. **But maybe the knife doesn't have to be perfectly sharpened if the chef is a two-star Michelin winner?**

Unfortunately, it's **the least flexible solution** because the business can come up with the idea of 3-minute time slots. Then, depending on the resource type or reservation type, the slots will be different lengths. It's a lot of the play.

That's why the third solution would be considerable if you use PostgreSQL. I haven't found a weak spot; on the contrary, it's the best option for bigger loads, as seen for a million simultaneous requests.

But why does the solution based on the *Bitmap Search* keep up with the others? I don't know. **Several dozen years of relational database optimization have done their job**. **If you know, dear reader, please comment on this post. I will be more than happy.**

If your database engine doesn't provide an equivalent of what we've done here, then the "*SELECT*" solution may work for you.

You might think that since time availability issues are so common, the solutions to handle them would be well-known and thoroughly documented. However, my article aims to highlight just how complex and challenging these problems can be. I was personally surprised by what I discovered.