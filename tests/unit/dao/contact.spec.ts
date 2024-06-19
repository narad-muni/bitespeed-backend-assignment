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
                linkedId: null,
                linkPrecedence: 'primary',
                createdAt: '2024-01-01T12:00:00.000+00:00',
            }
        )
        assert.assert(partiallyExistingContact == null);
        assert.assert(missingContact == null);

    })
})