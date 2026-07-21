import { useState } from 'react'
import { YStack, XStack, H1, Text, Paragraph, Button, Separator } from '@hanzo/gui'
import { ProductImage } from './product-image'
import { Stepper } from './stepper'
import { money, index, type Product as Row } from '../lib/shop'

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <XStack justifyContent="space-between" paddingVertical="$2" borderBottomWidth={1} borderColor="$borderColor">
      <Text fontSize={13} letterSpacing={1.5} color="$color11" opacity={0.55}>
        {label}
      </Text>
      <Text fontSize={13} fontWeight="600" color="$color12">
        {value}
      </Text>
    </XStack>
  )
}

/** Product detail — the studio image beside its editorial spec, a quantity
 * stepper bounded by stock, and add-to-cart (writes a `cart_items` row). */
export function Product({
  product,
  idx,
  inCart,
  adding,
  onBack,
  onAdd,
}: {
  product: Row
  idx: number
  inCart: number
  adding: boolean
  onBack: () => void
  onAdd: (qty: number) => void
}) {
  const [qty, setQty] = useState(1)
  const sold = product.stock <= 0
  const stockLabel = sold
    ? 'Sold out'
    : product.stock <= 3
      ? `Low stock — ${product.stock} left`
      : `In stock — ${product.stock} available`

  return (
    <YStack gap="$6">
      <Button size="$3" chromeless alignSelf="flex-start" onPress={onBack}>
        ← The collection
      </Button>

      <XStack gap="$8" flexWrap="wrap" alignItems="flex-start">
        <YStack flexGrow={1} flexBasis={440} minWidth={300} maxWidth={520}>
          <ProductImage product={product} idx={idx} height={460} />
        </YStack>

        <YStack flex={1} minWidth={300} maxWidth={440} gap="$5">
          <Text fontSize={12} fontWeight="700" letterSpacing={3} color="$color11" opacity={0.5}>
            OBJECT {index(idx)}
          </Text>
          <H1 fontSize={40} lineHeight={42} fontWeight="800" letterSpacing={-0.6} color="$color12">
            {product.name}
          </H1>
          <Text fontSize={24} fontWeight="600" color="$color12">
            {money(product.price)}
          </Text>
          <Paragraph fontSize={16} lineHeight={25} opacity={0.65} color="$color12">
            {product.desc}
          </Paragraph>

          <YStack>
            <Spec label="EDITION" value={`${index(idx)} / 09`} />
            <Spec label="FINISH" value="Matte, unfinished" />
            <Spec label="LEAD TIME" value="Ships in 10 days" />
          </YStack>

          <Text fontSize={13} fontWeight="600" color={sold ? '$red10' : '$color11'} opacity={sold ? 1 : 0.8}>
            {stockLabel}
          </Text>

          <Separator />

          <XStack gap="$3" alignItems="center" flexWrap="wrap">
            <Stepper qty={qty} min={1} max={product.stock} disabled={sold} onChange={setQty} />
            <Button size="$5" theme="active" disabled={sold || adding} onPress={() => onAdd(qty)}>
              {sold ? 'Sold out' : adding ? 'Adding…' : 'Add to cart'}
            </Button>
          </XStack>
          {inCart > 0 ? (
            <Text fontSize={13} opacity={0.55} color="$color12">
              {inCart} already in your cart.
            </Text>
          ) : null}
        </YStack>
      </XStack>
    </YStack>
  )
}
