export default {
    host: process.env.REACT_APP_DAILY_HELPER_HOST!,
    endpoints: {
        reports: {
            base: '/v1/reports/:teamId',
            particularDay: '/:day',
            days: '/archive/days'
        },
        configurations: {
            base: '/v1/configurations',
            particular: '/:teamId'
        }
    }
}