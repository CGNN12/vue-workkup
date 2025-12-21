<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useProductStore } from '@/stores/product'

const cartStore = useCartStore()
const productStore = useProductStore()

// Sepet ürünlerini ürün detaylarıyla birleştir
const cartItemsWithDetails = computed(() => {
  return cartStore.items.map((item) => {
    const product = productStore.getProductById(item.productId)
    return {
      ...item,
      image: product?.image || 'https://via.placeholder.com/150',
    }
  })
})

const isCartEmpty = computed(() => cartStore.items.length === 0)
</script>

<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>🛒 Sepetim</h1>
      <span class="item-count" v-if="!isCartEmpty"> {{ cartStore.totalQuantity }} ürün </span>
    </div>

    <!-- Boş sepet durumu -->
    <div v-if="isCartEmpty" class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h2>Sepetiniz boş</h2>
      <p>Henüz sepetinize ürün eklemediniz.</p>
      <UButton to="/customer" color="primary" size="lg"> Alışverişe Başla </UButton>
    </div>

    <!-- Sepet içeriği -->
    <div v-else class="cart-content">
      <div class="cart-items">
        <TransitionGroup name="cart-item">
          <div v-for="item in cartItemsWithDetails" :key="item.productId" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>

            <div class="item-details">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">{{ item.price }} ₺</p>
            </div>

            <div class="item-quantity">
              <UButton
                icon="i-heroicons-minus"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="cartStore.removeItem(item.productId)"
              />
              <span class="quantity-value">{{ item.quantity }}</span>
              <UButton
                icon="i-heroicons-plus"
                color="primary"
                variant="ghost"
                size="sm"
                @click="cartStore.addItem(item.productId)"
              />
            </div>

            <div class="item-total">
              <span class="total-label">Toplam</span>
              <span class="total-value">{{ item.price * item.quantity }} ₺</span>
            </div>

            <UButton
              icon="i-heroicons-trash"
              color="error"
              variant="ghost"
              size="sm"
              class="remove-btn"
              @click="
                () => {
                  // Tüm miktarı kaldır
                  for (let i = 0; i < item.quantity; i++) {
                    cartStore.removeItem(item.productId)
                  }
                }
              "
            />
          </div>
        </TransitionGroup>
      </div>

      <!-- Sepet özeti -->
      <div class="cart-summary">
        <div class="summary-card">
          <h2>Sipariş Özeti</h2>

          <div class="summary-row">
            <span>Ürün Sayısı</span>
            <span>{{ cartStore.totalQuantity }} adet</span>
          </div>

          <div class="summary-row">
            <span>Ara Toplam</span>
            <span>{{ cartStore.totalPrice }} ₺</span>
          </div>

          <div class="summary-row">
            <span>Kargo</span>
            <span class="free-shipping">Ücretsiz</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total">
            <span>Toplam</span>
            <span>{{ cartStore.totalPrice }} ₺</span>
          </div>

          <UButton
            color="primary"
            size="lg"
            block
            class="checkout-btn"
            icon="i-heroicons-shopping-cart"
            label="Siparişi Tamamla"
          />
          <br />
          <br />
          <UButton
            color="error"
            variant="solid"
            size="md"
            block
            class="clear-btn"
            @click="cartStore.clearCart()"
            label="Sepeti Temizle"
            icon="i-heroicons-trash"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.cart-header h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.item-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Boş sepet */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 1.5rem;
  border: 2px dashed rgba(102, 126, 234, 0.2);
}

.empty-cart-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-cart h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ui-text);
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: var(--ui-text-muted);
  margin-bottom: 1.5rem;
}

/* Sepet içeriği */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

/* Sepet ürünleri */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.cart-item:hover {
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ui-text);
  margin-bottom: 0.25rem;
}

.item-price {
  color: var(--ui-text-muted);
  font-size: 0.875rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--ui-bg);
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--ui-border);
}

.quantity-value {
  min-width: 2.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.item-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 100px;
}

.total-label {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}

.total-value {
  font-size: 1.125rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.remove-btn {
  opacity: 0.5;
  transition: opacity 0.2s;
}

.cart-item:hover .remove-btn {
  opacity: 1;
}

/* Sepet özeti */
.cart-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid var(--ui-border);
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.summary-card h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--ui-text);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: var(--ui-text-muted);
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ui-text);
}

.summary-row.total span:last-child {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.free-shipping {
  color: #10b981;
  font-weight: 500;
}

.summary-divider {
  height: 1px;
  background: var(--ui-border);
  margin: 0.5rem 0;
}

.checkout-btn {
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.clear-btn {
  margin-top: 0.75rem;
}

/* Animasyonlar */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter-from,
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 640px) {
  .cart-item {
    flex-wrap: wrap;
  }

  .item-quantity,
  .item-total {
    flex-basis: auto;
  }
}
</style>
