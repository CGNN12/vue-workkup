<template>
  <div
    class="w-full overflow-hidden py-1 sticky top-0 z-50"
    :style="{
      backgroundColor: config.background_color,
      fontFamily: `${config.font_family}, ${baseFontStack}`,
    }"
  >
    <div class="w-full flex items-center">
      <!-- Badge -->
      <div class="shrink-0 px-4">
        <div
          class="inline-flex items-center px-4 py-1 rounded-full"
          :style="{ backgroundColor: config.badge_color }"
        >
          <svg
            class="mr-2"
            :width="badgeIconSize"
            :height="badgeIconSize"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" :fill="config.text_color" />
          </svg>
          <span
            :style="{
              color: config.text_color,
              fontSize: config.font_size + 'px',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }"
          >
            {{ config.badge_text }}
          </span>
        </div>
      </div>

      <!-- Scrolling News -->
      <div class="flex-1 overflow-hidden">
        <div class="carousel-track flex items-center">
          <div
            v-for="(item, index) in allNewsItems"
            :key="index"
            class="news-item flex items-center px-5"
          >
            <svg class="shrink-0 mr-3" width="8" height="8" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" :fill="config.separator_color" />
            </svg>
            <span
              :style="{
                color: config.text_color,
                fontSize: config.font_size + 'px',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

// Varsayılan Ayarlar
const defaultConfig = {
  background_color: '#1a1a2e',
  badge_color: '#e63946',
  text_color: '#ffffff',
  separator_color: '#ffffff',
  badge_text: 'HABERLER',
  font_family: 'Inter',
  font_size: 14,
}

const baseFontStack = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'

const config = reactive({ ...defaultConfig })

// Haber başlıkları - promosyon mesajları
const newsItems = [
  '%50 İndirim Fırsatı!',
  'Yeni Ürünler Geldi',
  'Ücretsiz Kargo Kampanyası',
  'Sezona Özel Fiyatlar',
  'Son 3 Gün!',
]

// Sonsuz kaydırma için haberleri çoğalt
const allNewsItems = computed(() => [...newsItems, ...newsItems, ...newsItems])

const badgeIconSize = computed(() => config.font_size * 1.25)
</script>

<style scoped>
.carousel-track {
  display: flex;
  width: max-content;
  animation: scroll 10s linear infinite;
}

.carousel-track:hover {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
}

.news-item {
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-2px);
}
</style>
