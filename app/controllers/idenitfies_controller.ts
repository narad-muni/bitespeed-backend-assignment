import { identifyValidator } from '#validators/identify'
import type { HttpContext } from '@adonisjs/core/http'

export default class IdenitfiesController {
    async handle({request, response}: HttpContext) {
        const payload = await request.validateUsing(identifyValidator)
        
        return payload
    }
}