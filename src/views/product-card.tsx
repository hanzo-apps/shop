import { YStack, XStack, Text } from '@hanzo/gui'
import { ProductImage } from './product-image'
import { money, type Product } from '../lib/shop'

export const CARD_W = 300

/** A responsive editorial grid of product cards — three-up at full width,
 * wrapping down. `onOpen` makes the cards pressable (omitted in the preview). */
export function ProductGrid({
  products,
  onOpen,
}: {
  products: Product[]
  onOpen?: (id: string) => void
}) {
  return (
    <XStack flexWrap="wrap" gap="$7" justifyContent="flex-start" maxWidth={CARD_W * 3 + 120}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} idx={i} onOpen={onOpen} />
      ))}
    </XStack>
  )
}

/**
 * One product in the grid — the studio image over an editorial caption
 * (name · one-line note · price). Pressable when `onOpen` is given; a static
 * plate in the signed-out preview otherwise.
 */
export function ProductCard({
  product,
  idx,
  onOpen,
}: {
  product: Product
  idx: number
  onOpen?: (id: string) => void
}) {
  const press = onOpen ? { cursor: 'pointer' as const, onPress: () => onOpen(product.id), hoverStyle: { opacity: 0.9 } } : {}
  return (
    <YStack width={CARD_W} gap="$3" {...press}>
      <ProductImage product={product} idx={idx} height={CARD_W} />
      <XStack justifyContent="space-between" alignItems="flex-start" gap="$3">
        <YStack flex={1} gap={3}>
          <Text fontSize={15} fontWeight="600" letterSpacing={0.2} color="$color12" numberOfLines={1}>
            {product.name}
          </Text>
          <Text fontSize={12} color="$color11" opacity={0.55} numberOfLines={1}>
            {product.desc.split('.')[0]}
          </Text>
        </YStack>
        <Text fontSize={14} fontWeight="600" color="$color12">
          {money(product.price)}
        </Text>
      </XStack>
    </YStack>
  )
}
