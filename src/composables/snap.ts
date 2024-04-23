export const useSnap = createSharedComposable(() => {
  // const clampValue = ref(1)
  const snapValue = useStorage('minutesClamp', 1)
  const snapMarks = [
    {
      label: '1 min',
      key: 1,
    },
    {
      label: '5 min',
      key: 5,
    },
    {
      label: '10 min',
      key: 10,
    },
    {
      label: '15 min',
      key: 15,
    },
    {
      label: '20 min',
      key: 20,
    },
    {
      label: '30 min',
      key: 30,
    },
    {
      label: '1 heure',
      key: 60,
    },

  ]

  // const snapMarks = {
  //   1: '1 ',
  //   5: '5 ',
  //   10: '10 ',
  //   15: '15 ',
  //   20: '20 ',
  //   30: '30 ',
  //   60: '1 heure',
  // }
  return {
    snapMarks,
    snapValue,
  }
})
