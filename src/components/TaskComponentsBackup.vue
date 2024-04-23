<!-- eslint-disable unused-imports/no-unused-imports -->
<script setup lang="ts">
import { add, format, intervalToDuration, parse, set } from 'date-fns'
import { computed, reactive, ref } from 'vue'
import { NTimePicker } from 'naive-ui'
import { useElementSize, usePointerSwipe } from '@vueuse/core'
import { useZoom } from '@/composables/zoom'

const target = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const { zoomFactor } = useZoom()

const remForHour = ref(8)

const el = ref(null)
const size = reactive(useElementSize(el, { width: 0, height: 0 }, { box: 'border-box' }))

const originalLogHeight = ref(50)
const originalDurationHours = ref(1)
const originalDurationMinutes = ref(0)
const snap = ref(0.25)

// const { distanceY, distanceX, isSwiping } = usePointerSwipe(target, {
//   threshold: 10,
//   onSwipeStart() {
//     originalLogHeight.value = logHeight.value
//   },
//   onSwipe() {
//     const rawHeight = originalLogHeight.value - distanceY.value
//     logHeight.value = Math.floor(rawHeight / snap.value) * snap.value
//   },
// })

const startFormattedTime = ref<string>('10:00')
const endFormattedTime = ref<string>('11:00')
const height = ref(20)
const timeFormat = 'HH:mm'
const today = new Date()

const parsedStart = computed(() => parse(startFormattedTime.value, timeFormat, today))
const parsedEnd = computed(() => parse(endFormattedTime.value, timeFormat, today))
const durationWritable = computed({
  get() {
    const calculatedDuration = intervalToDuration({ start: parsedStart.value, end: parsedEnd.value })
    const durationAsDate = set(today, {
      ...calculatedDuration,
    })
    return format(durationAsDate, timeFormat)
  },
  set(newDuration) {
    const [hours, minutes] = newDuration.split(':').map(Number.parseInt)
    const newEnd = add(parsedStart.value, {
      hours, minutes,
    })
    endFormattedTime.value = format(newEnd, timeFormat)
  },
})

const timeToRem = computed(() => {
  const myArray = durationWritable.value.split(':')
  const hour = Number.parseInt(myArray[0])
  const minute = Number.parseInt(myArray[1])
  return hour * remForHour.value + minute * (remForHour.value / 60)
})
const { distanceY } = usePointerSwipe(target, {
  threshold: 0,
  onSwipeStart() {
    // originalLogHeight.value = size.height
    originalDurationMinutes.value = Number.parseInt(durationWritable.value.split(':')[1])
    originalDurationHours.value = Number.parseInt(durationWritable.value.split(':')[0])
  },
  onSwipe() {
    const betterValue1 = -distanceY.value / 128
    const betterValue = Math.floor(betterValue1 / snap.value) * snap.value
    const minutes = betterValue % 1
    const hours = betterValue - minutes
    const realMinutes = Math.floor(minutes * 60)
    const finalHours = originalDurationHours.value + hours
    const finalMinutes = originalDurationMinutes.value + realMinutes
    const newEnd = add(parsedStart.value, {
      hours: finalHours, minutes: finalMinutes,
    })
    endFormattedTime.value = format(newEnd, timeFormat)

    const rawHeight = originalLogHeight.value - distanceY.value
    // const rawDuration = durationWritable.value -
    // size.height = Math.floor(rawHeight / snap.value) * snap.value
    // durationWritable.value =
  },
})
</script>

<template>
  <div flex flex-col items-center gap-4>
    <div flex items-center gap-8>
      <div flex items-center gap-1>
        <div>Start:</div>
        <NTimePicker v-model:formatted-value="startFormattedTime" :format="timeFormat" />
      </div>

      <div flex items-center gap-1>
        <div>End:</div>
        <NTimePicker v-model:formatted-value="endFormattedTime" :format="timeFormat" />
      </div>

      <div flex items-center gap-1>
        <div>Duration:</div>
        <NTimePicker v-model:formatted-value="durationWritable" :format="timeFormat" />
      </div>
    </div>
    <div
      flex="~ col" items-center
    >
      <!-- :style="{ height: `${timeToRem}rem` }" -->
      <div

        ref="el" border="~ solid black 2" h-40 w-40 rounded-2 bg-red p-2 shadow-md drop-shadow transition-all
        :style="{ height: `${timeToRem}rem` }"
      >
        {{ height }}
      </div>
      <div ref="target" h-2 w-40 translate-y--1 bg-transparent hover:cursor-n-resize hover:bg-blue />
    </div>

    <!-- <div ref="container" relative h-1500px w-80px flex items-center justify-center rounded bg-gray-200>
      <div
        ref="target"
        class="absolute left-0 top-0 h-full w-full flex items-center justify-center bg-[#3eaf7c]"
        :class="{ 'transition-all duration-200 ease-linear': !isSwiping }"
        :style="{ left, opacity }"
      />
    </div> -->
  </div>
</template>
