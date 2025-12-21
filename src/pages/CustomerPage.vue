<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/product'
import ProductCard from '../../components/ProductCard.vue'

const store = useProductStore()

const searchQuery = ref('')

const selectedCategory = ref('Tümü')

const categoryOptions = computed(() => {
  return ['Tümü', ...store.categories]
})

const filteredProducts = computed(() => {
  let products = store.products

  if (selectedCategory.value && selectedCategory.value !== 'Tümü') {
    products = products.filter((product) => product.category === selectedCategory.value)
  }
  if (searchQuery.value) {
    const searched = searchQuery.value.toLowerCase()
    products = products.filter((product) => product.name.toLowerCase().includes(searched))
  }

  return products
})
</script>

<template>
  <div class="customer-page">
    <UPageHeader
      title="Kahve Menümüz"
      description="En taze kahve çekirdeklerinden hazırlanan özel içeceklerimiz"
    />
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between my-6">
      <div class="w-full md:max-w-md">
        <UInput
          v-model="searchQuery"
          placeholder="Ürün ara..."
          icon="i-lucide-search"
          size="lg"
          class="w-full"
          variant="outline"
          :ui="{ border: 'border-gray-300 dark:border-gray-700' }"
        >
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

      <div class="w-full md:w-auto">
        <USelect
          style="min-width: 200px"
          v-model="selectedCategory"
          :items="categoryOptions"
          placeholder="Kategori Seçin"
          size="lg"
        />
      </div>
    </div>
    <TransitionGroup name="fade-slide" tag="div" class="product-grid" appear>
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :isAdmin="false"
      />
    </TransitionGroup>
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <UIcon name="i-lucide-coffee" class="text-6xl text-muted mb-4" />
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

.fade-slide-enter-active {
  transition: all 0.5s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(80px);
}
</style>
