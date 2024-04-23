<!-- eslint-disable no-console -->
<!-- eslint-disable unused-imports/no-unused-imports -->
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { add, endOfDay, format, getHours, getMinutes, intervalToDuration, isAfter, isBefore, parse, roundToNearestMinutes, subMinutes } from 'date-fns'

import { Temporal } from '@js-temporal/polyfill'

import TimelogEditDialog from './TimelogEditDialog.vue'
import { usePixelRatio } from '~/composables/pixelRatio'
import type { Timelog } from '~/stores/timelogData'
import { useSnap } from '~/composables/snap'
import { useTimelogSettingsStore } from '~/stores/timelogSettings'

const props = defineProps<{
  timelog: Timelog
  dayTimelogs: Timelog[]
  isOvertime: boolean
  disableTaskCreation: boolean
  dayDate: string
}>()

const emit = defineEmits(['update:timelog', 'update:dayTimelogs', 'update:disableTaskCreation'])

const timelog = useVModel(props, 'timelog', emit)
const dayTimelogs = useVModel(props, 'dayTimelogs', emit)
const disableTaskCreation = useVModel(props, 'disableTaskCreation', emit)
const timeformat = 'HH:mm'

const aqApi = useAqAPIStore()
const timelogDataStore = useTimelogDataStore()
const timelogSettings = useTimelogSettingsStore()
const { convertMinutesToPixel, convertPixelToMinutes, globalScale } = usePixelRatio()
const { snapValue } = useSnap()
const scrollbarInfo = useScrollbarInfo()

const isHide = ref(false)
const isTrash = ref(false)

const timeFormat = 'HH:mm'

const initialHeight = ref()

const targetEnd = ref<HTMLElement | null>(null)
const targetStart = ref<HTMLElement | null>(null)
const jobBlock = ref<HTMLElement | null>(null)
const size = reactive(useElementSize(jobBlock, { width: 0, height: 0 }, { box: 'border-box' }))

const disableDialog = ref(false)

const durationFormatted = computed(() => {
  const duration = Temporal.Duration.from(timelog.value.duration)
  const formattedValue = `${duration.hours.toString().padStart(2, '0')}:${duration.minutes.toString().padStart(2, '0')}`
  return formattedValue
})
const shouldDisplayTitle = computed(() => {
  const { hours, minutes } = timelogSettings.displayTitleMaximumDuration
  const safeHours = hours ?? 0
  const safeMinute = minutes ?? 0
  const minimumPixelHeight = convertMinutesToPixel(safeHours * 60 + safeMinute) * 1 / globalScale.value
  return size.height > minimumPixelHeight
})

const [dialogShown, toggleDialog] = useToggle()

function showTaskInfoDialog() {
  if (!disableDialog.value)
    toggleDialog()

  // else
  //   disableDialog.value = false
}

const todayDate = computed(() => parse(props.dayDate, 'EEEE:dd:MM:yyyy', new Date()))
const isTommorow = ref(false)

const endDate = computed(() => {
  return timelog.value.end
    ? parse(timelog.value.end, timeformat, todayDate.value)
    : undefined
})
const startDate = computed(() => {
  if (!timelog.value.start)
    return
  return parse(timelog.value.start, timeformat, todayDate.value)
})

const nextTimelog = dayTimelogs.value.find((obj) => {
  if (!timelog.value.end || !obj.start)
    return undefined
  return obj.start >= timelog.value.end
})

// const maximumDuration = computed(() => {
//   if (!startParsed.value)
//     return
//   const result = Temporal.Duration.from(intervalToDuration({ start: startParsed.value, end: endOfDay(startParsed.value) })).toString()
//   return result
// })

// const previousTimelogs = dayTimelogs.value.find((obj) => {
//   if (!timelog.value.start || !obj.end)
//     return undefined
//   return obj.end <= timelog.value.start
// })

const durationInPixels = computed(() => {
  const duration = Temporal.Duration.from(timelog.value.duration)
  const timeInMinutes = duration.hours * 60 + duration.minutes
  return convertMinutesToPixel(timeInMinutes)
})

const topPosition = computed(() => {
  if (!startDate.value)
    return
  const hours = getHours(startDate.value)
  const minutes = getMinutes(startDate.value)
  const timeInMinute = hours * 60 + minutes
  return convertMinutesToPixel(timeInMinute)
})

const { start: enableDialogsAfterDelay } = useTimeoutFn(() => {
  // When you drag to change the block height, if you release the mouse
  // while hovering over the block div itself, the task info dialog opens
  // as well as the task creation dialog. This is not desirable.
  //
  // In order to fix that, we disable the dialogs creation using
  // disableDialog & disableTaskCreation variables in the drag events:
  // - usePointerSwipe(targetEnd, { ... })
  // - usePointerSwipe(targetStart, { ... })
  //
  // This current function enables the dialogs back after a short delay.

  disableDialog.value = false
  disableTaskCreation.value = false
}, 20)
const startScroll = ref(0)

const { distanceY: distanceYEnd, stop } = usePointerSwipe(targetEnd, {
  threshold: 0,
  onSwipeStart() {
    disableTaskCreation.value = true
    initialHeight.value = durationInPixels.value
    disableDialog.value = true
    startScroll.value = scrollbarInfo.scrollbarPosY.value
  },
  onSwipe() {
    if (!startDate.value || !endDate.value)
      return
    const scrollOffset = startScroll.value - scrollbarInfo.scrollbarPosY.value
    const remainingDistance = initialHeight.value - distanceYEnd.value - scrollOffset
    let remainingMinutes = convertPixelToMinutes(remainingDistance < timelogSettings.minimumDistance ? timelogSettings.minimumDistance : remainingDistance)
    remainingMinutes = Math.round(remainingMinutes / snapValue.value) * snapValue.value
    if (remainingMinutes < snapValue.value)
      remainingMinutes = snapValue.value
    const newEnd = add(startDate.value, {
      hours: Math.floor(remainingMinutes / 60), minutes: (remainingMinutes % 60),
    })
    if (isAfter(newEnd, endOfDay(todayDate.value)))
      isTommorow.value = true
    timelog.value.end = format(newEnd, timeFormat)
    timelog.value.duration = Temporal.Duration.from(intervalToDuration({ start: startDate.value, end: endDate.value })).toString()
    isTommorow.value = false
  },
  onSwipeEnd() {
    enableDialogsAfterDelay()
  },
})

const initialStart = ref<Date>()
const initialEnd = ref<Date>()
const isMovingStart = ref(false)
const minimumStartMinutes = ref(0)
const actualTopPosition = ref(0)

const { distanceY: distanceYStart } = usePointerSwipe(targetStart, {
  threshold: 0,
  onSwipeStart() {
    isMovingStart.value = true
    initialStart.value = startDate.value
    initialEnd.value = endDate.value
    disableDialog.value = true
    disableTaskCreation.value = true
    const { hours, minutes } = Temporal.Duration.from(timelog.value.duration)
    minimumStartMinutes.value = -1 * ((hours * 60) + minutes) + (snapValue.value < convertPixelToMinutes(timelogSettings.minimumDistance) ? convertPixelToMinutes(timelogSettings.minimumDistance) : snapValue.value)
    startScroll.value = scrollbarInfo.scrollbarPosY.value
    actualTopPosition.value = topPosition.value ?? 0
  },
  onSwipe() {
    if (!initialStart.value || !initialEnd.value)
      return
    const scrollOffset = startScroll.value - scrollbarInfo.scrollbarPosY.value
    const maximumMinutesToAdd = convertPixelToMinutes(actualTopPosition.value)
    let minutesToAdd = convertPixelToMinutes(distanceYStart.value + scrollOffset)
    // blocking timelog minimum size to snapValue or 10 minutes
    if (minutesToAdd < minimumStartMinutes.value)
      minutesToAdd = minimumStartMinutes.value

    // Blocking timelog mximum size to startTime 00:00
    if (minutesToAdd > maximumMinutesToAdd)
      minutesToAdd = maximumMinutesToAdd

    const newStartDate = subMinutes(initialStart.value, minutesToAdd)
    const snappedDate = roundToNearestMinutes(newStartDate, { nearestTo: snapValue.value })
    timelog.value.start = format(snappedDate, timeFormat)
    timelog.value.duration = Temporal.Duration.from(intervalToDuration({ start: snappedDate, end: initialEnd.value })).toString()
  },
  onSwipeEnd() {
    enableDialogsAfterDelay()
    isMovingStart.value = false
  },
})

const { distanceX: distanceXJob, distanceY: distanceYJob } = usePointerSwipe(jobBlock, {
  threshold: 0,
  onSwipeStart() {
    initialStart.value = startDate.value
    startScroll.value = scrollbarInfo.scrollbarPosY.value
    disableTaskCreation.value = true
  },
  onSwipe() {
    disableDialog.value = true
    const scrollOffset = startScroll.value - scrollbarInfo.scrollbarPosY.value
    const distanceDuration = convertPixelToMinutes(distanceYJob.value + scrollOffset)
    const newStartDate = subMinutes(initialStart.value!, distanceDuration)
    const snappedDate = roundToNearestMinutes(newStartDate, { nearestTo: snapValue.value })
    timelog.value.start = format(snappedDate, timeformat)
  },
  onSwipeEnd() {
    enableDialogsAfterDelay()
  },
})

const htmlRefHook = ref<HTMLElement | null>(null)

// function onLongPressedCallback(e: PointerEvent) {
//   disableDialog.value = true
//   console.log('j\'ai presse longtemps')
// }

// onLongPress(htmlRefHook, onLongPressedCallback)

watch(() => timelog.value.start, (newValue, oldValue) => {
  if (!oldValue || !endDate.value || isMovingStart.value)
    return
  console.log('heelo')
  const oldValueParsed = parse(oldValue, timeFormat, todayDate.value)
  const previousDuration = intervalToDuration({ start: oldValueParsed, end: endDate.value })
  if (!newValue)
    return
  const newEnd = add(parse(newValue, timeFormat, todayDate.value), previousDuration ?? {})
  if (isAfter(newEnd, endOfDay(todayDate.value))) {
    console.log('jour suivant')
    timelog.value.end = '23:59'
  }
  const newEndFormatted = format(newEnd, timeFormat)
  timelog.value.end = newEndFormatted
})

watch(() => timelog.value.end, (newValue) => {
  if (!newValue || !startDate.value)
    return

  const newValueParsed = parse(newValue, timeFormat, todayDate.value)
  // console.log(newValueParsed)

  // @TODO ici la condition n'est pas exacte nous sommes limité sur un seule jour
  // apres le monday 21 aout a 23:59 nous avons le monday 21 aout 00:00
  // cela est du a la variable endDate qui est un computed de timelog.value.end
  if (isBefore(newValueParsed, startDate.value))
    timelog.value.end = '23:59'

  if (nextTimelog?.start) {
    const nextTimelogStartParsed = parse(nextTimelog.start, timeFormat, todayDate.value)

    if (isAfter(newValueParsed, nextTimelogStartParsed))
      nextTimelog.start = newValue
  }

  timelog.value.duration = Temporal.Duration.from(intervalToDuration({
    start: parse(timelog.value.start!, 'HH:mm', todayDate.value),
    end: parse(timelog.value.end!, 'HH:mm', todayDate.value),
  })).toString()
})

watchDebounced(timelog,
  () => {
    timelogDataStore.changedTimelogs.set(timelog.value._key, timelog.value)
  }, {
    deep: true,
    debounce: 1000,
  })

async function tashJob() {
  // @ TODO ameliorer le systeme de trash il y a deux probleme
  // le premier est parce que les data creer depuis aquarium ne possede pas de nobsData start et end
  // ensuite le deuxieme sur les job creer depuis lápplication est surrement cause  par la condition ligne ligne 270
  // mais pas encore sur
  const timelogs = timelogDataStore.timelogsPerDay.get(props.dayDate)
  if (!timelogs)
    return
  const response = await aqApi.aq.trash(timelog.value._key)
  if (!response)
    return
  if (timelogs?.length <= 1) {
    timelogDataStore.timelogsPerDay.set(props.dayDate, [])
    return
  }
  const idx = timelogs?.findIndex(v => v._key === timelog.value._key)
  console.log(idx)
  timelogs?.forEach(v => console.log(v))
  if (idx == null)
    return
  timelogs?.splice(idx, 1)
}

// const scrollHook = ref<HTMLElement | null>(null)

// const scrollbar = useScroll(scrollHook)

// const dragHook = ref<HTMLElement | null>(null)

// const { x, y } = useDraggable(dragHook, {
//   initialValue: { x: 0, y: topPosition.value },
//   onMove() {
//     if (y.value < 0)
//       y.value = 0
//     const start = convertPixelToMinutes(y.value)
//     const hours = Math.floor(start / 60)
//     const minutes = Math.floor(start % 60)
//     const startFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
//     console.log(startFormatted)
//     timelog.value.start = startFormatted
//   },
// })
</script>

<template>
  <div v-if="!isHide" :style="{ top: `${topPosition}px` }" pointer-events-auto absolute flex gap-5>
    <div flex="~ col" items-center>
      <div ref="targetStart" b="~ solid 2 transparent" absolute h-3 w-full rounded-t-2 bg-transparent bg-clip-content hover:cursor-n-resize hover:bg-blue />
      <div
        ref="jobBlock" b="~ solid 2 blue-950" :style="{
          height: `${durationInPixels}px`,
        }" flex="~ col" w-50 rounded-2 from-blue-900 to-blue-950 bg-gradient-to-b p-2
      >
        <div div i-ic-baseline-delete absolute right-0 top-0 mr2 mt2 h-5 w-5 @click="tashJob" />
        <div ref="htmlRefHook" h-full w-full flex="~ col" items-center justify-center hover:cursor-pointer @click.prevent.stop="showTaskInfoDialog">
          <div select-none text-center text-lg>
            {{ timelog.parentName }}
          </div>
          <div v-if="shouldDisplayTitle" select-none text-center text-lg>
            {{ timelog.title }}
          </div>
          <div select-none text-8 font-mono>
            {{ durationFormatted }}
          </div>
        </div>
      </div>
      <div ref="targetEnd" b="~ solid 2 transparent" relative h-3 w-full translate-y--3 rounded-b-2 bg-transparent bg-clip-content hover:cursor-n-resize hover:bg-blue />
    </div>
  </div>
  <NModal v-model:show="dialogShown">
    <TimelogEditDialog
      v-model:timelog="timelog"
      v-model:dialogShown="dialogShown"
      v-model:isTrash="isTrash"
    />
  </NModal>
</template>

<style scoped>

</style>
