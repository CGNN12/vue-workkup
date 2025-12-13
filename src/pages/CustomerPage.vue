<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/product'
import ProductCard from '../../components/ProductCard.vue'

const store = useProductStore()

const searchQuery = ref('')

const filteredProducts = computed(() => {
  const products = store.products

  if (!searchQuery.value) return products

  const searched = searchQuery.value.toLowerCase()

  return products.filter((product) => product.name.toLowerCase().includes(searched))
})
</script>

<template>
  <div class="customer-page">
    <UPageHeader
      title="Kahve Menümüz"
      description="En taze kahve çekirdeklerinden hazırlanan özel içeceklerimiz"
    />
    <div class="flex justify-end my-6">
      <div class="w-full max-w-sm">
        <UInput v-model="searchQuery" placeholder="Ara..." icon="i-lucide-search" size="lg">
          <template v-if="searchQuery" #trailing>
            <UButton
              color="gray"
              :padded="false"
              variant="link"
              icon="i-lucide-x"
              @click="searchQuery = ''"
            />
          </template>
        </UInput>
      </div>
    </div>
  </div>

  <div class="product-grid">
    <ProductCard
      v-for="product in filteredProducts"
      :key="product.id"
      :product="product"
      :isAdmin="false"
    />
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <UIcon name="i-lucide-coffee" class="text-6x1 text-muted mb-4" />
      <p v-if="searchQuery" class="text-lg text-muted">
        "{{ searchQuery }}" ile eşleşen ürün bulunamadı.
      </p>
      <p v-else class="text-lg text-muted">Şu anda menümüzde ürün bulunmuyor.</p>
    </div>
  </div>
</template>

<style scoped>
.customer-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}
</style>
