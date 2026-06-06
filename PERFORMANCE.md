# Performance Audit Report & Optimization Log

This document records the performance audit for the React HackerNews Aggregator. Below is the baseline report for the intentionally unoptimized application and a structured roadmap of optimizations.

## Baseline Performance Report Table

| Metric / Issue | Baseline Score / Observation | Root Cause Analysis | Proposed Solution Hypothesis |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | ~8.2s (Estimated on Mobile/Slow Desktop) | Large, unoptimized hero image (3.69MB) loaded via standard `<img>` tag without preloading, resizing, or compression, blocking page visual readiness. | Compress image to WebP, use responsive size attributes (`srcset`/`sizes`), and specify exact rendering dimensions. |
| **INP (Interaction to Next Paint)** | ~1800ms (High lag on filter keystrokes / sorting) | Direct DOM rendering of all 500+ articles simultaneously combined with expensive render-path calculations (timestamp conversion blocking CPU for 1.5ms per item). | Implement list virtualization (rendering only items visible in viewport) and memoize rendering logic / calculations. |
| **CLS (Cumulative Layout Shift)** | ~0.45 | Hero image loads without explicit height and width parameters, causing the text and layout below it to shift downwards when the image resolves. | Provide explicit width and height dimensions on the hero `<img>` tag to reserve layout space. |
| **Bundle Size** | ~266.65 kB (Gzipped: ~87.62 kB) | Import of full `lodash` library; no dynamic routing or component code splitting. | Refactor imports to use cherry-picked `lodash` functions (e.g. `lodash/sortBy`) and implement `React.lazy`/`Suspense` code splitting. |
| **Network Waterfall** | ~501 serial requests (Total loading time ~60s+) | Sequential HTTP requests in a synchronous `for` loop executing N+1 queries. | Parallelize HTTP requests using `Promise.all` with a controlled batching mechanism. |

---

## Optimization Roadmap and Logs

*Detailed metrics, implementation steps, and before/after comparisons will be documented here as each optimization step is successfully deployed.*
