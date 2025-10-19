---
cover: /articles/is-solid-dead.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2025-01-12T00:00:00.000Z
title: "Is SOLID dead?"
description: "I'll do a small revision of the SOLID principles, shifting it more towards high-level components and modern software development practices."
layout: ../layouts/article.njk
tags:
  - solid-principles
  - software-architecture
  - design-principles
  - best-practices
  - code-quality
canonical: https://www.knowhowcode.dev/articles/is-solid-dead
excerpt: "Revisiting SOLID principles in the context of modern software development and high-level component design"
readingTime: 6
published: true
---

<img class="cover-image article-image" src="/public/articles/is-solid-dead.webp" alt="" loading="eager" fetchpriority="high" />

In the past year, I've had the chance to work on a skills matrix at my company. It's been a hell of a challenge, and I still feel the burden of potential consequences.  
I concluded with my colleagues that soft skills comprise at least half of a developer's capabilities. These include communication, independence, and a willingness to work on both front—and back-ends.  
Regarding technical skills, I thought about what it means to be a good developer.  
In addition to some crucial soft skills, a good developer knows how to manage risk practically by making trade-offs. The critical part of that is coupling management.  
How do you describe that skill? Well, it is a matter of interpretation what SOLID is.  
These mature rules are not rancid or dusted. Quite the opposite.  
I'll do a small revision of them to prove my point, shifting SOLID more towards high-level components.  
  
➡️ SRP. The more reasons you have to change a module, the less cohesion of the module’s parts. The more reasons, the bigger the coupling between those parts.  
Consequently, you increase the probability of a bug propagating within coupled implementations. Additionally, developers can easily conflict within the same codebase.  
  
➡️ OCP. Making extensions (not modifications) reduces the coupling. Another perspective is that the OCP describes pluggable systems. Pluggability is important in modern systems as it helps to respond to dynamic business changes - clients want to test a delivered feature, but it may turn out that customers don't like it. Then, all we have to do is unset or remove this feature. [Oskar Dudycz](https://www.linkedin.com/in/oskardudycz/)  named this quality as Removability. When that feature is coupled with others, its removal becomes more challenging.  
  
➡️ LSP. The substitution principle, in other words. When we're forced to get to know the details of a replaceable component, a policy, in a high-level component to utilise its capability, we become coupled to it and its domain knowledge.  
I appreciate the Extended LSP interpretation I first learnt in "Agile Principles, Patterns, and Practices in C#” by Robert C. Martin. It states you should use inheritance only when you are using polymorphism; in all other cases (which is often), you should use composition.  
I firmly believe that inheritance leads to overengineering and creating unnecessary code.  
  
➡️ ISP. Imagine you have a shared library where you put some infrastructure facades and utilities. At some point, you add types and value objects. It's a tricky place to force some modules to have logic or validation that is not meant for them. Shared kernels can also leak domain knowledge, which moves your system towards more significant coupling.  
  
➡️ DIP. Two significant methods of dependency inversion are dependency injection and events. Both are crucial in coupling management at all levels.  
  
That's why SOLID is still the thing in many aspects of designing systems and thinking about possible implementations.