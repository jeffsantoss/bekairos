import { Matcher } from '@common/validation/matchers'

export const beKairosSchema = {
  version: '0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    gs1: { hash: 'gs1pk', sort: 'gs1sk', project: 'keys', follow: false },
    gs2: { hash: 'gs2pk', sort: 'gs2sk', project: 'keys', follow: false },
    gs3: { hash: 'gs3pk', sort: 'gs3sk', project: 'keys', follow: false },
    gs4: { hash: 'gs4pk', sort: 'gs4sk', project: 'keys', follow: false },
    gs5: { hash: 'gs5pk', sort: 'gs5sk', project: 'keys', follow: false }
  },
  models: {
    Partner: {
      pk: { type: String, value: 'partner:${id}' },
      sk: { type: String, value: 'partner:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      name: { type: String, required: true },
      ownerId: { type: String, required: true },
      specialtyId: { type: String, required: true },
      coordinates: {
        type: Object,
        schema: { latitude: { type: Number, required: true }, longitude: { type: String, required: true } },
        required: false
      },
      address: {
        type: Object,
        schema: {
          uf: { type: String, required: true },
          city: { type: String, required: true },
          cep: { type: String, required: true },
          street: { type: String, required: true },
          streetNumber: { type: String, required: true }
        },
        required: true
      },
      photo: { type: String, required: true },

      gs1pk: { type: String, value: 'partner:specialty:${specialtyId}' },
      gs1sk: { type: String, value: 'partner:specialty:' }
    },
    PartnerService: {
      pk: { type: String, value: 'partner-service:${id}' },
      sk: { type: String, value: 'partner-service:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      name: { type: String, required: true },
      partnerId: { type: String, required: true },
      price: { type: Number, required: false },
      description: { type: String, required: false }
    },
    PartnerMember: {
      pk: { type: String, value: 'partner-member:${affiliateId}}' },
      sk: { type: String, value: 'partner-member:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      userId: { type: String, required: true },
      partnerServiceId: { type: String, required: true },
      partnerId: { type: String, required: true }
    },
    Schedule: {
      pk: { type: String, value: 'schedule:${id}' },
      sk: { type: String, value: 'schedule:' },
      partnerServiceId: { type: String, required: true },
      start: { type: Number, required: true },
      end: { type: Number, required: true }
    },
    UserDetails: {
      pk: { type: String, value: 'user-details:${id}' },
      sk: { type: String, value: 'user-details:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      name: { type: String, required: true },
      phone: { type: String, required: true }
    },
    UserSchedule: {
      pk: { type: String, value: 'user-schedule:${userId}:${scheduleId}' },
      sk: { type: String, value: 'user-schedule:' },
      userId: { type: String, required: true },
      scheduleId: { type: String, required: true }
    },
    UserFavoriteAffiliate: {
      pk: { type: String, value: 'user-favorite-affiliate:${userId}:${scheduleId}' },
      sk: { type: String, value: 'user-favorite-affiliate:' },
      userId: { type: String, required: true },
      affiliateId: { type: String, required: true }
    },
    Review: {
      pk: { type: String, value: 'review:${id}' },
      sk: { type: String, value: 'review:$' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      description: { type: String, required: true },
      affiliateId: { type: String, required: true },
      specialtyId: { type: String, required: true },
      userId: { type: String, required: true },
      score: { type: Number, required: true },

      gs1pk: { type: String, value: 'review:category:${specialtyId}' },
      gs1sk: { type: String, value: 'review:category' }
    },
    Specialty: {
      pk: { type: String, value: 'specialty:${id}' },
      sk: { type: String, value: 'specialty:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      name: { type: String, required: true, unique: true }
    }
  }
}

export const BeKairosModels = {
  Partner: 'Partner',
  PartnerService: 'PatnerService',
  Schedule: 'Schedule',
  ScheduleUser: 'ScheduleUser',
  UserDetails: 'UserDetails',
  UserSchedule: 'UserSchedule',
  UserFavoriteAffiliate: 'UserFavoriteAffiliate',
  Specialty: 'Specialty',
  Review: 'Review'
}
