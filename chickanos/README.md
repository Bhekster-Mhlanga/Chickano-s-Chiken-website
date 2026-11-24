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

## Menu page
- `src/data/menu.json` drives `menu.html`. Each item can have `options` (groups of choices with a price `delta`; a choice marked `"none"` is left out of the WhatsApp note). Add `"image": "/images/menu/name.jpg"` to an item to show a photo.
- Needs confirming with the owners: descriptions for every item, what the daily promos and Party packs include, the six R19.90 flavour items (Banana, Bubblegum, Chocolate, Custard, Lime, Strawberry) that were left out, and whether Spicy Rice Jumbo should be R29.90 (site says R29.99).

## Find a Chickano page
- Built entirely from `src/data/branches.json` (address, phones, map query, directions link). Edit a branch there and the page updates.
- "Open now" uses regular hours (Mon to Sat 8am to 8pm, Sun 9am to 8pm, South Africa time). It cannot know public holidays.
- "Order from here" saves the branch for the cart and opens the Menu.
- Needs confirming: Acornhoek and Steelpoort landlines (none on the old site), and a precise Steelpoort map pin.
