import { XStack, YStack, Text, Square } from '@hanzo/gui'

/**
 * The MONO wordmark — a single ink object beside the name. Monochrome, tightly
 * tracked; the whole store is one typographic idea. `tone` flips the mark/type
 * for the light preview vs. the dark shell.
 */
export function Wordmark({ size = 20, sub = true }: { size?: number; sub?: boolean }) {
  return (
    <XStack alignItems="center" gap={size * 0.55}>
      <Square size={size * 0.62} backgroundColor="$color12" borderRadius={size * 0.1} />
      <YStack>
        <Text fontSize={size} fontWeight="800" letterSpacing={size * 0.22} color="$color12">
          MONO
        </Text>
        {sub ? (
          <Text fontSize={size * 0.4} fontWeight="600" letterSpacing={size * 0.14} color="$color11" opacity={0.6}>
            OBJECTS, EDITIONED
          </Text>
        ) : null}
      </YStack>
    </XStack>
  )
}
