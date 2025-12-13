<script setup lang="ts">
import type { Product } from '../src/stores/product'

defineProps<{
  open: boolean
  product: Product | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function handleCancel() {
  emit('update:open', false)
}

function handelConfirm() {
  emit('confirm')
  emit('update:open', false)
}
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3 p-4 bg-error/10 rounded-lg">
          <UIcon name="i-lucide-alert-triangle" class="text-error text-2xl shrink-0" />
          <p class="text-default">
            <strong>{{ product?.name }}</strong> ürünü silmek istediğinize emin misiniz? Bu işlem
            geri alınamaz!
          </p>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <UButton color="neutral" variant="ghost" @click="handleCancel">İptal</UButton>
          <UButton color="error" @click="handelConfirm">Sil</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
