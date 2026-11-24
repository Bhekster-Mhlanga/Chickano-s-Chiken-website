# Chickano’s Chicken website

Vite + vanilla JS, multi-page. Shared navbar, footer and cart live in `partials/` and are included with `{{> nav}}`, `{{> footer}}`, `{{> cart}}`.

## Run (Codespaces)
```bash
npm install
npm run dev      # port 5173
npm run build    # production build in dist/
```

## Where things live
- `src/data/branches.json`: branch names, WhatsApp numbers, phones, delivery fee (`null` = "confirmed by the branch"). The cart reads this.
- `src/data/reviews.json`: customer reviews (placeholders, replace with real ones).
- `src/data/categories.json`: the scrolling menu ticker.
- `src/js/cart.js`: sliding cart and WhatsApp order message. Other pages add items with `window.Cart.add({id, name, price, note})`.
- `public/images/`: hero photo (low resolution, replace with the original), background, logo.

## To do
- Footer branches and hours are static in `partials/footer.html`; keep in sync with `branches.json`.
- Remove the "Add a sample item (demo)" button in `cart.js` once the Menu page exists.
- Nav links still point at the live chickanos.co.za pages; change them as pages are rebuilt.
- Redirect the old `/our-story/` URL to `/#about` on the host.
