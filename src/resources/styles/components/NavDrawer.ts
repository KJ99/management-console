import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
        width: 256
    },
    pernamentPaper: {
        marginTop: 64
    }
}));

export default styleSheet;