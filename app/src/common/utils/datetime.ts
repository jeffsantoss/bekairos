import { DATE_TIME_FORMAT } from '@common/constants'
import moment from 'moment'

export const dateTimeToString = (timestamp: number): string => {
  return moment(timestamp).format(DATE_TIME_FORMAT)
}

export const stringDateTimeToTimestamp = (dateTime: string): number => {
  return moment(dateTime, DATE_TIME_FORMAT).valueOf()
}
