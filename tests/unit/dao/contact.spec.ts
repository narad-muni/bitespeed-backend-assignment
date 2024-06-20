import { test } from '@japa/runner'
import ContactDao from '../../../app/dao/contact.ts'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Contact dao', (group) => {
    // Db will reset to seed after each test block run
    group.each.setup(() => testUtils.db().withGlobalTransaction())

    test('getExactContact', async ({ assert }) => {
        const existingContact = await ContactDao.getExactContact("91246867", "ajay@gmail.com");
        const partiallyExistingContact = await ContactDao.getExactContact("91246867", "whoami@yahoo.com");
        const missingContact = await ContactDao.getExactContact("000000", "a@gmail.com");

        assert.containsSubset(
            existingContact?.serialize(),
            {
                id: 1,
                phoneNumber: '91246867',
                email: 'ajay@gmail.com',
                linkedId: 0,
                linkPrecedence: 'secondary',
                createdAt: '2024-01-01T12:00:00.000+00:00',
            }
        )
        assert.assert(partiallyExistingContact == null);
        assert.assert(missingContact == null);

    })

    test('getMatchingContacts', async({ assert }) => {
        let noMatchingContacts = await ContactDao.getMatchingContacts([], []);
        assert.assert(noMatchingContacts.length == 0);

        let matchingContacts = await ContactDao.getMatchingContacts(["91246867"], ["ajay@gmail.com"]);
        assert.assert(matchingContacts.length == 2);

        assert.containsSubset(
            matchingContacts.map(e => e.serialize()),
            [
                {
                    id: 0,
                    phoneNumber: '91246867',
                    email: 'cid@gmail.com',
                    linkedId: null,
                    linkPrecedence: 'primary',
                    createdAt: '2024-01-01T11:00:00.000+00:00',
                },
                {
                    id: 1,
                    phoneNumber: '91246867',
                    email: 'ajay@gmail.com',
                    linkedId: 0,
                    linkPrecedence: 'secondary',
                    createdAt: '2024-01-01T12:00:00.000+00:00',
                }
            ]
        )
    })

    test('getRelatedContacts 2 contacts', async ({assert}) => {
        let linkedId, primaryContacts, secondaryContacts;

        [linkedId, primaryContacts, secondaryContacts] = await ContactDao.getRelatedContacts(
            '91246867',
            'ajay@gmail.com',
        )

        assert.assert(linkedId == 0)
        assert.assert(primaryContacts.length == 1)
        assert.assert(secondaryContacts.length == 1)

        assert.containsSubset(
            primaryContacts.map(e => e.serialize()),
            [
                {
                    id: 0,
                    phoneNumber: '91246867',
                    email: 'cid@gmail.com',
                    linkedId: null,
                    linkPrecedence: 'primary',
                    createdAt: '2024-01-01T11:00:00.000+00:00',
                },
            ]
        )

        assert.containsSubset(
            secondaryContacts.map(e => e.serialize()),
            [
                {
                    id: 1,
                    phoneNumber: '91246867',
                    email: 'ajay@gmail.com',
                    linkedId: 0,
                    linkPrecedence: 'secondary',
                    createdAt: '2024-01-01T12:00:00.000+00:00',
                },
            ]
        )
    })

    test('getRelatedContacts 3 contacts', async ({assert}) => {
        let linkedId, primaryContacts, secondaryContacts;

        [linkedId, primaryContacts, secondaryContacts] = await ContactDao.getRelatedContacts(
            '123456789',
            'saumil@gmail.com',
        )

        assert.assert(linkedId == 3)
        assert.assert(primaryContacts.length == 1)
        assert.assert(secondaryContacts.length == 2)

        assert.containsSubset(
            primaryContacts.map(e => e.serialize()),
            [
                {
                    id: 2,
                    phoneNumber: '8788612711',
                    email: 'saumillinux@gmail.com',
                    linkedId: null,
                    linkPrecedence: 'primary',
                },
            ]
        )

        assert.containsSubset(
            secondaryContacts.map(e => e.serialize()),
            [
                {
                    id: 3,
                    phoneNumber: "8788612711",
                    email: "saumil@gmail.com",
                    linkedId: 2,
                    linkPrecedence: "secondary",
                },
                {
                    id: 4,
                    phoneNumber: "123456789",
                    email: "saumil@gmail.com",
                    linkedId: 3,
                    linkPrecedence: "secondary",
                },
            ]
        )
    })

    test('getRelatedContacts 3 contacts using primary', async ({assert}) => {
        let linkedId, primaryContacts, secondaryContacts;

        [linkedId, primaryContacts, secondaryContacts] = await ContactDao.getRelatedContacts(
            '8788612711',
            'saumillinux@gmail.com',
        )

        assert.assert(linkedId == 2)
        assert.assert(primaryContacts.length == 1)
        assert.assert(secondaryContacts.length == 2)

        assert.containsSubset(
            primaryContacts.map(e => e.serialize()),
            [
                {
                    id: 2,
                    phoneNumber: '8788612711',
                    email: 'saumillinux@gmail.com',
                    linkedId: null,
                    linkPrecedence: 'primary',
                },
            ]
        )

        assert.containsSubset(
            secondaryContacts.map(e => e.serialize()),
            [
                {
                    id: 3,
                    phoneNumber: "8788612711",
                    email: "saumil@gmail.com",
                    linkedId: 2,
                    linkPrecedence: "secondary",
                },
                {
                    id: 4,
                    phoneNumber: "123456789",
                    email: "saumil@gmail.com",
                    linkedId: 3,
                    linkPrecedence: "secondary",
                },
            ]
        )
    })
})