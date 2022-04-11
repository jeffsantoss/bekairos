import { getBeKairosDBConnection } from '@infra/db/db'
import {
  PartnerEntity,
  SpecialtyEntity,
  ReviewEntity,
  UserDetailsEntity,
  PartnerServiceEntity
} from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

export const USER_FIXTURE: UserDetailsEntity = {
  id: v4(),
  name: 'Jefferson Santos de Souza',
  phone: '85986821854'
}

export const specialtyFixture: SpecialtyEntity[] = [
  { id: v4(), name: 'Barbeiro' },
  { id: v4(), name: 'Nutrição' },
  { id: v4(), name: 'Dentista' }
]

export const PARTNER_FIXTURE: PartnerEntity = {
  id: v4(),
  coordinates: {
    latitude: '-27.4398163',
    longitude: '-48.3966226'
  },
  name: 'Barbearia VIP',
  specialtyId: specialtyFixture[0].id,
  ownerId: USER_FIXTURE.id,
  address: {
    uf: 'SC',
    city: 'Florianópolis',
    cep: '88058193',
    street: 'Servidão Maria Tomásia Cabral',
    streetNumber: 31
  },
  photo: 'photo.png'
}

export const PARTNER_SERVICE_FIXTURE: PartnerServiceEntity = {
  description: 'Corte de Cabelo com diversas opções para melhor atender',
  name: 'Corte de Cabelo',
  partnerId: PARTNER_FIXTURE.id,
  price: 25,
  id: v4()
}
export const REVIEWS_FIXTURE: ReviewEntity[] = [
  {
    id: v4(),
    description: 'que serviço pica',
    score: 5,
    partnerId: PARTNER_FIXTURE.id,
    specialtyId: specialtyFixture[0].id,
    userId: USER_FIXTURE.id
  },
  {
    id: v4(),
    description: 'que serviço bosta',
    score: 1,
    partnerId: PARTNER_FIXTURE.id,
    specialtyId: specialtyFixture[0].id,
    userId: USER_FIXTURE.id
  }
]

export const fixture = async () => {
  const connec = await getBeKairosDBConnection()

  await Promise.all(
    specialtyFixture.map((specialty) => connec.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).create(specialty))
  )
  await connec.getModelFor<UserDetailsEntity>(BeKairosModels.UserDetails).create(USER_FIXTURE)
  await connec.getModelFor<PartnerEntity>(BeKairosModels.Partner).create(PARTNER_FIXTURE)
  await connec.getModelFor<PartnerServiceEntity>(BeKairosModels.PartnerService).create(PARTNER_SERVICE_FIXTURE)
  await Promise.all(
    REVIEWS_FIXTURE.map((review) => connec.getModelFor<ReviewEntity>(BeKairosModels.Review).create(review))
  )
}
