import { YStack, XStack, H2, Text, Paragraph, Button, Separator, Circle } from '@hanzo/gui'
import { ProductImage } from './product-image'
import { Stepper } from './stepper'
import { money, subtotal, type Line } from '../lib/shop'

/** A single cart line — thumbnail, name, unit price, a stepper, line total,
 * and remove. */
function Row({
  line,
  idx,
  onQty,
  onRemove,
  busy,
}: {
  line: Line
  idx: number
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  busy: boolean
}) {
  const { item, product } = line
  return (
    <XStack gap="$4" alignItems="center" paddingVertical="$4" borderBottomWidth={1} borderColor="$borderColor">
      <YStack width={76} borderRadius="$3" overflow="hidden">
        <ProductImage product={product} idx={idx} height={76} />
      </YStack>
      <YStack flex={1} minWidth={140} gap={3}>
        <Text fontSize={15} fontWeight="600" color="$color12" numberOfLines={1}>
          {product.name}
        </Text>
        <Text fontSize={13} opacity={0.5} color="$color12">
          {money(product.price)} each
        </Text>
      </YStack>
      <Stepper qty={item.qty} min={1} max={product.stock} disabled={busy} onChange={(n) => onQty(item.id, n)} />
      <Text width={90} textAlign="right" fontSize={15} fontWeight="600" color="$color12">
        {money(product.price * item.qty)}
      </Text>
      <Button size="$2" chromeless disabled={busy} onPress={() => onRemove(item.id)}>
        Remove
      </Button>
    </XStack>
  )
}

/** The cart — lines, an order summary, and a checkout stub. `placed` swaps in a
 * confirmation (no payment is taken; this is a template). */
export function Cart({
  lines,
  placed,
  busy,
  onQty,
  onRemove,
  onCheckout,
  onContinue,
}: {
  lines: Line[]
  placed: boolean
  busy: boolean
  onQty: (id: string, qty: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  onContinue: () => void
}) {
  if (placed) {
    return (
      <YStack alignItems="center" justifyContent="center" gap="$5" paddingVertical="$10" maxWidth={460} alignSelf="center">
        <Circle size={64} borderWidth={2} borderColor="$color12">
          <Text fontSize={28} color="$color12">
            ✓
          </Text>
        </Circle>
        <H2 fontSize={28} fontWeight="800" letterSpacing={-0.5} textAlign="center" color="$color12">
          Order placed.
        </H2>
        <Paragraph fontSize={16} lineHeight={24} textAlign="center" opacity={0.6} color="$color12">
          This is a checkout stub — no payment was taken and your cart has been
          cleared. Wire it to Hanzo Commerce to take real orders.
        </Paragraph>
        <Button size="$5" theme="active" onPress={onContinue}>
          Continue shopping
        </Button>
      </YStack>
    )
  }

  if (lines.length === 0) {
    return (
      <YStack alignItems="center" justifyContent="center" gap="$5" paddingVertical="$10" maxWidth={460} alignSelf="center">
        <Text fontSize={12} fontWeight="700" letterSpacing={3} color="$color11" opacity={0.5}>
          EMPTY
        </Text>
        <H2 fontSize={28} fontWeight="800" letterSpacing={-0.5} textAlign="center" color="$color12">
          Your cart is empty.
        </H2>
        <Button size="$5" theme="active" onPress={onContinue}>
          Browse the collection
        </Button>
      </YStack>
    )
  }

  const sub = subtotal(lines)
  return (
    <YStack gap="$5" maxWidth={760} width="100%" alignSelf="center">
      <Text fontSize={12} fontWeight="700" letterSpacing={3} color="$color11" opacity={0.5}>
        YOUR CART
      </Text>
      <Separator />

      <YStack>
        {lines.map((l, i) => (
          <Row key={l.item.id} line={l} idx={i} onQty={onQty} onRemove={onRemove} busy={busy} />
        ))}
      </YStack>

      <YStack gap="$3" alignSelf="flex-end" width="100%" maxWidth={320}>
        <XStack justifyContent="space-between">
          <Text fontSize={14} opacity={0.6} color="$color12">
            Subtotal
          </Text>
          <Text fontSize={14} fontWeight="600" color="$color12">
            {money(sub)}
          </Text>
        </XStack>
        <XStack justifyContent="space-between">
          <Text fontSize={14} opacity={0.6} color="$color12">
            Shipping
          </Text>
          <Text fontSize={14} opacity={0.6} color="$color12">
            Calculated at checkout
          </Text>
        </XStack>
        <Separator />
        <XStack justifyContent="space-between" alignItems="baseline">
          <Text fontSize={16} fontWeight="700" color="$color12">
            Total
          </Text>
          <Text fontSize={20} fontWeight="700" color="$color12">
            {money(sub)}
          </Text>
        </XStack>
        <Button size="$5" theme="active" disabled={busy} onPress={onCheckout}>
          {busy ? 'Placing…' : 'Checkout'}
        </Button>
      </YStack>
    </YStack>
  )
}
