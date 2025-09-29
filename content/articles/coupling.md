---
cover: /articles/overengineering.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2024-11-03T00:00:00.000Z
title: "Coupling management + Communication = Our job"
description: "Most of the known patterns can be reduced to the coupling control. Get to know how this reasoning can help you simplify your solutions."
layout: article
tags:
  - software-architecture
  - coupling
  - communication
  - design-patterns
  - domain-driven-design
canonical: https://www.knowhowcode.dev/articles/coupling
excerpt: "Discover how coupling management and communication are the fundamental building blocks of all software development methodologies and patterns"
readingTime: 6
published: true
---


I faced moments of feeling lost, confused, futile and frustrated as I navigated through a myriad of methodologies, patterns, processes, and workshop tools. It was overwhelming at times, but I realised that it was all part of the journey.  
  
What if I told you that this complexity is an illusion shaped by marketing?  
  
Just as all mathematical formulas can be distilled into simpler forms, we can uncover the most fundamental elements behind many methodologies and patterns. Embracing this perspective empowers me to see clarity amidst the chaos.  
  
I learnt there are only two building materials in software development.  
  
You can think of it as “basic” glucose that gets converted into glycogen, starch, or sugars. Then, the amylase enzyme breaks down the complex chains back into glucose, among other things.  
  
When it comes to our yard…  
  
The two ingredients are… suprise suprise…  
  
Coupling and communication!  
  
Let's analyse some of the popular software's "must-haves":  

🤌 _Event Sourcing_. The database pattern that decouples stored data from taking a tying-hands projection by storing events describing changes instead of persisting and updating one shape of data. But to do so, we have to communicate and understand business requirements.  
  
🤜 _CQRS_. It decouples read and write models as what we read is not necessarily what we want to save. Writes are usually more complicated because of the domain logic. But how do you decide the separation has to be done? We need communication with a team or client.  
  
🤙 _Bounded contexts_. Decoupling by distilling requirements into separate “boxes” that should not be “hungry” for non-stop talking with each other. Communication is crucial in the determination of proper bounded contexts.  
  
🫶 _SOLID_. All rules that can also be applied on the architectural level involve managing coupling and cohesion. But can we really focus on tech without caring about the design phase?  
  
🫱 _Event Storming / Domain Storytelling_. Both focus on visual mimicking of requirements based on intense structural communication and coarse-grained distilling of processes by finding high cohesion in drawn flows by some heuristics.  
  
🤟 _Root Aggregate. Clean Architecture. Large-scale structures. Builder. Adapter. Command. Mediator. Context Maps_. The formula is coupling management + communication!  
  
Now, the vital thing - NO PATTERN OR METHODOLOGY OR TOOL WILL MAKE THE JOB DONE FOR YOU.  
  
It is always about the design phase, analysis, asking HOW and WHY and the intellectual power we all have to put in to make reasonable decisions at a given time. Sorry, no shortcuts.  
  
But this is good news, right? Otherwise, systems would be designed by ChatGPT by now 🫣  
  
All patterns are to look at problems from different perspectives. By the end of the day, you must deliver a product close to a customer’s domain and a product that can evolve.

<img class="article-image" src="/articles/overengineering.webp" alt>