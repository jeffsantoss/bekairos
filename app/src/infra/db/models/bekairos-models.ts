import { Entity } from 'dynamodb-onetable'
import { beKairosSchema } from '../schemas/bekairos-schema'

export type PartnerEntity = Entity<typeof beKairosSchema.models.Partner>
export type PartnerServiceEntity = Entity<typeof beKairosSchema.models.PartnerService>
export type PartnerMemberEntity = Entity<typeof beKairosSchema.models.PartnerMember>
export type ScheduleEntity = Entity<typeof beKairosSchema.models.Schedule>
export type UserDetailsEntity = Entity<typeof beKairosSchema.models.UserDetails>
export type TicketEntity = Entity<typeof beKairosSchema.models.Ticket>
export type UserFavoriteAffiliateEntity = Entity<typeof beKairosSchema.models.UserFavoritePartner>
export type ReviewEntity = Entity<typeof beKairosSchema.models.Review>
export type SpecialtyEntity = Entity<typeof beKairosSchema.models.Specialty>
