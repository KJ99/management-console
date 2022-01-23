export default {
    host: process.env.REACT_APP_RETRO_HELPER_HOST!,
    liveHost: process.env.REACT_APP_RETRO_HELPER_LIVE_HOST!,
    endpoints: {
        retrospectives: {
            base: '/v1/retrospectives',
            particular: '/:id',
            token: '/:id/token',
            report: '/:id/report',
            incoming: '/incoming',
            start: '/:id/start',
            nextStep: '/:id/next-step'
        },
        answers: {
            base: '/v1/answers',
            particular: '/:id',
            votes: '/:id/votes'
        },
        actionItems: {
            base: '/v1/actions',
            particular: '/:id'
        },
        live: {
            base: '/retro',
            members: '/members/:retroId',
            status: '/status/:retroId',
            answers: '/answers/:retroId'
        }
    }
}