---
cover: /articles/mvp/cover.webp
author:
  name: Artur Wojnar
date: 2023-09-09T00:00:00.000Z
title: "How to successfully deliver an MVP to the market"
description: "My thoughts on how we can help ourselves to successfully deliver the MVP on the market."
layout: ../layouts/article.njk
readingTime: 18
tags:
  - risk-management
  - kubernetes
---

<img class="cover-image article-image" src="/public/articles/mvp/cover.webp" alt="" loading="eager" fetchpriority="high" />

**I’ve only worked in software houses, where we usually kick off startup projects**. So we begin tiny, without guaranteeing that the market will appreciate our effort and the client’s plan. This situation also indirectly implies the non-functional requirement — the budget is not a bottomless pit, so we have to thoroughly plan our work to not sink all the client’s money into a product **yet to be released.**

Here’re some of my thoughts on _how_ we can help ourselves to successfully deliver the MVP on the market. But please, **don’t treat bits of advice and experiences described here as something that will work for you**. Read the first sentence of the very first paragraph again and consider if there’s a chance you are in this place too.

**First of all, I try to organize the process with my client for delivering pieces of the unfinished and partially mocked MVP**, following the well-known and hated rule “_time-to-market_”, to let the client have presentations for _investors_, _potential customers_, and _future users_. **This speeds up something inevitable — that something will change in the requirements**, and there will be some adjustments _even though_ in the design phase, we went through tests with users, and even though during workshops we did our best to tease every detail out of the client.Our client has to agree with this approach and has to have the possibility to work that way. We can hint at this and politely explain that it’ll probably be the best for their business but the client has the final call, as always.

**We want to get to know as much as we can as fast as we can**, thus delivering the product step by step is one of the ideas to go to save time and some portion of the budget. What other actions can be taken to _mitigate_ the risk of the failure specter?

Although we’ve been struggling to improve the process of delivering the MVP making it gradual as it was planned and needed for the next demos for investors, _there are still dark clouds looming over our concerned heads_ making us think whether it’ll end up with a big storm.

Staying in the area of processes and the business itself **\-** sometimes the business side is people with ideas about what to do, with grants or investors. And surprise, surprise — **they don’t play heads or tails with our work and our processes, with software development in general**. We can politely and calmly explain and elaborate on everything. You know. _EVERYTHING_. Tell how sprints work, what Scrum celebrations are, why they are important, what an estimation means, etc…

**Alternatively, you can spur the business side on hiring someone technical, a CTO, who will take over the laborious job** **and will strike a balance between your team and the non-tech stakeholders**, pushing away from you preposterous, fanciful, and tiring questions.Also, having a CTO on the client's side puts him in a “_last-word_” decision-making position, which is good because there are fewer duties on you. I’m not talking about keeping your hands clean, but **the CTO may be a person who will be on the same longitude and latitude as the client so that they skip problems with remote communication**. Again, that should be the person who has some technical knowledge but is also business-empathetic and business-involved. They participate in conferences and all sorts of business meetings. The CTO should represent the technical aspect of the client’s needs.

**Of course, this deal may sometimes be frustrating**, **you never know who you will be working with**. What the background of this person is, maybe that person is short-fused, always bummed up, or does everything down to the wire, or is newly baked in the CTO role and will tear into it with the greatest passion trying to splurge. _Let’s not jinx it!_ The possible downsides do not outweigh the advantages.

**So now, we’re getting to the most tricky advice I would’ve given myself a few years ago. It’s a character trait — being humble**.

That person on the other end of the call that _pixel-ish face_ on a video conference is also a part of the team, and with high confidence, this person also wants the best for the project. They might be _annoying sometimes_, and you will disagree with them, but that’s part of the process. Respect their opinion. You don’t know everything, you haven’t been everywhere and you haven’t seen everything.

And remember that they make a final call, even if you dislike that from your developer’s perspective. Take a breath and think — maybe that can eventually turn out better, indeed?

It’s difficult to find balance here, because **a** **CTO may tend to micromanagement**. Our aim is to not let that happen and nip it in the bud because it will make the whole team demotivated and _ultimately_ the team’s pent-up feelings will surely blow up.

Our aim is to discuss ideas thoroughly with the CTO, gently push them toward a good solution if that’s really the best one and **take responsibility for that**. CTOs have to trust you and the team and you have to gain their trust by making good decisions and being professional.

**About the obvious — when you got to the development process it means that before you had passed through workshops with the client.**

**You know what the** _**core domain is**_. By “you” I understand the contractor (_development team_) and the principal (_client_). Even when the client is convinced that they planned and know everything, because they have tons of documents and wireframes, you must go through a few days’ workshops to visualize processes and embrace the scope of the MVP.

**Speaking of which, one of the goals except a common understanding of the product is defining what features the MVP includes**_._ Only then the development team will be able to provide reliable estimation. **There are a bunch of techniques you can apply to make the workshops more structural**: _**User Story Mapping**_**,** _**Example Mapping**_**, and** _**Event Storming**_. But more important than any of the techniques is to talk to each other and to analyze product functionalities.

**The important thing about every workshop is to define a single goal** that is understood by all stakeholders and to work solely on it. Thanks to that you can avoid _context switching_ and maximize chances to get more detailed information and spot more intricacies rather than having a superficial view on a few problems.

**One thing that is beside me and always results in something good — tests with users** performed by the UX team show whether planned features make sense or how they can be improved. This can be done earlier by the client, but not necessarily, and not always it’s done thoroughly. So, _limited trust here._

**Prepare the first version of the architecture.**

_How are you going to deploy it? What aggregates do you encounter? What modules do you see? What other non-functional requirements influence the architecture? Maybe part of the system will be certificated as a medical device? Maybe you want to store and process users’ data only in one module and in a separate database? Maybe the business is somewhere OK with eventual consistency? Maybe the business side expects the history of changes to be kept somewhere. Maybe you will be consuming telemetry? What database(s) will fit your case at a given moment?_

**Before you answer any of the above questions, remember to focus on the functionalities and the domain instead of on technology and infrastructure.**

**Before you pull toys out of the sleeve**, **like queues, event sourcing, CQRS, NoSQL databases, and new frameworks**, **think about the members of the team and their skills.** My _simple_ rule is that I don’t introduce more than one new thing at a time to not bog down the development process and flatten the learning curve. For me a new thing is something that no one on the team knows, if there’s at least one person (but me) who knows this, then I’ll not treat this as something new.

**My current aim is to work on a chassis repository for bootstrapping new projects**.

I believe that this kind of standard in a software house helps to organize knowledge and speeds up project bootstrapping. Aligning knowledge contained within that repository is also a matter of internal training.

**Make sure that your team understands architectural assumptions and the decisions behind them**. Make sure they know the importance of the processes (e.g. API first) and the documentation. Confront them all with that, discuss it in detail, and in the end help them adapt to the changes.

**Set a cyclic meeting, e.g. once a week to take control of the evolution process of the architecture and to address doubts that have been piling up.** Especially at the beginning (the first few months), when developers get to know each other, the new project, and potential new rules and guidelines. That’s why, as mentioned above, I believe that these rules and guidelines in a software house company shouldn’t deviate much between teams.

Work on documentation and track your decisions, you can e.g. follow one of many ADR (Architecture Decision Record) templates. I use a GIT repository for storing it to push those documents through a regular code review process. The decision records should be short, spikes may produce longer analysis documents.

You can accuse me of inconsistency here because developing cumbersome documentation is the opposite of cutting edges where possible. That’s right, **but** _**without**_ **documentation, we can’t really follow the project in the post-MVP phase**. It’s not possible to write accurately the docs that should have been settled a few months ago. No one would remember the exact motivations behind decisions.

**Another way I find effective is prototyping using cloud-native solutions**.Did you know that to make an on-prem Kubernetes (as of the moment of writing — version 1.7.1) secure and production-ready you need to go through over _300 pages_ of [CIS report](https://learn.cisecurity.org/benchmarks)? Did you know that to do the same but with a cloud-managed cluster you have to go through over _170 pages_?

My recent EKS implementation included the following controllers/daemon sets: _CoreDNS_, _Metrics Server_, _Helm_, _Flux_, _Sealed Secrets_, _AWS Distro for OpenTelemetry Collector_, _Fluent Bit_**.** Everybody may feel dizzy with all of these integrations and possible bugs caused by _a version mismatch_. Additionally, having yet another plugin can mean having another container running.

**It’s a lot of maintenance, a lot of configurations, and a lot of spots and intersections where something may go wrong**. So, if you don’t want to occupy your busy developers with DevOps or, _Kyrie eleison_ (!) if you don’t have much of this skill, then _pack all the toys back into a bag and focus on what’s really important — functionalities, not the infrastructure_.

**Another issue regarding the K8s that I’d like to tackle is the vendor lock.** _**THE**_ **mythical vendor lock**. If we use a managed version of the orchestrator, then — whatever the efforts — we’ll bump into the vendor lock as well. Examples: logs harvesting to send them to the cloud, distributed cache on a cloud bucket, sending metrics to the cloud, mounting cloud storage with a _FUSE adapter_, _cloud load balancer_, and _cloud OIDC provider_.

As one of my teammates once said — _coupling to the cloud for a managed K8s cluster is way more subtle and implicit than using a cloud-native solution directly_.

Of course, in most of these scenarios, you can substitute cloud solutions with more generic _SaaS_ and Kubernetes-hosted services (like, for example getting rid of the cloud load balancer and having _Nginx_ or _Traefix_ instead). But that means more tooling and integrations on your side. So, the question is — is it worth it?

**In my life, I migrated a managed Kubernetes cluster from AWS to Azure. And I have to admit there’s a lot of not obvious caveats and intricacies**. **Hence, my thumb rule and decision heuristic is to start with a cloud-native service** like _AWS Elastic Container Services_ or _Lambdas_.

It’s simple, observability is better, it’s much less responsibility on the team side and it’s also less error-prone. _I find it quicker and more cost-effective to migrate the cloud-native solution to another cloud provider or to a non-cloud-native approach_ (like migrating from Lambdas or ECS to a K8s or EC2s). Moreover, the cloud providers give you a set of tools that are perfectly compatible with each other. Can you say the same about Kubernetes plug-ins?

**If you work on Docker images, then it seems that what and how runs them doesn’t make much difference**. Making the K8s up and running, secure and usable is cumbersome and put a significant burden on your shoulders.

A real big-scale scenario was migrating one of Prime Video services from AWS Step Functions and Lambdas to ECS and EC2s. Engineers did it because they relied on virtualization, a good plan and that was just another step in their architecture evolution. I will come back to it later.

**It’s staggering for me that microservices are one of the most controversial topics.** When this defiant buzzword is thrown in space you, hear mumbling, someone sounds off about what they think. Appetites for the microservices have been largely undimmed, they seem to be beckoning, but people often forget that this is just another screwdriver, another tool.

Let’s refer again to the Prime Video case. The noise around that proved to me once again that I shouldn’t trust most of the blog posts on the Internet even if the author is not an anonymous developer (like me, your Favorite Modest Author). A prominent example is [this post](https://world.hey.com/dhh/even-amazon-can-t-make-sense-of-serverless-or-microservices-59625580) (sic!).

Developers dig their heels in and refuse to read with understanding.

_The Video Quality Analysis_, one along many Amazon’s teams, motivated its initial choice as follows:

> “We designed our initial solution as a distributed system using serverless components saw (for example, AWS Step Functions or AWS Lambda), which was a **good choice for building the service quickly**.

_The link to the original Amazon post you can find_ [_here_](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90).

So, it was handy and cost-effective for them to bootstrap their app with Step Functions, a few Lambdas, Media Conversion Service, and S3. They continue:

> **“We realized that distributed approach wasn’t bringing a lot of benefits** in our specific use case, so we packed all of the components into a single process.

They explicitly pointed out it’s about their specific use case.

And the last interesting thing in the context of my text:

> “Conceptually, the high-level architecture remained the same. **We still have exactly the same components as we had in the initial design**.

In this case, they, among others, hit the AWS region’s limits which limited their scaling capabilities. Also, having distributed architecture forced them to use S3 which has been replaced by in-memory storage in one-process monolith service.

The takeaway here is that _in this particular case_ due to arbitrary region limits and the racked-up costs (high demand), they found the single process on EC2s and ECS a much better fit because everything is close to each other so there’s no latency for infrastructure communication.

**It was the evolution process**. They kicked off with Lambdas, Media Converter, and the distributed system because they were focused solely on functionalities and testing their product. _And the product worked out, it passed the market test._

The Prime Video’s case showed also, as I pointed out a few paragraphs earlier, that it wasn’t a barrier not to overcome to switch from Lambdas to a more conservative and traditional solution — the codebase within the vendor-locked solution has been mostly reused.

The same applies (and even more) to the ECS, which the Prime Video team thinks of as a more traditional tool because it doesn’t force you to use microservices as it happens naturally with Lambdas. The ECS is yet another orchestrator where you have to deliver a containerized application, so what’s the problem with migrating it to on-prem infrastructure later when the software is more mature and needs are different?

**Honestly, I’ve never started with microservices architecture and that’s my other thumb rule not to do so as I want to bypass overcomplicated architectures consuming precious time which is running out.** The architecture has to serve the business goal.But I have to highlight one thing that I believe is widely misunderstood; The tautology is _microservices => distributed system_. It means that if you have microservice architecture it implies you also have a distributed system but not the other way around. Having a distributed system doesn’t mean your architecture can be called microservices.

**The microservices are fine-grained**. The perfect examples are AWS Lambdas and _AWS Step Functions_ implementing the _Saga pattern_. That toolset forces fine-grained services with a single responsibility. Of course, you can still create a distributed big ball of mud, reference all functions to a single database, make all Lambdas hungry, and kill off yourself with overcomplicated communication. **No tool or technology saves you from doing stupid things**. You can grab a hammer and try to bump a bicycle tire, why not?

**Service-oriented architecture and monoliths are coarse-grained services.** They are perfect to learn about your business boundaries, bounded contexts, rules, constraints, and aggregates. It’s easier to split a bigger service than merge an existing service into one when you discover that something went wrong. That thing is comprehensively described in _**Neal Ford’s Software Architecture: The Hard Parts**_**.**

If I learn that, for instance, I have to implement data streaming of health monitoring devices, then it’s likely I’ll dedicate a separate service to that to take the burden of real-time data processing. If I learn that the important non-functional requirement is the security of patients’ records, then maybe I will cut off this piece of the cake and put it in a separate closed box with dedicated security measures and layers that other parts of the system don’t need. If I learn that there’s also a development team on the client’s side, then maybe we’ll agree to work on separate monoliths (services). But it doesn’t mean that suddenly I work with microservices architecture. It means that I analyze the requirements and **I try to do my best to deliver the value whilst having the option to evolve what is currently implemented into something more advanced and focused in the future**.

**These days everything is a distributed system, even monoliths.** You have your backend, you have a Keycloak instance (with its database), and you have of course your main database. So, already you have a few moving parts. You can’t span a change over both databases with a single transaction. Also, probably, you have more than that. You have a notification service, static storage, etc. **Worth noticing is also that microservices are monoliths too**. Right? But distributed. They all serve the common purpose of implementing business flows. If you shut down one of the services will the whole system still be delivering the full value?

**My point is that a modular monolith is not a constant struggle to have everything contained in a single process**. If I have a modular monolith with that one split service for the data streaming I still call the whole thing a modular monolith because I’m still learning along with my client about the product’s domain and I don’t see a reason to overload me and the team with hundreds of problems that pop up with microservices.

The microservices are not an end in itself — the end in itself is to follow your domain and organization requirements and adapt the architecture towards them to achieve their goals to let your client successfully sell their application.

**Wrapping up the above paragraphs — I start my projects as modular monoliths because there’s still a lot to learn about the domain and that includes me, the team, and as well as the clients themselves.**

The software development and the architecture for me is risk management. **This is the mantra I follow. This is also a paraphrase of the idiomatic “it depends”.**

I have to gather functional and non-functional requirements that have been determined for the time being and know who I will be working with. Mix it all up, assess a hazard, and propose some solutions. **There’s no single effective recipe on how to successfully deliver an MVP to the world**, only some heuristics I learned after a lot of smaller or bigger failures. Heuristics I’ve just shared with you, Dear Reader. And again, _don’t_ treat them as tools that will help you, but rather think of them as inspiration and an incentive to confront your own views and your experience.

**There’s also an area, I imagine pretty big, of things that I haven’t tried and which can serve the purpose.** One I can think of is feature toggle and Canary deployment. It’s something that so far I haven’t had a chance to work with and have an opinion about.

If I stand by my resolution, then I will thoroughly describe how I go through the design and decision-making process up to the implementation phase based on a real-world scenario.

Artur

**Bibliography**

*   [Strategic Monoliths and Microservices: Driving Innovation Using Purposeful Architecture](https://www.amazon.com/Strategic-Monoliths-Microservices-Addison-Wesley-Signature/dp/0137355467)
    
*   [Serverless Architectures on AWS, Second Edition](https://www.amazon.com/Serverless-Architectures-AWS-Peter-Sbarski/dp/1617295426)
    
*   [Building Evolutionary Architectures: Automated Software Governance](https://www.amazon.com/Building-Evolutionary-Architectures-Automated-Governance/dp/1492097543)
    
*   [https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90](https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90)