import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    wrapper: {
        [theme.breakpoints.up('md')]: {
            marginLeft: 256
        }
    }
}));

export default styleSheet;