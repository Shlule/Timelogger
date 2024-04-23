import type { JsonObject, Opaque } from 'type-fest'

export interface TimelogBlockProps {
  title: string
  start: string
  end: string
  duration?: Duration
}

export interface MyPosition {
  x: number
  y: number
}
export interface AqAppendResponse<T> {
  item: {
    _key: string
    type: string
    data: T
  }
  edge: unknown
}

export interface AqAppendJobData {
  duration: string
  name: string
  performedAt: string
  performedBy: string
  nobsData: JsonObject
}

export interface AqAppend {
  type: string
  data: JsonObject
  apply_template?: boolean
  template_key?: string
  path?: string
}
export interface AqData {
  name: string
  [key: string]: unknown
}

export interface AqJobData extends AqData {
  email: string
}

export interface AqQuery {
  query: string
  aliases?: JsonObject
}
export interface Timelog {
  _key: string
  title: string
  start?: string
  end?: string
  duration: string
  performedAt: ISODate
}

export interface QueriedJob {
  _key: string
  performedAt: ISODate
  duration: ISODuration
  name: string
  nobsStart?: string
  nobsEnd?: string
  parentName: string
}

export const AqItemTypes = {
  Alias: 'Alias',
  Asset: 'Asset',
  Comment: 'Comment',
  Episode: 'Episode',
  File: 'File',
  Filter: 'Filter',
  Group: 'Group',
  Library: 'Library',
  Media: 'Media',
  Note: 'Note',
  Organisation: 'Organisation',
  Project: 'Project',
  Properties: 'Properties',
  Report: 'Report',
  Sequence: 'Sequence',
  Shot: 'Shot',
  Task: 'Task',
  Template: 'Template',
  Text: 'Text',
  Timesheet: 'Timesheet',
  Trash: 'Trash',
  Url: 'Url',
  User: 'User',
  Usergroup: 'Usergroup',
  Users: 'Users',
  Version: 'Version',
  View: 'View',
  Whiteboard: 'Whiteboard',
} as const

export type AqItemType = typeof AqItemTypes[keyof typeof AqItemTypes]

export type AqAuthToken = Opaque<string, 'AqAuthToken'>
export type ISODuration = Opaque<string, 'ISODuration'>
export type ISODate = Opaque<string, 'ISODate'>
export type AqKey = Opaque<string, 'AqKey'>
export type AqID = Opaque<string, 'AqID'>
export type AqRev = Opaque<string, 'AqRev'>
export type AqDate = Opaque<string, 'AqDate'>
export type AqUUID = Opaque<string, 'AqUUID'>

export interface AquariumOptions {
  baseUrl?: string
  version?: string
  token?: AqAuthToken | string
}

export interface _AqBaseData {
  _id: AqID
  _key: AqKey
  _rev: AqRev
  type: AqItemType
  createdAt: AqDate
  createdBy: AqKey
  data: AqData
  updatedAt: AqDate
  updatedBy: AqKey
  uuid: AqUUID
}
export interface AqUser extends _AqBaseData {
  type: typeof AqItemTypes.User
  data: AqData & {
    email: string
  }
}
