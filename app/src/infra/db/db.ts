import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import Dynamo from 'dynamodb-onetable/Dynamo'
import { Model, OneSchema, Table } from 'dynamodb-onetable'
import { v4 } from 'uuid'
import { beKairosSchema } from './schemas/bekairos-schema'

export default class DBClient {
  table: Table
  client: Dynamo
  region = 'us-east-1'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  logger = (level: string, message: string, context: any) => {
    if (level == 'trace' || level == 'data') return
    console.log(`${new Date().toLocaleString()}: ${level}: ${message}`)
  }

  constructor(tableName: string, schema: OneSchema) {
    const isTest = process.env.JEST_WORKER_ID
    const config = {
      convertEmptyValues: true,
      ...(isTest && {
        endpoint: 'http://127.0.0.1:8000',
        sslEnabled: false,
        region: 'local-env',
        credentials: {
          accessKeyId: v4(),
          secretAccessKey: v4()
        }
      })
    }
    this.client = new Dynamo({
      client: new DynamoDBClient({
        region: this.region,
        ...config
      })
    })

    this.table = new Table({
      client: this.client,
      uuid: 'ulid',
      name: tableName,
      timestamps: false,
      schema: schema,
      logger: this.logger
    })
  }

  init = async () => {
    try {
      const isTableExists = await this.checkTableExists()
      if (!isTableExists) {
        return await this.createTable()
      }
    } catch (err: any) {
      console.error('DBClient init err\n' + err)
      throw new Error(err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  checkTableExists = (): Promise<Boolean> => {
    return this.table.exists()
  }

  createTable = (): Promise<any> => {
    return this.table.createTable()
  }

  getModelFor = <T>(entity: string): Model<T> => this.table.getModel<T>(entity)
}

export const getBeKairosDBConnection = async () => {
  const client = new DBClient('BeKairosAppTable', beKairosSchema)
  await client.init()
  return client
}
