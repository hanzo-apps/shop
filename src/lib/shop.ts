import type { BaseRecord } from '@hanzo/base/react'

/**
 * The shop domain, in ONE place: the Base row types, the curated demo
 * collection an owner can seed, and the small pure helpers the views share
 * (price formatting, the deterministic monochrome art picks, cart math).
 *
 * Keep the row shapes in lockstep with schema.sql.
 */

/** A row of the `products` collection. `image` is an optional photo URL; when
 * empty the monochrome studio art is generated deterministically from `name`. */
export interface Product extends BaseRecord {
  name: string
  price: number
  image: string
  desc: string
  stock: number
}

/** A row of the `cart_items` collection. `product` is a product row id. */
export interface CartItem extends BaseRecord {
  product: string
  qty: number
}

/** A cart line resolved against the products it points at. */
export interface Line {
  item: CartItem
  product: Product
}

/** Fields an owner seeds — everything Base stamps (id/owner/org/…) is omitted. */
export type Seed = Pick<Product, 'name' | 'price' | 'image' | 'desc' | 'stock'>

/**
 * The demo collection — a monochrome catalogue of considered objects. Loaded
 * into Base on demand (empty store → "Load the collection"), and shown as the
 * signed-out preview so the landing reflects the real product faithfully.
 */
export const CATALOG: Seed[] = [
  { name: 'Monolith Vase', price: 128, image: '', stock: 12, desc: 'A single unbroken curve thrown in matte stoneware. Fired once, unglazed, left the colour of the clay.' },
  { name: 'Eclipse Lamp', price: 245, image: '', stock: 6, desc: 'A disc of warm light balanced on a hairline stem. Dimmable by touch, nothing to read, nothing to press.' },
  { name: 'Halo Wall Clock', price: 96, image: '', stock: 20, desc: 'Time reduced to a ring and a single hand. Silent sweep movement, powder-coated steel.' },
  { name: 'Slab Lounge Chair', price: 890, image: '', stock: 3, desc: 'One fold of bent ply, nothing spare. Shaped in a single press, finished by hand at the edges.' },
  { name: 'Cusp Carafe', price: 74, image: '', stock: 18, desc: 'Hand-blown glass drawn to a paper-thin lip. Pours clean, reads as a line of water in the air.' },
  { name: 'Basalt Speaker', price: 320, image: '', stock: 8, desc: 'A monolith that happens to play sound. Full-range driver, cast composite body, one continuous face.' },
  { name: 'Fold Mirror', price: 410, image: '', stock: 5, desc: 'A leaning plane framed in blackened steel. Rests against the wall, tilts to the room, moves with you.' },
  { name: 'Ledger Tray', price: 58, image: '', stock: 26, desc: 'A shallow tray for the day’s small objects. Solid ash, chamfered rim, a place for keys and time.' },
  { name: 'Plume Throw', price: 140, image: '', stock: 14, desc: 'Undyed wool woven in a single tone. Heavy in the hand, soft over a shoulder, warmer than it looks.' },
]

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

/** Price as currency — whole amounts drop the cents (editorial, not a receipt). */
export function money(n: number): string {
  return Number.isInteger(n)
    ? usd.format(n).replace(/\.00$/, '')
    : usd.format(n)
}

/** Two-digit editorial index, e.g. 3 -> "03". */
export function index(i: number): string {
  return String(i + 1).padStart(2, '0')
}

/** Stable small hash of a string (djb2) so art is a property of the product,
 * not of its position in a list. */
function hash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

/** The paper/stone/ash grounds — neutral by design, one monochrome family. */
const GROUNDS = ['#efece6', '#e7e8ea', '#eae6df', '#e4e4e7', '#ece9e3', '#e6e9ea', '#eae7e1', '#e3e5e7', '#efece5']

/** The ink form vocabulary — one bold mark per object, a coherent series. */
export const FORMS = ['disc', 'ring', 'arch', 'pillar', 'stack', 'split'] as const
export type Form = (typeof FORMS)[number]

/** The studio ground colour for a product (stable per name). */
export function ground(name: string): string {
  return GROUNDS[hash(name) % GROUNDS.length]
}

/** The ink form for a product (stable per name). */
export function form(name: string): Form {
  return FORMS[hash(name + '·form') % FORMS.length]
}

/** The catalogue lifted to product rows for the signed-out preview (synthetic
 * ids — these never touch Base). */
export function preview(): Product[] {
  return CATALOG.map((s, i) => ({ ...s, id: `preview-${i}` }))
}

/** Cart subtotal across resolved lines. */
export function subtotal(lines: Line[]): number {
  return lines.reduce((sum, l) => sum + l.product.price * l.item.qty, 0)
}

/** Resolve cart rows against products, dropping any orphaned line. */
export function resolve(items: CartItem[], products: Product[]): Line[] {
  const byId = new Map(products.map((p) => [p.id, p]))
  const lines: Line[] = []
  for (const item of items) {
    const product = byId.get(item.product)
    if (product) lines.push({ item, product })
  }
  return lines
}
