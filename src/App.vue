<script setup lang="ts">
import { useCartStore } from './stores/cart'
import NewsTicker from '../components/NewsTicker.vue'
const cartStore = useCartStore()
</script>

<template>
  <Suspense>
    <UApp>
      <NewsTicker />
      <UHeader>
        <template #left>
          <RouterLink to="/" class="flex items-center gap-2">
            <UIcon name="i-lucide-coffee" class="text-2xl text-primary" />
            <span class="font-bold text-lg">Kahve Dükkanı</span>
          </RouterLink>
        </template>

        <nav class="flex items-center gap-1">
          <UButton
            to="/"
            :variant="$route.path === '/' ? 'solid' : 'ghost'"
            :color="$route.path === '/' ? 'primary' : 'neutral'"
          >
            <UIcon name="i-lucide-home" class="mr-1" />
            Anasayfa
          </UButton>
          <UButton
            to="/products"
            :variant="$route.path === '/products' ? 'solid' : 'ghost'"
            :color="$route.path === '/products' ? 'primary' : 'neutral'"
          >
            <UIcon name="i-lucide-coffee" class="mr-1" />
            Ürünler
          </UButton>
        </nav>

        <template #right>
          <UChip
            :text="cartStore.totalQuantity > 0 ? cartStore.totalQuantity : undefined"
            color="primary"
            size="2xl"
          >
            <UButton
              to="/cart"
              :variant="$route.path === '/cart' ? 'solid' : 'subtle'"
              color="primary"
              size="md"
              icon="i-lucide-shopping-cart"
              aria-label="Sepet"
            />
          </UChip>
          <UColorModeButton />
        </template>
      </UHeader>

      <UMain>
        <RouterView />
      </UMain>

      <USeparator icon="i-lucide-coffee" />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">Kahve Dükkanı • © {{ new Date().getFullYear() }}</p>
        </template>
      </UFooter>
      <UNotification />
    </UApp>
  </Suspense>
</template>
