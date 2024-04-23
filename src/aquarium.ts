import ky from 'ky'
import type { KyInstance } from 'ky/distribution/types/ky'
import type { AqAppendJobData, AqAppendResponse, AqAuthToken, AqData, AqMe, AqQuery, AquariumOptions } from './types'
import type { AqResponseSignIn } from './endpointTypes'

export class NobsAquarium {
  authToken?: AqAuthToken
  request: KyInstance
  constructor(options: AquariumOptions = {}) {
    const {
      baseUrl = 'https://nobody.aquarium.app',
      version = 'v1',
      token = undefined,
    } = options

    this.authToken = token as AqAuthToken

    this.request = ky.extend({
      prefixUrl: `${baseUrl}/${version}`,
      hooks: {
        beforeRequest: [
          (req) => {
            if (this.authToken)
              req.headers.set('Authorization', this.authToken)
          },
        ],
      },
    })
  }

  async signIn(options: { email: string; password: string }) {
    const body = new URLSearchParams ({ ...options })
    const response = await this.request.post('signin', {
      body,
      throwHttpErrors: false,
    })
    const data = await response.json< AqResponseSignIn & { error?: string }>()

    if (!data)
      return
    if (data.error)
      throw new Error(data.error)
    this.authToken = data.token
    return data
  }

  async query<T>(query: AqQuery) {
    const resp = await this.request.post('query', {
      json: query,
    }).json<T>()
    return resp
  }

  async getMe() {
    const response = await this.request.get('users/me', {
      retry: 0,
    }).json<AqMe>()
    return response
  }

  async traverse<T = unknown>(from: string, query: AqQuery) {
    const response = await this.request.post(`items/${from}/traverse`,
      { json: query }).json<T[]>()
    return response
  }

  async patch<T>(options: { itemKey: string; data: AqData }) {
    const { itemKey, data } = options
    const response = await this.request.patch(`items/${itemKey}`, {
      json: {
        data,
      },
    }).json<T>()
    return response
  }

  async trash<T>(itemKey: string) {
    const response = await this.request.delete(`items/${itemKey}/trash`, {
      json: itemKey,
    }).json<T>()
    return response
  }

  async append<T>(options: { taskKey: string; item: { type: string; data: AqAppendJobData } }) {
    const { taskKey, item } = options
    const response = await this.request.post(`items/${taskKey}/append`, {
      json: {
        item,
      },
    }).json<AqAppendResponse<T>>()
    return response
  }
}
