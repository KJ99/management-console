import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    root: {
        width: 256,
        paddingBottom: theme.spacing(10)
    },
    pernamentPaper: {
        marginTop: 64
    },
    backgroindDay: {
        backgroundColor: theme.palette.primary.main
    },
    header: {
        height: 240,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(6)
    },
    picture: {
        width: 128,
        height: 128,
        objectFit: 'cover',
        borderRadius: '100%'
    },
    workspaceName: {
        fontWeight: theme.typography.fontWeightBold,
        marginTop: theme.spacing(3)
    },
    changeWorkspaceLink: {
        color: theme.palette.info.main,
        textDecoration: 'none',
        marginTop: theme.spacing(3)
    },
    contentRoot: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        paddingBottom: 20
    },
    divider: {
        flexGrow: 1
    },
    itemTitle: {
        marginLeft: theme.spacing(1),
        color: 'inherit'
    },
    item: (props: any) => ({
        cursor: 'pointer',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(3 + (props?.depth * 2)),
    }),
    linkActive: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.grey[200]
    },
    linkItem: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200]
        }
    },
    itemIcon: {
        color: 'inherit'
    }
}));

export default styleSheet;