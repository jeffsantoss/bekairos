# ciam-identity-provider-prv

## Automação com CDK (Cloud Development Kit)

- Runtime: `NodeJs 16.x`
- CDK version: `2.2.0`
- Branch name: `dev`

### Recursos que são provisionados manualmente

- Custom Domain Name
- Execução do script de seed para DynamoDB:
    - Caminho do script (typescript): `ciam-identity-provider-prv/iam/local/dynamo_seed.ts`
    - Comando: `./prepare-build.sh && cd iam && node dist/local/dynamo_seed.js`

### Deploy Develop Env (linha de comando)

```jsx
DEFAULT_CLIENT_ID=$SECRET HOST=https://iaas-ciam-dev.zup.com.br cdk deploy
```

- Substituir a variável `HOST` pelo Custom Domain Name do API Gateway

### Comandos para Build e Deploy (baseado em pipeline com GitHub Actions)

```jsx
npm install
npm install -g aws-cdk
cdk bootstrap --public-access-block-configuration=false
DEFAULT_CLIENT_ID=$SECRET HOST=https://iaas-ciam-dev.zup.com.br cdk deploy --require-approval never
```

### Recursos Provisionados

- API Gateway;
- Lambda Function;
- DynamoDB.
