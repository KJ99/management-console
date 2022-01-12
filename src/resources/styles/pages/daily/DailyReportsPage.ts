import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    membersWithoutReportLabel: {
        fontWeight: theme.typography.fontWeightBold,
        marginTop: theme.spacing(6),
    },
}));

export default styleSheet;
