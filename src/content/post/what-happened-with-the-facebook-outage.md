---
title: "What Happened With the Facebook Outage"
publishDate: "05 October 2021"
description: "In October 2021 Facebook erased itself from the internet, and then couldn't get back in. A plain-English explanation."
tags: ["tech", "internet", "meta"]
---

*Originally posted on [eToro](https://www.etoro.com/posts/5d52f180-25e8-11ec-8080-8000010855e0) on 5 October 2021, the day after the outage. I've corrected the explanation using [Facebook's own write-up](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/), published a day later.*

A lot of people asked me to explain what happened with the Facebook outage. Facebook, Instagram and WhatsApp went dark for about six hours. Here's the basic version.

## Cutting the roads

Facebook runs a private network, its backbone, that connects all of its data centres to each other and to the rest of the internet.

During routine maintenance, an engineer ran a command meant to check how much capacity that backbone had. Instead, it took the whole backbone down. Facebook had a tool to catch dangerous commands like that one. The tool had a bug, so it let it through.

In an instant, every Facebook data centre was cut off.

## Erasing the address

Then a safety feature made it worse.

When you type facebook.com, your computer asks DNS, the internet's address book, where Facebook lives. Facebook runs its own DNS servers. And those servers were designed to stay quiet if they couldn't reach the data centres. That's sensible: if I can't reach the data centres, I'm probably broken, so stop sending people to me.

With the backbone gone, every one of them decided it was broken. They all stopped announcing themselves to the internet (through a system called BGP, which is how networks tell each other where to find them). The address book was still there. But nobody could find it.

It's like the post office losing every road to your house, and your house then taking its own name off the map.

## Locked out of everything

This is where it gets much better. Facebook runs almost everything on that same network. So the outage didn't only take down the apps. It took down the tools Facebook would use to fix them.

- Engineers couldn't reach the machines remotely.
- Internal tools and communication went down too, so even coordinating the fix was a struggle.
- Badge systems reportedly stopped working, making it hard to even get into the rooms where the machines live.

It's like locking your car keys in the trunk with no spare. And then pushing the car off a bridge into a river, and waiting for a dive team to find it.

In the end, Facebook had to send engineers physically into its data centres to bring the network back by hand. Rumours spread online that they were breaking in with angle grinders. Whether or not that's true, it captures the mood.

## What I took from it

Nothing here was stupid on its own. Running maintenance is normal. Auditing commands is smart. DNS servers that switch themselves off when they're unhealthy are good design.

The problem was that everything depended on the same thing. The apps, the address book, the repair tools and the door badges all needed the backbone. When it went, they all went together.

It's easy to put all your eggs in one basket without noticing, because each egg went in for a good reason.
