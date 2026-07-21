-- Hanzo Base schema for Shop Storefront — the `databaseSchema` DDL.
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- id/created/updated/owner/org itself, so they are never re-declared here.
-- Every row is stamped with the verified IAM owner+org and is org-scoped: Base
-- applies the list/view/create/update/delete rule `@request.auth.org_id = org`,
-- so a member of your org reads/writes the row and other orgs cannot see it.
--
-- Keep this in lockstep with what the app reads/writes
-- (src/lib/shop.ts + src/views/storefront.tsx · product.tsx · cart.tsx).

-- Products — the shop's catalogue. `image` is an optional photo URL; when empty
-- the app renders deterministic monochrome studio art from the name.
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT    NOT NULL,
  price REAL    NOT NULL DEFAULT 0,     -- price in dollars
  image TEXT    NOT NULL DEFAULT '',    -- product photo URL (empty -> generated art)
  desc  TEXT    NOT NULL DEFAULT '',    -- editorial description
  stock INTEGER NOT NULL DEFAULT 0      -- units available
);

-- Cart — one row per product in the signed-in user's org cart. `product` holds
-- a products.id; `qty` is the count. Checkout clears these rows (a stub — wire
-- it to Hanzo Commerce to take real orders).
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT    NOT NULL DEFAULT '',  -- products.id
  qty     INTEGER NOT NULL DEFAULT 1
);
