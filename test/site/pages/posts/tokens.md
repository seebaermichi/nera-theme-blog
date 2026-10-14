---
layout: pages/post.pug
lang: en
slug: tokens
title: Design tokens in one file
description: Change one colour in config/theme.yaml and the whole theme follows.
date: 2025-03-02
updated: 2025-04-10
author: Ada Example
tags: [css, nera]
image: /images/workbench.jpg
image_alt: Shapes in rust, grey and sand on a light background
---

## One line per change

The theme reads every colour, font and size from `config/theme.yaml`. To change the accent:

```yaml
tokens:
    color:
        accent: '#006400'
```

## No build step

The tokens become CSS custom properties in the page's `<head>`, so there is nothing to compile.
