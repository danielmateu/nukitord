import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(
    req: Request,
) {
    try {
        /* `const profile = await currentProfile()` is calling the `currentProfile()` function and
        assigning the returned value to the `profile` variable. The `await` keyword is used to wait
        for the `currentProfile()` function to complete and return a value before continuing with
        the execution of the code. */
        const profile = await currentProfile()
        /* `const { name, type } = await req.json()` is destructuring the JSON data from the request
        body. */
        const { name, type } = await req.json()
        /* `const { searchParams } = new URL(req.url)` is creating a new URL object using the `req.url`
        property and then destructuring the `searchParams` property from that URL object. */
        const { searchParams } = new URL(req.url)

        /* The line `const serverId = searchParams.get('serverId')` is retrieving the value of the
        'serverId' parameter from the URL's query string. */
        const serverId = searchParams.get('serverId')

        if (!profile) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        if (!serverId) {
            return new NextResponse('Bad Request', { status: 400 })
        }

        if (name === 'general') {
            return new NextResponse('Name cannot be "general"', { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('[CHANNEL_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }

}