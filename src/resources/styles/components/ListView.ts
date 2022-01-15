import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    title: {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(2)
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(1),
        borderTop: `1px solid ${theme.palette.grey[300]}`
    },
    rowTitle: {
        marginBottom: theme.spacing(1)
    },
    rowSubtitle: {
        fontSize: '0.8rem',
        color: theme.palette.text.secondary
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(1)
    },
    crossedOut: {
        textDecoration: 'line-through'
    }
}));

export default styleSheet;