import { XStack, Text, Button } from '@hanzo/gui'

/** A compact quantity control — one horizontal rule around −/value/+, shared by
 * the product detail and each cart line. */
export function Stepper({
  qty,
  min = 0,
  max,
  disabled,
  onChange,
}: {
  qty: number
  min?: number
  max?: number
  disabled?: boolean
  onChange: (next: number) => void
}) {
  return (
    <XStack alignItems="center" borderWidth={1} borderColor="$borderColor" borderRadius="$3" overflow="hidden">
      <Button size="$3" chromeless disabled={disabled || qty <= min} onPress={() => onChange(qty - 1)}>
        –
      </Button>
      <Text minWidth={36} textAlign="center" fontSize={15} fontWeight="600" color="$color12">
        {qty}
      </Text>
      <Button size="$3" chromeless disabled={disabled || (max != null && qty >= max)} onPress={() => onChange(qty + 1)}>
        +
      </Button>
    </XStack>
  )
}
