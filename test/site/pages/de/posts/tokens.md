---
layout: pages/post.pug
lang: de
slug: tokens
title: Design-Tokens in einer Datei
description: Eine Farbe in config/theme.yaml ändern, und das ganze Theme folgt.
date: 2025-03-02
updated: 2025-04-10
author: Ada Example
tags: [css, nera]
image: /images/workbench.jpg
image_alt: Formen in Rost, Grau und Sand auf hellem Grund
---

## Eine Zeile pro Änderung

Das Theme liest jede Farbe, Schrift und Größe aus `config/theme.yaml`. So ändern Sie die Akzentfarbe:

```yaml
tokens:
    color:
        accent: '#006400'
```

## Kein Build-Schritt

Die Tokens werden zu CSS-Custom-Properties im `<head>` der Seite, es gibt nichts zu kompilieren.
