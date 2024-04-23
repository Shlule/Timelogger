<script setup lang="ts">
import { NButton, NInput, NTimePicker } from 'naive-ui'
import { Temporal } from '@js-temporal/polyfill'
import type { Timelog } from '~/stores/timelogData'

const props = defineProps<{

  // durationFormated?: string
  dialogShown: boolean
  isTrash: boolean
  timelog: Timelog
}>()

const emit = defineEmits(['update:title', 'update:startFormatedTime', 'update:durationFormated', 'update:endFormatedTime'])
const timelog = useVModel(props, 'timelog', emit)

// const durationFormated = useVModel(props, 'durationFormated', emit)
const dialogShown = useVModel(props, 'dialogShown', emit)
const isTrash = useVModel(props, 'isTrash', emit)
const timeFormat = 'HH:mm'

function showTimelogEditDialog() {
  dialogShown.value = !dialogShown.value
}

const aqApi = useAqAPIStore()

function timelogTrash() {
  aqApi.trash(timelog.value._key)
  showTimelogEditDialog()
}

const durationTemp = computed({
  get() {
    const asd = Temporal.Duration.from(timelog.value.duration)
    const dsa = `${asd.hours.toString().padStart(2, '0')}:${asd.minutes.toString().padStart(2, '0')}`
    return dsa
  },
  set(newDuration) {
    const [hours, minutes] = newDuration.split(':').map(v => Number.parseInt(v))
    timelog.value.duration = Temporal.Duration.from({
      hours,
      minutes,
    }).toString()
  },
})
</script>

<template>
  <NDialog @close="showTimelogEditDialog">
    <div flex flex-col gap2>
      <div flex justify-End gap-3>
        <NButton ghost circle @click="isTrash = !isTrash">
          <span i-ic-baseline-delete />
        </NButton>
        <NButton circle ghost @click="timelogTrash">
          <span i-icon-park-outline-config />
        </NButton>
      </div>
      <div>
        <div text-center text-18px>
          Title
        </div>
        <NInput v-model:value="timelog.title" text-center text-24px type="text" placeholder="Title" />
      </div>
      <div h15 />

      <div flex gap2>
        <div flex flex-1 items-center justify-between gap1>
          <div justify-center>
            Start:
          </div>
          <NTimePicker v-model:formatted-value="timelog.start" :format="timeFormat" />
        </div>

        <div flex flex-1 items-center justify-between gap1>
          <div justify-center>
            End:
          </div>
          <NTimePicker v-model:formatted-value="timelog.end" :format="timeFormat" />
        </div>
      </div>

      <div gap-1>
        <NTimePicker v-model:formatted-value="durationTemp" text-center text-18px :format="timeFormat" />
      </div>
    </div>
  </NDialog>
</template>
