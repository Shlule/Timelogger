import { add, format, formatRFC3339, parse } from 'date-fns'
import { Temporal } from '@js-temporal/polyfill'
import type { AqAppendJobData } from '~/stores/aqApi'

interface CreateTimelogOptions {
  taskKey: Ref<string>
  timelogName: Ref<string>
  mouseCursorPosY: number
  selectedDay: string
}

export function useCreateTimelog(options: CreateTimelogOptions) {
  // i want to initialize the nobsStart and nobsEnd Variable thanks to the position of
  // the mouse cursor and scrollbar Position.
  // I need the mouse cursor position in timelogDay component.
  // mouseCursorPosY is initialise in timelogDay component but is stock here

  const { convertPixelToMinutes } = usePixelRatio()
  const timelogDatastore = useTimelogDataStore()
  const api = useAqAPIStore()
  const timelogSettings = useTimelogSettingsStore()

  const calculatedNobsStart = computed(() => {
    // I didn't take the value of the scrollbar because mouseCursorPosY already take it
    // const duration = convertPixelToMinutes(options.mouseCursorPosY)
    // const hours = Math.floor(duration / 60)
    // const minutes = Math.floor(duration % 60)
    // return `${hours}:${minutes}`

    return '10:00'
  })
  const dateNobsStart = computed(() => parse(calculatedNobsStart.value, 'HH:mm', Date.now()))

  // I format to ISO because aquarium use Iso format i think is good to keep data coherent.
  const durationIso = Temporal.Duration.from(timelogSettings.workingHoursPerDay).toString()
  const calculatedNobsEnd = computed(() => format(add(dateNobsStart.value, timelogSettings.workingHoursPerDay), 'HH:mm'))

  const performedAt = computed(() => {
    // selectedDay is of this form: "Monday:27:08:2023" -> "EEEE:dd:MM:yyyy"
    // An Aquarium job expects a performedAt value of this form: "2023-08-27T20:17:00Z"
    // We need to transform selectedDay appropriately...
    const dateSelectedDay = parse(options.selectedDay, 'EEEE:dd:MM:yyyy', new Date())
    return formatRFC3339(dateSelectedDay)
  })

  // const newTimelog: Timelog = reactive<Timelog>({
  //   _key: '02020',
  //   title: '',
  //   duration: durationIso,
  //   performedAt: performedAt.value,
  //   start: calculatedNobsStart.value,
  //   end: calculatedNobsEnd.value,

  // })
  watch(() => options?.timelogName.value, () => console.log(options?.timelogName.value))

  async function createJob() {
    const newJob = await api.aq.append<AqAppendJobData>({
      taskKey: options.taskKey.value,
      item: {
        type: 'Job',
        data: {
          duration: durationIso,
          name: options.timelogName.value,
          performedAt: performedAt.value,
          performedBy: api.me.user._key,
          nobsData: {
            start: calculatedNobsStart.value,
            end: calculatedNobsEnd.value,
          },
        },
      },
    })

    timelogDatastore.timelogsPerDay.get(options.selectedDay)?.push({
      _key: newJob.item._key,
      duration: newJob.item.data.duration,
      performedAt: newJob.item.data.performedAt,
      title: newJob.item.data.name,
      end: newJob.item.data.nobsData.end,
      start: newJob.item.data.nobsData.start,
    })
  }

  return {
    createTimelog: createJob,
    performedAt,
    calculatedNobsEnd,
    durationIso,
  }
}
