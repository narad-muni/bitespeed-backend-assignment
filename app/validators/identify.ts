import vine from '@vinejs/vine'

export const identifyValidator = vine.compile(
    vine.object({
        phoneNumber: vine.string().nullable(),
        email: vine.string().nullable(),
    })
)
