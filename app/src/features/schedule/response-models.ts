export interface ScheduleResponse {
  service: PartnerServiceResponse
  schedules: AttendanceResponse[]
}

interface AttendanceResponse {
  start: number
  end: number
}

interface PartnerServiceResponse {
  id: string
  name: string
}
