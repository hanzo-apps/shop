import { useIam } from '@hanzo/iam/react'
import { YStack, XStack, H1, Paragraph, Text, Button, Separator } from '@hanzo/gui'
import { Wordmark } from './brand'
import { ProductImage } from './product-image'
import { ProductGrid } from './product-card'
import { preview, money } from '../lib/shop'

const MAXW = 1080

/** A tracked label — the editorial connective tissue of the store. */
function Eyebrow({ children }: { children: string }) {
  return (
    <Text fontSize={12} fontWeight="700" letterSpacing={3} color="$color11" opacity={0.5}>
      {children}
    </Text>
  )
}

/**
 * Signed-out landing — the honest public storefront. The catalogue is shown
 * faithfully (the same cards the signed-in grid uses); the one gated action is
 * building a cart, so the single CTA is PKCE sign-in with Hanzo. No local
 * credential form — Hanzo IAM owns every credential interaction.
 */
export function SignedOut() {
  const { login, isLoading } = useIam()
  const products = preview()
  const hero = products[0]
  const enter = () => login()

  return (
    <YStack flex={1} minHeight="100vh" backgroundColor="$background">
      {/* Top bar */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$6"
        paddingVertical="$4"
        borderBottomWidth={1}
        borderColor="$borderColor"
      >
        <Wordmark size={20} />
        <Button size="$3" chromeless disabled={isLoading} onPress={enter}>
          Sign in
        </Button>
      </XStack>

      <YStack maxWidth={MAXW} width="100%" alignSelf="center" paddingHorizontal="$6">
        {/* Hero — statement left, a big product plate right */}
        <XStack gap="$8" paddingTop="$7" paddingBottom="$8" flexWrap="wrap" alignItems="center">
          <YStack flex={1} minWidth={340} maxWidth={520} gap="$5">
            <Eyebrow>EDITION 01 — LIGHT, FURNITURE &amp; OBJECTS</Eyebrow>
            <H1 fontSize={46} lineHeight={48} fontWeight="800" letterSpacing={-1.2} color="$color12">
              Considered objects, in black and white.
            </H1>
            <Paragraph fontSize={16} lineHeight={25} opacity={0.62} maxWidth={460} color="$color12">
              MONO is a small shop of design objects reduced to their essential form —
              nine pieces, one palette. Browse the collection; sign in to build a cart
              and check out.
            </Paragraph>
            <XStack gap="$4" alignItems="center" flexWrap="wrap">
              <Button size="$5" theme="active" disabled={isLoading} onPress={enter}>
                {isLoading ? 'Loading…' : 'Enter the shop'}
              </Button>
              <Text fontSize={13} opacity={0.5} color="$color12">
                Cart stored per-org in Hanzo Base.
              </Text>
            </XStack>
          </YStack>

          <YStack flexGrow={1} flexBasis={360} minWidth={320} maxWidth={460} gap="$3">
            <ProductImage product={hero} idx={0} height={440} />
            <XStack justifyContent="space-between" alignItems="baseline">
              <Text fontSize={15} fontWeight="600" letterSpacing={0.2} color="$color12">
                {hero.name}
              </Text>
              <Text fontSize={14} fontWeight="600" color="$color12">
                {money(hero.price)}
              </Text>
            </XStack>
          </YStack>
        </XStack>

        <XStack alignItems="center" justifyContent="space-between" paddingBottom="$5">
          <Eyebrow>THE COLLECTION</Eyebrow>
          <Eyebrow>NINE OBJECTS</Eyebrow>
        </XStack>
        <Separator />

        <YStack paddingTop="$6" paddingBottom="$9">
          <ProductGrid products={products} />
        </YStack>
      </YStack>
    </YStack>
  )
}
