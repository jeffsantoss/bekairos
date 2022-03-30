import { getBeKairosDBConnection } from '@infra/db/db'
import { AffiliateEntity, SpecialtyEntity, ReviewEntity, UserDetailsEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { v4 } from 'uuid'

export const userFixture: UserDetailsEntity = {
  id: v4(),
  name: 'Jefferson Santos de Souza',
  phone: '85986821854'
}

export const specialtyFixture: SpecialtyEntity[] = [
  { id: v4(), name: 'Barbeiro' },
  { id: v4(), name: 'Nutrição' },
  { id: v4(), name: 'Dentista' }
]

export const affiliateFixture: AffiliateEntity = {
  id: v4(),
  coordinates: {
    latitude: '-27.4398163',
    longitude: '-48.3966226'
  },
  name: 'Barbearia VIP',
  specialtyId: specialtyFixture[0].id,
  ownerId: userFixture.id,
  address: {
    uf: 'SC',
    city: 'Florianópolis',
    cep: '88058193',
    street: 'Servidão Maria Tomásia Cabral',
    streetNumber: 31
  },
  photo: 'photo.png'
}

export const reviewsFixture: ReviewEntity[] = [
  {
    id: v4(),
    description: 'vc eh pica',
    score: 5,
    affiliateId: affiliateFixture.id,
    specialtyId: specialtyFixture[0].id,
    userId: userFixture.id
  },
  {
    id: v4(),
    description: 'vc eh um bosta',
    score: 1,
    affiliateId: affiliateFixture.id,
    specialtyId: specialtyFixture[0].id,
    userId: userFixture.id
  }
]

export const fixture = async () => {
  const connec = await getBeKairosDBConnection()

  await Promise.all(
    specialtyFixture.map((specialty) => connec.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).create(specialty))
  )
  await connec.getModelFor<UserDetailsEntity>(BeKairosModels.UserDetails).create(userFixture)
  await connec.getModelFor<AffiliateEntity>(BeKairosModels.Affiliate).create(affiliateFixture)
  await Promise.all(
    reviewsFixture.map((review) => connec.getModelFor<ReviewEntity>(BeKairosModels.Review).create(review))
  )
}
