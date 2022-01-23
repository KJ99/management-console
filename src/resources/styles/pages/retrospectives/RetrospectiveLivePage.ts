import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: theme.spacing(3)
    },
    summarizeSectionTitle: {
        fontSize: '1.5rem',
        fontWeight: theme.typography.fontWeightBold
    },
    summarizeSectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
    },
    actionItemCard: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    actionData: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: theme.spacing(2)
    },
    actionDataItem: {
        marginRight: theme.spacing(2),
        color: theme.palette.text.secondary,
        fontSize: '0.8rem'
    },
    actionDataIcon: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary,
        fontSize: '0.9rem'
    },
    timerContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
        height: '3rem'
    },
    answerCard: {
        marginTop: theme.spacing(2)
    },
    votesRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    votesLabel: {
        color: theme.palette.text.secondary,
        margin: theme.spacing(0.5)
    },
    actionItemActionsContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    actionItemAction: {
        margin: theme.spacing(1)
    },
    completedDialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: theme.spacing(3)
    },
    completedDialogText: {
        margin: theme.spacing(2)
    }
}));

export default styleSheet;
