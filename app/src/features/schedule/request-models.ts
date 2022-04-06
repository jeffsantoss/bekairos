export interface CreateScheduleRequest {
  serviceId: string
  startJourney: number
  endJourney: number
  intervals: IntervalRequest[]
  serviceDurationInMinutes: number
}

export interface IntervalRequest {
  start: number
  end: number
}
