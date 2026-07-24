---
cover: /articles/why-entropy-kills-software/cover.webp
author:
  name: Artur Wojnar
date: 2026-05-19T00:00:00.000Z
title: "Why does entropy kill my software?"
description: "Software architecture decays toward chaos the same way matter does. Two practical tools for keeping entropy low: small functional modules and archetype-based generalization."
layout: ../layouts/article.njk
tags:
  - architecture
  - entropy
  - modularity
  - archetypes
  - system-design
canonical: https://www.planthencode.com/articles/why-entropy-kills-software
excerpt: "The default state of matter is chaos, and software is no different. After enough time, what started organized and 'clean' fills with disorder. Here is how I fight entropy in system design."
readingTime: 5
slug: why-entropy-kills-software
---

<img class="cover-image article-image" src="/public/articles/why-entropy-kills-software/cover.webp" alt="" loading="eager" fetchpriority="high" />

The default state of matter is chaos. The movement of matter is always toward chaos. Disorganization.

Life is unique — incredibly organized into billions of structures working together. Seemingly fragile, it is an exception to the ever-expanding empty dark space.
And life exists onlys because eventually it degrades, vanishes, and blends back with the rest of the free atoms, chaotically colliding in constant motion.

*This is statistics.*

After enough time, our cities, left to themselves, will disappear, and eventually no one coming to Earth will know we were ever here.

If a force is shooting small balls of different colors toward a few buckets, then at some point we may think the balls got placed there following some pattern. But it's an illusion. After enough time, all the buckets will contain millions of balls of all colors, and no organization will be discoverable. Only chaos.

*This is statistics.*

Why would software architecture be any different? It *isn't*.
At the beginning, everything is neatly placed into its bucket, organized, and — as much as I hate this word — "clean".
But after enough time (and in the case of software, that's not hundreds of millions of years, but *months*), a bucket that once contained only green balls now has other colors in it too.

What can we do in software engineering to fight and lower entropy?

## Business capabilities

The most stable parts of the system are its business capabilities. They tend to change the least, as they represent business fundamentals — such as Finance, HR, Fleet, or managing clinical documentation.

I start with those. To learn about business capabilities, we can either figure them out ourselves or ask stakeholders.

Business capabilities provide a solid foundation for implementing discovered processes inside the modules that live within those capabilities. See my example mapping of business capabilities in the image below.

<article-image maxwidth="600px" src="/public/articles/why-entropy-kills-software/capabilities.webp" label="Image 1. A real-life example of a business capability map."></article-image>

Business capabilities often have several nested capabilities, which can be more detailed and technical.

Once you've mapped all of that, you know the core one — the most important capability, without which the business wouldn't exist. This is the structure that will likely change the most, and bugs there carry the biggest risk.

## Small functional modules

*Divide and conquer* — thin modules tend to have only a few inputs and outputs, so the surface for change is also smaller than in larger systems. That means entropy should be much lower, manageable, and not increasing significantly.

But the law, the axiom, is that entropy *always* increases. If it doesn't happen in our small, manageable modules, then *where?*

Well, entropy grows in the overall system — between modules, and in the orchestrator layer that implements inter-module communication and 3rd-party access.

<article-image maxwidth="1000px" src="/public/articles/why-entropy-kills-software/entropy.webp" label="Image 2. Impact on entropy on the overall system vs. entropy on the local level."></article-image>

That's why I focus most of the design phase on discovering business processes, modules/vertical slices, write and read models, and root aggregates. I discover and design modules with predictable, small flows.
I know that some people benefit from event modelling.

## Generalization

Generalization is often a bad practice. Our brains have a natural tendency to rely on generalization as a cognitive economy mechanism, allowing rapid information processing and pattern creation — something closely related to the functioning of intelligence.
Generalization that leads us to create a *shared kernel* (not infrastructure) across multiple modules is bad. All those monsters like UserService, OrderService, or DiscountRepository that cut across functionalities horizontally are a pure nightmare.

But if we are able to generalize our model to fit multiple domains, then it is a win.
We're then ready to handle horizontal business scaling and diversification into other domains.

Take the classic example of seat reservations in a cinema. If we base our solution on the *Availability* archetype, we can build large-scale structures on top of it that provide policies specific to different cinemas and businesses — such as theaters, operas, concerts, or training sessions — and we'll be ready for environmental changes. Whenever the business says something like, "Now we want to support bike rentals."

Large-scale structures and archetype patterns are tools for creating flexible solutions built on universal structures. If a solution is universal, it has a chance to resist change.

In one of my previous articles, I wrote about an alerting system for patients. I discovered a semantic boundary for a single alert. So I separated different sources of alerts: one for the liver cancer risk alert, a separate one for the fatty liver risk alert, and separate models for clinic-specific alerts.

See how I designed a single context below.

<article-image maxwidth="1000px" src="/public/articles/why-entropy-kills-software/module.webp" label="Image 3. Single module for monitoring liver cancer risk level."></article-image>

And check out how I designed a high-level perspective on the broader alerting capability.

<article-image maxwidth="1000px" src="/public/articles/why-entropy-kills-software/contexts.webp" label="Image 4. Each context monitors different disease entities and is a separate linguistic boundary"></article-image>

But if we look at it carefully, we can conclude that, in fact, our model is not unique or domain-specific. We can draw it as a linear set of states. We get something as input, compare it with the current state, and depending on the result, we either shift to the next state or go back to the beginning.

<article-image maxwidth="400px" src="/public/articles/why-entropy-kills-software/object-collaboration.webp" label="Image 5. Colloboration of objects within the module."></article-image>

This is a state machine that can be broadly designed as a graph. Each node is a specific state, and edges are conditions telling whether the transition to a given state should happen. We could instead drop conditions from the edges and put them on the states themselves, but this solution is less flexible, as it limits us to a single condition that must be satisfied to reach a given state from any other.

<article-image maxwidth="1000px" src="/public/articles/why-entropy-kills-software/composite.webp" label="Image 6. Implementing a graph with Composite Pattern (less flexible solution)"></article-image>

<article-image maxwidth="1000px" src="/public/articles/why-entropy-kills-software/graph.webp" label="Image 7. Implementing a graph with edges as logical conditions."></article-image>

Now we have two wins. First, with similar requirements in the future, we have an immediate solution. But more importantly, knowing the underlying universal structure — *the graph* — we can adapt the model to different domains: a bank transfer state, a physical lab test (where manual inputs are changes that happen to the test object), a state in a therapy, and so on.

## Wrap-up

I have two categories of tools for lowering entropy.
The first is discovering and implementing small modules with a well-documented list of inputs and outputs. I keep entropy low inside the rooms, even though the whole building is constantly under construction and gaining new floors.
The second category is generalization at the level of domain patterns (archetypes). With that, we can take changes from the business side and implement them without changing the model — but rather by adding new policies, or by using the underlying structures differently.

See you later 👋