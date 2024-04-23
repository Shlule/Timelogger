import type { JsonObject } from 'type-fest'

const AqTypes = {
  Job: 'Job',
  Asset: 'Asset',
} as const
type AqType = typeof AqTypes[keyof typeof AqTypes]

interface Query {
  query: string
  aliases: {
    [key: string]: unknown
    view: JsonObject
  }
}

function query<T = unknown>(q: Query) {
  const response = {
    _key: 'asdasd',
    type: AqTypes.Asset,
    data: {
      asd: 1,
      name: 'asasd',
    },
  }

  type ReturnType = typeof q.aliases.view[keyof typeof q.aliases.view]
  return response as unknown as ReturnType
}

interface QueriedJob {
  _key: string
  parentName: string
  nobsData: {
    start: string
    end: string
  }
}
const asd = query<QueriedJob>({
  query: '',
  aliases: {
    view: {
      asd: 'asd',
    },
  },
})

asd
