export default {
    host: process.env.REACT_APP_TEAMS_API_SERVER_HOST!,
    endpoints: {
        teams: {
            base: '/v1/teams',
            particular: '/:id',
            join: '/join',
            leave: '/:id/leave'
        },
        invitations: {
            base: '/v1/invitations',
            particular: '/:id'
        },
        members: {
            base: '/v1/teams/:teamId/members',
            particular: '/:userId'
        },
        resources: {
            base: '/v1/resources',
            particular: '/:id',
            download: '/:id/download'
        }
    }
}