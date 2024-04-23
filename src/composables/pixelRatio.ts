export const usePixelRatio = createSharedComposable(() => {
  const globalScale = ref(1)
  const pixelToMinute = 1.5
  function resetGlobalScale() {
    globalScale.value = 1
  }
  function convertHoursToPixels(hours: number) {
    return hours * pixelToMinute * 60 * globalScale.value
  }
  function convertMinutesToPixel(minutes: number) {
    return minutes * (pixelToMinute * globalScale.value)
  }
  function convertPixelToMinutes(pixel: number) {
    return pixel / (pixelToMinute * globalScale.value)
  }
  return {
    pixelToMinute,
    globalScale,
    convertHoursToPixels,
    convertMinutesToPixel,
    convertPixelToMinutes,
    resetGlobalScale,
  }
})
