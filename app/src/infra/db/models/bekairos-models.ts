import { Entity } from 'dynamodb-onetable'
import { beKairosSchema } from '../schemas/bekairos-schema'

export type AffiliateEntity = Entity<typeof beKairosSchema.models.Affiliate>
export type AffiliateServiceEntity = Entity<typeof beKairosSchema.models.AffiliateService>
export type ScheduleEntity = Entity<typeof beKairosSchema.models.Schedule>
export type UserDetailsEntity = Entity<typeof beKairosSchema.models.UserDetails>
export type UserScheduleEntity = Entity<typeof beKairosSchema.models.UserSchedule>
export type UserFavoriteAffiliateEntity = Entity<typeof beKairosSchema.models.UserFavoriteAffiliate>
export type ReviewEntity = Entity<typeof beKairosSchema.models.Review>
export type SpecialtyEntity = Entity<typeof beKairosSchema.models.Specialty>
