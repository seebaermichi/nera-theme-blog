---
layout: pages/post.pug
lang: de
slug: first-build
title: Ihr erster Build
description: Vom leeren Ordner zum fertigen Blog in drei Befehlen.
date: 2026-09-21
author: Ben Example
tags: [nera, anleitung]
---

## Drei Befehle

Website anlegen, Theme installieren, bauen:

```bash
npx @nera-static/nera new my-blog
npm install @nera-static/theme-blog
npx nera build
```

## Was dabei herauskommt

Ein Ordner `public/` mit schlichtem HTML und einem Stylesheet, bereit für jeden statischen Host.
