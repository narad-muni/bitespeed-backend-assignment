import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner'

test.group('Identify API', (group) => {
    // Db will reset to seed after each test block run
    group.each.setup(() => testUtils.db().withGlobalTransaction())

    test('create new single contact', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "manu@gmail.com",
            phoneNumber: "912111111",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 5,
                "emails": ["manu@gmail.com"],
                "phoneNumbers": ["912111111"],
                "secondaryContactIds": []
            }
        })
    });

    test('ignore already existing same contact', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "saumillinux@gmail.com",
            phoneNumber: "8788612711",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 2,
                "emails": ["saumillinux@gmail.com", "saumil@gmail.com"],
                "phoneNumbers": ["8788612711", "123456789"],
                "secondaryContactIds": [3, 4]
            }
        })
    });

    test('create secondary contact linked to primary contact', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "abhijeet@cid.com",
            phoneNumber: "8788612711",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 1,
                "emails": ["saumillinux@gmail.com", "saumil@gmail.com", "abhijeet@cid.com"],
                "phoneNumbers": ["8788612711"],
                "secondaryContactIds": [3, 4, 5]
            }
        })
    });

    test('create secondary contact linked to another secondary contact', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "saumil@gmail.com",
            phoneNumber: "912111111",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 5,
                "emails": ["saumillinux@gmail.com", "saumil@gmail.com"],
                "phoneNumbers": ["8788612711", "123456789", "912111111"],
                "secondaryContactIds": [3, 4, 5]
            }
        })
    });

    test('create common contact for 2 primary, convert newer to secondary and modify linked contacts', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "ajay@gmail.com",
            phoneNumber: "8788612711",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 1,
                "emails": ["ajay@gmail.com", "saumillinux@gmail.com", "saumil@gmail.com"],
                "phoneNumbers": ["91246867", "8788612711", "123456789"],
                "secondaryContactIds": [2, 3, 4]
            }
        })
    });

    // Doubt
    // If common contact matches one primary and one secondary
    // no info on what to do in that case
    // Failing test case
    test('create common contact for 2 primary, convert newer to secondary and modify linked contacts', async ({ client, assert }) => {
        const response = await client.post('/identify').json({
            email: "ajay@gmail.com",
            phoneNumber: "123456789",
        })

        assert.assert(false)
    });

})