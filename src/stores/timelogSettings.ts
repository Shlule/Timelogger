import { acceptHMRUpdate, defineStore } from 'pinia'

export const useTimelogSettingsStore = defineStore('timelogSettings', () => {
  const { convertMinutesToPixel, convertPixelToMinutes } = usePixelRatio()

  const minimumDuration = ref(10)
  const minimumDistance = computed({
    get() {
      return convertMinutesToPixel(minimumDuration.value)
    },
    set(newDistance) {
      minimumDuration.value = convertPixelToMinutes(newDistance)
    },
  })

  const displayTitleMaximumDuration = ref<Duration>({ hours: 0, minutes: 30 })

  const timelogColor = ref('#1e40af')
  const timelogOvertimeColor = ref('#9d174d')

  const workingHoursPerDay = ref<Duration>({ hours: 7, minutes: 0 })

  return {
    minimumDistance,
    displayTitleMaximumDuration,
    timelogColor,
    timelogOvertimeColor,
    workingHoursPerDay,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTimelogSettingsStore, import.meta.hot))
