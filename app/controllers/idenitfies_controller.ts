import { identifyValidator } from '#validators/identify'
import type { HttpContext } from '@adonisjs/core/http'
import ContactDao from '../dao/contact.ts'
import Contact from '#models/contact';
import createResponse from '../utils/utils.ts';

export default class IdenitfiesController {
    async handle({request}: HttpContext) {
        const payload = await request.validateUsing(identifyValidator)

        const {
            email,
            phoneNumber
        } = payload;

        // Get exact matching contact
        const existingContact = await ContactDao.getExactContact(phoneNumber, email)

        // Get releated contact with direclt linked id
        // Linked id will be oldest matching record
        const [
            linkedId,
            primaryContacts,
            secondaryContacts,
        ] = await ContactDao.getRelatedContacts(phoneNumber, email)

        // Existing contact
        if(existingContact) {
            return createResponse(primaryContacts[0], secondaryContacts);
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
        }else if(primaryContacts.length > 1){
            // Multiple primary contact
            // Make newer primary contact secondary
            // No new contact will be created
            const primaryContact = primaryContacts.shift() as Contact;

            for await(const contact of primaryContacts) {
                contact.linkedId = primaryContact.id;
                contact.linkPrecedence = 'secondary';

                await contact.save();
            }

            return createResponse(primaryContact, [...primaryContacts, ...secondaryContacts])
        }else{
            console.log("Unhandeled case");
        }
    }
}