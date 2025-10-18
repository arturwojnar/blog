---
cover: /articles/ts-dto.webp
author:
  name: Artur Wojnar
  url: https://www.linkedin.com/in/artur-wojnar-a19349a6/
date: 2025-03-24T00:00:00.000Z
title: "How easily get your DTO in TypeScript"
description: "Learn simple and effective ways to create DTOs in TypeScript for better type safety and data validation in your applications."
layout: ../layouts/article.njk
tags:
  - typescript
  - dto
  - data-validation
  - nodejs
  - type-safety
canonical: https://www.knowhowcode.dev/articles/typescript-dto
excerpt: "A practical guide to creating Data Transfer Objects (DTOs) in TypeScript with simple, effective patterns"
readingTime: 5
published: true
---

I changed my mind after years of mentally not supporting TypeScript 😈  

When I first interacted with this wrapper 10-12 years ago, I felt that **true JavaScript** believers should use JavaScript and not pretend that JavaScript is not prototype-based. Instead, they play with interfaces 🤢 and classical inheritance 🤢 like they do not know what happens under the hood.  
I felt "M💲" had tried to convert JavaScript into C#, and it just happened that I tried to convert myself from the .NET stack to the NodeJS stack.  
  
But it's another story. Today, I can say **Microsoft did it pretty well**. Thanks.  
  
Thus, **I want to share with my type I use across projects** (I change it depending on needs).  
  
It helps me to convert a complex domain type into a payload type, a DTO I use in a communication layer for receiving commands or requests.  
  
```typescript
type ConvertToDto<Props> =
  Props extends Array<infer T>
    ? Array<ConvertToDto<T>>
    : {
        [Property in keyof Props]: Props[Property] extends Date
          ? string
          : Props[Property] extends boolean
            ? boolean
            : Props[Property] extends string
              ? string
              : Props[Property] extends number
                ? number
                : Props[Property] extends Array<infer R>
                  ? ConvertToDto<Array<R>>
                  : ConvertToDto<Props[Property]>
      }
```

And the usage:

```typescript
type TestBloodScheduleTime = {
  hour: Hour
  minutes: Minutes
  tz: TimeZoneOffset
}
type TestBloodScheduleTimeDto = ConvertToDto<TestBloodScheduleTime>

// The result is this 👇👇👇
type TestBloodScheduleTimeDtoResult = {
  hour: number
  minutes: number
  tz: number
}
```