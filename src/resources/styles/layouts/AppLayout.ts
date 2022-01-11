import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    topBar: {
        height: 64
    },
    wrapper: {
        marginTop: 64
    }
}));

export default styleSheet;
