import { format, parseISO } from 'date-fns'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { Temporal } from '@js-temporal/polyfill'
import type { QueriedJob, Timelog } from '../types'

export const useTimelogDataStore = defineStore('timelogData', () => {
  const aqTimelogs = ref<Timelog[]>([])

  const dateStore = useDateStore()

  const firstDayOfSelectedWeekFornatted = computed(() => format(dateStore.weekStart, 'yyyy-MM-dd'))
  const lastDayOfSelectedWeekFornmatted = computed(() => format(dateStore.weekEnd, 'yyyy-MM-dd'))
  const browserDateData = new Intl.DateTimeFormat().resolvedOptions()
  const timelogsPerDay = ref<Map<string, Timelog[]>>(new Map())
  const changedTimelogs = ref<Map<string, Timelog>>(new Map())
  const timelogToCreate = ref<Timelog>()

  const aqApiStore = useAqAPIStore()

  watch(() => dateStore.week, async () => {
    // @ TODO  faire en sorte que qápres línitialisation des donnes start et end des timelog envoyer les donner sur aquarium

    const shouldPatchInitialNobsData = false
    const timelogs = await aqApiStore.aq.query<QueriedJob[]>({
      query: `# 0,10000 (item.type == \'Job\'  AND item.data.performedBy == 
      "512381610" AND NOT(item.data.performedAt < \'${firstDayOfSelectedWeekFornatted.value}\
      ' OR item.data.performedAt > \'${lastDayOfSelectedWeekFornmatted.value}\') ) 
      SET $set SORT item.data.performedAt ASC VIEW $view`,
      aliases: {
        set: {
          parents: '# <($Child, 2)- 0,2 * SORT LENGTH(path.vertices) VIEW item',
        },
        view: {
          _key: 'item._key',
          performedAt: 'item.data.performedAt',
          duration: 'item.data.duration',
          comment: 'item.data.comment',
          type: 'item.type',
          name: 'item.data.name',
          nobsStart: 'item.data.nobsData.start',
          nobsEnd: 'item.data.nobsData.end',
          parentName: 'parents[0].data.name',
        },
      },
    })
    // for (const t of timelogs) {
    //   if (t.nobsStart == null || t.nobsEnd == null)
    //     shouldPatchInitialNobsData = true
    // }
    aqTimelogs.value = timelogs.map(timelog => ({
      _key: timelog._key,
      performedAt: timelog.performedAt,
      title: timelog.name,
      duration: timelog.duration,
      start: timelog.nobsStart,
      end: timelog.nobsEnd,
      parentName: timelog.parentName,
    } as Timelog))

    const days = new Map<string, Timelog[]>()
    for (const day of dateStore.week)
      days.set(format(day, 'EEEE:dd:MM:yyyy'), [])
    console.log(aqTimelogs.value.length)
    if (aqTimelogs.value.length < 1) {
      timelogsPerDay.value.clear()
      for (const [day, timelogs] of days)
        timelogsPerDay.value.set(day, timelogs)
      return
    }
    const startOfDay = Temporal.Instant
      .from(aqTimelogs.value[0].performedAt)
      .toZonedDateTime({
        calendar: browserDateData.calendar,
        timeZone: browserDateData.timeZone,
      })
      .startOfDay()
      .add({ hours: 10 })

    let currentTime = startOfDay
    let currentStart: string
    for (const timelog of aqTimelogs.value) {
      const day = format(parseISO(timelog.performedAt), 'EEEE:dd:MM:yyyy')
      const currentDayTimelogs = days.get(day) || days.set(day, []).get(day)!
      if (currentDayTimelogs.length === 0) {
        currentTime = Temporal.Instant
          .from(timelog.performedAt)
          .toZonedDateTime({
            calendar: browserDateData.calendar,
            timeZone: browserDateData.timeZone,
          })
          .startOfDay()
          .add({ hours: 10 })
      }
      const lastTimelog = currentDayTimelogs.at(-1)
      const lastEnd = lastTimelog?.end
      if (lastEnd)
        currentStart = lastEnd
      else
        currentStart = '10:00'

      if (!timelog.start)
        timelog.start = currentStart
      currentTime = currentTime.add(timelog.duration)
      if (!timelog.end)
        timelog.end = format(currentTime.epochMilliseconds, 'HH:mm')
      currentDayTimelogs.push(timelog)
    }

    timelogsPerDay.value.clear()
    for (const [day, timelogs] of days)
      timelogsPerDay.value.set(day, timelogs)
  }, {
    immediate: true,
  })

  watchDebounced(changedTimelogs,
    () => {
      if (changedTimelogs.value.size < 1)
        return
      for (const timelog of changedTimelogs.value.values())
        aqApiStore.aq.patch({ itemKey: timelog._key, data: { name: timelog.title, duration: timelog.duration, performedAt: timelog.performedAt, nobsData: { start: timelog.start, end: timelog.end } } })

      changedTimelogs.value.clear()
    }, {
      deep: true,
      debounce: 1000,
    })

  return {
    timelogsPerDay,
    changedTimelogs,
    timelogToCreate,
    firstDayOfSelectedWeekFornatted,
  }

  // function addTimelog() {
  //   timelogsPerDay.value.set('Monday:14:08:2023',{_key: 'test', })
  // }

  // watchDebounced(timelogToAdd, () => {
  //   if (timelogToAdd.value.size < 1)
  //     return
  //   for(const timelog of timelogToAdd.value.values())
  //     aqApiStore.append
  // })

  // timelogToAdd.value.clear()
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTimelogDataStore, import.meta.hot))
