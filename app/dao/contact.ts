import Contact from "#models/contact";

export default class ContactDao {
    public static async getExactContact(phoneNumber: string | null, email: string | null): Promise<Contact | null> {
        const contact = await Contact.findBy({
            phoneNumber,
            email,
        })

        return contact
    }
    
    // First value is primary contacts
    // Second array is all secondary contacts
    public static async getRelatedContacts(phoneNumber: string | null, email: string | null): Promise<[number, Contact[], Contact[]]> {
        return [0, [], []];
    }
}