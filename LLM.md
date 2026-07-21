# shop-storefront — agent notes

A minimal editorial product storefront on the canonical Hanzo stack — the
`hanzo-starter` provider spine (Vite + React 19 + `@hanzo/gui` + `@hanzo/iam` +
`@hanzo/base`) applied to a real shop. Keep it minimal and REAL — every surface
must build and run, no fabricated UI.

## The app

MONO — a monochrome shop of design objects. Three views over two Base
collections:

- **Storefront grid** (`src/views/storefront.tsx`) — the catalogue; a fresh org
  is empty and can seed the demo collection into Base.
- **Product detail** (`src/views/product.tsx`) — studio image, editorial spec, a
  stock-bounded quantity stepper, add-to-cart.
- **Cart** (`src/views/cart.tsx`) — lines, order summary, and a checkout stub
  that clears the cart (wire it to Hanzo Commerce for real orders).

`src/views/home.tsx` is the signed-in shell: it owns the `products` + `cart_items`
queries and the mutations, and routes shop → product → cart. `src/views/signed-out.tsx`
is the public landing (hero + faithful preview of the same cards).

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam is what makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **Domain is one place** (`src/lib/shop.ts`) — row types, the demo catalogue,
  price/index formatting, the deterministic monochrome art picks, and cart math.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`.
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind). Product imagery is generated (`src/views/product-image.tsx`): a paper
  ground + one ink mark + the editorial index, derived from the product name, so
  an image-less catalogue still looks art-directed. A real `products.image` URL
  wins when present.

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line; the in-browser builder runtime can't do this, which is the whole
  reason this ships as a real repo): (1) alias `react-native` →
  `react-native-web`, (2) `define` `process.env.TAMAGUI_TARGET` / `NODE_ENV` /
  `__DEV__`, (3) `dedupe` react/react-dom/react-native-web. No Tamagui compiler,
  no `one`, no Expo — the optimizer is a perf pass, not a correctness one.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`alignSelf`/
  `borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/`self`/
  `rounded`/`text` shorthands. Shorthands pass at runtime but FAIL `tsc`.
  `Button` uses `onPress`; `Input` uses `value`/`onChangeText`; `Image` uses `src`.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections (`provisionBaseFromDDL`). Keep it in
  lockstep with `src/lib/shop.ts` and the three views.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage (the `*.hanzo.app` published-sites edge). No server process.
- Identity is ambient IAM (hanzo.id PKCE); `VITE_HANZO_CLIENT_ID`'s IAM client
  must allow this origin's `/auth/callback`. Data is org-scoped Hanzo Base.
