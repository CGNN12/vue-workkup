<template>
  <Suspense>
    <UApp>
      <UHeader>
        <template #left>
          <RouterLink to="/" class="flex items-center gap-2">
            <UIcon name="i-lucide-coffee" class="text-2xl text-primary" />
            <span class="font-bold text-lg">Kahve Dükkanı</span>
          </RouterLink>
        </template>

        <nav class="flex items-center gap-1">
          <UButton to="/" :variant="$route.path === '/' ? 'soft' : 'ghost'" color="neutral">
            <UIcon name="i-lucide-store" class="mr-1" />
            Menü
          </UButton>
          <UButton
            to="/admin"
            :variant="$route.path === '/admin' ? 'soft' : 'ghost'"
            color="neutral"
          >
            <UIcon name="i-lucide-settings" class="mr-1" />
            Admin
          </UButton>
        </nav>

        <template #right>
          <UColorModeButton />
        </template>
      </UHeader>

      <UMain>
        <RouterView />
      </UMain>

      <USeparator icon="i-lucide-coffee" />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">Kahve Dükkanı • © {{ new Date().getFullYear() }}</p>
        </template>
      </UFooter>
    </UApp>
  </Suspense>
</template>
