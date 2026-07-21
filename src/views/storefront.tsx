import { YStack, XStack, H2, Text, Paragraph, Button, Separator } from '@hanzo/gui'
import { ProductGrid } from './product-card'
import type { Product } from '../lib/shop'

/**
 * The shop — a fresh org's `products` collection is empty, so it offers to seed
 * the MONO catalogue into Base; once stocked it renders the editorial grid.
 */
export function Storefront({
  products,
  onOpen,
  onSeed,
  seeding,
}: {
  products: Product[]
  onOpen: (id: string) => void
  onSeed: () => void
  seeding: boolean
}) {
  if (products.length === 0) {
    return (
      <YStack alignItems="center" justifyContent="center" gap="$5" paddingVertical="$10" maxWidth={460} alignSelf="center">
        <Text fontSize={12} fontWeight="700" letterSpacing={3} color="$color11" opacity={0.5}>
          NO STOCK YET
        </Text>
        <H2 fontSize={30} fontWeight="800" letterSpacing={-0.5} textAlign="center" color="$color12">
          Your shop is empty.
        </H2>
        <Paragraph fontSize={16} lineHeight={24} textAlign="center" opacity={0.6} color="$color12">
          Load the MONO collection — nine objects written into your org’s Base as real
          product rows you can open, price, and sell.
        </Paragraph>
        <Button size="$5" theme="active" disabled={seeding} onPress={onSeed}>
          {seeding ? 'Stocking…' : 'Load the collection'}
        </Button>
      </YStack>
    )
  }

  return (
    <YStack gap="$5">
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={12} fontWeight="700" letterSpacing={3} color="$color11" opacity={0.5}>
          THE COLLECTION
        </Text>
        <Text fontSize={12} fontWeight="700" letterSpacing={2} color="$color11" opacity={0.5}>
          {products.length} {products.length === 1 ? 'OBJECT' : 'OBJECTS'}
        </Text>
      </XStack>
      <Separator />
      <YStack paddingTop="$4">
        <ProductGrid products={products} onOpen={onOpen} />
      </YStack>
    </YStack>
  )
}
