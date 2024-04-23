<script setup lang="ts">
import { NScrollbar } from 'naive-ui'
import { useScrollbarInfo } from '~/composables/scrollbarInfo'

const timelogDataStore = useTimelogDataStore()
const showCreateJobDialog = ref(false)
const bus = useEventBus<string>('createDialogBus')
const selectedDayRef = ref<string>()
const elementY = ref<number>(0)
function createDialogHook(e: string, options: { selectedDay: string; elementY: number }) {
  selectedDayRef.value = options.selectedDay
  elementY.value = options.elementY
  showCreateJobDialog.value = true
}
const unsubscribe = bus.on(createDialogHook)

const scrollbar = ref<InstanceType<typeof NScrollbar> | HTMLElement | null>(null)
const scrollbarInfo = useScrollbarInfo()

onMounted(() => {
  scrollbarInfo.maximumScrollY.value = (scrollbar.value as InstanceType<typeof NScrollbar>).scrollbarInstRef?.containerRef?.scrollTopMax ?? 0
})

const currentScrollValue = computed(() => {
  if (!scrollbar.value)
    return 0
  return (scrollbar.value as InstanceType<typeof NScrollbar>).scrollbarInstRef?.containerScrollTop ?? 0
})

watch(currentScrollValue, (newCurrentScrollValue) => {
  scrollbarInfo.scrollbarPosY.value = newCurrentScrollValue
  scrollbarInfo.maximumScrollY.value = (scrollbar.value as InstanceType<typeof NScrollbar>).scrollbarInstRef?.containerRef?.scrollTopMax ?? 0
  // console.log(scrollbarInfo.scrollbarPosY.value)
  // console.log(scrollbarInfo.maximumScrollY.value)
  // console.log(scrollbarInfo.ratio.value)
})

// scrollbarPosY.value = y.value
</script>

<template>
  <div w-full flex flex-col gap-5 px5>
    <div flex justify-around>
      <div m0 w-67px flex flex-col items-center justify-center gap-2 />
      <TimelogDayHeader v-for="[day] in timelogDataStore.timelogsPerDay" :key="day" :day-date="day" />
    </div>
    <NScrollbar ref="scrollbar">
      <div relative top-10px z-100 h-full w-full flex>
        <div absolute h-full w-full flex>
          <div m0 w-67px flex flex-col items-center justify-center gap-2 />
          <TimelogDay v-for="[day, jobs] in timelogDataStore.timelogsPerDay" :key="day" :day-date="day" :jobs="jobs" />
        </div>
      </div>
      <TimelogBackground />
    </NScrollbar>
    <NModal v-if="selectedDayRef" v-model:show="showCreateJobDialog">
      <!-- <div>
        <div />

        <NTreeSelect v-model:value="timelogToCreate.taskKey.value" filterable :options="tasks" clearable :default-expand-all="true" />
        <div @click="addTimelogtest">
          button
        </div>
      </div> -->
      <CreateTimelogDialog :selected-day="selectedDayRef" :element-y="elementY" />
    </NModal>
  </div>
</template>

<style scoped></style>
