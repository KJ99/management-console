import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        border: '1px solid',
        borderColor: theme.palette.grey[400],
        color: theme.palette.grey[500],
        cursor: 'pointer'
    },
    active: {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main
    },
    label: {
        color: 'inherit',
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: '1.2rem'
    },
    previewsContainer: {
        marginTop: theme.spacing(3),
        display: 'flex'
    },
    preview: {
        width: 128,
    },
    previewPicture: {
        width: 128,
        height: 64,
        objectFit: 'contain'
    },
    previewFileName: {
        fontWeight: theme.typography.fontWeightBold
    },
    previewFileSize: { 
        fontWeight: theme.typography.fontWeightLight,
        color: theme.palette.grey[600]
    }
}));

export default styleSheet;