import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    name: {
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '2rem'
    }
}));

export default styleSheet;
