import Contact from "#models/contact";

export default class ContactDao {
    public static async getExactContact(phoneNumber: string | null, email: string | null): Promise<Contact | null> {

        const whereClause: Record<string, string> = {};

        // Check for null
        if(phoneNumber){
            whereClause['phoneNumber'] = phoneNumber;
        }
        if(email){
            whereClause['email'] = email;
        }

        const contact = await Contact.findBy(whereClause)

        return contact
    }

    // Get all contacts which matches provided array
    public static async getMatchingContacts(phoneNumbers: (string|null)[], emails: (string|null)[]): Promise<Contact[]> {
        const contacts =  await Contact.query()
        .whereIn('phone_number', phoneNumbers as string[])
        .orWhereIn('email', emails as string[])
        .orderBy('created_at', 'asc')

        return contacts
    }
    
    // First value is oldest linked contact id
    // Second array is all primary contacts
    // Third array is all secondary contacts
    public static async getRelatedContacts(phoneNumber: string | null, email: string | null): Promise<[number, Contact[], Contact[]]> {
        let linkedId: number|null = null;
        let fetchedContacts: Contact[] = [];

        // Array of all emails and phone numbers found
        let phoneNumbers = [phoneNumber];
        let emails = [email];

        // Loop till we find all records directly or indirectly
        while (true) {
            // Get all directly matching contacts which contains obtained emails and phone numbers
            let contacts = await ContactDao.getMatchingContacts(
                phoneNumbers,
                emails,
            )

            // Assign linked id if not already set
            if(linkedId == null) {
                linkedId = contacts?.[0]?.id;
            }

            // If no new contacts are fetched, then break
            if(contacts.length <= fetchedContacts.length) {
                break
            }

            // Assign all email and phone numbers
            emails = contacts.map(e => e.email);
            phoneNumbers = contacts.map(e => e.phoneNumber);

            // Assign all fetched contacts
            fetchedContacts = contacts;
        }

        const primaryContacts = fetchedContacts.filter(e => e.linkPrecedence == 'primary');
        const secondaryContacts = fetchedContacts.filter(e => e.linkPrecedence == 'secondary');

        return [linkedId, primaryContacts, secondaryContacts]
    }
}