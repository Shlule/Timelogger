<script setup lang="ts">
import { NNotificationProvider, darkTheme } from 'naive-ui'

const isDark = useDark()

const currentTheme = computed(() => {
  return isDark.value ? darkTheme : undefined
})

const taskStore = useTaskStore()
</script>

<template>
  <NNotificationProvider>
    <NConfigProvider :theme-overrides="naiveThemeOverrides" :theme="currentTheme" h-100dvh>
      <div h-full w-full flex bg-light dark:bg-dark-9 dark:color-light>
        <RouterView />
      </div>
    </NConfigProvider>
  </NNotificationProvider>
</template>

<style lang="scss">
</style>
