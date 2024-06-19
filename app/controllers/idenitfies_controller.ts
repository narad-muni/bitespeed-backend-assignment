import type { HttpContext } from '@adonisjs/core/http'

export default class IdenitfiesController {
    async handle(ctx: HttpContext) {
        return {
            "Hello": "World"
        }
    }
}