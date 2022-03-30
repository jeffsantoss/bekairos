module.exports = {
  tables: [
    {
      TableName: `TableModule`,
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 50, WriteCapacityUnits: 50 }
    }
    // etc
  ],
  installerConfig: {
    port: 8002,
    installPath: '/tmp/dynamo-local'
  }
}
