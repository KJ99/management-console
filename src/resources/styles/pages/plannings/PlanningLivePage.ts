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
    focusedItem: {
        fontWeight: theme.typography.fontWeightBold,
    },
    itemTitle: {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(2)
    },
    expandButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    votingSectionHeader: {
        marginTop: theme.spacing(3),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: theme.spacing(3)
    },
    memberName: {
        marginLeft: theme.spacing(2),
        fontWeight: theme.typography.fontWeightBold
    },
    votesAction: {
        marginLeft: theme.spacing(1)
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
