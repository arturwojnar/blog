---
cover: /articles/outbox/cover.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2025-03-03T00:00:00.000Z
title: Every* system you develop is distributed, and Hermes PostgreSQL supports you in that
description: Pretending it is not exposes your client’s system to the unpredictability of the world’s reality.
layout: ../layouts/article.njk
tags:
  - distributed-systems
  - postgresql
  - outbox-pattern
  - nodejs
  - typescript
  - hermesjs
canonical: https://www.knowhowcode.dev/articles/outbox
excerpt: "A comprehensive introduction to distributed systems and how Hermes PostgreSQL implements the Outbox pattern for reliable message publishing"
readingTime: 39
published: true
---

<h3>A comprehensive introduction to distributed systems</h3>

<img class="cover-image article-image" src="/public/articles/outbox/cover.webp" alt="" loading="eager" fetchpriority="high" />

**Every system you develop is distributed. Pretending it is not exposes your client’s system to the unpredictability of the world’s reality.**

Modern software development relies strongly on _third parties _— generic _subdomains_ packed as _commodities_. Delegated authentication, RBAC management, notifications, etc. Combining commodity services with your client’s market leverage, a _unique value proposition_, creates a product.

This is wonderful: we can cut down on implementations commonly considered generic, but also put a new shiny burden on your shoulders.

Before we start, I want to give a big, smiling thanks to [Damian Płaza](https://www.linkedin.com/in/damian-plaza/), an excellent programming philosopher and speaker, for detailed verification of this article. I always feel a need for a review by someone wiser than me.

Working example from this text you’ll find in the [Hermes repo](https://github.com/arturwojnar/hermes/blob/main/examples/postgresql/patient-registration/index.ts).

#### Inspiration

I tackled this article from the perspective of _internal dialogue with my friend_, who is _constantly resistant to adding any level of complexity to projects_. That is why I concluded I shall write a _guidance_ embedding the following thought: **Even the most straightforward features may loom on us a shadow of the sinister complexity! Don’t confuse simple solutions with trivial solutions. All you need is know-how.**

#### The case

Imagine a simple situation — _patient registration_. Two actions are required — registering a new account in an _Identity Provider (IP)_ and creating a new _tuple_ in a database that couples the IP’s user _subject_ with your _domain identifier_ (a database ID).

> 💡I’ll be referring a user in context of the IP, because it is a generic component, and a patient in context of the business case (app side).

**What can go wrong?**

**When the running application goes down** (because of an outage or your orchestrator’s planned job; remember that containers are _ephemeral_) just after the first action is completed successfully, you end up in an inconsistent state.

Analogously, you successfully write that tuple and want to send an event that says it has happened. That event can be utilised to build a _read model_.

But again, when the app container goes down after the successful write and before sending the event, we hit a wall of _inconsistency_.

We can try to wrap the actions in a _try..catch_, but what if the IP is acting up and we can’t revert the action?

And that’s all despite the fact we work with, so-called, a “_monolith_” app 😀

#### Why the events and commands, after all?

Because it’s the most natural way of describing changes in our world.

We have heard many times that _every action has a reaction_. Things around us happen _over time_. When you turn on the light, the electric circuit needs _propagation time_ in which electrical current from the power source gets into the bulb’s thin filaments. It seems like it happens immediately when your finger clicks a light switch, but actually, it does not.

We can take a different approach, though.

**The _reliability_ of _transactional operations_ can be ensured and increased by correctly implementing the _Outbox pattern_.** In other words, we can help ourselves by following the old-good fellow _Write-Ahead Log_.

#### A simple perspective on Write-Ahead Log

Please, look at the _Image 1_. Before the database considers a transaction as _received_, it first must write it successfully down to an _append-only log_. It happens like this because a transaction can consist of many operations (_inserts_, _updates_, _deletes_), which may get lost during their application when an unexpected outage occurs.

Moreover, the database will be inconsistent due to a lack of knowledge of what other operations should be applied next to complete the transaction. If that transaction were first stored in the log, it’d clear which operations were applied and which were not after the restart. Without that, we’d apply one of two inserts of _Transaction #1_ to a table, as we’d not know that it was part of an uncompleted transaction.

It seems natural that databases store information about incoming transactions somewhere else. This “_somewhere else_” is the _Write-Ahead Log (WAL)_.

<article-image src="/public/articles/outbox/outbox-1.webp" label="Image 1. Simple perspective on Write-Ahead Log."></article-image>
**Let’s leave the theory for a while and skip straight to an example! 🙂**

#### Registration process, as you may know it

I’d bet dollars to doughnuts that you often implemented a registration process. That may be news for you, but it could have happened that you haven’t provided a fully reliable solution. (But if it’s clear, you can skip to the next section).

Imagine an API (backend), a database and an _OpenID Connect_ provider (_Keycloak_, _Auth0_, FusionAuth, _AWS Cognito_, etc…), and the goal is to register, let’s say, _a new patient_ (that is closer to my domain).

-   First, we want to register a new user through _OIDC’s API_ (#1)
-   Then, we get a user’s sub(ject) in response (#2)
-   Next, we want to store a new user with the received subject (#3).
-   The completion of the process is a response from the database insert operation (#4).

It is visualised in the _Image 2_.

> 💡You can think of any variation of that process. You can generate the sub upfront and call two simultaneous requests. You can make more steps like updating OIDC’s user with the database ID to contain it in access tokens, etc.

<article-image src="/public/articles/outbox/outbox-2.webp" label="Image 2. Diagram of the registration process."></article-image>

I almost forgot. Since we model our system with events, we want to publish either the `PatientSuccessfullyRegistered`or `PatientRegistrationFailed`as the result of the process.

#### A brave developer overwhelmed by piling-up problems

```ts
import crypto from 'node: crypto'
import express from 'express'
import { parseUuid4 } from '@arturwojnar/hermes'

const app = express()

const parsePatientId = (value: string) => parseUuid4<'PatientId'>(value) as PatientId

app.post<string, any, RegisterPatientResponse, RegisterPatientRequest>('/patient', async (req, res) => {
  const { body } = req
  const patientId = parsePatientId(crypto.randomUUID())
  const oidcSubject = await addUserToIdentityProvider(body.email)

  await storePatient(patientId, oidcSubject)
  // 🚨⚠️💥
  await messageBus.publish(literalObject<MessageEnvelope<PatientRegisteredSuccessfully>>({
    kind: 'event',
    type: 'PatientRegisteredSuccessfully',
    data: { patientId: data.systemId, patientSub: data.sub },
  }))

  res.send({ id: patientId })
})
```


The implementation is _clear_ and _straightforward_. When an HTTP request reaches the server, we generate a UUID for the patient; then, we call two _I/O functions_ — `addUserToIdentityProvider`and `storePatient  
`First, it returns the subject value of the newly registered user in the OIDC provider. This value will link patient data on the backend side with the identity provider’s users.

At the end, we publish information about the fact of the patient registration. For now, let’s skip where the `messageBus`comes from.

And… That works. The job is done.

But, as you know or suspect, we can encounter potential problems here. Let’s tell them out loud:

➡️ **Problem 1**. Something may go wrong. There is an event indicating success, but not **the opposite event.**

➡️ **Problem 2**. What if the execution of the `addUserToIdentityProvider`  finishes with the OK, but the `storePatient`  **fails**, or it is not reached at all?

<article-image src="/public/articles/outbox/hmm.webp" label="Image 3. A developer giving it a quick thought."></article-image>
The next version of the implementation is better. (I shortened it a bit to highlight what’s the most important).

```ts
app.post<string, any, RegisterPatientResponse, RegisterPatientRequest>('/patient', async (req, res) => {
  const { body } = req
  const patientId = parsePatientId(crypto.randomUUID())

  const oidcSubject = await addUserToIdentityProvider(body.email)
  // 🚨⚠️💥
  try {
    await storePatient(patientId, oidcSubject)
    // 🚨⚠️💥
    // cut-out: publish a successful event
    res.send({ id: patientId })
  } catch (error) {
    await removeUserFromIdentityProvider(oidcSubject)
    // 🚨⚠️💥
    // cut-out: publish a fail event

    throw error
  }
})
```

Now, when the OIDC user is created, we securely insert data into the database, so in case of an error, the `removeUserFromIdentityProvider`is called. It reverts the first action taken (adding the OIDC user). After that, we publish an event that says: “_Hey, you know, that registration didn’t go so well_”.

Problems? Yes, please:

➡️ **Problem 3**. What if the app is abruptly torn down by external circumstances just after jumping into the _try..catch_ block? So, do we end up with Problem 2 only in a different place?

Giving it a second thought. **Publishing events is also an I/O operation**.

➡️ **Problem 4**. What if `removeUserFromIdentityProvider`completes, reverting the operation, but the fail event won’t be published? (Probably, in that case, the impact won’t be significant)

➡️ **Problem 5**. What if storing the patient entity finishes successfully, but the success event won’t be published?

➡️ **Problem** **6**. What if the reverting fails because the OIDC service is not available at the moment?

The last problem brings us to another variation of the previous implementation.

```ts
app.post<string, any, RegisterPatientResponse, RegisterPatientRequest>('/patient', async (req, res) => {
  const { body } = req
  const patientId = parsePatientId(crypto.randomUUID())

  let oidcSubject: Subject | null = null

  await sql
    .begin(async () => {
      oidcSubject = await addUserToIdentityProvider(body.email)
      await storePatient(patientId, oidcSubject, sql)

      // publish a successful event

      res.send({ id: patientId })
    })
    .catch(async () => {
      if (oidcSubject) {
        for (let i = 0; i < 10; i++) {
          try {
            await removeUserFromIdentityProvider(oidcSubject)
            // publish a fail event
          } catch {
            await setTimeout(Duration.ofSeconds(10).ms)

            if (i === 9) {
              // log the stuff (and forget :D)
            }
          }
        }
      }
    })
})
```


Well done, you sneaky developer!

Different approach. We wrapped everything within an SQL transaction. If it fails, we try to call `removeUserFromIdentityProvider`up to 10 times; if all attempts fail (unresponsive OIDC), we log the info about that and… you know… kinda forget about that.

> 💡Also, wrapping the implementation within a transaction is not helpful. It would have been helpful if we had more database operations, but with only one, it doesn’t benefit us (only if `res.send` fails, then the database insert would be reverted).

It turns out that we don’t yet have a remedy for _Problem 3_ — _when an app gets abruptly torn down_. Also, when reverting is not completed, even though we happily logged that happening, we still must do it so.

**We will be inconsistent**. What else can we do? We can _periodically_ check whether users in the OIDC match the corresponding patient accounts on the backend side. If the patient entity is missing, we can try to revert the operation again. That should solve _Problem 6_.

How can we address _Problem 5_? **We can save the events we send** and, similarly to the previous solution, check the consistency of the registered patients with the corresponding events stored in the database. If an event is missing, we can send it.

Can we solve _Problem 4_ the same way as _Problem 5_? After the revert, we don’t have any trace of what happened. We don’t have a patient entity we can deduce based on that, we had to undo the registration.

Well… We can if we **put into the database information that the creation failed**.

It’s not perfect because we have to save it first. What if the database is not available at the moment? That’s why the save failed, and now the information about the failed patient registration attempt can’t be stored either.

That would be sth like:

```ts
try {
  await storePatient(patientId, oidcSubject, sql)
} catch (e) {
  await storeFailedAttemptOfRegistration(patientId, oidcSubject, sql)
}
```

I can go and go with the successive iterations of attempts to make things right. But the proper reaction right now should be:

<article-image src="/public/articles/outbox/fck.webp" label="Image 4. A brave developer overwhelmed by piling-up problems."></article-image>

#### WAL for the rescue

The solution will be the _Write-Ahead Log_. **Before proceeding with the execution, we store first what is about to happen**.

The core problem is the _atomicity_ of our I/O operations. The OIDC API works in its context, and the backend’s database in its context. They both work in _separate transactions_, but only when both are completed successfully, they consist of a business value. This is a _distributed transaction_ in a place where many developers think it won’t happen because they work with a monolith application.

**How can we help ourselves?**

We can wrap context-separated operations in a _logical unit_ by saving information about them within one actual database transaction. Somehow like this:

```ts
// -----------------one transaction--------------------------
await sql
  .begin(async () => {
    await addUserToIdentityProvider(body.email)
    await storePatient(patientId)
  })
// ----------------------------------------------------------
```


Now, we have to switch our thinking.

These operations we work with are _events_ and _commands_. In general — _messages_ to be delivered, but on the reasoning, domain and abstraction level, these are either events or commands.

Quick revision.

➡️ An event is a message describing something that has already happened in the system. An event can be consumed by many interested parties, e.g. to build _a read model_ or translate that event into another command.  
The publishing party is not interested in a result of the event publication.

➡️A command is a message describing an intention to change a state of the system. One dedicated party consumes a command, which can eventually lead to engaging more components in the process. Commands result in facts (events).  
The sending party is usually inserted in the command’s result.

<article-image src="/public/articles/outbox/events.webp" label="Image 5. Revision of commands and events."></article-image>

Once the intentions are saved in the database, we can pull them back from it (by checking periodically), and when they are delivered, we have to remember that it happened. So, before going into the distributed transaction, we save the information we want to execute `addUserToIdentityProvider`_._ Unfortunately, we can’t do the save at the time with the `storePatient`because it depends on the result of the first one. When the first command is delivered and executed successfully, we only save the information we want to send to the command. When this is completed, we can save the information we want to send about the event, saying everything is as expected.

With this “borrowed” solution, we can guarantee that messages we save to the WAL will eventually be delivered to the app — to be precise, to the app’s message bus, as we work in an event-driven fashion.

When the app gets a message, it is up to the app to say it got it. If it doesn’t do so, or an error happens, the message is considered not delivered and will be delivered again. This pattern is called _acknowledging_.

We can proceed to the following message only when the previous one is acknowledged, which means we have to store a current position to restore the state after a restart.

> 💡I’ll be using the words acknowledge and confirm interchangeably

Look at the below listing.

```ts
const handler = async (acknowledge) => {
  await inputOutputOperation()
  acknowledge()
}
```


We can still experience the same problem as earlier: the I/O operation is completed successfully. Still, the app is terminated before acknowledging that fact (similar to sending the success event before).

But the situation is better now because we track the _state_, and after the unexpected exit, we will return to the last message, which wasn’t acknowledged. That results in calling the `inputOutputOperation`for the second time. This behaviour is called _at-least-once delivery_. That means we must know our codebase that handles messages should be _idempotent_. It’s a consequence of the _Write-Ahead Log design_.

_Write-Ahead Logging_ ensures _the atomicity_ and _durability_ of operations, so we were aiming for the two things. Two ACID properties (_atomicity_, _consistency_, _isolation_, _and durability_) are crucial in relational databases.

The messages we save are _durable_ because we store them in a database before they are picked up for delivery.

The messages are delivered in an _atomic_ way — only if the delivery is confirmed (acknowledged), the message is considered as delivered and the WAL position can be incremented.

_Write-Ahead Logging_ was described in the early 1970s.

The approach applied solely to databases has been adapted to software applications and distributed systems and was called the _Outbox Pattern_.

The specific implementation of the Outbox pattern does matter. This is often a _pulling mechanism_ — periodically asking for new messages. This solution has some _profound_ implications, as described in a dedicated session, but sometimes implementations can rely on databases’ APIs, which are _façades_ over their internal _append-only logs_. For instance — _MongoDB’s Change Streams_ and _PostgreSQL’s Logical Replications_.

See the image that visualises how we can utilise the WAL pattern to achieve _durability_ and _atomicity_, which will increase the _reliability_ of our solution.

<article-image src="/public/articles/outbox/outbox-3.webp" label="Image 6. WAL + in-app processing."></article-image>
Before the final implementation, let’s consider why we are even doing this.

#### How often do apps crash, leaving the system in an inconsistent state?

I sparked this topic a bit before. We live in a world of _integrations_. Integration with OIDC providers is one of many examples. Besides, we can encounter other popular examples:

➡️ DBaaS. Imagine you must call its API to set up some roles and permissions when instantiating a new tenant.

➡️ R(e)BAC tools, like _Permify_ or _OpenFGA,_ Sometimes proper permissions management is more demanding, especially in multi-tenant environments where e.g. medical organisations can exchange their data.

➡️ You have to check the state of a run task, e.g. by _Apache Airflow_ or by a _Kubernetes_ job

➡️ You call another service of your organisation or of your client’s organisation to meet some goal

I mean, there can be plenty of reasons why the requirement you implement can consist of calls that go out of your current context.

**Ok, but should we even care about the margin of cases?** What’s the likelihood of a crash/outage/restart/whatever of my application in between I/O operations? 3%? 10%?

This is honestly an actual question I’ve been asked by one of my clients. And I have to admit that I didn’t know how to answer that question. I googled that, hoping for some stats, but I was disappointed when I realised there were none.

So, let’s try to summarise why your app can go down.

Containers are _ephemeral_ by design. Kubernetes or another orchestrator like _AWS Elastic Container Services_ can close your containers for various reasons:

➡️ Node maintenance, drain operations, or cluster scaling

➡️ When nodes become unhealthy or unreachable

➡️ Based on pod disruption budget policies that define availability requirements

➡️ If a pod exceeds its resource limits (CPU/memory)

➡️ If the liveness or readiness probe failed

➡️ If the health check reports some issues (that can be a matter of imperfect configuration or not adjusting to the provider’s guidance).

➡️ During _rolling updates_ (when a new version of your application is being deployed)

➡️ On scaling as traffic lowers, pods also get scaled down

➡️ Because of changes in a configuration, such as a _pod template_ or _Task Definition_ (AWS ECS)

➡️ Because of the cluster upgrade

But you can say — hey, there is a _graceful shutdown_. Yes, the orchestrators should respect that, but the _SIGTERM_ signal will be sent after some time (like 30 seconds).

And these things are every day.

➡️ A bug that pops in between your asynchronous steps

➡️ Network partitioning failures like damaged cables, failed routers, traffic overload, outages, malicious attacks

That is why I firmly believe, and based on my experience, that it happens more often than you think.

**And now is the time to go into our refactored, reliable solution!**

#### Hermes PostgreSQL for the rescue

I want to show you an example that is as close to production code as it makes sense. **There’s nothing more harmful than trivial examples containing bad practices because it’s shorter that way**.

But first, I want to show a classical use case for the Outbox:

```ts
const patientRegisterdEvent = literalObject<MessageEnvelope<PatientRegisteredSuccessfully>>({
  message: {
    kind: 'event',
    type: 'PatientRegisteredSuccessfully',
    data: { patientId: data.systemId, patientSub: data.sub },
  },
  messageId: constructMessageId('PatientRegisteredSuccessfully', data.sub),
})

await sql.begin(async (sql) => {
  await storePatient(data.systemId, data.sub, sql)
  await outbox.queue(patientRegisterdEvent, { tx: sql })
}).catch((error) => /* send a failure event */)
```


Please take a closer look at the transaction. It stores a new entity in the database and _saves an event in the outbox_ that has yet to be published. And that happens in _the same database transaction_, even though the two operations, so storing data in the database and publishing an event by a message broker, are two separate things. **But yet, with an outbox, we can do a trick and pretend it is the same operation**. “Pretend” because saving that event to the outbox doesn’t equal publishing it by the _message broker_. But, as we already know, the outbox will eventually deliver the message there (or wherever we want) at least once. Cool, huh?

Now, I will show you how to implement the registration flow I mentioned before in a reliable way.

We work with a modular monolith. Our backend is one deployable unit (container). We don’t have a standalone message broker like _Apache Pulsar_, _RabbitMQ_ or _AWS Message Queuing Service._ We don’t want it because it’s an additional complexity for us. Having a messaging platform like this requires specific _know-how_ from the development team since when a message broker is deployed, it becomes a vital part of the infrastructure. We put ourselves out to complex hot fixes if it fails due to improper configuration. So, in the team, there has to be someone who knows the tool like the back of one’s hand

We will be using an _in-memory message queue_.

I’m using a product out of a shelf provided by the _Emmet_ by _Oskar Dudycz_. It is simple, but why implement that from scratch since I can use a well-tested implementation of a more experienced colleague?

Now, I have to put out the difference it makes.

If we were using a message broker, then the high-level architecture would look like this:

<article-image src="/public/articles/outbox/outbox-4.webp" label="Image 7. Combination of Hermes PostgreSQL and a message broker."></article-image>
As an Outbox pattern implementation, the Hermes PostgreSQL ensures that a message is _delivered at least once_. In this case, it is responsible for successfully delivering messages to an external component, a _message broker._ From that very moment, it is the _message broker’s_ responsibility to deliver that message to _subscribers_. **So, basically, there are two queues** (to be precise, Hermes PostgreSQL queue and whatever _message broker_ is). One can span several messages into one logical transaction and deliver these messages in _at-least-once_ assurance. The latter is responsible for delivering messages independently from the first to the app. _This is how you usually want that to work_.

So, Hermes PostgreSQL guarantees that messages you save within a transaction will be eventually delivered to the _message broker_ (a message will be acknowledged if the broker confirms it took over that message). Hermes PostgreSQL sends the subsequent messages to the broker in order, and the broker guarantees a bunch of stuff (depending on the configuration). But above all, _it ensures the messages will get to subscribers._ If a subscriber acknowledges a message, analogously how Hermes PostgreSQL works, it considers it delivered.

In our example, we’re going to use an _in-memory message_ queue. It works like this: we register _command_/_event_ handlers, then send or publish either commands or events. When we call the `send`or `publish`method, it executes all registered handlers asynchronously in order, one by one. So, if that ends, we know that everything that was supposed to happen has already happened.

Look how our case will work:

<article-image src="/public/articles/outbox/outbox-6.webp" label="Image 8. With an in-memory queue, Hermes PostgreSQL confirms a message when that message gets successfully processed by a related message handler."></article-image>

_PostgreSQL Replication Stream_ sends messages to _Hermes PostgreSQL_. Hermes internally keeps a _message ID_ (here called _LSN_, which is explained later) for the last confirmed message.

The last confirmed message, here, means a message sent to t_he in-memory message bus_ and _processed by the corresponding handler(s)_.

Hermes calls a `publish`callback for each message.

Hermes must _acknowledge_ received messages to the _Replication Stream_, but it does it only when a message’s callback has been called without an error and only when the message is the earliest. What does it mean?

Messages arrive, and Hermes PostgreSQL calls the `publish`callback for each message. The callback can work at the same time, depending on processing time. That is why a newer message finishes processing before the earliest. Hermes can’t acknowledge this message because if the app goes down, then after a reset the _Replication Stream_ would start delivering messages after this newer message. It means we’d lose a message (that earliest one) because its callback wasn’t finished.

**In the view of above, Hermes PostgreSQL acknowledges only the earliest messages if are delivered, or in general, when the** `**publish**` **is done (whatever happens there).**

Is it clear? Let’s modify _Image 8_ a bit to make it more detailed and generic.

<article-image src="/public/articles/outbox/outbox-concept.webp" label="Image 9. General overview how Hermes PostgreSQL works."></article-image>
By default, Hermes PostgreSQL _sends messages in the order the messages have been committed_, but it doesn’t block the next messages that arrive.

If delivering (and processing in this case) _message 1_ takes _200 milliseconds_, and the _second message_ is _10 milliseconds_, then processing of the first message finishes when processing the second message is already done. _This also means that handlers are called simultaneously_.

If Hermes PostgreSQL gets information that the _message one_ has been processed successfully, then Hermes acknowledges this message for _PostgreSQL’s WAL_; Otherwise, it won’t do so, waiting for successful callback execution in the next iteration.

_That means that despite the second message has been processed successfully, Hermes doesn’t acknowledge this message because that could cause the app to lose this message if it goes down at the very moment._ In such a case, Hermes would start delivering messages after the second message that has been acknowledged as the last one.

Notice that if the _first_ and the _second messages_ are processed successfully but it happens Hermes PostgreSQL doesn’t acknowledge any of them. After the restart, they both will be delivered and processed again.

By the way. Hermes can also work in a _serialised_ way. Then, the second message would be delivered only after successfully delivering the first message. And so on.

But without a _message broker_, we’d block the app from processing messages because, in our case, we deliver and process messages in the Hermes message callback.

Hermes won’t proceed further if the last message hasn’t been acknowledged. This means that the delivery of other messages will be delayed.

In our case, without a _message broker,_ Hermes PostgreSQL is _responsible for the delivery of messages, not a message broker (that is — the_ `_publish_` _callback)._

#### Scaling and evenly distribution of messages

The _in-memory message bus_ also has one drawback compared to a _message broker_. It is the _scaling_. So far, we’ve been thinking only about one instance of our backend. What if there are two.

Messages will be propagated only to the instance in charge of the Hermes instance (whatever was first), technically not in charge of Hermes but in charge of the PostgreSQL’s logical replication slot, _so that one instance will receive all messages_. Even if the second instance writes something to Hermes, the first instance will pick up those messages. Assuming the first instance is in charge. This is something we have to have in our minds.

If we want to scale more, we must use a message broker.

<article-image src="/public/articles/outbox/outbox-messages-scaling.webp" label="Image 10. A message broker like AWS SQS or Apache Pulsar can spread messages over your app's instances."></article-image>

In the above image, the first instance of the app that owns an _exclusively_ Hermes instance and queues all messages in a message broker.

All app instances subscribe to a shared topic subscription. Thanks to that, the instances will receive queued messages by round-robin selection. If that’s what you want.

There’s much more you can do. You can rely on many consumers and partitioning, but this is out of the scope.

What does it mean _exclusively_ and how does it happen?

When the app instances start, they all try to create or append to a Hermes PostgreSQL consumer. The instance that wins the race will own the consumer _exclusively_, while the other instances fail that operation, but still can write to the outbox.

This lock is technically possible by subscribing to a PostgreSQL Logical Replication slot using a specific name.

#### The implementation

Finally, dear developer! Let’s do some programming! 😘❤️

First, let’s add the imports we’ll need sooner or later:

```ts
import {
  Duration,
  NonEmptyString,
  PositiveInteger,
  Uuid4String,
  addDisposeOnSigterm,
  literalObject,
  parseUuid4,
} from '@arturwojnar/hermes'
import { type HermesMessageEnvelope, type MessageEnvelope, createOutboxConsumer } from '@arturwojnar/hermes-postgresql'
import { Command, DefaultCommandMetadata, DefaultRecord, Event, getInMemoryMessageBus } from '@event-driven-io/emmett'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { StatusCodes } from 'http-status-codes'
import crypto, { randomInt } from 'node:crypto'
import { setTimeout } from 'node:timers/promises'
import postgres, { PostgresError } from 'postgres'
import validator from 'validator'
```

Next, let's configure our server. For that purpose, I use old-good fellow ExpressJS:

```ts
const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
```

The package `@arturwojnar/hermes`provides some helpful utils and types I use to model and prototype the events and the commands we need to make the registration process work.

But first, let’s model some common types and utils:

```ts
type MessageId = Uuid4String<'MessageId'>
type PatientId = Uuid4String<'PatientId'>
type Subject = NonEmptyString<'Subject'>
type Email = NonEmptyString<'Email'>
type RegisterPatientRequest = {
  email: string
}
type RegisterPatientResponse = {
  id: PatientId
}
type CommonMetadata = DefaultCommandMetadata & {
  redeliveryCount: number
  messageId: string
}
type DomainCommand<CommandType extends string = string, CommandData extends DefaultRecord = DefaultRecord> = {
  kind: 'command'
} & Command<CommandType, CommandData, CommonMetadata | undefined>
type DomainEvent<EventType extends string = string, EventData extends DefaultRecord = DefaultRecord> = {
  kind: 'event'
} & Event<EventType, EventData, CommonMetadata | undefined>

const parseEmail = (value: string) => {
  if (!validator.isEmail(value)) {
    throw new Error(`The value ${value} is not an email.`)
  }

  return value as Email
}
const parsePatientId = (value: string) => parseUuid4<'PatientId'>(value) as PatientId
const parseMessageId = (value: string) => parseUuid4<'MessageId'>(value) as MessageId
const constructMessageId = (...values: (string | { toString: () => string })[]) => {
  return values
    .reduce<crypto.Hash>((messageId, value) => {
      messageId.update(value.toString())

      return messageId
    }, crypto.createHash('sha256'))
    .digest('binary')
}
```

So, we have _value objects_ in the above listing, such as `PatientId`or `Subject`. I also defined `DomainCommand`and `DomainEvent`based on _Emmet’s_ `Command`and `Event`but enhanced with the `kind`that distinguishes between _commands_ and _events_. This will be needed to use the proper _message bus’ method_.

Messages will contain metadata (`CommonMetadata`): `redeliveryCount`and `messageId`. If a message handler of Hermes fails, it means the message hasn’t been delivered successfully, and there will be another attempt. Remember that, in our case, the delivery is the same as the handler execution. So, we can’t drag out the process of message acknowledgement.

The main pros of using Hermes PostgreSQL here is maintaining the _consistency_ of the operation.

All _values objects_ are _branded_ or _flavoured_ if you like, which makes it impossible to compare two strings such as `Subject`and `Email`.

I also defined some _parsers_ for validation.

Ok, and now — we have two operations to perform one by one, passing the results of one to another. When the two are completed successfully, we must publish a corresponding event; Otherwise, if the first or the second fails, we must publish information about that fact.

In other words, we’re implementing a simple _process_ with _compensation,_ which means if a process cannot be completed, all steps taken will be reverted (compensated).

As I said earlier, we kinda create an imitation of a transaction spanned two independent I/O operations. This is something we can call _a business transaction_. The difference between it and a well-known relational database transaction is that it does not ensure _isolation_. And the _consistency_ is only _eventual_. So, it is only AD from ACID. That is why the business transactions are much more comparable to BASE (_Basically Available_, _Soft state_, _Eventually consistent_).

This is because when we manage to register a new user in the OIDC provider but not yet the corresponding entity in the database, we’ll be temporarily in an inconsistent state.

<article-image src="/public/articles/outbox/outbox-7.webp" label="Image 11. Business transactions are not ACID-compliant. During Δt the system state will be temporarily inconsistent. When the business transaction is over, the state will be consistent."></article-image>
Going back to the implementation. Let's model the command and the events.

```ts
type _AddUserToIdp = DomainCommand<
  '_AddUserToIdp',
  {
    systemId: PatientId
    email: Email
  }
>
type _StorePatient = DomainCommand<
  '_StorePatient',
  {
    systemId: PatientId
    sub: Subject
  }
>
type _RevertPatientRegistration = DomainCommand<
  '_RevertPatientRegistration',
  | {
      systemId: PatientId
    }
  | {
      sub: Subject
    }
  | {
      systemId: PatientId
      sub: Subject
    }
>
type PatientRegisteredSuccessfully = DomainEvent<
  'PatientRegisteredSuccessfully',
  {
    patientId: PatientId
    patientSub: Subject
  }
>
type PatientRegistrationFailed = DomainEvent<
  'PatientRegisteredSuccessfully',
  {
    patientId: PatientId
    patientSub: Subject
  }
>
type RegisterPatientCommand = _AddUserToIdp | _StorePatient | _RevertPatientRegistration
type RegisterPatientEvent = PatientRegisteredSuccessfully | PatientRegistrationFailed
```


The `RegisterPatientCommand`is either `_AddUserToIdP`or `_StorePatient`or `_RevertPatientRegistration`.

And there are only two events: `PatientRegisteredSuccessfully`and `PatientRegistrationFailed`.

I used an underscore as the prefix to indicate it is a private (internal) message, not relevant business-wise.

Somewhere, we have to create an instance of our internal _in-memory, in-process message bus_:

```ts
const outbox = createOutboxConsumer<RegisterPatientCommand | RegisterPatientEvent>({
  getOptions() {
    return {
      // database credentials
    }
  },
  publish: async (message) => {
    // if this function passes, then the message will be acknowledged;
    // otherwise, in case of an error, the message won't be acknowledged.
    if (Array.isArray(message)) {
      for (const nextMessage of message) {
        await publishOne(nextMessage)
      }
    } else {
      await publishOne(message)
    }
  },
  consumerName: 'app',
})
```


The consumer, named _app_, is of type union type the `RegisterPatientCommand` and `RegisterPatientEvent`.

The most important part is the implementation of the `publish` callback. It is called when a message is received. Its goal is to decide whether to consider this message acknowledged or not. The message will be acknowledged if the callback doesn’t raise any error.

Remember that there can be only one _app_ consumer. If another service instance has successfully started message streaming, the other instances can only publish messages that the first instance will take over.

The implementation of the `publishOne` is straightforward. Based on the kind of message, it picks up the correct method of Emmet’s message bus. We put a message delivered by Hermes PostgreSQL on our simple message bus.

```ts
const publishOne = async (envelope: HermesMessageEnvelope<RegisterPatientCommand | RegisterPatientEvent>) => {
  const { message, messageId, redeliveryCount } = envelope
  const metadata: CommonMetadata = {
    redeliveryCount,
    messageId,
    now: new Date(),
  }

  if (message.kind === 'command') {
    await messageBus.send({
      ...message,
      metadata,
    })
  } else {
    await messageBus.publish({
      ...message,
      metadata,
    })
  }
}
```

The controller triggers an action (`registerPatient`) and then waits for its result by pulling the database based on the pre-generated patient ID. If the waiting timeouts, then we send the _Timeout HTTP_ response.

```ts
app.post<string, any, RegisterPatientResponse, RegisterPatientRequest>('/patient', async (req, res) => {
  const { body } = req

  const patientId = await registerPatient(body)

  try {
    await waitForResult(patientId)

    res.send({ id: patientId })
  } catch(error) {
    // do logging
    res.sendStatus(StatusCodes.REQUEST_TIMEOUT)
  }
})
```

What does the `registerPatient`look like?

We have to create the first command, `_AddUserToIdP`, and pass this message to Hermes PostgreSQL.

```ts
const registerPatient = async (params: RegisterPatientRequest) => {
  const patientId = parsePatientId(crypto.randomUUID())
  const addUserToIdPCommand = literalObject<MessageEnvelope<_AddUserToIdp>>({
    message: {
      kind: 'command',
      type: '_AddUserToIdp',
      data: { email: parseEmail(params.email), systemId: patientId },
    },
    messageType: '_AddUserToIdp',
    messageId: constructMessageId('_AddUserToIdp', patientId),
  })

  await outbox.queue(addUserToIdPCommand)

  return patientId
}
```

The next analogous thing is sending a `_StorePatient`command.

```ts
const sendStoreCommand = async (sub: Subject, systemId: PatientId) => {
  const storePatientCommand = literalObject<MessageEnvelope<_StorePatient>>({
    message: {
      kind: 'command',
      type: '_StorePatient',
      data: { systemId, sub },
    },
    messageId: constructMessageId('_StorePatient', sub),
    messageType: '_StorePatient',
  })
  await outbox.queue(storePatientCommand)
}
```

The next step is to implement a handler for the `_AddUserToIdP`command. The handler will be called when Hermes’ consumer receives the message and passes it to the message bus of the consumer’s service instance.

Please read the comments in the snippet for better context and explanations.

```ts
messageBus.handle<_AddUserToIdp>(async ({ data, metadata }) => {
  let sub: Subject | undefined

  try {
    console.info(`_AddUserToIdp`)
    sub = await addUserToIdentityProvider(data.email)
    // This is the place where something bad can happen.
    // Imagine that the previous I/O operation is completed, and the next one will never be.
    // If so, the handler will be called again. That's why this is called "at-least-once delivery".
    await sendStoreCommand(sub, data.systemId)
  } catch (error) {
    // Handling the case when _AddUserToIdp is called another time.
    // Before the change happened (addUserToIdentityProvider) without publishing a command (sendStoreCommand).
    if ((error as Error)?.name === `UserAlreadyExistsError`) {
      await sendStoreCommand(await getIdPUser(data.email), data.systemId)
    } else {
      // In this place we can check the `redeliveryCount` of `metadata`.
      console.error(error)

      // Fail on the `sendStoreCommand`.
      if (sub) {
        await revertRegistration({ sub })
      }
      // If an error if thrown, then this handler fails
      // and the related outbox message won't be acknowledged
      // but we don;t do that in this case.
    }
  }
}, '_AddUserToIdp')
```

Now, let's handle the second command.

```ts
messageBus.handle<_StorePatient>(async ({ data }) => {
  try {
    console.info(`_StorePatient`)

    await sql.begin(async (sql) => {
      await storePatient(data.systemId, data.sub, sql)
      const patientRegisterdEvent = literalObject<MessageEnvelope<PatientRegisteredSuccessfully>>({
        message: {
          kind: 'event',
          type: 'PatientRegisteredSuccessfully',
          data: { patientId: data.systemId, patientSub: data.sub },
        },
        messageId: constructMessageId('PatientRegisteredSuccessfully', data.sub),
        messageType: 'PatientRegisteredSuccessfully',
      })
      await outbox.publish(patientRegisterdEvent, { tx: sql })
    })
  } catch (error) {
    // Patient already exists.
    if ((error as PostgresError)?.code === `23505`) {
      return
    }

    console.error(error)

    await revertRegistration({ sub: data.sub, systemId: data.systemId })
  }
}, '_StorePatient')
```


Saving an entity and publishing an event is the most common use-case of the _Outbox pattern_. It is the last step of our process.

The `revertRegistration`function sends a command that will keep trying to revert the registration. Also, it queues the `PatientRegistrationFailed`. We don’t wait for the compensation because we already know the process has failed.

One issue, though. In our case, we don’t use any message broker, and compensation may take a while. Especially when the OIDC provider is down. This is a perfect use case for a message broker. We can send a message there, knowing it will be delivered until it’s acknowledged.

For us, the best option is to send it to a separate place where we don’t expect an order but only a message to be eventually delivered. A place that is periodically checked against non-delivered messages. Hermes PostgreSQL exposes a method called `send`(not `queue`) for that purpose.

```ts
const revertRegistration = async (params: _RevertPatientRegistration['data'], email: Email) => {
  const messageIdParam = 'sub' in params ? params.sub.toString() : params.systemId.toString()
  const revertCommand = literalObject<MessageEnvelope<_RevertPatientRegistration>>({
    message: {
      kind: 'command',
      type: '_RevertPatientRegistration',
      data: params,
    },
    messageId: constructMessageId('_RevertPatientRegistration', messageIdParam),
    messageType: '_RevertPatientRegistration',
  })
  const registrationFailedEvent = literalObject<MessageEnvelope<PatientRegistrationFailed>>({
    messageId: constructMessageId('PatientRegistrationFailedPatientRegistrationFailed', messageIdParam),
    messageType: 'PatientRegistrationFailed',
    message: {
      kind: 'event',
      type: 'PatientRegisteredSuccessfully',
      data: {
        email,
      },
    },
  })

  await outbox.send([revertCommand, registrationFailedEvent])
}

const sendStoreCommand = async (sub: Subject, systemId: PatientId, email: Email) => {
  const storePatientCommand = literalObject<MessageEnvelope<_StorePatient>>({
    message: {
      kind: 'command',
      type: '_StorePatient',
      data: { systemId, sub, email },
    },
    messageId: constructMessageId('_StorePatient', sub),
    messageType: '_StorePatient',
  })
  await outbox.queue(storePatientCommand)
}

messageBus.handle<_RevertPatientRegistration>(async ({ data, metadata }) => {
  try {
    if ('systemId' in data) {
      await removePatient(data.systemId)
    }

    if ('sub' in data) {
      await removeUserFromIdentityProvider(data.sub)
    }
  } catch (error) {
    if (metadata && 'redeliveryCount' in metadata && metadata.redeliveryCount < 5) {
      throw error
    }
  }
}, '_RevertPatientRegistration')
```

#### What are Hermes’ limitations?

Hermes PostgreSQL is built on top of PostgreSQL’s Logical Replication.

See the image below to get a better understanding of PostgreSQL’s feature.

<article-image src="/public/articles/outbox/replication.webp" label="Image 11. It shows how PostgreSQL Logical Replication works."></article-image>

➡️ Logical Replication is a mode of how the WAL decodes data — we can read WAL data as logical operations constituting the following transactions

➡️ PostgreSQL gives us an option to create Replication Slots, which are part of the publishing side

➡️ _A Replication Slot contains a pointer to the WAL_

➡️ Each operation in the Replication Slot has a Log Sequence Number (LSN) that uniquely points to a position in the WAL

➡️ _Actually, there is more than one LSN_.

➡️ _Restart LSN_ represent _the earliest message_ a subscriber needs while repeating the lost connection

➡️ _Confirmed Flush LSN_, on the other hand, _is the last confirmed number_ by a subscriber

➡️ _Confirmed Flush LSN may be in the middle of a transaction, so in case of repeating the stream, the Replication Slot has to start from Restart LSN to keep consistency of transactional data_

➡️ _The gap between the two LSNs represents the WAL that must be retained_

➡️ A subscriber gets the following logical transactional messages

➡️ A subscriber must acknowledge the LSN it successfully processed

The key sentence was: “**The gap between the two LSNs represents the WAL that must be retained**_”_.

Now, imagine there are many replication slots. Btw, one replication slot is one Hermes consumer.

**If one replication slot is far behind the others, say 1000 messages behind, the database can’t safely release those messages because there is still a replication slot that will need this data.**

Thus, the main pain point of the Logical Replication feature is the limitation of how many Replication Slots can exist at the same time on a cluster. By default, it’s 10. The limitation comes from the fact that the WAL has to be retained for the slowest subscriber.

As database administrators, we can increase this value as much as we want, considering we may exhaust the hard drive capacity. Also, many Replication Slots result in memory pressure from maintaining multiple decoder states (decoding WAL raw data into logical transactional messages).

As the Logical Replication is the foundation of the Hermes PostgreSQL, its limitations are also limitations of the library.

Also, the PostgreSQL team works hard on the following releases, and each new release brings some nice improvements in the future.

How can we manage the limitation?

➡️ Although there are no performance tests yet, the Logical Replication is a native mechanism of PostgreSQL which is not implemented on the pull (like _MongoDB Change Streams_) but rather on the _pub/sub_ mechanism, so it’s performant by design as it takes off the necessity of performing countless I/O requests to the database.

➡️ Taking that into account, one instance of your app should be able to process many messages at the same time

➡️ We can achieve scaling of message delivery by _partitioning_ (each _partition_ is a separate _Replication Slot_)

➡️ It all depends on your resources (CPU, memory, disk space), average message size and how fast the slots will progress (whether there will often be some bottlenecks). You can bump the maximum slots limit from 10 to 100 and be fine.

Finally, I will mention a significant advantage of relying on Logical Replication.

Most of the time, the outbox implementation is a simple pull. We will keep the ID of the last message that was delivered. And we select every one second of the database to get all non-processed messages. If the messages are delivered, we change the ID of the last delivered message.

We can also update the messages and mark them as delivered, which would cause many database _UPDATES_.

The solution based on pulling brings one tricky problem. Look at the image below.

<article-image src="/public/articles/outbox/outbox-gap.webp" label="Image 12. Tuple auto-increment identifiers are figured out before transactions start."></article-image>

Autoincremented identifiers of PostgreSQL are calculated when a transaction begins. In Image 9, three transactions start on the left, one after another. The first one gets ID of value 1, the second is 2, and the third is 3.

First, the transaction one commits which results in a new row with ID 1 in a related table. The second transaction that commits is transaction 3. That puts the row with the ID 3 to the table. At that moment, we have two rows in the IDs 1 and 3 table. And that lasts for a Δt until the transaction two commits. It just took longer than the other two.

Why is this a problem?

It is a problem, because we pull newer messages than the last delivered message. This is the beginning of the above case, so that’d be 0. We’d get messages 1 and 3. And the ID 3 would become our new last delivered message.

But, hey, we forgot about the 2!

While getting messages, we can check the sequence numbers and detect a gap. We can wait for a while for the missing transaction. But how long should we wait? 10 ms? 1 second?

What happens if the transaction is aborted and never gets to the table?

Handling this case is challenging but fortunately, the Logical Replication is free of it! When a late transaction finally commits, the Commit Long Sequence Number of the WAL progress and we know about that.

#### Summary

That was an intense one, huh? 🙂

We faced problems tightly associated with _distributed systems_ and _microservices_:

➡️ Reliability of operations

➡️ Compensating

➡️ Controlling the execution of business transactions

➡️ The above can be met by, e.g., an _orchestrated saga_ or _process manager_

➡️ Outbox pattern

That is a lot. But for me, these are just _names_. In fact, **we operated on basic logical reasoning**:

➡️ If A happens, B must also happen

➡️ A program execution can be stopped at any moment for various reasons

➡️ The execution can be stopped when A is done but before B even starts

➡️ Since A is an asynchronous I/O operation, the control is given away to an I/O component

➡️ While A is processing or when its result is on its way somewhere on the network, the program execution can be stopped

➡️ The program can be stopped when A is processing, not getting to the B

➡️ If we save first both A and B in one transaction into a database as intentions, we get the atomic guarantee of that operation

➡️ A dedicated process can pick up stored operations and let the program know about that (by a callback)

➡️ If the callback fails, it will be called again

➡️ This behaviour is called _at-least-once delivery_ so that a message handler can be called multiple times for the same messages

**The things we learn over years, I call know-how. It is the ability to solve non-trivial and complex issues by providing knowledge, experience and worked-out solutions, either third parties or your own**. For instance, I use a similar codebase in my projects, which I improve from project to project, that is, a small library to run container tests. Thanks to that, I can quickly and effectively support a project and my client with reliable broad tests.