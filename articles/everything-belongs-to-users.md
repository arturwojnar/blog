---
cover: /articles/kolkhoz.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2025-03-24T00:00:00.000Z
title: "Everything belongs to users"
description: "Homo Sovieticus's mantra was: Everything belongs to the kolkhoz, everything belongs to me. In the context of this text, I want to rephrase it to: Everything belongs to the app, everything belongs to users."
layout: ../layouts/article.njk
tags:
  - software-architecture
  - modular-design
  - user-centric-design
  - system-design
  - dependency-management
canonical: https://www.knowhowcode.dev/articles/everything-belongs-to-users
excerpt: "Exploring how user-centric design principles can help simplify complex software architectures and reduce coupling between modules"
readingTime: 5
published: true
---

> Homo Sovieticus's mantra was "**Everything belongs to the kolkhoz, everything belongs to me**". In the context of this text I want to rephrase it to: **Everything belongs to the app, everything belongs to users**.

<img class="cover-image article-image" src="/public/articles/kolkhoz.webp" alt="" loading="eager" fetchpriority="high" />

I often hear we _can't_ modularise the app when everything depends on _users_. I hear it's a mirage, overcomplication in the name of self-indulgence.

I remember that once, back in the old sunny days, trying to visualise the team's problems, I took a piece of paper, drew big dots, labelled them with class names, and drew directional arrows between any two modules referencing each other. **That was a spider's web!**

Then, I realised **life is about striving for a straightforward graph that doesn't look like that web**.

#### Users glue all the pieces together, right?

But what to do with those _users_?

The problem is we can call whatever user-related a user.

➡️ User _belongs_ to the complaints.

➡️ User _belongs_ to the blood examinations.

➡️ User _belongs_ to the shipment.

➡️ User _belongs_ to the patients' list.

➡️ User _belongs_ to the clinics.

If you see a folder structure in your project like on the _Image 1_, there is a significant chance that something is firmly off in this project.

Of course, **folder structure is not an architecture**, but often is an explicit manifestation of it.

<article-image src="/public/articles/kolhkoz/folders.webp" width="350px" label="Image 1. "We can't separate anything because all features link to the users"."></article-image>
It's a classical _ubiquitous language_ [problem](https://martinfowler.com/bliki/UbiquitousLanguage.html).

Without a proper design phase we can't discover subtle differences between actual entities.

#### Business capabilities

Imagine we have _patients_ registered in our app. Patients can be evaluated according to different test results.  

<article-image src="/public/articles/kolhkoz/tests.webp" label="Image 2. Two modules referencing a patient."></article-image>  
We defined two [_business capabilities_](https://www.leanix.net/en/wiki/ea/business-capability) - evaluation of test A or B results.

Test A needs an _age_, and test B needs a patient’s _weight_ and _height_ of.

However, **none of these need to be aware of other patients' information**. These modules link to a patient by their ID.

The evaluation modules have their **own perspectives of what a patient is**. And it's not something known from where patients come from.
  
There's a module that stores patients and contains information that, e.g. lets them log in or get profile details. It doesn't necessarily contain biometric data like _age_, _weight_ or _height_. This data may come with test results, be obtained on-demand by a _questionnaire_, and be purposed only for evaluation. 

#### "Common" is mostly bad
  
Let's picture creating explicit coupling between patients and the two evaluations having one model of patient and supplying modules with data about patients from one source (that model).

It's presented in the _Image 3_.

<article-image src="/public/articles/kolhkoz/folders2.webp" width="350px" label="Image 3. Coupling by generalisation."></article-image>
> 💡 By the way - `patient.entity` is hanging, it doesn't belong to any specific module. This situation is called _orphan classes_, initially described by Neal Ford. I wrote more about that [here](https://www.knowhowcode.dev/articles/solution).

In fact, the two features are fueled by two _projections_ of who the patient is and by what behaviours and properties are represented.

If we don't go with design reasoning and let our brain flow with its [natural generalisation mechanism](https://www.sciencedirect.com/science/article/pii/S0885201421001398) (thank you, evolution!), we will create a Frankenstein. Frankenstein is all needed by the two features.

It is a __data and behaviour leak__ between the features.
  
I see this situation as breaking _Interface Segregation_ and _Single Responsibility_ rules on the architecture level. 
In this situation, we caused a domain language leak from one module to another (patients to evaluation A or B).

Also, the other modules don't need to know e.g. emails except the _PII_ (Personal Identifiable Information) module.

#### Different capabilities, different users
  
With simple context separation, we increase the overall reliability of the system because we untangled different system capabilities:

➡️ Getting profile details / Logging-in patients  
➡️ Evaluating A test results
➡️ Evaluating B test results

Look at the _Image 4_ that shows the correct design.

<article-image src="/public/articles/kolhkoz/separation.webp" label='Image 4. Each "module"/"slice"/"feature" knows a different patient entity.'></article-image>
Also, look at the _Image 5_ below how the bad design is.

<article-image src="/public/articles/kolhkoz/no-separation.webp" label='Image 5. Each "module"/"slice"/"feature" knows a different patient entity.'></article-image>
**Each capability understands the patient differently, using the same identifiers to uniquely identify and link patients if needed.**

#### Database also does matter

At the end, it is worth to mention that the _coupling can be created also on the database level_.

It's tempting to create some relations. Especially if we work with a single database. Then, you may think that it's beneficial to reference a patient from test "A" to patients from the _PII_ module.

That'd make a physical relation between capabilities that can potentially force changes in module A/B because the "base" patient model changed.

You can read more about the database coupling [here](https://www.knowhowcode.dev/articles/decomposition). 

#### Outro

**Adequately designed and modelled systems are nothing like a communist utopia.**

Common is not good ☭ 🛑.

In properly **designed** systems, there are **narrowed** "sectors" of the overall project's _domain knowledge_.

Sure, those "sectors" are not entirely separated. It is not possible, and this is not the goal.

The aim is to build an [effective development environment](https://www.knowhowcode.dev/articles/coupling) in which features can be successfully implemented in a reasonable time - in contrast to the (Distributed) [Big Ball of Mud](https://thedomaindrivendesign.io/big-ball-of-mud/).


