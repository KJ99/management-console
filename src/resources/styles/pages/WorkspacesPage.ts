import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    listActionCard: {
        height: 256,
        width: 256,
        border: `2px dotted`,
        borderColor: theme.palette.grey[500],
        color: theme.palette.grey[500],
        fontWeight: theme.typography.fontWeightBold,
        '&:hover': {
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
        }
    },
    workspaceCard: {
        height: 256,
        width: 256,
        textAlign: 'left'
    },
    workspaceImage: {
        width: '100%',
        height: 96,
        objectFit: 'cover'
    },
    workspaceName: {
        fontWeight: theme.typography.fontWeightBold,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: 64,
    },
    workspaceRolesContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 64
    },
    workspaceRoles: {
        color: theme.palette.grey[500],
        fontStyle: 'italic',
        fontSize: '0.8rem'
    },
    rolesIcon: {
        marginRight: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    createDialog: {
        width: '50vw'
    },
    workspaceJoinImage: {
        width: 256,
        height: 128,
        objectFit: 'contain'
    },
    confirmJoinDialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    workspaceToJoinTitle: {
        fontSize: '1.3rem',
        fontWeight: theme.typography.fontWeightBold,
        marginTop: theme.spacing(3)
    },
    nextPageContainer: {
        height: 256,
        width: 256,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));

export default styleSheet;