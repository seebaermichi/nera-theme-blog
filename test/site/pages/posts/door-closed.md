---
layout: pages/post.pug
lang: en
slug: door-closed
title: Writing with the door closed
description: First drafts are for one reader. A small routine that keeps mine away from everyone else.
lead: First drafts are for one reader. A small routine that keeps mine away from everyone else, including me.
date: 2026-11-18
updated: 2026-11-21
tags: [writing, tools]
---

For years I wrote in the same window I published from. Every sentence was one click away from an audience, and I wrote like someone being watched: careful, hedged and a little dull.

## The drafts folder

Now a draft starts as a text file in a folder that no program syncs, indexes or previews. It has a date for a name and no title. The only rule is that I may not reread it on the day I wrote it.

> The first draft is where you find out what you think. The second is where you decide whether anyone else should have to read it.

![A row of spruce trees under low fog](/images/fog.jpg "The view from the desk on most mornings between October and March.")

## Moving a draft out

When a draft survives a week, one command moves it to the blog and gives it its frontmatter:

```bash:terminal
mv drafts/2026-11-11.md pages/posts/door-closed.md
nera build --check
```

Most drafts never get that far, and that is what the folder is for.

## What changed

| | Before | After |
|---|---|---|
| Drafts started per month | 3 | 11 |
| Drafts published | 2 | 2 |
| Posts I regret | some | none so far |

The number that matters is the first one. I publish as little as before, but I now write most days, and the two posts that make it are better for the nine that did not.
