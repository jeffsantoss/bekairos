import { BadArgumentError } from '@common/errors/api-errors'
import { calculateDistanceBetweenCoordinates } from '@common/utils/geodist'
import { average } from '@common/utils/math'
import { getBeKairosDBConnection } from '@infra/db/db'
import { AffiliateEntity, SpecialtyEntity, ReviewEntity } from '@infra/db/models/bekairos-models'
import { BeKairosModels } from '@infra/db/schemas/bekairos-schema'
import { GetAffiliatesBySpecialty } from '../request-models'
import { AffiliateResponse } from '../response-models'

export const getBySpecialty = async (
  specialtyId: string,
  request: GetAffiliatesBySpecialty
): Promise<AffiliateResponse[]> => {
  const dbConnection = await getBeKairosDBConnection()

  if (!specialtyId) throw new BadArgumentError('specialtyId')

  console.log(`Searching affiliates from category ${specialtyId}`)

  const category = await dbConnection.getModelFor<SpecialtyEntity>(BeKairosModels.Specialty).get({ id: specialtyId })

  const affiliates = await dbConnection
    .getModelFor<AffiliateEntity>(BeKairosModels.Affiliate)
    .find({ specialtyId }, { index: 'gs1', follow: true })

  const reviews = await dbConnection
    .getModelFor<ReviewEntity>(BeKairosModels.Review)
    .find({ specialtyId }, { index: 'gs1', follow: true })

  return affiliates.map((aff) => {
    const distance = calculateDistanceBetweenCoordinates(
      {
        latitude: aff.coordinates['latitude'] as number,
        longitude: aff.coordinates['longitude'] as number
      },
      {
        latitude: Number.parseFloat(request.lat),
        longitude: Number.parseFloat(request.long)
      }
    )

    return <AffiliateResponse>{
      name: aff?.name,
      address: aff.address,
      distance: distance.m.toFixed(0),
      category: {
        id: category.id,
        name: category.name
      },
      reviewAvg: average(reviews.filter((r) => r.affiliateId == aff.id).map((s) => s.score))
    }
  })
}
