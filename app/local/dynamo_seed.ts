// import { ScopeType } from '@infra/db/models/iam-models'
// import { GrantTypes } from '@core/constants'
// import { getIamDBConnection } from '@infra/db/db'
// import {
//   TenantType,
//   GrantTypeType,
//   RedirectUriType,
//   IdentityUserType,
//   UserModelType,
//   ClientType,
//   AssetLinkType
// } from '@infra/db/models/iam-models'
// import { IAMModels } from '@infra/db/schemas/iam-schema'
// import { generateHashPassword } from '@pbkdf2/generate-hash-password'
// import { v4 } from 'uuid'

// export const IDENTITY_USER_PASSWORD_FIXTURE = 'password-mock'

// export const TENANT_FIXTURE: TenantType = {
//   id: v4(),
//   slug: 'tenant-slug-mock',
//   name: 'tenant-name-mock'
// }

// export const CLIENT_FIXTURE: ClientType = {
//   id: v4(),
//   tenantId: TENANT_FIXTURE.id,
//   slug: 'client-login-mock',
//   name: 'tenant-login-mock'
// }
// export const CONFIDENTAIL_CLIENT_FIXTURE: ClientType = {
//   id: v4(),
//   tenantId: TENANT_FIXTURE.id,
//   slug: 'client-confidential-mock',
//   name: 'client-confidential-mock'
// }

// export const CLIENT_SCOPES_FIXTURE: ScopeType[] = [
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CLIENT_FIXTURE.id,
//     name: 'scope-a'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CLIENT_FIXTURE.id,
//     name: 'scope-b'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CLIENT_FIXTURE.id,
//     name: 'scope-c'
//   }
// ]

// export const CONFIDENTIAL_CLIENT_SCOPES_FIXTURE: ScopeType[] = [
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//     name: 'user:impersonate'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//     name: 'user:create'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//     name: 'user:update'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//     name: 'user:register-password'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//     name: 'user:register-fido'
//   },
//   {
//     tenantId: TENANT_FIXTURE.id,
//     clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//     name: 'openid'
//   }
// ]
// export const GRANT_TYPE_AUTHORIZATION_CODE_FIXTURE: GrantTypeType = {
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CLIENT_FIXTURE.id,
//   name: GrantTypes.AUTHORIZATION_CODE
// }
// export const GRAN_TYPE_CODE_FIXTURE: GrantTypeType = {
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CLIENT_FIXTURE.id,
//   name: GrantTypes.CODE
// }
// export const GRANT_TYPE_REFRESH_TOKEN_FIXTURE: GrantTypeType = {
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CLIENT_FIXTURE.id,
//   name: GrantTypes.REFRESH_TOKEN
// }
// export const GRANT_TYPE_CLIENT_CREDENTIALS_FIXTURE: GrantTypeType = {
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CONFIDENTAIL_CLIENT_FIXTURE.id,
//   name: GrantTypes.CLIENT_CREDENTIALS
// }
// export const GRANT_TYPE_FIDO_FIXTURE: GrantTypeType = {
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CLIENT_FIXTURE.id,
//   name: GrantTypes.FIDO
// }

// export const REDIRECT_URI_FIXTURE: RedirectUriType = {
//   url: 'http://localhost:8080/home',
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CLIENT_FIXTURE.id
// }
// export const IDENTITY_USER_FIXTURE: IdentityUserType = {
//   id: v4(),
//   username: 'username-mock',
//   tenantId: TENANT_FIXTURE.id,
//   email: 'email@email.com'
// }
// export const USER_MODEL_FIXTURE: UserModelType = {
//   userId: IDENTITY_USER_FIXTURE.id,
//   firstName: 'John',
//   lastName: 'Doe',
//   cpf: 14397211618,
//   tenantId: TENANT_FIXTURE.id
// }

// export const ASSET_LINK_FIXTURE: AssetLinkType = {
//   tenantId: TENANT_FIXTURE.id,
//   clientId: CLIENT_FIXTURE.id,
//   baseTargetNamespace: 'web',
//   site: 'https://iaas-ciam-dev.zup.com.br',
//   androidTargetNamespace: 'android_app',
//   packageName: 'br.com.zup.fido',
//   sha256CertFingerprints: [
//     'AA:C9:7F:75:26:FA:FA:9D:48:1A:05:FC:23:DC:25:02:F5:0F:BE:21:F8:7F:91:3E:3B:04:C7:7B:C6:49:9B:9B'
//   ]
// }

// export const iamDbFixture = async () => {
//   const dbConnection = await getIamDBConnection()
//   IDENTITY_USER_FIXTURE.password = await generateHashPassword(IDENTITY_USER_PASSWORD_FIXTURE)
//   CONFIDENTAIL_CLIENT_FIXTURE.credential = IDENTITY_USER_FIXTURE.password

//   console.log('Seeding Tenants..')
//   await dbConnection.getModelFor<TenantType>(IAMModels.Tenant).create(TENANT_FIXTURE)
//   console.log('Seeding Clients..')
//   await dbConnection.getModelFor<ClientType>(IAMModels.Client).create(CLIENT_FIXTURE)
//   await dbConnection.getModelFor<ClientType>(IAMModels.Client).create(CONFIDENTAIL_CLIENT_FIXTURE)
//   console.log('Seeding Scopes')
//   await Promise.all(
//     CLIENT_SCOPES_FIXTURE.map((scope) => dbConnection.getModelFor<ScopeType>(IAMModels.Scope).create(scope))
//   )
//   await Promise.all(
//     CONFIDENTIAL_CLIENT_SCOPES_FIXTURE.map((scope) =>
//       dbConnection.getModelFor<ScopeType>(IAMModels.Scope).create(scope)
//     )
//   )
//   console.log('Seeding GrantyTypes')
//   await dbConnection.getModelFor<GrantTypeType>(IAMModels.GrantType).create(GRANT_TYPE_AUTHORIZATION_CODE_FIXTURE)
//   await dbConnection.getModelFor<GrantTypeType>(IAMModels.GrantType).create(GRANT_TYPE_CLIENT_CREDENTIALS_FIXTURE)
//   await dbConnection.getModelFor<GrantTypeType>(IAMModels.GrantType).create(GRAN_TYPE_CODE_FIXTURE)
//   await dbConnection.getModelFor<GrantTypeType>(IAMModels.GrantType).create(GRANT_TYPE_FIDO_FIXTURE)
//   await dbConnection.getModelFor<GrantTypeType>(IAMModels.GrantType).create(GRANT_TYPE_REFRESH_TOKEN_FIXTURE)
//   console.log('Seeding Redirect URI')
//   await dbConnection.getModelFor<RedirectUriType>(IAMModels.RedirectURI).create(REDIRECT_URI_FIXTURE)
//   console.log('Seeding Identity User')
//   await dbConnection.getModelFor<IdentityUserType>(IAMModels.IdentityUser).create(IDENTITY_USER_FIXTURE)
//   console.log('Seeding User Model')
//   await dbConnection.getModelFor<UserModelType>(IAMModels.UserModel).create(USER_MODEL_FIXTURE)
//   console.log('Seeding Asset Link')
//   await dbConnection.getModelFor<AssetLinkType>(IAMModels.AssetLink).create(ASSET_LINK_FIXTURE)
// }

// iamDbFixture()
