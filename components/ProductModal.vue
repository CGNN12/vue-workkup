<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Product } from '../src/stores/product'

const props = defineProps<{
  open: boolean
  product?: Product
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [product: Omit<Product, 'id'> & { id?: number }]
}>()

const form = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      if (props.product) {
        form.value = {
          name: props.product.name,
          description: props.product.description,
          price: props.product.price,
          stock: props.product.stock,
          image: props.product.image,
        }
      } else {
        form.value = {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          image: '',
        }
      }
    }
  },
)

const isEditing = computed(() => !!props.product)

function handleSubmit() {
  emit('save', {
    ...(props.product?.id ? { id: props.product.id } : {}), // Omit dersi: ID varsa ekle
    ...form.value,
  })
  emit('update:open', false)
}

function handleClose() {
  emit('update:open', false)
}
</script>

<template>
  <UModal
    :open="open"
    :title="isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'"
    @update:open="emit('update:open', $event)"
  >
    <template #body>
      <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
        <UFormField label="Ürün Adı" required>
          <UInput v-model="form.name" placeholder="Örn: Espresso" required />
        </UFormField>

        <UFormField label="Açıklama" required>
          <UTextarea
            v-model="form.description"
            placeholder="Ürün açıklaması..."
            :rows="3"
            required
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Fiyat (₺)" required>
            <UInput v-model.number="form.price" type="number" min="0" step="0.01" required />
          </UFormField>

          <UFormField label="Stok Adedi" required>
            <UInput v-model.number="form.stock" type="number" min="0" required />
          </UFormField>
        </div>

        <UFormField label="Görsel URL">
          <UInput v-model="form.image" placeholder="https://example.com/image.jpg" />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4">
          <UButton type="button" color="neutral" variant="ghost" @click="handleClose">
            İptal
          </UButton>
          <UButton type="submit" color="primary">
            {{ isEditing ? 'Güncelle' : 'Ekle' }}
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
