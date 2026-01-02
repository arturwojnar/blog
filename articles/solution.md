---
cover: /articles/solution/cover.webp
author:
  name: Artur Wojnar
date: 2024-02-23T00:00:00.000Z
title: "The ultimate solution to everything"
description: "If you do THAT, THEN YOU DO IT WRONG!"
layout: ../layouts/article.njk
tags:
  - architecture
  - risk-management
  - legacy-code
  - domain-driven-design
canonical: https://www.knowhowcode.dev/articles/solution
excerpt: "If you do THAT, THEN YOU DO IT WRONG! Explore how we approach problem-solving in software development and avoid falling for ultimate solutions and silver bullets."
readingTime: 11
published: true
---

<img class="cover-image article-image" src="/public/articles/solution/cover.webp" alt="" loading="eager" fetchpriority="high" />

“**STOP**_ _using it”_

_“If you do_ _**THAT, THEN YOU DO IT WRONG!**”_

_“A technique you_ _**must**_ _know”_

_“The X framework is_ _**DEAD**”_

_“**The rise**_ _of Y framework”_

If you roll your eyes or, worse, you feel troubled whenever you read an eye-catching, heart-breaking, and click-bait title like one of those above, you’ve finally found a good place for you (I hope so). Let’s delve into a discourse on how we approach problem-solving.

Renowned astrophysicist Neil deGrasse Tyson once remarked:

> “The best thing we have going for us is our intelligence, especially pattern recognition, sharpened over aeons of evolution

While pattern recognition is undoubtedly valuable, it can also be a double-edged sword.

When I learn a new thing, I see it everywhere. When I learned about [SOLID](https://en.wikipedia.org/wiki/SOLID) someday, I became a [SOLID](https://en.wikipedia.org/wiki/SOLID) _neophyte_, saluting strict rules as a soldier bravely standing for the rights of good taste.Whether adopting [SOLID](https://en.wikipedia.org/wiki/SOLID) design principles or fervently embracing the latest framework, we can become entrenched in rigid thinking.

Despite many years passing, I still catch myself, let’s say, easily falling in love with new things. Maybe it doesn’t last long months, but some days or weeks for sure, looming later over me like an embarrassing memory from school past (you have it too, right?).

It’s a great way to learn — seeing patterns and introducing them to our solutions- but let’s try to remember to cool down passion and turn on critical thinking. Also, it’s helpful to recall one of the many embarrassing moments!

People on the Internet often want to sell you something; they are in their “_in-love-and-no-question-asked_” moments. We have had tiny, truly innovative things in the last few years.

About becoming a soldier of a new standard: _There are soldiers with_ [_blue uniforms_](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215), right? In that particular case, a specific contradiction arises.

I read [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) as a bunch of experience gathered under some named ideas (like _Aggregate_), and I think we’ve gotten to this point by now that naming something explicitly in a codebase by its name may be narrowing, making others hold you accountable because this ”_pattern says that and that_”. So, we tend to lose something far more important from sight — pragmatism and business goals. That’s funny — [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) is about business and domains, but because of treating the [_Blue Book_](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215) as the Bible, we may achieve the opposite — focusing too much on technical aspects and definitions of ideas that should only be a guide.

It’s a lesson I’ve learned: _every battle to follow the rules costs you nerves and your client real money_.

_We tend to follow algorithms (patterns) to solve our problems_. We expect to implement the same successful solution of others to achieve the same success. Yet, it almost always requires an individual approach unless we’re solving a problem from a tutorial.

I’ve learned through experience that blindly following rules can be costly regarding time and resources. Instead, I advocate for a more pragmatic approach focused on managing risk effectively._I gathered my most important rules under yet another acronym: 3R_.

### Risk management rule

There’s no infinite time for planning and development, so everybody talks about trade-offs. Not because something is impossible but because we can’t do 100 architecture iterations or work on one story by one year.

I think about programming and designing architectures as _legacy code management_. Legacy code is always with us, but if it is contained in _predictable boxes, it_ can be manageable, and the overall project’s costs are more satisfying. First things first: for me, legacy code is code that a developer calls “_we have to fix it someday_” — it is an implementation that is not done by the book and, at some point, can cause problems.

I always ask myself and my teams about a decision: “_What’s the worst thing that can happen?_”

A few examples:

1.  Supporting subdomains are places where less-experienced developers can learn and grow without stressful expectations of more complicated implementations of core subdomains (this is also a good place to outsource).I agree with this area’s higher legacy code level (_supporting subdomain_). Thanks to that, the team doesn’t have to deliver the highest quality. In the worst scenario, I’m okay with that to rewrite that part when a subdomain drifts toward bigger complexity (because the business also shifts in a new direction or is discovering new possibilities).Supporting subdomains are often [CRUDs](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete), so they probably rely on [Transaction Scripts](https://martinfowler.com/eaaCatalog/transactionScript.html) or [Active Records](https://www.martinfowler.com/eaaCatalog/activeRecord.html) — that’s why I cover them with container tests; with that, I know at least that that part works as an end product.
    
2.  _Modules_. It’s a matter of cohesion and design independence from other modules. If the modules are not self-evident in the bounded context, then I use the [_Event Storming Process Level_](https://mrpicky.dev/process-level-event-storming-lets-get-this-process-started/). The same is true for supporting subdomains. The modules give me, to some extent, a guarantee that legacy code in one of the modules won’t necessarily propagate to others. So, again, I try to mitigate the risk of spreading the legacy code to other modules like a virus.
    
3.  _Minimise_ [_generalisation_](https://en.wikipedia.org/wiki/Generalization). If you don’t work in a [waterfall](https://en.wikipedia.org/wiki/Waterfall_model) and don’t know the full scope of the product, then it’s impossible to predict all change vectors and how your codebase will evolve.I unzip the thinnest umbrella of commons over modules to minimise coupling between them. It is easy to bump into the Liskov problem and try to modify a “_generic class_” to support “_one thing more_”. With that, I mitigate the risk of tightening up things that should be loosely coupled and also of diluting commons, which eventually become a burden (legacy code)
    
4.  It’s a recent problem I hope I fixed for good. I tended to make commons from, e.g. [_value objects_](https://martinfowler.com/bliki/ValueObject.html) that, similarly to the above point, will lead to the same problem but with the leaking domain. I mitigate the risk by sharing only an infrastructural commons
    
5.  Suppose a project is still in the phase of a modular monolith with well-defined data ownership. In that case, I agree with simplifying and embracing database operations from different modules in one database transaction to avoid eventual consistency problems. At some point, when the project evolves to the point where it has to split into separate processes, this implementation will be something to refactor, but up to this point, we save time and money.
    
6.  [Slicing](https://www.jimmybogard.com/vertical-slice-architecture/) the codebase. It’s something other than modules — the slices are more granular, referencing one feature. With that approach, I avoid expanding relationships and unnecessary dependencies between features (the opposite of the [Layered Architecture](https://www.oreilly.com/library/view/architecture-patterns/9781491971437/ch01.html)).
    

It is a fair summary of my thoughts to say that I strive to keep legacy code manageable because I know that it’s inevitable. _Legacy code is yet another tool to fit a project implementation into a multidimensional shape created by the intersection of different non-functional constraints_ _like time, budget and team capabilities_. It’s like packing numerous pieces of luggage into the car trunk; some of them will get squeezed, and some of the boxes may get deformed a bit, but after all, it’s about protecting what is inside and not forgetting to pack an undeniably needed thing.

Risk management is broad, but I don’t want to contain everything here. Speaking of that, I encounter two bigger building blocks of my thinking (at least starting from R)

### Redundancy

I’ve liked redundancy after years of trying to be [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself). It’s the harmful rule, a relic of the past, yet another example of how thinking is necessary before applying “_good practices_”.

_WET >> DRY__WET_ stands for _Write Everything Twice_, the opposite of _DRY_. But I don’t use it as a hammer. My rule of thumb is to apply _DRY_ on the module level, but for everything else, think 5 times before making a generalisation (see point 3 in the previous section). Infrastructure-specific and typing utils are probably good candidates for a separate package or a common code in a mono repo.

Worth noticing is that a shared package (kernel) means one [_Architectural Quanta_](https://www.oreilly.com/library/view/building-evolutionary-architectures/9781491986356/ch04.html). Because the DRY part is the single source of truth, it couples components that refer to it.

One perfect example of a generalisation problem is _orphaned classes_ (or _orphaned files_). This perspective is extremely useful when we’re still in the extensive domain discovery phase and/or we work on modular monolith.

If you add another directory to the namespace or directory structure, you may generate some architectural problems despite the fact that it makes total sense from the developer’s point of view.

Let’s take a look at the following structure:

```
/patient-calendar
  /scheduler
    get-patient-info.code
    cron.code
    generate-event.code
  /notification
    get-patient-info.code
    generate-notification.code
    push-notification.code
```

It seems to be OK, and maybe it is, but by asking, “How should I split that into services?” some problems will arise. Should _the schedule_ be a separate service? If so, what’s with the _get-patient-info_? Should it also be a separate thing? Or maybe we should deploy a service called _patient-calendar_?The orphaned classes’ perspective resolves that dilemma by defining a component as the last directory (_leaf_ directory). With that, the schedule and the notification are components, and the patient calendar can be considered a subdomain. The get-patient-info file is the orphaned class, not belonging to any particular component but (likely) shared between them.

The rule distilled from these considerations can be summarised as follows: _Code can exist only in node leaves (components)_.

The refactoring process for orphaned classes is called the Flatten Components Pattern (introduced by Neal Ford). One way is redesigning with, e.g. Event Storming or merging an orphaned class like this:

```
/patient-calendar
  # info whether a user wants to receive notifications or in which language
  get-patient-info.code 
  /schedule
    cron.code
    generate-event.code
  /notification
    generate-notification.code
    push-notification.code
```

Neal Ford describes orphaned classes and the Flatten Components Pattern:

> “Regardless of the direction of flattening, make sure source files reside only in a leaf node namespace or directories so that source code can always be identified within a specific component

I like making refactoring like this because it’s also part of the risk/legacy code management — potential split into separate deployable units will be much simpler, and orphaned files tend to hurt their dependencies by violating of Liskov rule.

### Restrained ocean

If my kid wants to play and sees too many toys, she ends up trying to play with every toy for a few seconds, so eventually, she plays with nothing and gets unfocused. If you’re a parent, you know that for sure 🙂

_A restrained ocean means limiting an ocean of possibilities_. Instead of trying to grasp the whole underwater space and all the creatures living there, it’s better to refrain from absorbing everything to not overload our senses. I purposefully limit the possibilities of plays for my daughter so that she can enjoy her time instead of falling into chaos.

I try not to fall into the so-called analysis paralysis, expecting to come up with an ultimate complex solution at once. Instead, I take small steps and morph my current solution, splitting the problem into smaller ones like the divide-and-conquer algorithm.

A few examples:

1.  When a new project kicks off, I do not usually pick up too many new things (to the team or the company), technology-wise — like frameworks, 3rd parties, and cloud services. Most of the stack should be known to me and the developers.
    
2.  When starting an implementation, I start with requirements and risks I’m sure will impact the solution immediately, leaning over cohesion and coupling; I give the implementation a chance to evolve later or be changed completely or even removed without the need for long and bloody surgery involving other components.I.a., if stories or requirements are prioritised (like with _MoSCoW_) and I see _COULDs_, then it is a signal those have a much bigger chance to change in the future. They are only guidance for me on the direction of evolution, but they should not significantly influence the implementation/architecture of _MUSTs_.
    

Let’s come up with an example:

*   _MUST_: if a patient bought ten or more blood tests in a current calendar year, then the next 5 should have a 5% discount if made in the next 6 months after receiving the discount
    
*   _COULD_: if a patient has invited a new patient to the system, then the inviting patient should get a one-time 2% discount for the next blood test, and the discount cumulates the others
    

The _COULD_ gives me a feeling that different types of discounts may be applied cumulatively. I know it’s an important aspect of the business’s competition, so I’m preparing a slice that treats the known discount type separately. _With that, I can process other discounts later_, _either in a pipeline or independently_, if they can be calculated without context.The result is a blood test price with applied discounts described by dedicated events. Thanks to that design, different discounts are not coupled together. An example implementation can look like this:

```typescript
type DiscountCommand = OrderBloodTest | CancelBloodTestOrde
type DiscountEvent = BloodTestsNumberDiscountApplied
type DiscountCounter = {
  state: NotReached | Active | Expired
  year: NaturalNumber
  lastBoughtAt: Date
  boughtTestsNumber: NaturalNumber
  _version: NaturalNumber
}

calculateTestDiscount(command: DiscountCommand, state: DiscountCounter): DiscountEvent {
  // implementation
}
```

---

In conclusion, I move away from the allure of one-size-fits-all solutions and embrace a more nuanced approach to problem-solving. By combining well-known patterns with critical thinking and risk management, Thanks to, I can navigate the ever-changing landscape of technology with greater confidence and clarity.

Anyway, catch you later!