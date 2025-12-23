---
cover: /articles/architecture-the-bad-parts/cover.webp
author:
  name: Artur Wojnar
date: 2025-12-24T00:00:00.000Z
title: "Software Architecture: The Bad Parts"
description: "TBA"
layout: ../layouts/article.njk
tags:
  - software-architecture
  - antipatterns
canonical: https://www.knowhowcode.dev/articles/architecture-the-bad-parts
excerpt: "TBA"
readingTime: 20
slug: architecture-the-bad-parts
---

<img class="cover-image article-image" src="/public/articles/architecture-the-bad-parts/cover.webp" alt="" loading="eager" fetchpriority="high" />

🎃🎃🎃

Hello, Internet citizens!

Do you want to learn about BAD ARCHITECTURE PRACTICES? Do you think you are free of them? Because I made all possible mistakes on my way!

Do you want to go through a detailed example and see how poor or naive approach to architecture can turn your components in God Objects?

Yeah. I know you want to.

Do you want to read about domain leaks? About how starting from nouns is bad? About mixing read and write models?

Tighten your seat belt and let's hit the road!

🎃🎃🎃

I've been asked a question recently after one of my presentations that sounded, more or less, like this: "_But what for? Why should I change the way I work right now and introduce a more complex solution instead_"? That was a talk I called "_Baby steps in Event Sourcing_". I replied then that I don't think this is necessarily a more complicated approach; rather, it's a matter of our customs and experience. I also responded with a question about whether you (the participant) find your current and past projects straightforward. Were those projects weighted by popping out of nowhere bugs?

But, the question was good, though. Realy good.

It's not easy to answer that one. How to bridge the gap between knowledge and experience?

And it came to me. How was that in my case, I asked myself. I simply spotted how bad and messy the codebase can become.

The only way for me, as the prelegent, is to demonstrate how the bad software-engeenering practices devolve the project into [big ball of mud](https://dev.to/m_midas/big-ball-of-mud-understanding-the-antipattern-and-how-to-avoid-it-2i), convert classes into [God Classes](https://dev.to/wallacefreitas/understanding-god-objects-in-object-oriented-programming-5636) and make you a big fan of the Italian cousine as your code became a spaghetti.


🎃🎃🎃

The title of this article was inspired by the Douglas Crockford's "[JavaScript: The Good Parts](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/)", as well as the Neal Ford's "[Software Architecture: The Hard Parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/).

🎃🎃🎃

The full implementation of the article's example you'll find on [this repo and this branch](https://github.com/arturwojnar/alerting-app-example/blob/no-design).

🎃🎃🎃

Let's treat this article as the explanation why people should think about the architecture. Back in the days that was for me a revelation and the beggining of the road towards events. Moving from CRUD to events is less about technology and more about changing how we think. Events aren’t more complex or time-consuming — clinging to bad practices is. So... let's dive into the bad practices. And make the code scary!

## The project

First, let's talk about the requirements we'll be working hard on. Meet the client, Janek.

<article-image src="/public/articles/architecture-the-bad-parts/requirements.webp" label="Image 1. Business context and acceptance criterias."></article-image>

Here's the text format of the image content, in case you like it more.

### **Context**

-   Janek owns a company called “JanMed” (previously “JanWątroba”)
-   Janek has a network of ten laboratories in Poland
-   The laboratories have technicians and equipment necessary for liver examinations
-   Janek wants to digitize the process of monitoring patients’ health and lay off part of the staff

### **Acceptance criterias**

-   **AC1.** My system receives the patient’s test results: alanine aminotransferase (ALT – U/L) and liver fibrosis level on the METAVIR scale F0–F4 from elastography.
-   **AC2.** ALT above 35 U/L for women / 45 U/L for men generates a small alert.
-   **AC3.** Fibrosis levels F1, F2, F3, and F4 generate a small alert.
-   **AC4.** After three consecutive alarming ALT–fibrosis result pairs, taken at intervals of at least one month, we calculate the liver cancer risk level using the formula:**(patient age / 70) * (median fibrosis / 4) * (mean ALT / [last ALT result + first ALT result])**
-   **AC5.** If the calculated liver cancer risk level is greater than 0.3, we generate a large alert.
-   **AC6.** A doctor may resolve a large alert → this resolves all small alerts.
-   **AC7.** A doctor may resolve small alerts, but when a large alert appears, small alerts cannot be resolved.
-   **AC8.** No new alerts can be generated if a large alert has not been resolved.

## The Bad Part: Wireframe Driven Development

The team meets on the planning session. The epics have been already prepared by (and here comes one of possible roles) Project Leader/Team Leader/(Proxy) Product Owner. The epics have been prepared based on detailed work of a UX designer who examined the users' journey. All personas have been discovered - a patient, a medical doctor and a laboratory technician.

The epics, along with linked designs, are:
- Authentication (registration, logging in)
- Laboratory app (measurements registration)
- Patient app (vieweing measurements, alerting)
- Medical doctor app (viewing patients, alerting, resolving alerts)
- Admin Panel

During the long planning session the backend developers concluded, based on the wireframes, that a few REST API endpoints are needed:
- Adding measurements, that is ALT blood results and liver fibrosis levels. On measurement registration will be a check whether an alert should be raied.
- Resolving and getting alerts
- CRUD for patients
- Endpoints for the integration with an [OIDC provider](https://openid.net/developers/how-connect-works/), like [Keycloak](https://www.keycloak.org/) or [AWS Cognito](https://aws.amazon.com/pm/cognito/?trk=1cd4d802-f0cd-40ed-9f74-5a472b02fba5&sc_channel=ps&ef_id=CjwKCAiAmKnKBhBrEiwAaqAnZ07MTAgtad56hYS0uIX1Xu4ywEni4Rfr-iqrvZZNoLkbKw9N_FfQCxoCsSgQAvD_BwE:G:s&s_kwcid=AL!4422!3!651541907485!e!!g!!cognito!19835790380!146491699385&gad_campaignid=19835790380&gbraid=0AAAAADjHtp_2LM_Gmh7NuOvZ_iyujxCcs&gclid=CjwKCAiAmKnKBhBrEiwAaqAnZ07MTAgtad56hYS0uIX1Xu4ywEni4Rfr-iqrvZZNoLkbKw9N_FfQCxoCsSgQAvD_BwE)

### The pain: Wireframe driven-development

Does this process sound familiar? If so, that might be you, who will finally break the bad cycle.

Relying fully on the UX wireframes and designs and treating them as the architecture is a real pain, because views often aggregate many information where logically we expect a clear separation.

Look at the Image 2, where you can see a results search page on [Amazon](https://www.amazon.com/s?k=laptop&crid=27XWE7JK2L7BY&sprefix=lapto%2Caps%2C262&ref=nb_sb_noss_2).

<article-image src="/public/articles/architecture-the-bad-parts/amazon.webp" label="Image 2. Every red rectangle comes from a separate system area. The view aggregates many separate contexts."></article-image>

Do you think, that the implementation of that was so naive that Amazon stores product instances along with data regarding special offers, ad's origin, rate, number of comments, prices and delivery estimation?

## The implementation

### Class Diagram

Once the development team wrote down the REST API endpoints, the team discovered the main resources. These are:
- Measurement
- Alert
- User

These domain language, these words, these nouns describe everyhting that happens in the system and they map perfectly to the API endpoints.
Someone created an [Architecture Decision Record](https://adr.github.io/) describing a motivation behind the decision to split the API this way, not another, and as the final documentation monument, the developer attached an UML class diagram. See the Image 3.

<article-image src="/public/articles/architecture-the-bad-parts/classes.webp" label="Image 3. UML Class Diagram describing the system entities."></article-image>

_User_ has _Measurement_ and _Alert_, which makes sense because _User_ has this relations, right?

The most intereseting is the _Alert_ class which has the following behaviors:

- shouldTriggerAltAlert

  ```ts
  static shouldTriggerAltAlert(value: number, sex: Sex): boolean
  ```

  Checks if ALT value triggers an alert based on sex-specific thresholds (>45 for male, >35 for female)

- shouldTriggerFibrosisAlert

  ```ts
  static shouldTriggerFibrosisAlert(value: number): boolean
  ```

  Checks if fibrosis value triggers an alert (value between 1 and 4 inclusive)

- findAlarmingPairs

  ```ts
  static findAlarmingPairs(measurements: Measurement[], user: User): AlarmingPair[]
  ```

  Finds pairs of ALT and fibrosis measurements from the same day that both trigger alerts

- findValidConsecutivePairs

  ```ts
  static findValidConsecutivePairs(alarmingPairs: AlarmingPair[], requiredCount: number = 3): AlarmingPair[]
  ```

  Finds valid consecutive pairs that are at least one month (30 days) apart

- calculateLiverCancerRisk

  ```ts
  static calculateLiverCancerRisk(validPairs: AlarmingPair[], user: User): number
  ```

  Calculates liver cancer risk based on age, median fibrosis, and ALT values using the formula: `(age/70) * (medianFibrosis/4) * (meanALT/(lastALT + firstALT))`

- shouldRaiseBigAlert
  ```ts
  static shouldRaiseBigAlert(riskLevel: number): boolean
  ```
  Checks if the risk level requires a big alert (threshold: >0.3)

### Database diagram

Once we designed the classes, we can decide what tables do we need. The matter is simple. Three classes is all we need. Check out the Image 4.

<article-image src="/public/articles/architecture-the-bad-parts/db.webp" label="Image 4. UML Database Diagram. Isn't that beautifully and encouraging simple?"></article-image>

_Alerts_ and _Measurements_ refer the _Users_. Logical, right?

There's a chance you learned about the [Database normalization and the normal forms](https://en.wikipedia.org/wiki/Database_normalization). If you do, you're lucky bastard! You'll be able to tell about that to your kids in one sentence with CDs, tapes, walkmans, etc.

Probably the schema is at least in the [2NF](https://en.wikipedia.org/wiki/Second_normal_form), as none of _non-prime attributes (that is, one not part of any candidate key) is functionally dependent on only a proper subset of the attributes making up a candidate key_. Hehe 😀😀😀

### The architecture

Right. The architecure. Architecture is a word.

We all do know the [Layered Architecture](https://dev.to/yasmine_ddec94f4d4/understanding-the-layered-architecture-pattern-a-comprehensive-guide-1e2j). We've been taught it. It's everywhere. Similarly, as the other "Architectures". But this one also seems be easy.

So, please look at the Image 5.

_The controllers_ (REST API) refer the Applcation layer (services) and it refers the Domain layer and the Persistance layer (repositories). Ok, maybe it is a bit twisted version of the pattern, because the Domain itself does not refer the repositories directly but rather operate on "clean" data. Normally, the Domain layer reffers the Persistnace layer. But hey, who told you, that I want to implement the worst version of all possible implementations?

<article-image src="/public/articles/architecture-the-bad-parts/layers.webp" label="Image 5. Layered Architecture. A bit improved, but stil..."></article-image>


### The code

Software engeneers are not the ones to write some docs, so let's go to some hard coding, shall we?

I will present you some more intresting parts of the implementation.

The whole thing is implemented in NodeJS/TypeScript. If you're not into this tech stack, then I'm pretty sure the codebase will be still redable to you.

Remember, that the full implementation you can check in [this repo and this branch](https://github.com/arturwojnar/alerting-app-example/blob/no-design). You can check also the commit history.



<!-- ## The Bad Part: Noun-ing

Once the development team wrote down the REST API endpoints, the team discovered the main resources. These are:
- Measurement
- Alert
- User

These domain language, these words, these nouns describe everyhting that happens in the system and they map perfectly to the API endpoints.
Someone created an [Architecture Decision Record](https://adr.github.io/) describing a motivation behind the decision to split the API this way, not another, and as the final documentation monument, the developer attached an UML class diagram. See the Image 3.

<article-image src="/public/articles/architecture-the-bad-parts/classes.webp" label="Image 3. UML Class Diagram describing the system entities."></article-image>

_User_ has _Measurement_ and _Alert_
### The pain

Onion/ports/clean -->