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

    test('ignore already existing same contact with null value', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "saumillinux@gmail.com",
            phoneNumber: null,
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
                "primaryContatctId": 2,
                "emails": ["saumillinux@gmail.com", "saumil@gmail.com", "abhijeet@cid.com"],
                "phoneNumbers": ["8788612711", "123456789"],
                "secondaryContactIds": [3, 4, 5]
            }
        })
    });

    test('create secondary contact with null value linked to primary contact', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: null,
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

    test('create secondary contact linked to another secondary contact', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "saumil@gmail.com",
            phoneNumber: "912111111",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 2,
                "emails": ["saumillinux@gmail.com", "saumil@gmail.com"],
                "phoneNumbers": ["8788612711", "123456789", "912111111"],
                "secondaryContactIds": [3, 4, 5]
            }
        })
    });

    test('create common contact for 2 primary, convert newer to secondary', async ({ client }) => {
        const response = await client.post('/identify').json({
            email: "cid@gmail.com",
            phoneNumber: "8788612711",
        })

        response.assertBody({
            contact: {
                "primaryContatctId": 0,
                "emails": ["cid@gmail.com", "ajay@gmail.com", "saumillinux@gmail.com", "saumil@gmail.com"],
                "phoneNumbers": ["91246867", "8788612711", "123456789"],
                "secondaryContactIds": [1, 2, 3, 4]
            }
        })
    });

    // Doubt
    // If common contact matches one primary and one secondary with different primary
    // Also 2 different secondary having 2 different primary contacts
    // no info on what to do in that case
    // Failing test case
    // test('create common contact between one primary and one secondary', async ({ client, assert }) => {
    //     await client.post('/identify').json({
    //         email: "cid@gmail.com",
    //         phoneNumber: "123456789",
    //     })
        
    //     await client.post('/identify').json({
    //         email: "ajay@gmail.com",
    //         phoneNumber: "123456789",
    //     })

    //     assert.assert(false)
    // });

})