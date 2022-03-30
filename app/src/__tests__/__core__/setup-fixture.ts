import { getBeKairosDBConnection } from '@infra/db/db'
import { fixture } from './db/db-fixture'

beforeAll((done) => {
  fixture().then(() => {
    done()
  })
})

afterAll((done) => {
  getBeKairosDBConnection().then((db) => {
    db.table.deleteTable('DeleteTableForever').then(() => {
      console.log('deletando as tabelas')
      done()
    })
  })
})
