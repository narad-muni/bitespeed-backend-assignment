import Contact from "#models/contact";

export default async function createResponse(primaryContact: Contact, secondaryContacts: Contact[]) {

    const secondaryEmails = secondaryContacts.map(e => e.email);
    const secondaryPhoneNumbers = secondaryContacts.map(e => e.phoneNumber);
    const secondaryContactIds = secondaryContacts.map(e => e.id);

    return {
        contact: {
            primaryContatctId: primaryContact.id,
            emails: [primaryContact.email, ...secondaryEmails],
            phoneNumbers: [primaryContact.phoneNumber, ...secondaryPhoneNumbers],
            secondaryContactIds,
        }
    }
}