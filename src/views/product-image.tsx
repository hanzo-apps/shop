import { YStack, Circle, Square, Text, Image } from '@hanzo/gui'
import { ground, form, type Product, type Form } from '../lib/shop'

const INK = '#1b1b1e'

/** The single ink mark for a product — one bold form, a coherent series. */
function Mark({ kind, u }: { kind: Form; u: number }) {
  switch (kind) {
    case 'disc':
      return <Circle size={u * 0.52} backgroundColor={INK} />
    case 'ring':
      return <Circle size={u * 0.56} borderWidth={u * 0.075} borderColor={INK} backgroundColor="transparent" />
    case 'arch':
      return (
        <YStack
          width={u * 0.42}
          height={u * 0.62}
          backgroundColor={INK}
          borderTopLeftRadius={u * 0.21}
          borderTopRightRadius={u * 0.21}
        />
      )
    case 'pillar':
      return <YStack width={u * 0.26} height={u * 0.64} backgroundColor={INK} borderRadius={999} />
    case 'stack':
      return (
        <YStack width={u * 0.58} height={u * 0.58} position="relative">
          <Square size={u * 0.4} backgroundColor={INK} opacity={0.26} position="absolute" top={0} left={0} />
          <Square size={u * 0.4} backgroundColor={INK} position="absolute" bottom={0} right={0} />
        </YStack>
      )
    case 'split':
      return <Square size={u * 0.44} backgroundColor={INK} rotate="45deg" />
  }
}

/**
 * The product's studio image. A photo when `product.image` is a URL; otherwise
 * a deterministic monochrome composition — a paper ground, one ink mark on a
 * hairline shelf, and the editorial index — generated from the product name so
 * a fresh, image-less catalogue still looks art-directed. Shared by the grid,
 * the detail hero, the cart thumbnails, and the signed-out preview.
 */
export function ProductImage({ product, height, idx }: { product: Product; height: number; idx: number }) {
  const u = height
  return (
    <YStack
      width="100%"
      height={height}
      backgroundColor={ground(product.name)}
      position="relative"
      overflow="hidden"
      alignItems="center"
      justifyContent="flex-end"
    >
      {/* editorial index, top-left */}
      <Text
        position="absolute"
        top={u * 0.07}
        left={u * 0.09}
        fontSize={u * 0.14}
        fontWeight="700"
        letterSpacing={u * 0.006}
        color={INK}
        opacity={0.24}
      >
        {String(idx + 1).padStart(2, '0')}
      </Text>

      {/* the mark, sitting on a hairline shelf */}
      <YStack alignItems="center" justifyContent="flex-end" paddingBottom={u * 0.17} height="100%">
        <Mark kind={form(product.name)} u={u} />
      </YStack>
      <YStack position="absolute" left={u * 0.12} right={u * 0.12} bottom={u * 0.15} height={1} backgroundColor={INK} opacity={0.12} />

      {/* real photograph wins when present */}
      {product.image ? (
        <Image
          src={product.image}
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          objectFit="cover"
        />
      ) : null}
    </YStack>
  )
}
