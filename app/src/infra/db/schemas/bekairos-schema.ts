import { EntityStatus, TicketStatus } from '@common/constants'
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
        required: false
      },
      photo: { type: String, required: false },
      createdAt: { type: Number, required: true },
      status: { type: String, default: 'active', enum: Object.values(EntityStatus) },

      gs1pk: { type: String, value: 'partner:specialty:${specialtyId}' },
      gs1sk: { type: String, value: 'partner:specialty:' },

      gs2pk: { type: String, value: 'partner:${status}' },
      gs2sk: { type: String, value: 'partner:${createdAt}' }
    },
    PartnerService: {
      pk: { type: String, value: 'partner-service:${id}' },
      sk: { type: String, value: 'partner-service:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      name: { type: String, required: true },
      partnerId: { type: String, required: true },
      price: { type: Number, required: false },
      description: { type: String, required: false },

      gs1pk: { type: String, value: 'partner-service:${partnerId}' },
      gs1sk: { type: String, value: 'partner-service:' }
    },
    PartnerMember: {
      pk: { type: String, value: 'partner-member:${partnerId}}' },
      sk: { type: String, value: 'partner-member:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      userId: { type: String, required: true },
      partnerServiceId: { type: String, required: true },
      partnerId: { type: String, required: true },
      name: { type: String, required: true },

      gs1pk: { type: String, value: 'partner-member:${partnerServiceId}' },
      gs1sk: { type: String, value: 'partner-member:' }
    },
    Schedule: {
      pk: { type: String, value: 'schedule:${id}' },
      sk: { type: String, value: 'schedule:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      partnerServiceId: { type: String, required: true },
      start: { type: Number, required: true },
      end: { type: Number, required: true },
      interval: { type: Number, required: true },
      startEndPerServiceUk: { type: String, value: 'schedule:${partnerServiceId}:${start}:${end}', unique: true },

      gs1pk: { type: String, value: 'schedule:${specialtyId}' },
      gs1sk: { type: String, value: 'schedule' },

      gs2pk: { type: String, value: 'schedule:${partnerServiceId}' },
      gs2sk: { type: String, value: 'schedule' }
    },
    UserDetails: {
      pk: { type: String, value: 'user-details:${id}' },
      sk: { type: String, value: 'user-details:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      name: { type: String, required: true },
      phone: { type: String, required: true }
    },
    Ticket: {
      pk: { type: String, value: 'ticket:${userId}:${id}' },
      sk: { type: String, value: 'ticket:' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      userId: { type: String, required: true },
      scheduleId: { type: String, required: true },
      status: { type: String, enum: Object.keys(TicketStatus), default: TicketStatus.SCHEDULED },

      gs1pk: { type: String, value: 'ticket:${userId}:${scheduleId}' },
      gs1sk: { type: String, value: 'ticket' }
    },
    UserFavoritePartner: {
      pk: { type: String, value: 'user-favorite-partner:${userId}:${scheduleId}' },
      sk: { type: String, value: 'user-favorite-partner:' },
      userId: { type: String, required: true },
      partnerId: { type: String, required: true }
    },
    Review: {
      pk: { type: String, value: 'review:${id}' },
      sk: { type: String, value: 'review:$' },
      id: { type: String, generate: 'uuid', validate: Matcher.uuid },
      description: { type: String, required: true },
      partnerId: { type: String, required: true },
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
      name: { type: String, required: true, unique: true },
      description: { type: String, required: false },

      gs1pk: { type: String, value: 'specialty:' },
      gs1sk: { type: String, value: 'specialty:${name}' }
    }
  }
}

export const BeKairosModels = {
  Partner: 'Partner',
  PartnerService: 'PartnerService',
  Schedule: 'Schedule',
  UserDetails: 'UserDetails',
  PartnerMember: 'PartnerMember',
  Ticket: 'Ticket',
  UserFavoritePartner: 'UserFavoritePartner',
  Specialty: 'Specialty',
  Review: 'Review'
}
