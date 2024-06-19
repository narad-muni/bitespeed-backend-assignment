import { identifyValidator } from '#validators/identify'
import type { HttpContext } from '@adonisjs/core/http'
import ContactDao from '../dao/contact.ts'
import Contact from '#models/contact';
import createResponse from '../utils/utils.ts';

export default class IdenitfiesController {
    async handle({request, response}: HttpContext) {
        const payload = await request.validateUsing(identifyValidator)

        const {
            email,
            phoneNumber
        } = payload;

        const existingContact = await ContactDao.getExactContact(email, phoneNumber)
        const [
            linkedId,
            primaryContacts,
            secondaryContacts,
        ] = await ContactDao.getRelatedContacts(email, phoneNumber)

        // Existing contact
        if(existingContact) {
            
        }else if(primaryContacts.length == 0 && secondaryContacts.length == 0) {
            // New contact without any linked contacts
            const contact = await Contact.create({
                email,
                phoneNumber,
                linkedId: null,
                linkPrecedence: "primary",
            })

            return createResponse(contact, []);
        }else if(primaryContacts.length == 1) {
            // Only one primary contact
            const secondary_contact = await Contact.create({
                email,
                phoneNumber,
                linkedId,
                linkPrecedence: "secondary",
            })

            secondaryContacts.push(secondary_contact)

            return createResponse(primaryContacts[0], secondaryContacts)
        }else{
            // Multiple primary contact
            // Make newer primary contact secondary
        }
    }
}