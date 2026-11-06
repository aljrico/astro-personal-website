---
title: "What Happened With the Facebook Outage"
publishDate: "05 October 2021"
description: "In October 2021 Facebook erased itself from the internet, and then couldn't get back in. A plain-English explanation."
tags: ["tech", "internet", "meta"]
---

*Originally posted on [eToro](https://www.etoro.com/posts/5d52f180-25e8-11ec-8080-8000010855e0) on 5 October 2021, the day after the outage.*

A lot of people asked me to explain what happened with the Facebook outage. Here's the basic version.

## Removing your own address

Facebook, accidentally of course, pushed a change to its routing configuration (BGP, the system networks use to tell each other how to reach them) that withdrew the routes to its servers. In effect, Facebook told the internet: "we don't have any servers, there's no address for us." It's like removing your address from the postal service's records. You'd never receive anything again.

Normally that's easy to fix. You push another update with the correct routes, the system picks it up, and you're done. The post office knows where you live again and can deliver your mail.

## Locked out of everything

Pay attention, because this is where it gets much better. Facebook's case was more complicated for one simple reason: it runs literally everything on its own servers. And I mean everything. By disconnecting its servers from the internet, it crippled its own operations.

- It couldn't push the update that would fix the problem.
- It couldn't remotely access the machines that handle that update.
- Badge systems reportedly stopped working, making it hard to even get into the buildings and rooms where those machines live.
- Its internal tools and communication went down too, so even coordinating the fix was a struggle.

It's like locking your car keys in the trunk with no spare. And then pushing the car off a bridge into a river, and waiting for a specialist dive team to find it.

They were so screwed.

In the end, Facebook had to send engineers physically into its data centres to reset things by hand. Rumours spread online that they were breaking in with angle grinders. Whether or not that's true, it captures the mood.

Nothing like putting all your eggs in one basket, and then accidentally setting the basket on fire.

Hollywood couldn't have written a funnier story.
