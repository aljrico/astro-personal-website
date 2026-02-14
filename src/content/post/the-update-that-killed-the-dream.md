---
title: "The Update That Killed the Dream"
publishDate: "14 February 2026"
description: "I shipped cloud sync to 100k users. It wiped their progress instead."
tags: ["gamedev", "devlog", "cookie-empire"]
---

I started [Cookie Empire](/apps/cookie-empire) as a fun excuse to learn SwiftUI. Nothing more ambitious than that. I was going through [100 days of SwiftUI](https://www.hackingwithswift.com/100/swiftui) and I started tinkering with my own designs for buttons and playing around with custom animations. Eventually, I started wondering "Could I make a game with this?" 

Cloning the famous Cookie Clicker seemed like a no-brainer and a fun exercise. The UI seems pretty simple, no fancy animations, and the design is very straightforward. Seemed like the best candidate for the iOS equivalent of "just start making Pong". As I was practicing, I started to get ideas on how I'd balance the game differently, what other fun minigames I'd add, how an original prestige system would look like, etc. I got carried away and decided to publish it to the App Store to get some user feedback. If I pull this off, I can make it good, make a homage that's original enough to stand on its own and - important - don't make it suck. I was determined not to make a cheap copy that felt like a cash grab. I can do better than that.

So the _grind_ started. I worked late into the night. Whole weekends just crunching spreadsheets with balancing designs or fixing weird SwiftUI glitches. Reading books about game design ([personal favourite](https://www.amazon.com/Designing-Games-Guide-Engineering-Experiences/dp/1449337937)). Answering Discord DMs addressing users' suggestions about the game. I never thought making a game was _so much work_. It's really a lot. From deciding on the exact curvature of the rounded rectangle that makes a button, the palette of colors the game will use, the exact velocity of a floating magic cookie, where should the prestige mechanic live, how powerful should it be, how that interacts with other upgrades, etc. 

I was releasing updates twice a week. Shipping a new feature, and then fixing the million bugs it created, then releasing another new thing and then putting out the fires it caused. That with a live game, with real players actually using it and finding the most obscure and hidden bug I never thought was possible. Honestly, I was having the time of my life. Players writing me to say they spent the whole afternoon with their kids and spouse playing _my game_ warmed my heart in a way I really can't describe. I started daydreaming of quitting my job and going full-time as an indie dev. 

This wasn't an overnight success. But it was a success. In two years, the game accumulated more than 100k downloads and it was getting closer to making me enough money to quit my job and go full time on it. Not making as much money as my dayjob, but enough not to starve. What started as an exercise to learn iOS development and a simple Cookie Clicker clone now rocked a stock market minigame, a farming minigame, a sacrifice-grandmas-to-demonic-entities minigame, and a whole dungeon crawler minigame about discovering the mysteries of an abandoned mine by sending grandmas expeditions. It forced me to learn _a ton_ of game design, server infrastructure (to handle leaderboards), analytics pipelines (to carry out AB tests), and a whole lot about optimising code for game development.

As many other devs, I had started like 20 side-projects daydreaming of becoming a solo entrepreneur, make enough money to quit and live off my silly little toys. And this game was _finally_ something that could fulfil this fantasy. It was real, not just snake oil the grifters on Twitter try to sell you on. The dream was real, and it was happening.

Until I fucked it up.

## August 2025

I was so proud of the latest release. Finally, after months of players begging for it, I managed to release the biggest QoL update since I started this game. From now on, players would be able to continue playing the game on all Apple devices and those would sync automatically. They'd be able to play on their iPhones while commuting or at work, and then at home close it and open their iPads or their laptop and continue there seamlessly. It was hard work, but it worked so well and I couldn't be prouder of myself, especially considering this system still allowed for players to play completely offline for most of the time (only picking up online time to sync devices).

Boy, was I wrong. The moment the release went up, I started to get bombarded on Discord by players complaining that their game was _wiped out_. I just fucked up. The syncing system had a race condition by which, when opening the game when connection was slow, the request for cloud data would return empty and local data would be overrun with an 'empty' game progress state. On the next 'saving' tick that would get pushed to the cloud and overwrite the real game progress.

So players were getting their local game progress wiped out, and that was overwriting the one stored in the cloud. So not only was progress gone, I had no way of checking what their progress was or recovering it for them.

All of this could have been prevented with more testing. I was so eager to keep releasing fancy new things that my testing was honestly kind of sloppy. I didn't test on multiple devices, never set up a beta program despite players begging for it, and had no code review process. In my mind, there wasn't time to be careful. I was maniacally churning out new things.

Naturally, the App Store rating got _destroyed_ by 1-star reviews. My Discord inbox exploded with players complaining. I frantically started giving away gems (hard currency) to pretty much anyone who would ask them. Revenue plummeted, retention numbers plummeted, new installs plummeted, any metric you can think of that's used to measure engagement just went to the floor. My game was no longer the #3 on App Store searches, it was the #13.  

The game was dead. And the dream of quitting my job and going full-time on it just evaporated. 

Some months later, some things have been recovered but most haven't. Numbers are somewhat stable but at a far lower level than what they peaked at. I definitely can't live off this. It has a very small niche of enthusiastic players that keep enjoying it. And it makes enough revenue to buy me a couple of fancy dinners a month. 

I still want to call it a success. It's a side-project that makes _some_ money, and brings joy to a decent amount of players. And I have learned _a lot_ from it. But it's also somewhat bittersweet. The "what if" thoughts sting me from time to time. And I keep working on it. I keep the _grind_ on. If only to make something I'm proud of.

[Cookie Empire is free on the App Store.](https://apps.apple.com/app/cookie-empire-idle-clicker/id6471402254)
