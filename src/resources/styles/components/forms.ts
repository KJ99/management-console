import { Theme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    submitRow: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    cancelAction: {
        marginRight: theme.spacing(1)
    }
}));

export default styleSheet;