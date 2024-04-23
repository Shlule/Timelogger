import { eachDayOfInterval, endOfWeek, format, parse, startOfWeek } from 'date-fns'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDateStore = defineStore('date', () => {
  const dayFormat = 'EEE:dd:MMMM:yyyy'
  const today = new Date()
  const todayFormated = computed(() => format(today, dayFormat))

  // DayFormated is the variable  that we manipulate
  const dayFormated = ref<string>(todayFormated.value)

  const dayParsed = computed(() => parse(dayFormated.value, dayFormat, today))
  const weekStart = computed(() => startOfWeek(dayParsed.value, { weekStartsOn: 1 }))
  const weekEnd = computed(() => endOfWeek(dayParsed.value, { weekStartsOn: 1 }))
  const week = computed(() => eachDayOfInterval({
    start: weekStart.value,
    end: weekEnd.value,
  }))

  return { week, dayFormat, dayFormated, dayParsed, weekStart, weekEnd }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDateStore, import.meta.hot))
