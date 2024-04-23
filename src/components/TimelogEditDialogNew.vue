<!-- eslint-disable unused-imports/no-unused-imports -->

<script setup lang="ts">
import { NButton, NInput, NTimePicker } from 'naive-ui'

const props = defineProps<{

  dialogShown: boolean
}>()

const emit = defineEmits(['update:title', 'update:startFormatedTime', 'update:durationFormated', 'update:endFormatedTime'])

const timelogData = useTimelogStore()

const dialogShown = useVModel(props, 'dialogShown', emit)
const timeFormat = 'HH:mm'

function showDialog() {
  dialogShown.value = !dialogShown.value
}
</script>

<template>
  <NDialog @close="showDialog">
    <div m-3 flex justify-End gap-3>
      <NButton circle color="#FF3D20" />
      <NButton circle color="#90FF2A" />
    </div>
    <div ml-2 w-40>
      <NInput v-model:value="timelogData.title" type="text" placeholder="Title" />
    </div>

    <div flex items-center gap-1>
      <div>Start:</div>
      <NTimePicker v-model:formatted-value="timelogData.startTimeFormated" :format="timeFormat" />
    </div>

    <div flex items-center gap-1>
      <div>End:</div>
      <NTimePicker v-model:formatted-value="timelogData.endTime" :format="timeFormat" />
    </div>

    <div flex items-center gap-1>
      <div>Duration:</div>
      <NTimePicker v-model:formatted-value="timelogData.durationFormated" :format="timeFormat" />
    </div>
  </NDialog>
</template>
