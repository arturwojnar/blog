---
cover: /articles/nhibernate.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2024-10-15T00:00:00.000Z
title: "Do not trust docs... and ORMs"
layout: article
description: "Many documentations of different frameworks can deceive you because their creators are primarily interested in their interests, and sometimes, their knowledge and experience are limited. Read this article to prepare!"
tags:
  - orm
  - database
  - frameworks
  - documentation
  - best-practices
canonical: https://www.knowhowcode.dev/articles/do-not-trust-orms
excerpt: "Why you should be skeptical of framework documentation and ORMs, and how to make better architectural decisions"
readingTime: 8
published: true
---

I temporarily joined a team working with a modular monolith and single database. This is the most common case in our software house, and I believe it's the best way to start many projects.

On my PR, changes embraced a module responsible for external system integration (working on its users) and the app's user registration process.

Application-wise, those were separate slices and separate modules.

I received a comment that I should create a foreign key relationship between the two sets of identities, which was possible because the relationship between the two was 1:1.

It might be tempting to do so, but the logical separation is clear.

Otherwise, you break the app's architecture.

On the app side, we query the two datasets separately and combine them on a service layer.

What would happen if we separated the two concerns physically at some point? We'd have to untangle the database schema because we had created an unintentional coupling.

That may lead to creating a shared data set that overlaps many bounded contexts and injects them with a language, columns, and meaning not intended for them.

It breaks the Interface Segregation and the Liskov principles at the architecture level.

Besides, why the heck do we need db relationships these days? 😈 

This mechanism makes sense only when it's part of a root aggregate representation.

But I blame the documentation of many ORMs for being part of the problem. Look first at _NHibernate's_ docs cutout ([see the docs](https://nhibernate.info/doc/howto/various/lazy-loading-eager-loading.html)).

<img class="article-image" src="/articles/nhibernate.webp" alt="" loading="eager" fetchpriority="high" />

_NHibernate_ is a mature framework, and its docs are fully-fledged, so it raises the issue of distilling the Order and the OrderLine as a root aggregate. However, it doesn't seem to see a problem with creating a OneToMany relationship to the Customer. It says we shouldn't modify the Order and the Customer simultaneously because the two actions would be separate use cases. Huh? If so, why is the 1:N relation if the actions are separate?

This situation would be OK when it was explicitly stated that the Customer table is redundant to the Customer table from another context or database and this Order's Customer table keeps data required solely by the Order's bounded context.

Another question is: If the Customer table is not part of the root aggregate, why has the database relationship tightly coupled it?

Let's check the _TypeORM_ (which is wet behind the ears compared to .NET tooling): [see the docs](https://typeorm.io/many-to-one-one-to-many-relations)

The example there creates a relationship between Posts and Users. Kyrie eleison!

Developers read and trust these docs. However, as with most docs, they present only a significantly simplified perspective on the actual systems and do not care about good practices and architecture.

**My message is - do not trust docs... and ORMs** 😀 

---

I explained that many ORM documents can contain misleading or improper statements because they focus on trivial examples.  
This time, I will try to plant a seed of doubt about the vivid sense of using ORMs.  
  
➡️ First thing - overcomplication  
  
Look at the image below. It’s a screenshot of part of the NHibernate’s table of contents.  
I remember from the time I worked in the .NET tech stack, we spent lots of hours composing proper ORM queries. There was a big learning curve.

<img class="article-image" src="/articles/nhibernate2.webp" alt="" loading="eager" fetchpriority="high" />
  
➡️ Second thing - hidden complexity  
  
We also spent many man-days trying to make the resulting SQL queries more performant.  
It’s an abomination because, after all, we had to analyse raw SQLs.  
  
➡️ Third thing - performance issues  
  
Many ORMs are overpacked with features that slow down performance. One of the frequent features, “living objects”, tracks what has been changed since the last entity persistence. Nice thing, you may say, but it can bog you down.  
  
➡️ Fourth thing - the world moved forward  
  
JSON and JSONB columns work very, very well these days 😈 😁 But.. do you need ORM to use this type?  
  
💡Of course, we faced performance and composition issues because the project was large-scale and long-lasting. Over 50 people were involved, a few SCRUM teams. However, the scale sometimes tells you that a solution is elastic and can support you when your domain evolves.  
  
Finally, we were worn out by then, so we replaced most queries with raw SQL queries. Our SQL skills were high, so we were confident in this decision. Our team performance increased, and we also eliminated frustration.  
  
💡 I think ORMs are nice for CRUDs and simple use cases. They should be a good option for supporting subdomains that are simple by design. But it can be tricky as those subdomains can evolve into core ones.  
  
💡 I may also be prejudiced because, by default, I don't like the idea of frameworks - a big scary guy pointing a gun in your head telling you what to do.  
  
But how can you deal without ORM? Is it even possible?🤔 I’ll try to explain that next time!  
  
And what’s your opinion about using ORMs? 🙂