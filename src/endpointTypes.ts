import type { AqAuthToken, AqUser } from './types'

export interface AqResponseSignIn {
  token: AqAuthToken
  user: AqUser
}
