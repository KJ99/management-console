import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    itemsLabel: {
        fontWeight: theme.typography.fontWeightBold
    },
    itemsHeader: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(3),
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    itemCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    itemCardContent: {
        flex: 8,
    },
    itemActionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemAction: {
        margin: theme.spacing(1)
    },
    itemTitle: {
        fontWeight: theme.typography.fontWeightBold
    },
    importButton: {
        marginLeft: theme.spacing(1)
    },
    plannigTitle: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '1.2rem'
    },
    retrospectiveSubtitle: {
        fontSize: '0.8rem',
        color: theme.palette.text.secondary
    },
    retrospectiveCardContentEditMode: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    }
}));

export default styleSheet;
