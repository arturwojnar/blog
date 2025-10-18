---
cover: /articles/decomposition/cover.webp
author:
  name: Artur Wojnar
date: 2023-03-13T00:00:00.000Z
title: "Why make a decomposition of the monolith database?"
description: "Have you ever gotten stuck with your task because of a change introduced by another developer in a completely separate service?"
layout: ../layouts/article.njk
tags:
  - archetypes
  - software-architecture
  - design-principles
  - availability-archetype
  - domain-driven-design
canonical: https://www.knowhowcode.dev/articles/decomposition
excerpt: "Have you ever gotten stuck with your task because of a change introduced by another developer in a completely separate service? Learn about monolith database decomposition."
readingTime: 12
published: true
---

<img class="cover-image article-image" src="/articles/decomposition/cover.webp" alt="" loading="eager" fetchpriority="high" />

Figure 0. A typical emotion when you look at your database schema.

Introduction 1
--------------

Neal Ford is great. Erudite and intelligent speaker, receptive and perceptive. Highly experienced Software Architect, Solutions Architect, or whatever you’d like to call his range of responsibilities (these positions are overloaded in meaning, but that’s another topic!). With his books, he can hold your attention and make you feel that you are spending your precious time in a very satisfying way. And that’s a thing! Right? I bet, you can list many books that were OK, full of excellent insights but written in a way you had problems not falling asleep over the next page (yeah, I’m looking at the “biblical” _Blue Book_).Ford’s books are a different piece of writing. Let’s dive into the pages of this chapter, taking what’s best there and extending contained knowledge with my humble insights and experience.

Introduction 2
--------------

Have you ever gotten stuck with your task because of a change introduced by another developer in a completely separate service? How did that happen? Oh, of course! It’s because of our integration pattern based on the **database contract¹**. We extracted part of our application responsible for communication with pharmacy stores and gathering data about scanned and bought medicines, separating it from the patient-facing application. Thanks to this we could meet the requirements of the [_SLA_](https://en.wikipedia.org/wiki/Service-level_agreement) of our system again. By doing so, we migrated to the Service Oriented Architecture, meaning that we split up the monolith application into two services with a shared database. This was still the monolith application — Here I can reference Neal Ford’s book again and the idea of **architectural quantum²**. Well, this concept has been described in his two other books, including _The Hard Parts_. But going back to the topic — _architectural quantum_ says that if two services e.g. share the same database, they create one component, one deployable unit with high coupling, and we cannot treat them independently. This concept is wider — Ford mentions synchronous connascence; If two services share a resource or communicate with each other in a synchronous way, then they become _one quantum_.

Chapter 6 is about that — we start from having an _SOA_ application (coarse-grained services) and we want to try to break apart its database so we can get rid of their common static coupling (the shared database).

The original chapter title is _Pulling Aparat Operational Data._

Why split data?
---------------

Reasons why you should consider the effort of disintegrating data are drivers and non-functional requirements you can come up with after giving them some thought:

*   _Loose coupling_. Ford has split it into two separate disintegrators:- The number of services impacted by a database table change- Prevention of consolidating services into one architectural quantum
    
*   _Scalability_
    
*   _The performance_ described in the book as _connection management_
    
*   _Fault tolerance_ & _Security_
    
*   _Database type optimization_
    

Loose coupling
--------------

**We used to break** apart application functionalities into components, create abstractions for them, and use design patterns to model them in a more understandable and unified way. It **often follows** with treating databases only as bags for data — we add entries, some indexes or not, thinking that the database will deal with everything (in many cases that will be the truth, relational databases forgive a lot). We may add some _foreign keys_ between two columns because we can. But at some point, we may encounter popping up regression and increased size of estimations for changes planned for the application.

A team, trying to cut down on costs and working on the _MVP_, could agree, not to handle multiple databases, but it’s not the case anymore. It became a real problem, involving more and more of the client’s budget.Introducing a breaking change to the database like

*   changing the name of a column or property
    
*   removing a column or property
    
*   dropping a table or collection
    

may entail the necessity of refactoring other parts of the system depending on these data. Later, the team has to deploy several services and go through test protocols for these services. That results in increased estimations. On the other hand, if we forgot about one of the dependent services then we would face a regression.

<img class="article-image" src="/articles/decomposition/1.webp" alt="" loading="eager" fetchpriority="high" />
Figure 1. Services A, B, and C depend on one database.

A change in one of the services may impact or even force the change in other services.

Let’s imagine that _Service A_ is responsible for handling nurses, _Service B_ for patients, and _Service C_ for patients’ therapeutical indications and notes provided by nurses. Let’s also assume that this division is the best at the very moment and it’s the result of many analyses. It turns out that, despite having separate tables for nurses and patients, there’s also a table _Users_, because the two entities have a lot in common: e.g. _forename_, _surname_, _phone number_, _email address_, etc.

<img class="article-image" src="/articles/decomposition/2.webp" alt="" loading="eager" fetchpriority="high" />
Figure 2. Generalization results in one architectural quantum.

As a result, _team A_ and _team B_ or _C_ can affect each other while having separate domain models and seemingly the corresponding tables. That’s a bad thing because the desire was to make the teams much more independent and the communication between them should only occur on the API contract level. So, answering the author’s question — “_how many services are impacted by a database table change?_” — the answer is 2 and we can’t think of those services as independent.

Unfortunately, the services still consolidate into one _architectural quantum_ by sharing the same static coupling that is the shared database. That may be OK if the teams understand the consequences of it.Going further, if at some point the team decided to separate databases e.g. to ramp up fault tolerance, then the _Users_ table would have to be either merged with the _Nurses_ and _Patients_ tables or duplicated in the two separate databases.

Scalability and Performance
---------------------------

I decided to join the _Connection Management_ (_Performance_) and the _Scalability_ factors since one is a consequence of another, but the first one is less obvious and a way more precise.

For now, our project, as mentioned earlier, relies on an _SOA_ architecture with a shared database, which means we have N services that create connection pools to the very same database. One open connection can handle [one query at a time](https://www.postgresql.org/message-id/4A8B56E2.6050704@postnewspapers.com.au), so depending on the configuration the connection pool can consist of 5, 10, or 100 connections, depending on the expected load. That may not be a lot jointly, but each service can be run multiple times so that instances are capable of carrying increased traffic by (surprise, surprise!) scaling out. Those abrupt picks in load can quickly saturate database connections which will result in some clients waiting and waiting, seconds by seconds, minutes (?!) by minutes! And they say that 10 seconds is enough [to make our users feel impatient](https://www.nngroup.com/articles/response-times-3-important-limits/). I can say only for me, but I personally get annoyed faster.

Taking a simple example. If we deployed 20 services, each having 15 connections in the connection pool, and by average we always run at least 2 instances of every service, then by simple math we end up with _20 \* 15 \* 2 = 600_. Still, during Black Friday it’s not 2 on average but 5, which gives 1500!

The result is that we scaled out the services but it didn’t help because queries can get stuck along with system users lining up in a very long queue. Let’s remember also, that we are limited by the _max\_connections_ setting which varies on an OS, but by default is 100, which means that any new connection after reaching the maximum will [result in a failure](https://www.postgresql.org/docs/current/runtime-config-connection.html).

Fault tolerance & Security
--------------------------

We have N services smiling at us on the production cluster; Teams can work on separate service source codes and deploy them separately (unless you link them by your data — see [Loose coupling](https://medium.com/@arturwojnar.dev/why-make-a-decomposition-of-the-monolith-database-f91aea41af6c#d599)). It’s Sunday morning when, due to maintenance work scheduled by a vendor, your database crashes. It may be because of something — let’s say it’s a matter of deprecated configuration of one of the plugins you use, the plugin that is required only by exactly one of your services (_Service C_). Unfortunately, that scales onto the replica sets, too. As the result, your entire system is down. If we had data split up for _Service C_, kept separately in a dedicated database, the unlucky maintenance upgrade wouldn’t cause this big-scale damage, leading to the frustration of customers and your boss. Then, only one service would be acting up, not all, so only a subset of functionalities would be unreachable as depicted in _Figure 3_ (assuming that the responsibilities of the services are split wisely and the services don’t need each other all time to provide functionalities to end users).

<img class="article-image" src="/articles/decomposition/3.webp" alt="" loading="eager" fetchpriority="high" />
Figure 3. An outage in database C impacts only Service C.

Similarly, what can happen in the case of a shared database breakdown can also apply to security concerns which is one of the aspects I missed in the book.

If our database gets compromised, then **all data get compromised** off hand, including sensitive and private data of our patients and their medical records. What a mess! If our concern is security and this is one of the important non-functional requirements, then knowing which data are the most valuable, we may decide to move them to a separate database, although it’s not necessary from the domain perspective.Keeping those data separate also may not be sufficient, because our whole network could be hijacked. **The best way to mitigate this possibility is to keep your security-sensitive database in a separate** _**Virtual Private Cloud⁴**_; Then you are guaranteed that traffic is enclosed within each VPC and there’s no room for misconfigured firewalls (security groups, when talking in the context of AWS). You can add an explicit VPC Peering connection between two networks to keep traffic private.

<img class="article-image" src="/articles/decomposition/4.webp" alt="" loading="eager" fetchpriority="high" />
Figure 4. Two networks. Each is independent with separate addresses pool.

Database type optimization
--------------------------

The most popular database type is a relational database. It’s also the most generic one giving you the opportunity to model almost everything you can think of — of course with an appropriate level of complexity. Relational databases have been developed for over 50 years, which is plenty of time to optimize a product in a very sophisticated way. It implies that those databases “forgive” developers’ many mistakes.

Because relational databases have been with us for so long, it’s obvious that they have been studied and taught in schools and academies for decades, and students (me included!) have been analyzing which _normal form_ a database follows, what isolation level is desired, whether it’s possible to drive a database into a deadlock? What is _ACID_? And so on…

But the world and _IT_ made lots of steps forward, our community got clouds, and various SaaS products solving well-known problems like authentication, or video streaming; Requirements and needs had gotten more and more advanced, so eventually, we got on-demand support for full-text search, IoT, data warehouses, data lakes, AI platforms. There is a rule in the economy saying that the more complex the requirements become, the more complex software becomes and the more complex the software becomes, the more complex the requirements get. Some applications which used to take long months or years to develop, today may take a few days or weeks.

Among others, this is why we noticed something we can call an upsurge in the database market resulting in the creation of many problem-specific databases. I’m saying that we solve more and more specific problems and that’s why the NoSQL databases exist — to help us in solving particular problems. That’s true that maybe some of them get increasingly all-purpose, but it’s tough to beat relational databases’ performance.

These days we can choose from a variety of database products that belong to one or more types:

*   _Columnar databases_, like Apache Cassandra, HBase, Google BigTable, Azure ComosDB
    
*   _Wide-Column databases_, like ScyllaDB and most of the databases listed above
    
*   _Document databases_, like Atlas MongoDB, CouchDB, AWS DynamoDB, Azure CosmosDB
    
*   _Key-value databases_, like ScyllaDB, AWS DynamoDB, Azure ComosDB, Redis, Couchbase, Cassandra, RocksDB, TerracotaDB
    
*   Here we can also split this category into a subcategory of _in-memory key-value_ databases like Redis
    
*   _Time series databases_, like InfluxDB, TimescaleDB, MongoDB
    
*   _Graph databases_, like Neo4J, TypeDB, OrientDB
    
*   _State-transition databases_, like Event Store
    
*   _Full-text search databases_, like Elasticsearch, Amazon ElastiCache
    

You can read up on database internals in the great book [_Database Internals by Alex Petrov_](https://www.oreilly.com/library/view/database-internals/9781492040330/)³.

One caveat regarding my Ford’s book edition: It’s written that one of the document-based databases is _Amazon DocumentDB_. This database is objectively far behind its competitors, just look at the ratings on the “[DB-engines](https://db-engines.com/en/system/Amazon+DocumentDB)”, see that only three clients are mentioned in [AWS official documentation](https://aws.amazon.com/documentdb/), or read what [the official Atlas MongoDB opinion](https://www.mongodb.com/compare/documentdb-vs-mongodb) is. If you think about using the document-based database on AWS while you think the _DynamoDB_ is too much for you, then you can look at the official [Atlas MongoDB integration on AWS](https://aws.amazon.com/solutions/partners/mongodb-atlas/).

So, why exactly should we care about databases?

*   One point has already been mentioned and this is a particular use case optimization, e.g.:**\- Patients’ therapeutical indications** handled by Service C can be in fact a graph, where nodes are medicines, supplements, therapies, or specialized books, and edges (relationships) describe transitions and possible options. When a patient liked book A then we can easily traverse the graph by the book’s category and get the top 5 other similar positions; If one of the book’s categories is about building self-esteem then we can get therapy nodes that focus on this topic.You can get inspiration from other use cases from [Neo4J docs.](https://neo4j.com/use-cases/)Worth noticing is the fact that this type of database is not standalone but rather supporting and it should be a read model taken from another database.**\- You want to skip** bulky ORMs and simply store and index whole documents, but…**\- The main point** is that you can store whole Aggregates as a single document**\- Patients’ telemetry** can be stored in a time series database and processed and analyzed later
    
*   _Scalability_. _Reliability_. _Fault tolerance_.Lots of _buzzwords_, but the younger the age of the NoSQL database is also their leverage. They often have been constructed from scratch, sometimes based e.g. on MySQL database like it is with _Amazon DynamoDB_ or Meta’s database, but their architecture is also often distributed. You can scale out relational databases vertically, and you can have read replica sets, but if you want to have **sharding** (horizontal scaling), this is when the problems start; Fortunately, we can use totally distributed **cloud-native serverless databases** (with completely different philosophy) like AWS DynamoDB.Very short and high-level description of how this database work is: your table gets divided into partitions and DynamoDB “knows” how to get to a partition and its data by the special hash function (see Figure 4). Partitions also get replicated over multiple Availability Zones; In front of partitions are run scaled-out _Request Routers_ (APIs) that handle your requests and deal with “joins” in-flight. _DynamoDB_ defines several access patterns to retrieve and store data and it means there are many constraints on what you can do and it’s easy to get messy if you don’t know what you do or you don’t have a proper design. You can have only a few _Global Secondary Indexes_ which create a new _B-Tree_ structure being a different read model of your data.

<img class="article-image" src="/articles/decomposition/5.webp" alt="" loading="eager" fetchpriority="high" />
Figure 5. A high-level picture on scalability of DynamoDB.

*   As you see, it is a different approach with the sharding by default in which you have to first have well-defined boundaries and responsibilities within your domain design resulting in data ownership letting to have a reliable and performant data structure.Although _DynamoDB_ supports transactions providing _ACID_ guarantee, it’s not a natural thing for distributed systems and for sure it’s not a performant one; On the contrary to the _ACID_, the distributed systems define _BASE_ (you know, like in chemistry) that focuses mainly on the eventual consistency.If you’re interested you can dive into this topic on [this blog by Alex Debrie.](https://www.alexdebrie.com/posts/dynamodb-no-bad-queries/) Also, you can try one of Reinvent YouTube’s videos [like this one](https://www.youtube.com/watch?v=yvBR71D0nAQ).Remember, that cloud-native database will always be more scalable than on-premise databases.
    

Why keep data together?
-----------------------

It’s tempting to divide our services more and more and their data with it to be as micro as the biggest microservices purist’s dream in the world, but be careful! There is a line you should not cross. The bad news is the line is rather vague and there’s no mathematical equation to calculate the borders of your modules — only heuristics and discovering Aggregates boundaries. So, why keep data together? Ford calls the reasons the data integrators.

*   We need the atomicity of a business operation, one ACID transaction spanning crucial data. The saga pattern is not enough for us because of the [CAP theorem’s tradeoffs](https://www.scylladb.com/glossary/cap-theorem/).
    
*   Modules/Services are hungry, they need to talk to each other all the time to generate their own state and proceed with a change. It means that something went wrong on the design level, requirements could change and you need to redesign your system and modules/services responsibilities. Maybe the solution to problems would be merging some modules.
    

Not everyone has to strive to create maximally independent services meeting all of the ”-ity” non-functional requirements like reliability, scalability, or availability. With the shared database, our architecture is more straightforward. It also entails the fact that it is more cost-effective when we don’t have to worry about losing the ACID and transactionality over our tables.

Wrap-up
-------

That wasn’t a precise and exact summary of the sixth chapter of _Software Architecture: The Hard Parts by Neal Ford_⁵; I took parts that were the most valuable for me, I wrote what takeaways were contained on the book’s next pages, and whatever inspired me got a more detailed extension as I felt it needs more elaboration or small emendation (like with the AWS DocumentDB).

I haven’t written anything about techniques of data separation, or how to approach it. I believe that it’d require separate posts but based on a practical example — that is not the case in Neal’s book, unfortunately, it’s just a few theoretical paragraphs and your modest author also does not have experience in that.

If you haven’t heard about data ownership, you should probably get your head around it. It’s a change of customs, a change of mindset because it’s much simpler to link all the data together and access it with one transaction. If you can’t, and your only available option is data join in-memory, but you know it’s not something you should abuse, the day-to-day routine becomes more demanding. Because then the design-first matters, fine-grained planning matters, discussing tasks and stories with your teams matter, and **constantly evaluating and challenging your architecture matters** — architecture and design made once is not over, it’s just the beginning of evolution and discussion over them⁶.

---

\[1\]: Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions. Addison-Wesley. 2003.

\[2\]: Building Evolutionary Architectures: Support Constant Change. Neal Ford, Rebecca Parsons, Patrick Kua. O’Reilly Media. 2017

\[3\]: Database Internals. Alex Petrov. O’Reilly Media. 2019

\[4\]: AWS Security. Dylan Shields. Manning Publications 2022 (ISBN 978161729733). Page 104–109.

\[5\]: Software Architecture: The Hard Parts. Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani. O’Reilly Media. 2021 (ISBN: 9781492086895)

\[6\]: Continuous Architecture in Practice: Software Architecture in the Age of Agility and Devops. Murat Erder, Pierre Pureur. Addison-Wesley Professional. 2021