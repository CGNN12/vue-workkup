<script setup lang="ts">
import type { Product } from '../src/stores/product'
import { useCartStore } from '../src/stores/cart'
import { computed } from 'vue'

const props = defineProps<{
  product: Product
  isAdmin?: boolean
}>()

const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
}>()

const toast = useToast()

const cartStore = useCartStore()

function handleAddToCart() {
  cartStore.addItem(props.product.id)
  toast.add({
    title: 'Ürününüz Sepete Eklendi',
    description: `${props.product.name} sepete eklendi`,
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
}

const stockStatus = computed(() => {
  if (props.product.stock === 0) {
    return { color: 'error', variant: 'solid', lable: 'Stokta Yok' }
  }

  if (props.product.stock < 5) {
    return { color: 'warning', variant: 'solid', lable: `Son ${props.product.stock} Adet!` }
  }

  return { color: 'success', variant: 'solid', lable: `${props.product.stock} Adet Kaldı` }
})

const isOutOfStock = computed(() => props.product.stock === 0)
</script>

<template>
  <UCard
    class="product-card h-full flex flex-col overflow-hidden group transition-all duration-300"
    :class="{ 'opacity-75 grayscale': isOutOfStock && !isAdmin }"
  >
    <template #header>
      <div class="aspect-4/3 overflow-hidden rounded-lg -m-4 mb-0 relative">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div class="absolute top-2 right-2">
          <UBadge :color="stockStatus.color" :variant="stockStatus.variant" size="sm">
            {{ stockStatus.lable }}
          </UBadge>
        </div>
      </div>
    </template>

    <div class="flex-1 flex flex-col gap-2">
      <div class="flex items-start justify-between gap-2">
        <h3 class="text-lg font-semibold text-default">{{ product.name }}</h3>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm text-muted flex-1 line-clamp-2">{{ product.description }}</p>

        <UBadge color="primary" class="p-1.5" variant="soft" size="sm">{{
          product.category
        }}</UBadge>
      </div>

      <div
        class="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-800"
      >
        <span class="text-xl font-bold text-primary">₺{{ product.price }}</span>

        <div v-if="isAdmin" class="flex gap-2">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Düzenle"
            @click="emit('edit', product)"
          />
          <UButton
            icon="i-lucide-trash-2"
            color="error"
            variant="ghost"
            size="sm"
            aria-label="Sil"
            @click="emit('delete', product)"
          />
        </div>

        <div v-else>
          <UButton
            v-if="!isOutOfStock"
            icon="i-lucide-shopping-bag"
            size="sm"
            color="primary"
            variant="solid"
            @click="handleAddToCart"
            label="Sepete Ekle"
            class="shadow-sm"
          />
          <span v-else class="text-xs text-error font-medium">Gelince Haber Ver</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<style scoped>
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
</style>
