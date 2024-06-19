import Contact from '#models/contact'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
    async run() {
        await Contact.createMany([
            {
                id: 1,
                phoneNumber: "91246867",
                email: "ajay@gmail.com",
                linkedId: null,
                linkPrecedence: "primary",
                createdAt: DateTime.fromRFC2822("1 Jan 2024 12:00 Z"),
            },
            {
                id: 2,
                phoneNumber: "8788612711",
                email: "saumillinux@gmail.com",
                linkedId: null,
                linkPrecedence: "primary",
                createdAt: DateTime.fromRFC2822("1 Jan 2024 12:01 Z"),
            },
            {
                id: 3,
                phoneNumber: "8788612711",
                email: "saumil@gmail.com",
                linkedId: 2,
                linkPrecedence: "secondary",
                createdAt: DateTime.fromRFC2822("1 Jan 2024 12:02 Z"),
            },
            {
                id: 4,
                phoneNumber: "123456789",
                email: "saumil@gmail.com",
                linkedId: 3,
                linkPrecedence: "secondary",
                createdAt: DateTime.fromRFC2822("1 Jan 2024 12:03 Z"),
            },
        ])
    }
}