import { useMemo, useState } from 'react'
import { useIam } from '@hanzo/iam/react'
import { useQuery, useMutation } from '@hanzo/base/react'
import { YStack, XStack, Text, Button, Paragraph, Spinner } from '@hanzo/gui'
import { Wordmark } from './brand'
import { Storefront } from './storefront'
import { Product } from './product'
import { Cart } from './cart'
import { CATALOG, resolve, type Product as Row, type CartItem } from '../lib/shop'

type View = { name: 'shop' } | { name: 'product'; id: string } | { name: 'cart' }

/**
 * Signed-in shell — owns the two Base collections (`products`, `cart_items`),
 * the mutations that write them, and the shop/product/cart routing. Every read
 * and write carries the signed-in user's IAM token (wired in providers.tsx), so
 * the whole shop is scoped to their org.
 */
export function Home() {
  const { user, logout } = useIam()
  const who = user?.displayName || user?.name || user?.email || 'you'

  const productsQ = useQuery<Row>('products', { sort: 'created', realtime: false })
  const cartQ = useQuery<CartItem>('cart_items', { sort: 'created', realtime: false })

  const createProduct = useMutation('products', 'create')
  const createItem = useMutation('cart_items', 'create')
  const updateItem = useMutation('cart_items', 'update')
  const deleteItem = useMutation('cart_items', 'delete')

  const [view, setView] = useState<View>({ name: 'shop' })
  const [seeding, setSeeding] = useState(false)
  const [adding, setAdding] = useState(false)
  const [busy, setBusy] = useState(false)
  const [placed, setPlaced] = useState(false)

  const products = productsQ.data
  const items = cartQ.data
  const lines = useMemo(() => resolve(items, products), [items, products])
  const cartCount = items.reduce((n, i) => n + i.qty, 0)

  async function seed() {
    setSeeding(true)
    try {
      for (const p of CATALOG) await createProduct.mutate(p)
      await productsQ.refetch()
    } finally {
      setSeeding(false)
    }
  }

  async function addToCart(productId: string, qty: number) {
    setAdding(true)
    try {
      const existing = items.find((i) => i.product === productId)
      if (existing) await updateItem.mutate({ id: existing.id, qty: existing.qty + qty })
      else await createItem.mutate({ product: productId, qty })
      await cartQ.refetch()
    } finally {
      setAdding(false)
    }
  }

  async function setQty(id: string, qty: number) {
    setBusy(true)
    try {
      if (qty <= 0) await deleteItem.mutate({ id })
      else await updateItem.mutate({ id, qty })
      await cartQ.refetch()
    } finally {
      setBusy(false)
    }
  }

  async function removeItem(id: string) {
    setBusy(true)
    try {
      await deleteItem.mutate({ id })
      await cartQ.refetch()
    } finally {
      setBusy(false)
    }
  }

  async function checkout() {
    setBusy(true)
    try {
      for (const i of items) await deleteItem.mutate({ id: i.id })
      await cartQ.refetch()
      setPlaced(true)
    } finally {
      setBusy(false)
    }
  }

  const loading = productsQ.isLoading || cartQ.isLoading
  const error = productsQ.error || cartQ.error
  const openProduct = view.name === 'product' ? products.find((p) => p.id === view.id) ?? null : null
  const openIdx = openProduct ? products.findIndex((p) => p.id === openProduct.id) : 0
  const inCart = openProduct ? items.find((i) => i.product === openProduct.id)?.qty ?? 0 : 0

  const goShop = () => {
    setPlaced(false)
    setView({ name: 'shop' })
  }
  const goCart = () => setView({ name: 'cart' })

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor="$background">
      <XStack
        alignItems="center"
        justifyContent="space-between"
        gap="$4"
        flexWrap="wrap"
        paddingHorizontal="$6"
        paddingVertical="$4"
        borderBottomWidth={1}
        borderColor="$borderColor"
      >
        <YStack cursor="pointer" onPress={goShop}>
          <Wordmark size={20} />
        </YStack>
        <XStack alignItems="center" gap="$2">
          <Button size="$3" chromeless onPress={goShop}>
            Shop
          </Button>
          <Button
            size="$3"
            chromeless={view.name !== 'cart'}
            theme={view.name === 'cart' ? 'active' : undefined}
            onPress={goCart}
          >
            {cartCount > 0 ? `Cart · ${cartCount}` : 'Cart'}
          </Button>
          <Button size="$3" chromeless onPress={() => logout()}>
            Sign out
          </Button>
        </XStack>
      </XStack>

      <YStack maxWidth={1000} width="100%" alignSelf="center" paddingHorizontal="$6" paddingVertical="$7" gap="$4">
        <Paragraph fontSize={13} opacity={0.5} color="$color12">
          Signed in as {who}
        </Paragraph>

        {loading ? (
          <XStack gap="$2" alignItems="center" justifyContent="center" paddingVertical="$10" opacity={0.6}>
            <Spinner /> <Text color="$color12">Loading the shop…</Text>
          </XStack>
        ) : error ? (
          <Paragraph color="$red10">
            Couldn’t reach Base ({error.message}). Confirm VITE_HANZO_BASE_URL and that you’re
            signed in.
          </Paragraph>
        ) : view.name === 'cart' ? (
          <Cart
            lines={lines}
            placed={placed}
            busy={busy}
            onQty={setQty}
            onRemove={removeItem}
            onCheckout={checkout}
            onContinue={goShop}
          />
        ) : openProduct ? (
          <Product
            product={openProduct}
            idx={openIdx}
            inCart={inCart}
            adding={adding}
            onBack={goShop}
            onAdd={(q) => addToCart(openProduct.id, q)}
          />
        ) : (
          <Storefront
            products={products}
            onOpen={(id) => setView({ name: 'product', id })}
            onSeed={seed}
            seeding={seeding}
          />
        )}
      </YStack>
    </YStack>
  )
}
