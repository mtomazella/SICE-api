import { getLoginUser } from 'data/auth'
import { list } from 'data/user'
import { AuthenticationError } from 'error/index'
import { SignJWT } from 'jose'

export const login = async ({
    username,
    password,
}: {
    username: string
    password: string
}) => {
    if (!username) {
        throw new AuthenticationError('Missing username')
    }
    if (!password) {
        throw new AuthenticationError('Missing password')
    }

    const userId = await getLoginUser({ username, password })

    if (!userId) {
        throw new AuthenticationError('Invalid username or password')
    }

    const { data: userList } = await list({
        id: userId.id,
        includePermissions: true,
        page: 1,
        limit: 1,
    })

    if (!userList.length) {
        throw new AuthenticationError('User not found')
    }

    const user = userList[0]

    const jwt = await new SignJWT({ user })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    return {
        token: jwt,
        user,
    }
}
