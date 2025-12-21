<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '../stores/product'
import type { Product } from '../stores/product'
import ProductCard from '../../components/ProductCard.vue'
import ProductModal from '../../components/ProductModal.vue'
import DeleteConfirmModal from '../../components/DeleteConfirmModal.vue'

const store = useProductStore()

const isProductModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const editingProduct = ref<Product | null>(null)
const deletingProduct = ref<Product | null>(null)

function openAddModal() {
  editingProduct.value = null
  isProductModalOpen.value = true
}

function openEditModal(product: Product) {
  editingProduct.value = product
  isProductModalOpen.value = true
}

function openDeleteModal(product: Product) {
  deletingProduct.value = product
  isDeleteModalOpen.value = true
}

function handleSave(productData: Omit<Product, 'id'> & { id?: number }) {
  if (productData.id) {
    store.updateProduct(productData.id, productData)
  } else {
    store.addProduct(productData)
  }
}

const toast = useToast()

function handleDelete() {
  if (deletingProduct.value) {
    store.deleteProduct(deletingProduct.value.id)

    toast.add({
      title: 'Ürün Silindi',
      description: `${deletingProduct.value.name} ürünü silindi`,
      color: 'error',
      icon: 'i-lucide-trash-2',
    })
    deletingProduct.value = null
    isDeleteModalOpen.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="header-section">
      <div>
        <h1 class="text-3xl font-bold text-default">Admin Paneli</h1>
        <p class="text-muted mt-1">Ürünleri ekleyin, düzenleyin veya silin</p>
      </div>
      <UButton icon="i-lucide-plus" color="primary" size="lg" @click="openAddModal">
        Yeni Ürün Ekle
      </UButton>
    </div>

    <TransitionGroup name="fade-slide" tag="div" class="product-grid" appear>
      <ProductCard
        v-for="product in store.products"
        :key="product.id"
        :product="product"
        :is-admin="true"
        @edit="openEditModal"
        @delete="openDeleteModal"
      />
    </TransitionGroup>

    <div v-if="store.products.length === 0" class="empty-state">
      <UIcon name="i-lucide-coffee" class="text-6xl text-muted mb-4" />
      <p class="text-lg text-muted">Henüz ürün bulunmuyor</p>
      <UButton icon="i-lucide-plus" color="primary" class="mt-4" @click="openAddModal">
        İlk Ürünü Ekle
      </UButton>
    </div>

    <ProductModal
      v-model:open="isProductModalOpen"
      :product="editingProduct || undefined"
      @save="handleSave"
    />

    <DeleteConfirmModal
      v-model:open="isDeleteModalOpen"
      :product="deletingProduct"
      @confirm="handleDelete"
    />
  </div>
</template>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: Arial, Helvetica, sans-serif;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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
  transform: translateY(20px);
}
</style>
