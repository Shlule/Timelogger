<script setup lang="ts">
import { Temporal } from '@js-temporal/polyfill'
import type { Timelog } from '~/stores/timelogData'
import { useTimelogSettingsStore } from '~/stores/timelogSettings'

const props = defineProps<{
  dayDate: string
  jobs: Timelog[]
}>()
const emit = defineEmits(['update:isCreatingTimelog', 'update:ownerCreateTimelog'])

const scrollHook = ref<HTMLElement | null>(null)
const mousePosYTarget = ref(null)
const disableTaskCreation = ref(false)

const timelogSettings = useTimelogSettingsStore()
const bus = useEventBus<string>('createDialogBus')

const { elementY } = useMouseInElement(mousePosYTarget)

function displayCreateTimelogDialog() {
  if (disableTaskCreation.value)
    return
  bus.emit('createDialogBus', {
    selectedDay: props.dayDate,
    elementY: elementY.value,
  })
}

const isOvertime = computed(() => {
  const overtimeMinutes = timelogSettings.workingHoursPerDay.hours * 60 + timelogSettings.workingHoursPerDay.minutes
  let totalDayDuration = 0
  for (const timelog of props.jobs) {
    const timelogHours = Temporal.Duration.from(timelog.duration).hours
    const timelogMinutes = Temporal.Duration.from(timelog.duration).minutes
    const totalMinutes = timelogHours * 60 + timelogMinutes
    totalDayDuration += totalMinutes
  }
  if (overtimeMinutes < totalDayDuration)
    return true
  return false
})

const { convertMinutesToPixel } = usePixelRatio()
const taskStore = useTaskStore()
</script>

<template>
  <div ref="scrollHook" m0 flex flex-1>
    <div ref="mousePosYTarget" :style="{ height: `${convertMinutesToPixel(24 * 60)}px` }" border="solid dark-3  1" w-full flex flex-col items-center @click="displayCreateTimelogDialog">
      <!-- <div :style="{ height: `${convertMinutesToPixel(24 * 60)}px` }" border="solid dark-7  1" pointer-events-none w-full flex flex-col items-center @click="test"> -->
      <TimelogBlock v-for="(timelog, i) in props.jobs" :key="i" v-model:disable-task-creation="disableTaskCreation" :is-overtime="isOvertime" :timelog="timelog" :day-timelogs="jobs" :day-date="props.dayDate" />
      <!-- <div h-20 w-full bg-red mix-blend-color /> -->
    </div>
  </div>
</template>

<style scoped>

</style>
