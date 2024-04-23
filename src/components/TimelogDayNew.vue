<script setup lang="ts">
import type { TimelogBlockProps } from '~/types'

const props = defineProps<{
  dayDate: Date
}>()

const timelogs = ref<TimelogBlockProps[]>([])
const previewTimelogs = ref([])

const allTimelogs = computed(() => [...timelogs.value, ...previewTimelogs.value])
onMounted(() => {
  // if (dayName.value !== 'Fri')
  //   return
  timelogs.value = [
    {
      start: '00:00',
      title: 'title',
      end: '02:00',
    },
    {
      start: '02:00',
      title: 'do thing',
      end: '03:00',
    },

  ]
})
</script>

<template>
  <div m0 w-full flex flex-col items-center>
    <TimelogNew v-for=" (i) in allTimelogs" :key="timelog" v-model:timelogs="timelogs" :index="i" />

    <style scoped />
  </div>
</template>
