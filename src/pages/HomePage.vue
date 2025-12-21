<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductStore, type Product } from '../stores/product'
import { useCartStore } from '../stores/cart'

// Stores
const productStore = useProductStore()
const cartStore = useCartStore()
const toast = useToast()

// Carousel state
const currentStartIndex = ref(0)
const isTransitioning = ref(false)
let carouselTimer: ReturnType<typeof setInterval> | null = null

// Settings
const visibleCount = 3 // Görünür ürün sayısı
const autoSlideInterval = 2500 // 4 saniye

// Computed properties
const hasProducts = computed(() => productStore.products.length > 0)
const totalProducts = computed(() => productStore.products.length)

// Görünür ürünleri hesapla (loop mantığıyla)
const visibleProducts = computed(() => {
  if (!hasProducts.value) return []

  const products: (Product & { displayIndex: number })[] = []
  for (let i = 0; i < Math.min(visibleCount, totalProducts.value); i++) {
    const index = (currentStartIndex.value + i) % totalProducts.value
    const product = productStore.products[index]
    if (product) {
      products.push({
        ...product,
        displayIndex: i,
      })
    }
  }
  return products
})

// Stok durumu hesapla
const getStockStatus = (stock: number) => {
  if (stock === 0) {
    return { color: 'error', variant: 'solid', label: 'Stokta Yok' }
  }
  if (stock < 5) {
    return { color: 'warning', variant: 'solid', label: `Son ${stock} Adet!` }
  }
  return { color: 'success', variant: 'solid', label: `${stock} Adet` }
}

// Navigation functions
const nextSlide = () => {
  if (isTransitioning.value || totalProducts.value <= visibleCount) return
  isTransitioning.value = true
  currentStartIndex.value = (currentStartIndex.value + 1) % totalProducts.value
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

const prevSlide = () => {
  if (isTransitioning.value || totalProducts.value <= visibleCount) return
  isTransitioning.value = true
  currentStartIndex.value =
    (currentStartIndex.value - 1 + totalProducts.value) % totalProducts.value
  setTimeout(() => {
    isTransitioning.value = false
  }, 500)
}

// Sepete ekleme
const handleAddToCart = (product: Product & { displayIndex: number }) => {
  if (product.stock === 0) return
  cartStore.addItem(product.id)
  toast.add({
    title: 'Ürününüz Sepete Eklendi',
    description: `${product.name} sepete eklendi`,
    color: 'success',
    icon: 'i-lucide-check-circle',
  })
}

// Timer management
const startTimer = () => {
  if (totalProducts.value > visibleCount) {
    carouselTimer = setInterval(nextSlide, autoSlideInterval)
  }
}

const stopTimer = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const resetTimer = () => {
  stopTimer()
  startTimer()
}

// Mouse hover'da timer'ı durdur
const onMouseEnter = () => {
  stopTimer()
}

const onMouseLeave = () => {
  startTimer()
}

// Lifecycle hooks
onMounted(() => {
  if (hasProducts.value) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})

// Arkaplan renkleri
const cardBackgrounds = [
  'linear-gradient(135deg, #F5E6E0 0%, #E8D5CF 100%)',
  'linear-gradient(135deg, #F0D861 0%, #E5C94B 100%)',
  'linear-gradient(135deg, #B8C9A3 0%, #A3B88F 100%)',
  'linear-gradient(135deg, #9B8DC2 0%, #8A7CB5 100%)',
  'linear-gradient(135deg, #E8B4A0 0%, #D9A08C 100%)',
  'linear-gradient(135deg, #7FBFBF 0%, #6CACAC 100%)',
]

const getCardBackground = (index: number) => {
  return cardBackgrounds[index % cardBackgrounds.length]
}
</script>

<template>
  <div class="home-container">
    <!-- Products Showcase Section -->
    <template v-if="hasProducts">
      <section class="showcase-section">
        <!-- Section Title -->
        <h1 class="section-title">Ürünlerimizi Keşfedin</h1>

        <!-- Carousel Container -->
        <div class="carousel-wrapper" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
          <!-- Navigation Arrow - Prev -->
          <button
            v-if="totalProducts > visibleCount"
            class="carousel-nav carousel-nav--prev"
            @click="(prevSlide(), resetTimer())"
            :disabled="isTransitioning"
            aria-label="Önceki ürünler"
          >
            <UIcon name="i-lucide-chevron-left" />
          </button>

          <!-- Products Slider -->
          <div class="carousel-track">
            <TransitionGroup name="slide" tag="div" class="products-row">
              <div
                v-for="product in visibleProducts"
                :key="product.id"
                class="product-card-wrapper"
              >
                <div
                  class="product-card"
                  :style="{ background: getCardBackground(product.displayIndex) }"
                >
                  <!-- Image Container -->
                  <div class="card-image-section">
                    <div class="image-wrapper">
                      <img :src="product.image" :alt="product.name" class="product-image" />
                    </div>
                    <!-- Stock Badge -->
                    <div class="stock-badge">
                      <UBadge
                        :color="getStockStatus(product.stock).color"
                        :variant="getStockStatus(product.stock).variant"
                        size="sm"
                      >
                        {{ getStockStatus(product.stock).label }}
                      </UBadge>
                    </div>
                  </div>

                  <!-- Product Info -->
                  <div class="card-content">
                    <div class="product-header">
                      <h3 class="product-name">{{ product.name }}</h3>
                      <UBadge color="primary" variant="soft" size="sm">
                        {{ product.category }}
                      </UBadge>
                    </div>

                    <p class="product-description">{{ product.description }}</p>

                    <div class="product-footer">
                      <span class="product-price">₺{{ product.price }}</span>

                      <UButton
                        v-if="product.stock > 0"
                        icon="i-lucide-shopping-bag"
                        size="sm"
                        color="primary"
                        variant="solid"
                        @click="handleAddToCart(product)"
                        label="Sepete Ekle"
                        class="add-to-cart-btn"
                      />
                      <span v-else class="out-of-stock-text">Stokta Yok</span>
                    </div>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Navigation Arrow - Next -->
          <button
            v-if="totalProducts > visibleCount"
            class="carousel-nav carousel-nav--next"
            @click="(nextSlide(), resetTimer())"
            :disabled="isTransitioning"
            aria-label="Sonraki ürünler"
          >
            <UIcon name="i-lucide-chevron-right" />
          </button>
        </div>

        <!-- Carousel Indicators -->
        <div v-if="totalProducts > visibleCount" class="carousel-indicators">
          <span
            v-for="i in totalProducts"
            :key="i"
            :class="['indicator-dot', { 'indicator-dot--active': i - 1 === currentStartIndex }]"
          />
        </div>

        <!-- CTA Button -->
        <div class="cta-section">
          <UButton to="/products" color="neutral" variant="solid" size="xl" class="cta-button">
            Tüm Ürünleri Görüntüle
            <UIcon name="i-lucide-arrow-right" class="ml-2" />
          </UButton>
        </div>
      </section>

      <!-- Bottom Divider Band -->
      <div class="bottom-band"></div>
    </template>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-state-content">
        <div class="empty-icon">
          <UIcon name="i-lucide-coffee" />
        </div>
        <h2 class="empty-title">Şu An Tanıtılacak Ürün Bulunamadı</h2>
        <p class="empty-description">Yakında yeni ürünlerimizle burada olacağız.</p>
        <UButton to="/products" color="neutral" variant="outline" size="lg">
          <UIcon name="i-lucide-refresh-cw" class="mr-2" />
          Ürünlere Göz At
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  width: 100%;
}

/* Showcase Section */
.showcase-section {
  width: 100%;
  max-width: 1400px;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Section Title */
.section-title {
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--color-text-highlighted, #1a1a1a);
  margin-bottom: 2.5rem;
  text-align: center;
}

.dark .section-title {
  color: #f5f5f5;
}

/* Carousel Wrapper */
.carousel-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 1200px;
  position: relative;
}

/* Navigation Arrows */
.carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dark .carousel-nav {
  background: rgba(50, 50, 50, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
}

.carousel-nav:hover:not(:disabled) {
  background: #333;
  color: white;
  border-color: #333;
  transform: scale(1.1);
}

.dark .carousel-nav:hover:not(:disabled) {
  background: #f5f5f5;
  color: #333;
}

.carousel-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Carousel Track */
.carousel-track {
  flex: 1;
  overflow: hidden;
  max-width: 1000px;
}

.products-row {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

/* Product Card Wrapper */
.product-card-wrapper {
  flex: 0 0 calc(33.333% - 1rem);
  max-width: 300px;
  min-width: 260px;
}

/* Product Card - ProductCard.vue'dan esinlenildi */
.product-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 380px;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.2);
}

/* Card Image Section */
.card-image-section {
  position: relative;
  padding: 1.5rem 1.5rem 0.5rem;
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    6px 6px 0 rgba(0, 0, 0, 0.08),
    10px 10px 20px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.stock-badge {
  position: absolute;
  top: 2rem;
  right: 2rem;
}

/* Card Content */
.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem;
  flex: 1;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
}

.dark .card-content {
  background: rgba(30, 30, 30, 0.6);
}

.product-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.dark .product-name {
  color: #f5f5f5;
}

.product-description {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .product-description {
  color: #aaa;
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin-top: auto;
}

.dark .product-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.product-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #8b4513;
}

.add-to-cart-btn {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.out-of-stock-text {
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 500;
}

/* Carousel Indicators */
.carousel-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.dark .indicator-dot {
  background: rgba(255, 255, 255, 0.2);
}

.indicator-dot--active {
  background: #8b4513;
  transform: scale(1.3);
}

/* CTA Section */
.cta-section {
  margin-top: 2.5rem;
}

.cta-button {
  font-weight: 500;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
}

/* Bottom Band */
.bottom-band {
  width: 100%;
  height: 50px;
  background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
  margin-top: 2rem;
}

/* Slide Transition */
.slide-move,
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-leave-active {
  position: absolute;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  max-width: 400px;
  padding: 2rem;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(139, 69, 19, 0.1);
  color: #8b4513;
  font-size: 2.5rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-highlighted, #1a1a1a);
}

.dark .empty-title {
  color: #f5f5f5;
}

.empty-description {
  font-size: 1rem;
  color: var(--color-text-muted, #6b7280);
}

/* Responsive */
@media (max-width: 900px) {
  .product-card-wrapper {
    flex: 0 0 calc(50% - 0.75rem);
    min-width: 220px;
  }

  .products-row {
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.75rem;
  }

  .carousel-nav {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .product-card-wrapper {
    flex: 0 0 100%;
    max-width: 280px;
    min-width: 260px;
  }

  .product-card {
    min-height: 340px;
  }

  .card-image-section {
    padding: 1rem 1rem 0.5rem;
  }

  .card-content {
    padding: 0.75rem 1rem 1rem;
  }
}
</style>
