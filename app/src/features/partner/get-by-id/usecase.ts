import { getPartnerById } from '@infra/db/repository/partner/get'
import { PartnerResponse } from '../get-by-specialty/usecase'
import { LocalizationRequest } from '../get/usecase'

export const getPartnerByIdUseCase = async (id: string, request: LocalizationRequest): Promise<PartnerResponse> => {
  return await getPartnerById(id, request.lat, request.long)
}
