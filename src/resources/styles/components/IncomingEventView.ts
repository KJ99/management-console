import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    eventCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    eventContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    alternativeCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(3)
    },
    eventActions: {

    },
    eventTitle: {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(2)
    },
    eventDate: {
        color: theme.palette.text.secondary,
        fontSize: '0.8rem'
    },
}));

export default styleSheet;