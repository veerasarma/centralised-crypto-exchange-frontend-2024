export const authRoutes: string[] = [
    "/login",
    "/register",
    "/forget",
    "/reset-password/[token]"
]

export const protectedRoutes: string[] = [
    '/deposit/[id]',
    '/kyc',
    '/notification',
    '/p2p-post-new-order',
    '/p2p',
    '/security',
    '/support-ticket',
    '/wallet',
    '/withdraw/[id]',
    '/affiliateProgram',
    '/affiliateUserDetail'
]