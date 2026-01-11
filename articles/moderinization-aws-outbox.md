---
cover: /articles/moderinization-aws-outbox/cover.webp
author:
  name: Artur Wojnar
date: 2026-01-12T00:00:00.000Z
title: "Architecture Modernization in Legacy AWS Cloud-Native Systems"
description: "Learn how to modernize legacy AWS cloud-native systems using the Outbox Pattern with DynamoDB Streams, SNS, SQS, and Lambda to build reliable event-driven architecture."
layout: ../layouts/article.njk
tags:
  - aws
  - modernization
  - architecture
  - outbox
canonical: https://www.knowhowcode.dev/articles/moderinization-aws-outbox
excerpt: "A practical guide to implementing the New Scaffolding Pattern in legacy AWS systems. Learn how to use DynamoDB Streams, SNS, SQS, and Lambda to build a reliable cloud-native outbox pattern for event-driven architecture modernization."
readingTime: 5
slug: moderinization-aws-outbox
---

<img class="cover-image article-image" src="/public/articles/moderinization-aws-outbox/cover.webp" alt="" loading="eager" fetchpriority="high" />

Oh, you commercial project. You bastard.

How much I’ve sworn at you—only to finally realize how much I needed you. Your tangled, countless tentacles resemble a parody of an octopus; your surprised, pained face gives the impression that even you’re wondering how you became a failed genetic experiment.

But… you’re perfect.

Maybe it’s the environment you live in—the variables, the surrounding entropy, the uncertainty—that made you this way.

Now the ecosystem has changed. The waters of time have overflowed, reshaping everything they touch. And here you are, facing a new reality.

You must adapt.

Or die?

No. Not necessarily.

## Legacy Projects and Modernization

Projects are often a mess. They flow from one team to another, and teams vary in experience and mentality. There is rarely a concise architectural vision.

Recently, I joined one of those projects — and that is a good thing.

A full rewrite is rarely an option, and even more rarely a necessity. **A rewrite means hundreds of man-days, which translates directly into a lot of money — an investment that will probably never pay for itself.**

**Architecture modernization is mainly about understanding and rediscovering the domain, but in this article my focus is purely technical.**

I will cover only one case. If you have ever dealt with — or are currently working with — a legacy AWS cloud-native tech stack, this text is tailored for you. You are welcome, dear Reader.

## New Scaffolding Pattern

My project is a legacy cloud-native application running on *AWS*: tons of tangled *Lambdas* coupled through a [shared kernel](https://deviq.com/domain-driven-design/shared-kernel) (a horizontal one crossing multiple bounded contexts — *sic!*), *DynamoDB* tables that heavily mix read and write models, *Firehose*, *Glue*, *Redshift*, and more.

The previous contractor company working on this product figured out that they could implement side effects by calling them one by one at the end of a *Lambda*. No separation. No real contexts.

**But you and I know that the best method of [dependency inversion](http://en.wikipedia.org/wiki/Dependency_inversion_principle) is events.**

You can read one of my previous articles where I explain how [events are fruitful for implementing domains](https://www.knowhowcode.dev/articles/events-are-domain-atoms/). You can also catch up on a [longer explanation of why traditional CRUD, transaction scripts, and layered architectures are not a good path](https://www.knowhowcode.dev/articles/architecture-the-bad-parts/).

I decided to introduce a new foundation for system communication by publishing events to [*Simple Queue Service* (*SQS*)](https://aws.amazon.com/sqs/) and using it only for new parts of the system (new features).

I call this the **New Scaffolding Pattern**. Thanks to this approach, the development team does not have to get bogged down trying to modify a [distributed big ball of mud](https://martinfowler.com/articles/microservice-trade-offs.html) or escape constant regressions.

Ultimately, this enables us to apply the [Strangler Fig Pattern](https://developer.confluent.io/patterns/compositional-patterns/strangler-fig/). Maybe. Someday.

See *Image 1* to grasp the high-level plan for introducing the new scaffolding.

Communication between the legacy part and the new part is handled, traditionally, by an [anti-corruption layer](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/acl.html).

<article-image src="/public/articles/moderinization-aws-outbox/new-scaffolding.webp" label="Image 1. New Scaffolding – high-level perspective."></article-image>

---

## How to Introduce Events?

In an *AWS* cloud-native setup, *SQS* is a natural choice. However, switching tools alone is not enough.

Before anything else, we must remember:

- We are talking about **domain events**, and domain events express — unsurprisingly — the domain.
- Events are not notifications sent at the end of an operation just to inform other parties. **There is a command, the command produces events, and those events drive state changes and read models.**
- [Change Data Capture (CDC)](https://www.knowhowcode.dev/articles/events-are-domain-atoms/) is *not* events. CDC produces data streams, not business facts.
- **CDC feeding a data warehouse cannot be treated as domain events.**

ℹ️ *There are many more rules of thumb and good practices related to events, but this is not the place to cover them all.*

I highly recommend the work of Oskar Dudycz. Here are some useful links:

- [Event transformation](https://event-driven.io/en/event_transformations_and_loosely_coupling/)
- [Anti-pattern: State obsession](https://event-driven.io/en/state-obsession/)
- [Anti-pattern: Property sourcing](https://event-driven.io/en/property-sourcing/)
- [Versioning patterns](https://event-driven.io/en/simple_events_versioning_patterns/)

In my opinion, the most seamless, resilient, and reliable option is to implement the [Outbox Pattern](https://www.knowhowcode.dev/articles/outbox/) using cloud-native components.

### Why?

- We get all the benefits of the outbox pattern: data persistence and event publication in an atomic way.
- It is easy to achieve with *AWS* services.
- The codebase does not need to reference queues directly; it continues to work with *DynamoDB* as usual.

---

## Cloud-Native Outbox to the Rescue

To implement the outbox pattern reliably, we rely on:

- [*DynamoDB Streams*](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html)
- [*Simple Notification Service* (*SNS*)](https://aws.amazon.com/sns/)
- [*Simple Queue Service* (*SQS*)](https://aws.amazon.com/sqs/)
- [*AWS Lambda*](https://aws.amazon.com/lambda/)
- *CloudWatch*

See *Image 2*.

<article-image src="/public/articles/moderinization-aws-outbox/aws-outbox.webp" label="Image 2. *AWS* infrastructure implementing the outbox pattern."></article-image>

### How It Works

- ***DynamoDB Streams* start the mechanism.** Multiple *outbox tables* are defined per bounded context.
- A ***Lambda* consumes the stream records**, transforms them into domain events (adds identifiers, metadata, structure), and publishes them to an *SNS* topic.
- ***SQS* queues receive events.** Since *SQS* is a queue (not a log), messages are deleted once consumed.
- ***SNS* handles fan-out** by duplicating events into multiple queues using subscriptions and filters.
- When an event reaches its target ***SQS* queue**, it triggers the appropriate domain *Lambda*.

### Reliability Guarantees

- If a *DynamoDB* stream record is not processed successfully within the [24-hour retention window](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html), it is routed to a **Dead Letter Queue (DLQ)** via *Lambda* Event Source Mapping.
- If a message cannot be processed successfully from *SQS* after a configured number of retries, it ends up in an *SQS*-managed DLQ.
- **Use `BisectBatchOnFunctionError` to automatically split failing batches and isolate problematic records**, ensuring good records are processed while only bad ones are retried.

---

## Wrap-up

If you are stuck with an *AWS* cloud-native legacy system — or if you simply enjoy this kind of ride — it is entirely possible to implement a reliable and elegant outbox pattern.

**However, patterns like outbox and events, despite being good practices, must serve business goals and speak the domain language.** Events themselves are not the solution. Good architecture is.

**The New Scaffolding Pattern supports your team and your delivery calendar** by enabling new features to be built on clean architectural foundations, while gradually cutting off the burden of the legacy system.

Who said brownfield projects cannot still have green fields left to sow?