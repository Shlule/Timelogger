<script setup lang="ts">
import { usePixelRatio } from '~/composables/pixelRatio'

const { convertMinutesToPixel } = usePixelRatio()
</script>

<template>
  <div flex="~ col" relative flex-1 select-none>
    <div :style="{ height: `${convertMinutesToPixel(60 * 8 + 2)}px`, top: `${convertMinutesToPixel(60 * 10 + 6)}px` }" absolute w-full bg-dark-6 />
    <div v-for="h in 24" :key="h" :style="{ height: `${convertMinutesToPixel(60)}px` }" pointer-events-none z-1 overflow-hidden>
      <div w-full flex items-center gap-2>
        <div h-1px w-10 bg-dark-3 />
        <p>{{ h - 1 }}</p>
        <div h-1px w-full bg-dark-3 />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
