import Contact from "#models/contact";

export default async function createResponse(primaryContact: Contact, secondaryContacts: Contact[]) {

    // Sort contacts
    secondaryContacts = secondaryContacts.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return a.createdAt.toJSDate().valueOf() - b.createdAt.toJSDate().valueOf();
      })

    const secondaryEmails = secondaryContacts.map(e => e.email);
    const secondaryPhoneNumbers = secondaryContacts.map(e => e.phoneNumber);
    const secondaryContactIds = secondaryContacts.map(e => e.id);

    const uniqueEmails = new Set([primaryContact.email, ...secondaryEmails]);
    const uniquePhoneNumbers = new Set([primaryContact.phoneNumber, ...secondaryPhoneNumbers]);

    return {
        contact: {
            primaryContatctId: primaryContact.id,
            emails: Array.from(uniqueEmails),
            phoneNumbers: Array.from(uniquePhoneNumbers),
            secondaryContactIds,
        }
    }
}