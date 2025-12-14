import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  image: string
}

const mockProduct: Product[] = [
  {
    id: 1,
    name: 'Americano',
    price: 10,
    description: 'Description 1',
    stock: 10,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Cappuccino',
    price: 20,
    description: 'Description 2',
    stock: 20,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Espresso',
    price: 30,
    description: 'Description 3',
    stock: 30,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'Latte',
    price: 40,
    description: 'Description 4',
    stock: 40,
    image: 'https://via.placeholder.com/150',
  },
]

export const useProductStore = defineStore(
  'product',
  () => {
    const products = ref<Product[]>([...mockProduct])
    const nextId = computed(() => {
      if (products.value.length === 0) return 1
      return Math.max(...products.value.map((p) => p.id)) + 1
    })

    function addProduct(product: Omit<Product, 'id'>) {
      products.value.push({
        ...product,
        id: nextId.value,
      })
    }

    function updateProduct(id: number, product: Omit<Product, 'id'>) {
      const index = products.value.findIndex((p) => p.id === id)
      if (index === -1) return
      products.value[index] = { ...products.value[index], ...product } as Product
    }

    function deleteProduct(id: number) {
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.value.splice(index, 1)
      }
    }

    function getProductById(id: number) {
      return products.value.find((p) => p.id === id)
    }

    return {
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
    }
  },
  {
    persist: true,
  },
)
