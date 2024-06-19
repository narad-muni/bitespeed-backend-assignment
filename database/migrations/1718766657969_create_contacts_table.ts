import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'contacts'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        table.string('phone_number')
        table.string('email')
        table.integer('linked_id')
        table.string('link_precedence')

        table.timestamp('created_at')
        table.timestamp('updated_at')
        table.timestamp('deleteded_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}