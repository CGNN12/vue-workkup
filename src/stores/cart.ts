import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useProductStore, type Product } from './product'

export interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([])

    const itemCount = computed(() => items.value.length)

    const totalQuantity = computed(() =>
      items.value.reduce((total, item) => total + item.quantity, 0),
    )

    const totalPrice = computed(() =>
      items.value.reduce((total, item) => total + item.price * item.quantity, 0),
    )

    function addItem(productId: number) {
      const productsStore = useProductStore()
      const product = productsStore.getProductById(productId)

      if (!product) return

      const existingItem = items.value.find((item) => item.productId === productId)

      if (existingItem) {
        existingItem.quantity++
      } else {
        items.value.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      }
    }

    function removeItem(productId: number) {
      const index = items.value.findIndex((item) => item.productId === productId)
      if (index !== -1) {
        const item = items.value[index]
        if (item.quantity > 1) {
          item.quantity--
        } else {
          items.value.splice(index, 1)
        }
      }
    }

    function clearCart() {
      items.value = []
    }

    return {
      items,
      itemCount,
      totalQuantity,
      totalPrice,
      addItem,
      removeItem,
      clearCart,
    }
  },
  {
    persist: true,
  },
)
