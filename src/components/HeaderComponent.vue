<script setup lang="ts">
import { add, format, parse, sub } from 'date-fns'
import { computed, ref } from 'vue'
import { NButton, NDropdown, NIcon, NSlider } from 'naive-ui'
import { usePixelRatio } from '~/composables/pixelRatio'
import { useSnap } from '~/composables/snap'

const { globalScale, resetGlobalScale } = usePixelRatio()
const { snapMarks, snapValue } = useSnap()

const today = new Date()
const dateStore = useDateStore()
const dayFormatFull = ('EEEE dd MMMM yyyy')
const todayDate = computed(() => format(today, dayFormatFull))
const isDark = useDark()
const toggleDark = useToggle(isDark)

function selectToday() {
  dateStore.dayFormated = format(today, dateStore.dayFormat)
}

function addWeek() {
  const dayParsed = parse(dateStore.dayFormated, dateStore.dayFormat, today)
  const oneWeek = ref<Duration>({ weeks: 1 })
  const dayNextWeek = add(dayParsed, oneWeek.value)
  dateStore.dayFormated = format(dayNextWeek, dateStore.dayFormat)
}

function substractWeek() {
  const dayParsed = parse(dateStore.dayFormated, dateStore.dayFormat, today)
  const oneWeek = ref<Duration>({ weeks: 1 })
  const dayNextWeek = sub(dayParsed, oneWeek.value)
  dateStore.dayFormated = format(dayNextWeek, dateStore.dayFormat)
}

function handleSelect(key: string | number) {
  snapValue.value = key
}
</script>

<template>
  <div flex="~ row" items-center gap4>
    <div flex flex-1 gap-2>
      <NButton type="primary" :title="todayDate" ghost @click="selectToday">
        Today
      </NButton>
      <NButton type="primary" ghost circle @click="substractWeek">
        <span i-material-symbols-arrow-back-ios-new text-center />
      </NButton>
      <NButton type="primary" circle ghost @click="addWeek">
        <NIcon i-material-symbols-arrow-forward-ios />
      </NButton>
    </div>

    <div flex-1 text-center text-2xl>
      {{ todayDate }}
    </div>

    <div flex flex-1 items-center justify-end gap-2>
      <p>
        Snap:
      </p>

      <NDropdown v-model:value="snapValue" trigger="hover" :options="snapMarks" @select="handleSelect">
        <NButton> {{ snapValue }} </NButton>
      </NDropdown>
      <!-- <NSlider v-model:value="snapValue" :default-value="1" :marks="snapMarks" step="mark" :max="60" /> -->

      <p>
        Zoom:
      </p>
      <NButton text style="font-size: 24px" @click="resetGlobalScale">
        <span i-material-symbols-undo />
      </NButton>
      <div min-w-30>
        <NSlider v-model:value="globalScale" color="#0ea5e9" :min="0" :max="2" :default-value="1" :step="0.1" />
      </div>
      <NButton type="primary" ghost circle @click="toggleDark()">
        <div i-material-symbols-dark-mode-outline-rounded />
      </NButton>
      <NButton type="primary" ghost circle>
        <div i-icon-park-outline-config />
      </NButton>
    </div>
  </div>
</template>
