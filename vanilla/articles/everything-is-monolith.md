---
cover: /articles/everything-is-monolith.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2024-12-15T00:00:00.000Z
title: "Everything is a monolith"
layout: ../layouts/article.njk
description: "Do not harm yourself by thinking that you create a system with independent components"
tags:
  - monolith-systems
  - microservices
  - software-architecture
  - distributed-systems
canonical: https://www.knowhowcode.dev/articles/everything-is-monolith
excerpt: "Understanding why even distributed systems are fundamentally monolithic and how coupling management is the key to software development"
readingTime: 4
published: true
---

Software development, in a nutshell, is about coupling management.

We set project rules and make boundaries to cut down on coupling. Why?

To minimise the intertwining of responsibilities, which eventually brings many benefits, e.g. reducing the necessity of communication between teams/developers, improving fault tolerance, shortening deployability time, avoiding conflicts in changes or strengthening evolvability.

We deploy a set of separate services isolated from dedicated databases.

We add a queue to exchange asynchronous messages and, again, to improve reliability.

But despite all the effort, we still developed a monolith system—the same one that was poorly written, full of god classes with spaghetti code, where the coupling is a permanent resident.

Despite the effort of making a perfectly designed context, those contexts still have to talk to each other to meet business goals.

The thing is that the services, contexts or modules will be in an eventual coupling at some point. They will need to pass their results and wait for some events.

Think of cooperating contexts like _ShoppingCart_, _Inventory_, _Order_, _PurchaseOrder_, _Payments_, and _Invoices_. Together, they provide value and give a business capability, which is the possibility of making orders.

We don’t manage coupling to craft something other than a monolith; we manage coupling to make that monolith evolvable and, therefore, less expensive in development.