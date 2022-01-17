export default {
    host: process.env.REACT_APP_PLANNING_POKER_SERVER_HOST!,
    liveHost: process.env.REACT_APP_PLANNING_POKER_SERVER_LIVE_HOST!,
    endpoints: {
        plannings: {
            base: '/v1/plannings',
            particular: '/:id',
            token: '/:id/token',
            report: '/:id/report',
            incoming: '/incoming',
            start: '/:id/start'
        },
        items: {
            base: '/v1/plannings/:planningId/items',
            particular: '/:itemId',
            import: '/import'
        },
        live: {
            base: '/planning',
            members: '/members/:planningId',
            status: '/status/:planningId',
            focus: '/focus/:planningId',
            votes: '/votes/:planningId',
            estimations: '/estimations/:planningId',
            commands: '/commands'
        }
    }
}