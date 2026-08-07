# Bridgecare data/products.ts merge-conflict recovery

This patch contains only a clean `data/products.ts` with all Git merge markers removed.
It preserves the complete product objects from the stable source version used before the flyer merge conflict.

Apply by copying the `data` folder into the repository root and replacing `data/products.ts`.
Then commit and push.

Recommended verification:

```bash
git grep -nE "^(<<<<<<<|=======|>>>>>>>)"
npm run build
```
