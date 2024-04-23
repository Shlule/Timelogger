import { acceptHMRUpdate, defineStore } from 'pinia'
import { NobsAquarium } from '../aquarium'
import type { AqAuthToken } from '../types'

export const useAqAPIStore = defineStore('AqApiStore', () => {
  const token = useStorage<AqAuthToken | undefined>('_TOKEN', undefined)
  const aq = new NobsAquarium({
    baseUrl: 'https://nobody.aquarium.app',
    version: 'v1',
    token: token.value,
  })

  // const token = ref<AqAuthToken>()

  watch(token, (newToken) => {
    aq.authToken = newToken
  })

  async function signIn(options: { email: string; password: string }) {
    const response = await aq.signIn(options)
    if (!response)
      return undefined
    token.value = response.token
  }

  const me = ref()

  watch(token, async () => me.value = await aq.getMe(), { immediate: true })

  return { aq, signIn, me }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAqAPIStore, import.meta.hot))

// import { acceptHMRUpdate, defineStore } from 'pinia'
// import type { Options } from 'ky'
// import ky from 'ky'
// import type { AqAppendJobData, AqAuthToken, AqData, AqQuery } from '../types'
// import type { AqResponseSignIn } from '../endpointTypes'

// export const useAqAPIStore = defineStore('aqApiStore', () => {
//   // @TODO: Faudra changer ça!
//   // const token = ref<string>('eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmYXRmaXNoIiwic3ViIjoiNTEyMzgxNjEwIiwiZW1haWwiOiJlbG91YW5Abm9ib2R5LXN0dWRpby5jb20iLCJhdWQiOiJodHRwczovL25vYm9keS5hcXVhcml1bS5hcHAiLCJleHAiOjE2OTM0MDYyMjAsImlhdCI6MTY5MjgwMTQzNiwibmJmIjoxNjkyODAxNDM2LCJqdGkiOiI0ZDk1MTBjNC0wZGY1LTQxM2ItYWUzZS00NDllMzg0YjI3MzYiLCJkb21haW4iOiJub2JvZHkifQ.A55p46ab0jxYtTc_Ep5f8TPUEA7A3-QSt8m9I4u7unaC42joRxW-wRDM-iYPlxmnHhvC4J8zLE-7-M1GHU2C5A')

//   let token = useStorage<AqAuthToken | undefined>('_TOKEN', undefined)

//   const apiConfig = computed(() => {
//     return {
//       prefixUrl: 'http://nobody.aquarium.app/v1',
//       headers: {
//         Authorization: token.value,
//       },
//     } as Options
//   })
//   const api = ky.create(apiConfig.value)

//   const me = ref()

//   watch(token, async () => me.value = await getMe(), { immediate: true })

//   async function signIn(options: { email: string; password: string }) {
//     const body = new URLSearchParams({ ...options })
//     const response = await api.post('signin', {
//       body,
//       throwHttpErrors: false,
//     })

//     const data = await response.json<AqResponseSignIn & { error?: string }>()

//     if (!data)
//       return

//     if (data.error)
//       throw new Error(data.error)

//     token = data.token

//     return data
//   }

//   async function query<T>(query: AqQuery) {
//     const resp = await api.post('query', {
//       json: query,
//     }).json<T>()
//     return resp
//   }

//   async function getMe() {
//     const response = await api.get('users/me').json()
//     return response
//   }

//   async function traverse<T = unknown>(from: string, query: AqQuery) {
//     const response = await api.post(`items/${from}/traverse`,
//       { json: query }).json<T[]>()
//     return response
//   }

//   async function patch<T>(options: { itemKey: string; data: AqData }) {
//     const { itemKey, data } = options
//     const response = await api.patch(`items/${itemKey}`, {
//       json: {
//         data,
//       },
//     }).json<T>()
//     return response
//   }

//   async function trash<T>(itemKey: string) {
//     const response = await api.delete(`items/${itemKey}/trash`, {
//       json: itemKey,
//     }).json<T>()
//     return response
//   }

//   interface AqAppendResponse<T> {
//     item: {
//       _key: string
//       type: string
//       data: T
//     }
//     edge: unknown
//   }
//   async function append<T>(options: { taskKey: string; item: { type: string; data: AqAppendJobData } }) {
//     const { taskKey, item } = options
//     const response = await api.post(`items/${taskKey}/append`, {
//       json: {
//         item,
//       },
//     }).json<AqAppendResponse<T>>()
//     return response
//   }

//   return {
//     query,
//     patch,
//     trash,
//     append,
//     getMe,
//     me,
//     traverse,
//     signIn,
//   }
// })

// if (import.meta.hot)
//   import.meta.hot.accept(acceptHMRUpdate(useAqAPIStore, import.meta.hot))
