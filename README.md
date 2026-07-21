# Shop Storefront

**MONO** — a minimal editorial product storefront, and a real, buildable app you
fork on [hanzo.app](https://hanzo.app) and deploy live on Hanzo Cloud. Monochrome
chic: big product imagery, one palette, three views.

- **UI** — [`@hanzo/gui`](https://www.npmjs.com/package/@hanzo/gui) (the Hanzo
  design system) under Vite + React 19. Product imagery is generated from the
  design system itself — a paper ground, one ink mark, and an editorial index —
  so an image-less catalogue still looks art-directed.
- **Auth** — [`@hanzo/iam`](https://www.npmjs.com/package/@hanzo/iam), OAuth2
  **PKCE** against [hanzo.id](https://hanzo.id). No local passwords — IAM owns
  every credential interaction.
- **Data** — [`@hanzo/base`](https://www.npmjs.com/package/@hanzo/base), the
  IAM-native, org-scoped data plane. Products and the cart are real Base
  collections.

## The shop

Three views over two collections:

- **Storefront grid** — the catalogue. A fresh org is empty and seeds the demo
  collection into Base with one press.
- **Product detail** — the studio image, an editorial spec, a stock-bounded
  quantity stepper, and add-to-cart.
- **Cart** — line items, an order summary, and a **checkout stub** that clears the
  cart. Wire it to Hanzo Commerce to take real orders.

Browse the catalogue signed-out; sign in to build a cart that persists per-org.

## Stack (pinned)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `^19.2.4` |
| `@hanzo/gui` + `@hanzogui/config` | `7.3.0` |
| `@hanzo/iam` | `^0.13.1` |
| `@hanzo/base` | `^0.2.1` |
| `vite` | `^6` (`@vitejs/plugin-react`) |
| `typescript` | `5.9.3` |

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build  ->  dist/
npm run preview    # serve the production build (SPA fallback on)
```

Out of the box it runs against **live** Hanzo (hanzo.id + api.hanzo.ai) — no
config needed to see the storefront and sign-in flow. Copy `.env.example` to
`.env` to point at a different environment.

## Environment contract

Only `VITE_`-prefixed vars reach the browser (this is a static SPA — there is no
server). Defaults in parentheses.

| Var | Purpose |
| --- | --- |
| `VITE_HANZO_IAM_URL` (`https://hanzo.id`) | OIDC issuer. |
| `VITE_HANZO_CLIENT_ID` (`hanzo-app`) | IAM application (`<org>-<app>`). Its redirect-URI list must allow this deploy's `/auth/callback` — see **Ambient IAM**. |
| `VITE_HANZO_REDIRECT_URI` (`${origin}/auth/callback`) | PKCE redirect. |
| `VITE_HANZO_BASE_URL` (`https://api.hanzo.ai`) | Browser-reachable Hanzo Base data plane. Deploy injects the provisioned URL. |

## How auth works — ambient IAM

`login()` starts an OAuth2 **PKCE S256** redirect to hanzo.id; hanzo.id returns
to `/auth/callback`, where `handleCallback()` exchanges the code for tokens
(stored in `localStorage`, refresh-aware via `offline_access`). Every deployed
app is a static site at `<slug>.hanzo.app`; there is **no server token** — the
SPA authenticates the user in the browser and carries the resulting IAM JWT to
Base. The one deploy requirement: the IAM client (`VITE_HANZO_CLIENT_ID`) must
list this origin's `/auth/callback` as an allowed redirect URI.

## How data works — Base from `schema.sql`

[`schema.sql`](./schema.sql) is the app's `databaseSchema` (SQL DDL): a
`products` collection and a `cart_items` collection. On publish, Hanzo Cloud
translates each `CREATE TABLE` into a Hanzo Base collection
(`provisionBaseFromDDL`, additive + idempotent). Base manages
`id`/`created`/`updated`/`owner`/`org`, stamps `owner`+`org` from the verified
IAM principal, and scopes every row to the caller's org
(`@request.auth.org_id = org`). At runtime the views read/write those
collections through `@hanzo/base/react` (`useQuery`/`useMutation`) carrying the
IAM token. Keep `schema.sql` in lockstep with [`src/lib/shop.ts`](./src/lib/shop.ts).

## Deploy — Hanzo Cloud

[`hanzo.yml`](./hanzo.yml) declares a static build (`npm run build` → `dist/`,
served at `<slug>.hanzo.app`) plus the Base schema to provision and the env to
inject. Do **not** build a container image locally — Hanzo Cloud owns builds and
deploys. CI here only proves the template compiles green.

## Layout

```
src/
  main.tsx            entry
  providers.tsx       GuiProvider -> IamProvider -> BaseProvider(client=IAM-token)
  app.tsx             route (/auth/callback) + auth gate
  env.ts              the VITE_ env contract, one place
  iam.config.ts       IAM PKCE config
  lib/
    base.ts           BaseClient carrying the IAM bearer token
    shop.ts           row types · demo catalogue · money/art/cart helpers
  auth/callback.tsx   PKCE return leg
  views/
    signed-out.tsx    public landing (hero + preview)
    home.tsx          signed-in shell (owns queries + routing)
    storefront.tsx    the product grid (+ seed empty state)
    product.tsx       product detail (stepper + add to cart)
    cart.tsx          cart + checkout stub
    product-card.tsx  product card + responsive grid
    product-image.tsx generated monochrome studio image
    brand.tsx         the MONO wordmark
    stepper.tsx       quantity control
schema.sql            databaseSchema -> Base collections on publish
hanzo.yml             Hanzo Cloud build/deploy manifest
```
