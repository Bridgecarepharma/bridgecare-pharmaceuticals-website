# Product image fix deployment

Deploy normally through GitHub and Netlify. After the successful deployment, use **Deploy project without cache** once if Netlify continues serving an older optimized image.

Then hard-refresh the browser with `Ctrl + Shift + R`, or test in an incognito window.

Expected mapping:
- `/products/aspivit` → `/images/products/aspivit.png`
- `/products/asfenositol` → `/images/products/asfenositol.png`
- `/products/globivida` → `/images/products/globivida.png`
- `/products/herbal-bitter-tea` → `/images/products/herbal-bitter-tea.png`
