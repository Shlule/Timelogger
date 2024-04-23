export const useScrollbarInfo = createSharedComposable(() => {
  const scrollbarPosY = ref(0)
  const maximumScrollY = ref(0)
  const ratio = computed(() => {
    // if (maximumScrollY.value <= 0)
    //   return 0
    return scrollbarPosY.value / maximumScrollY.value
  })

  return {
    scrollbarPosY,
    maximumScrollY,
    ratio,
  }
})
