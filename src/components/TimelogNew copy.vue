<script setup lang="ts">
import { add, format, formatDuration, getHours, getMinutes } from 'date-fns'
import { useTimelogStore } from '~/stores/timelogData'

import { usePixelRatio } from '~/composables/pixelRatio'

// import type { TimelogBlockProps } from '~/types'

// const props = defineProps<{
//   timelogs: TimelogBlockProps[]
//   index: number
// }>()
// const timelogs = useVModel(props, 'timelogs', emit)

const { convertMinutesToPixel, convertPixelToMinutes, globalScale } = usePixelRatio()

const timelogData = useTimelogStore()
const durationDisplayed = computed(() => formatDuration(timelogData.duration))

const el = ref(null)
const size = reactive(useElementSize(el, { width: 0, height: 0 }, { box: 'border-box' }))
const [dialogShown, toggleDialog] = useToggle()

const initialHeight = ref()
const target = ref<HTMLElement | null>(null)

const topPosition = computed(() => {
  const hours = getHours(timelogData.startTimeParsed)
  const minutes = getMinutes(timelogData.startTimeParsed)
  const timeInMinute = hours * 60 + minutes
  return convertMinutesToPixel(timeInMinute)
})

const timeToPixel = computed(() => {
  const { hours, minutes } = timelogData.duration
  const safeHours = hours ?? 0
  const safeMinutes = minutes ?? 0
  const timeInMinute = safeHours * 60 + safeMinutes
  return convertMinutesToPixel(timeInMinute)
})

const displayTitle = computed(() => {
  const { hours, minutes } = timelogData.displayTitleMaximumDuration
  const safeHours = hours ?? 0
  const safeMinute = minutes ?? 0
  const minimumPixelHeight = convertMinutesToPixel(safeHours * 60 + safeMinute) * 1 / globalScale.value
  return size.height > minimumPixelHeight
})

const { distanceY } = usePointerSwipe(target, {
  threshold: 0,
  onSwipeStart() {
    initialHeight.value = timeToPixel.value
  },
  onSwipe() {
    const remainingDistance = initialHeight.value - distanceY.value
    const remainingMinutes = convertPixelToMinutes(remainingDistance < timelogData.minimumDistance ? timelogData.minimumDistance : remainingDistance)
    const newEnd = add(timelogData.startTimeParsed, {
      hours: Math.floor(remainingMinutes / 60), minutes: (remainingMinutes % 60),
    })
    timelogData.endTime = format(newEnd, timelogData.timeFormat)
  },
})

function showTaskInfo() {
  toggleDialog()
}
</script>

<template>
  <div :style="{ top: `${topPosition}px` }" absolute flex gap-5>
    <div
      ref="el"
      b="~ solid blue-950 2"
      :style="{ height: `${timeToPixel}px` }"
      flex="~ col" w-40 items-center justify-center rounded-2 bg-blue-800 p2 shadow-md drop-shadow
    >
      <div i-ic-baseline-delete absolute right-0 top-0 mr2 mt2 h-5 w-5 opacity-0 hover:opacity-100 />
      <div h-full w-full flex="~ col" items-center justify-center hover:cursor-pointer @click="showTaskInfo">
        <div v-if="displayTitle" text-xl>
          <!-- {{ elementPositionY }} -->
          {{ timelogData.title }}
        </div>
        <div font-mono>
          {{ durationDisplayed }}
        </div>
      </div>
      <div ref="target" h-2 w-full translate-y-2 bg-transparent hover:cursor-n-resize hover:bg-blue />
    </div>
  </div>
  <NModal v-model:show="dialogShown">
    <TimelogEditDialogNew v-model:dialogShown="dialogShown" />
  </NModal>
</template>

<style scoped>

</style>
