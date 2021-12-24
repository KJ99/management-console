export default {
    host: process.env.REACT_APP_IDENTITY_SERVER_HOST!,
    endpoints: {
        profile: {
            base: '/v1/profile',
            particular: '/:id',
            password: '/password'
        },
        auth: {
            base: '/v1/auth',
            passwordReset: '/password-reset',
            initPasswordReset: '/password-reset/init',
            login: '/login'
        },
        account: {
            base: '/v1/account',
            availability: '/availability',
            resendVerification: '/verification/resend',
            verify: '/verify'
        },
        resources: {
            base: '/v1/resources',
            particular: '/:id',
            download: '/:id/download'
        }
    }
}