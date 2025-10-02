---
cover: /articles/events-are-domain-atoms/cover.webp
author:
  name: Artur Wojnar
date: 2025-10-03T00:00:00.000Z
title: "Events are domain atoms"
description: "If you wonder how to take another step towards business language and its technical representation, then you should definitely read this article. You will learn how discovering of business capabilities combined with the vent sourcing and the decider pattern helps you in this challange."
layout: article
tags:
  - software-architecture
  - event-sourcing
  - event-driven-architecture
  - domain-driven-design
canonical: https://www.knowhowcode.dev/articles/events-are-domain-atoms
excerpt: "If you wonder how to take another step towards business language and its technical representation, then you should definitely read this article. You will learn how discovering of business capabilities combined with the vent sourcing and the decider pattern helps you in this challange."
readingTime: 12
published: true
---

<img class="article-image" src="/articles/events-are-domain-atoms/cover.webp" alt="" loading="eager" fetchpriority="high" />

Last year was a marathon of learning for me. I've finally tried event sourcing, and I love it! ❤️
The shift towards it may not have been difficult, because I was already deep in event-driven architecture. Realising one tiny detail convinced me I can be more business-oriented and closer to the domain language than I was.

What detail was that? I realised that events are atoms in the domain world.

If you wonder how to take another step towards business language and its technical representation, then you should definitely read this article. You will learn how discovering business capabilities combined with event sourcing and the decider pattern helps you in this challenge.

## Focus on events

👉 Events let you focus more on the domain rather than fixate on nouns and lastly-updated states.

Why?

Because events express _completed actions_. _Immutable_ facts.

On the other hand, the classic philosophy assumes updating one row, one document, one entity. But, hey, _panta rhei_ 🌊 and the _validity_ of such states may also change. Right?

In the Image 1 🖼️, you see some commands that can occur in the system. The system stores some medical test records and domain alerts triggered by those measurements taken.

These commands modify the state. This is the patient condition that evaluates some risk as a discrete number 🔟.

<p>
  <img class="article-image" src="/articles/events-are-domain-atoms/comparison.webp" alt="" loading="eager" fetchpriority="high" />
  <em class="image-description">Image 1. Comparison of the fixed-state approach and the event-sourced one.</em>
</p>

But the **interpretation can change**. Because _panta rhei_ 🌊

If we decide to store events as _event sourcing_ tells us, we get a beautiful and unique opportunity to **interpret those facts according to a specific formula**. We can have **multiple interpretations** and **be closer to the domain**.

Closer to the domain because we work on events that make _domain processes_, express actions, and are results of some domain behaviours (like raising small/big alerts), also, events can define or trigger new processes.

That opens a new door in the software architecture and Domain-Driven Design. **Drop the states and take in the events!**


## With event sourcing, you create thinner aggregates

... thinner, and verb-oriented.

The Image 2 👇👀👇 shows the full path from the request (command) to the commit.

<p>
  <img class="article-image" src="/articles/events-are-domain-atoms/event-stream.webp" alt="" loading="eager" fetchpriority="high" />
  <em class="image-description">Image 2. The flow explaining how to construct loosely coupled system, from events to read models.</em>
</p>

1️⃣ The command comes in - "_Resolve the big alert_"

2️⃣ To know what steps shall be taken, we aggregate the state from the events stream

3️⃣ Having the current state and the command, we can DECIDE what to do. The _invariants_ are that if there are unresolved small alerts, we shall resolve them and then resolve the big alert. That results in some events.

4️⃣ We append the events to the events stream

5️⃣ When the events persist, the read models are updated. In this case, the list of Alerts and the Patient Condition.

6️⃣ Now, a UI can conveniently use the read models

And now the thing is... The aggregate is NOT the _Patient Condition_. Because what does the _Patient Condition_ do? Is the _Patient Condition_ _patient-conditioning_? 😶‍🌫️

No, no, no. The _Patient Condition_ is a READ MODEL 🫡.

The aggregate is, as always, the _write model_. The invariants are cared for by the DECIDE function. Right? Right! 🥳 

In this case, it is "_ResolvingBigAlert_".

This is the BIG advantage of the event sourcing. Thanks to focusing on the commands and events, the atoms⚛️of the domain processes, we can distil thin aggregates more effectively⚡.

Focusing on the state (the classic approach) risks decreasing the cohesion of our aggregates. Due to the poor design phase ✍, we describe the aggregates as nouns and assign them a wide range of behaviours. Nouns should be READ MODELS!

## Domain events are all you need to make a business decision ‼️ 

When we focus on events and store them as they arrive, we can just read them and _interpret_ accordingly, and take a perspective on the data we need to make the decision.

In my example, I have a _stream of events_ which follow the naming "_patient-alerts-{ID}_". Please look at my previous posts to get more context if necessary.

But to make a decision, we have to know what the domain wants from us. As always, we should start with a _business capability_. Design first! ✍

When _business capabilities_ are discovered and we know what they are, we can try to meet their requirements by assigning them to domain processes.

Various things trigger domain processes. In the example below, this is either a medical doctor (_user_) or an external event (_AltTestResultProvided_ or _MetavirTestResultProvided_) we react on accordingly.

Regardless of the source, a command is published.

<p>
  <img class="article-image" src="/articles/events-are-domain-atoms/capability.webp" alt="" loading="eager" fetchpriority="high" />
  <em class="image-description">Image 3. First, discover business capabilities and later map their properties to business processes.</em>
</p>

But... the command is not all. Besides the command, we must know the current state to make our decision.

This is like a machine state but with events as the output:

```
decide(state, command) → events
```

With the current state and the command (intention), we can meet the requirements of the business capability (handle the business logic).

When we know the output events, we can apply them by appending them at the end of the stream.

And that's all! 🥳 

Essential things that make this approach different from the "_fixed state_" approach:

➡️ There is only the events stream, not a particular state (the state and its interpretation can change over time)

➡️ Depending on the needs of the "_decide_" function, we provide the current state that is evolved/derived/aggregated from the stream events

➡️ The commands handled by the "_decide_" function are highly coupled together

➡️ The parts of the "_decide_" function handling subsequent commands are thin root aggregates

The cohesion of that constructed "_decide_" function is high, and we love it ❤️

The pattern is called the [Decider Pattern](https://thinkbeforecoding.com/) (by _Jeremie Chassaing_).

## Code example

Check the implementation example to get a better understanding of what has been told earlier.

First, let's declare some types:

```typescript
type Flavour<T, K extends string> = T & { __flavour?: K };
type NonEmptyString<K extends string> = Flavour<string, K>;
type Event<Name extends string, D, Metadata = {}> = DeepReadonly<{
  kind: "event";
  type: Name;
  data: D;
  metadata: Metadata;
}>;
type Command<Name extends string, D, Metadata = {}> = DeepReadonly<{
  kind: "command";
  type: Name;
  data: D;
  metadata: Metadata;
}>;

type TestResultId = NonEmptyString<"TestResultId">;
type PatientId = NonEmptyString<"PatientId">;
type DoctorId = NonEmptyString<"DoctorId">;
type AltAlertId = NonEmptyString<"AltAlertId">;
type MetavirAlertId = NonEmptyString<"MetavirAlertId">;
type AlertId = NonEmptyString<"AlertId">;
type ResolveNote = NonEmptyString<"ResolveNote">;
type AltValue = Flavour<number, 'AltValue'>;
type MetavirValue = Flavour<number, 'MetavirValue'>;
type AlertReason = "ALT" | "METAVIR";
type TestResult = DeepReadonly<
  | {
      resultFor: "ALT";
      testResultValue: AltValue;
    }
  | {
      resultFor: "METAVIR";
      testResultValue: MetavirValue;
    }
>;
```

First let's model the command and corresponding events:

```typescript
type RaiseAlerts = Command<
  "RaiseAlerts",
  {
    testResult: TestResult;
    testDate: Date;
  },
  {
    patientId: PatientId;
  }
>;
type ResolveSmallAlert = Command<
  "ResolveSmallAlert",
  {
    note: ResolveNote;
    resolvedAt: Date;
  },
  {
    alertId: AlertId;
    resolvedBy: DoctorId;
  }
>;
type ResolveBigAlert = Command<
  "ResolveBigAlert",
  {
    note: ResolveNote;
    resolvedAt: Date;
  },
  {
    alertId: AlertId;
    resolvedBy: DoctorId;
  }
>;
type SmallAlertRaised = Event<
  "SmallAlertRaised",
  {
    testResult: TestResult;
    raisedAt: Date;
  },
  {
    patientId: PatientId;
  }
>;
type BigAlertRaised = Event<
  "BigAlertRaised",
  {
    raisedAt: Date;
  },
  {
    patientId: PatientId;
  }
>;
type SmallAlertResolved = Event<
  "SmallAlertResolved",
  {
    note: ResolveNote;
    resolvedAt: Date;
  },
  {
    alertId: AlertId;
    resolvedBy: DoctorId;
  }
>;
type BigAlertResolved = Event<
  "BigAlertResolved",
  {
    note: ResolveNote;
    resolvedAt: Date;
  },
  {
    alertId: AlertId;
    resolvedBy: DoctorId;
  }
>;
```

Next, we create union types:

```typescript
type AlertEvent =
  | SmallAlertRaised
  | BigAlertRaised
  | SmallAlertResolved
  | BigAlertResolved;
type AlertCommand = RaiseAlerts | ResolveSmallAlert | ResolveBigAlert;
```

Next thing is the way we will reduce the event stream into the current state. We already know what data we must have for the _decide_ function thanks to the design session.

The current state (_PatientAlertsState_) can be defined like this:

```typescript
type SmallAlertCommon = DeepReadonly<{
  testResultId: TestResultId;
  patientId: PatientId;
  raisedAt: Date;
}>;
type SmallAltPendingAlert = SmallAlertCommon &
  DeepReadonly<{
    status: "pending";
    testResult: Extract<TestResult, { resultFor: "ALT" }>;
  }>;
type SmallAltResolvedAlert = SmallAlertCommon &
  DeepReadonly<{
    status: "resolved";
    testResult: Extract<TestResult, { resultFor: "ALT" }>;
    resolvedAt: Date;
    resolvedBy: DoctorId;
  }>;
type SmallMetavirPendingAlert = SmallAlertCommon &
  DeepReadonly<{
    status: "pending";
    testResult: Extract<TestResult, { resultFor: "ALT" }>;
  }>;
type SmallMetavirResolvedAlert = SmallAlertCommon &
  DeepReadonly<{
    status: "resolved";
    testResult: Extract<TestResult, { resultFor: "METAVIR" }>;
    resolvedAt: Date;
    resolvedBy: DoctorId;
  }>;
type SmallAltAlert = SmallAltPendingAlert | SmallAltResolvedAlert;
type SmallMetavirAlert = SmallMetavirPendingAlert | SmallMetavirResolvedAlert;
type SmallAlert = SmallAltAlert | SmallMetavirAlert;
type PendingAlertPair = [
  SmallAltPendingAlert | null,
  SmallMetavirPendingAlert | null
];
type ResolvedlertPair = [
  SmallAltResolvedAlert | null,
  SmallMetavirResolvedAlert | null
];
type BigPendingAlert = DeepReadonly<{
  status: "pending";
  raisedAt: Date;
}>;
type BigResolvedAlert = DeepReadonly<{
  status: "resolved";
  raisedAt: Date;
  resolvedAt: Date;
}>;
type BigAlert = BigPendingAlert | BigResolvedAlert;

type UpToThreeElements<T> = [] | [T] | [T, T] | [T, T, T];
type PatientAlertsState = DeepReadonly<{
  smallAlerts:
    | UpToThreeElements<PendingAlertPair>
    | UpToThreeElements<ResolvedlertPair>;
  bigAlert: BigAlert | null;
}>;
```

Please notice, how **explicit and detailed we are about the types**. We know the requirements of the domain and we can express them in types. We know we gather last three pairs of alerts where each pair is ALT (_alanine aminotransferase_ enzyme) and the METAVIR value. And this is strictly included in the types.

Now, we can reduce the state with the _evolve_ function. I cut off most of the implementation because it's very long.

```typescript
const assertNever = (value: never): never => {
  throw new Error(`The value ${value} should be handled.`);
};
const resolveAlert = (
  alert: SmallAltPendingAlert | SmallMetavirPendingAlert | null,
  resolvedBy: DoctorId
): SmallAltResolvedAlert | SmallMetavirResolvedAlert | null =>
  alert === null
    ? null
    : {
        ...alert,
        status: "resolved",
        resolvedAt: new Date(),
        resolvedBy,
      };
const evolve = (
  state: PatientAlertsState | null,
  { type, data: event, metadata }: AlertEvent
): PatientAlertsState => {
  state = state || {
    bigAlert: null,
    smallAlerts: [],
  };

  switch (type) {
    case "SmallAlertRaised":
      // implemention skipped...
      return state;
    case "SmallAlertResolved":
      // implemention skipped...
      return state;
    case "BigAlertRaised":
      // implemention skipped...
      return state;
    case "BigAlertResolved":
      if (!state.bigAlert) {
        throw new InvlidStateError();
      }

      return state.bigAlert.status === "pending"
        ? {
            ...state,
            smallAlerts: state.smallAlerts.map((pair) => [
              resolveAlert(pair[0]),
              resolveAlert(pair[1]),
            ]),
            bigAlert: {
              status: "resolved",
              raisedAt: state.bigAlert.raisedAt,
              resolvedAt: event.resolvedAt,
            },
          }
        : state;
    default:
      assertNever(type);
  }
};
```

At the end, we must _decide_ how we should change the current state:

```typescript
const decide = (
  { type, data: command, metadata }: AlertCommand,
  state: PatientAlertsState
): AlertEvent[] => {
  switch (type) {
    case "RaiseAlerts": {
      const events: AlertEvent[] = [];

      if (state.bigAlert) {
        return [];
      }

      if (
        command.testResult.resultFor === "ALT" &&
        command.testResult.testResultValue > ALT_NORM
      ) {
        events.push({
          kind: "event",
          type: "SmallAlertRaised",
          metadata: {
            patientId: metadata.patientId,
          },
          data: {
            raisedAt: new Date(),
            testResult: command.testResult,
          },
        });
      }

      if (evaluateRisk(state, events)) {
        events.push({
          kind: "event",
          type: "BigAlertRaised",
          metadata: {
            patientId: metadata.patientId,
          },
          data: {
            raisedAt: new Date(),
          },
        });
      }

      return events;
    }
    case "ResolveSmallAlert":
      // implemention skipped...
      return [];
    case "ResolveBigAlert":
      // implemention skipped...
      return [];
    default:
      assertNever(type);
  }
};
```

## Wrap-up

Event sourcing brings you closer to the domain. Rather than fixate you to a single  (that can get stale quickly), you work directly with _business atoms_ (_commands_, _events_). If you model your work with business capabilities then you speak fully with _domain language_.

It's worth to give it chance and try.

Artur.
