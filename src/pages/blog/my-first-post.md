---
title: "My First Post"
pubDate: 2026-02-20
description: "Example blog post showing React code highlighting"
tags: ["abc", "ncd"]
layout: ../../layouts/BlogLayout.astro
---

This is an example post written in Markdown. Below is a React snippet; Highlight.js will style it on the client.

```jsx
import React from "react";

export default function Hello() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  );
}
```

You can also include plain text code blocks.

```text
This is a plain text block.
Line two.
```
