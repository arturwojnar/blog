---
cover: /articles/overengineering.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2024-12-05T00:00:00.000Z
title: "Overengineering by being a prisoner of patterns"
description: "Learn how being trapped by design patterns leads to overengineering. Discover the balance between coupling control and communication in software development."
layout: ../layouts/article.njk
tags:
  - overengineering
  - design-patterns
  - software-architecture
  - coupling
  - communication
canonical: https://www.knowhowcode.dev/articles/overengineering
excerpt: "Understanding how rigid adherence to patterns can trap developers and lead to unnecessarily complex solutions"
readingTime: 4
published: true
---

Yesterday, I wrote about magic components 🥩🥕 consisting of most of the patterns, approaches, strategies, processes and workshop methodologies.  
  
[link to the prev post:  [https://lnkd.in/dySE_fKb](https://lnkd.in/dySE_fKb)]  
  
This is the real magic 🌟 that has driven all the projects I’ve known.  
  
**COUPLING MANAGEMENT + COMMUNICATION = EVERYTHING** 
  
You can think of it as “basic” glucose that gets converted into glycogen, starch, or sugars. Then, the amylase enzyme breaks down the complex chains back into glucose.  
  
How does it help me?  
  
➡️ The goal is not to implement by the book a pattern X or Y. They are tools that help me in achieving my real goal.  
➡️ The real goal is always fulfilling the project’s business decisions through tight communication and an architecture driven by risk management  
➡️ My primary tool 🔨 on the code level that mitigates risks is coupling management  
➡️ The fact that a tool or a pattern helped somebody doesn’t mean right away it will work for me  
➡️ I always try to find my way, which is “this” project’s way and IS NOT THE PATTERN’S WAY  
➡️ Patterns serve me, not the other way around! I can’t be a prisoner of meanings related to patterns I apply  
  
📖 _Example_. It happened that I modified two aggregates in the same transaction. It should not have happened, but sometimes it does. I do not over-engineer the design in the name of a book definition and the community opinions. If my architecture is satisfied and its decisions are respected, then it is okay.  
  
📖 _Example_. During big picture event storming sessions, I allow for sticky notes that are not events because that also helps me to get where I want to be. I don’t force participants to follow strict rules but give them space to express their thoughts.  

<img class="article-image" src="/articles/overengineering.webp" alt="" loading="eager" fetchpriority="high" />