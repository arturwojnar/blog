---
cover: /articles/dry-wet.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2024-12-20T00:00:00.000Z
title: "Be WET between modules, DRY within modules"
description: "Learn when to apply DRY vs WET principles in software architecture. DRY within modules for maintainability, WET between modules for decoupling."
layout: article
tags:
  - software-architecture
  - best-practices
  - design-principles
canonical: https://www.knowhowcode.dev/articles/wet-dry
excerpt: "Understanding when to apply DRY (Don't Repeat Yourself) vs WET (Write Everything Twice) principles in software development"
readingTime: 3
published: true
---

_DRY_ (Don't Repeat Yourself)
_WET_ (Write Everything Twice)

_DRY_ has been an admirable rule, but the most significant application of it had meaning 2-3 decades ago when everybody had to care about the result size of the source code.

But still, it is a good practice in _SOME PLACES_. Like, you have a class and an implementation that repeats a few times in this class. This is a sign that you should apply the DRY.

Check out my simple _diagram_ what is the goal and importance od the WET.

<img class="article-image" src="/articles/dry-wet.webp" alt="" loading="eager" fetchpriority="high" />