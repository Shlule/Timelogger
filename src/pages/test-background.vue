<script setup lang="ts">
import { NSlider } from 'naive-ui'
import { usePixelRatio } from '~/composables/pixelRatio'

const { globalScale, convertMinutesToPixel } = usePixelRatio()
</script>

<template>
  <div flex="~ col" flex-1>
    <div flex flex-1 items-center justify-center>
      <p text-2xl>
        hello
      </p>
      <NSlider v-model:value="globalScale" color="#0ea5e9" :min="0" :max="2" :default-value="1" :step="0.1" />
    </div>
    <NScrollbar>
      <div relative h-full w-full>
        <WeekBlock absolute />
      </div>
      <div h-full w-full bg-red>
        <div v-for="h in 24" :key="h" z-0 :style="{ height: `${convertMinutesToPixel(60)}px` }" z-1 overflow-hidden>
          <div w-full flex items-center gap-2>
            <div h-1px w-10 bg-white />
            <p>Text</p>
            <div h-1px w-full bg-white />
          </div>
        </div>
      </div>
    </NScrollbar>
  </div>
</template>

<!-- <style scoped>
</style>
<script setup lang="ts">
import { NSlider } from 'naive-ui'
import { usePixelRatio } from '~/composables/pixelRatio'

const { globalScale, convertMinutesToPixel } = usePixelRatio()
</script>

<template>
  <div flex="~ col" flex-1>
    <div flex flex-1 items-center justify-center>
      <p text-2xl>
        hello
      </p>
      <NSlider v-model:value="globalScale" color="#0ea5e9" :min="0" :max="2" :default-value="1" :step="0.1" />
    </div>
    <NScrollbar h-full w-full>
      <div h-full w-full>
        <WeekBlock absolute />
      </div>
      <div h-full w-full bg-red>
        <div v-for="h in 24" :key="h" z-0 :style="{ height: `${convertMinutesToPixel(60)}px` }" z-1 overflow-hidden>
          <div w-full flex items-center gap-2>
            <div h-1px w-10 bg-white />
            <p>Text</p>
            <div h-1px w-full bg-white />
          </div>
        </div>
         <div h-full w-full>
          <div h-full w-full>
            <WeekBlock />
          </div>
        </div>
      </div>
    </NScrollbar>
  </div>
</template>

<style scoped>
</style> -->
