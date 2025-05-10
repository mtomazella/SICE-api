import { AuthenticationError } from 'error/index'
import { jwtVerify } from 'jose'

export const validateToken = async (token: string | undefined) => {
    if (!token) {
        throw new AuthenticationError('Missing validation token')
    }

    if (!token.startsWith('Bearer ')) {
        throw new AuthenticationError('Invalid token format')
    }

    const tokenWithoutBearer = token.split(' ')[1]

    let result
    try {
        result = await jwtVerify(
            tokenWithoutBearer,
            new TextEncoder().encode(process.env.JWT_SECRET),
            {
                algorithms: ['HS256'],
            }
        )

        if (!result || !result.payload || !result.payload?.user) {
            throw new AuthenticationError('Invalid token')
        }

        if (!result.payload) {
            throw new AuthenticationError('Invalid token')
        }

        return result.payload.user
    } catch (error) {
        if ((error as any)?.code === 'ERR_JWT_EXPIRED') {
            throw new AuthenticationError('Token expired')
        }
        if ((error as any)?.code === 'ERR_JWS_INVALID') {
            throw new AuthenticationError('Invalid token')
        }
        if ((error as any)?.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
            throw new AuthenticationError('Please stop')
        }
        throw new AuthenticationError('Invalid token')
    }
}
