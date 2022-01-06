import { Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const styleSheet = makeStyles((theme: Theme) => createStyles({
    workspaceImage: {
        maxHeight: 256,
        width: '100%',
        objectFit: 'contain',
        borderRadius: 0
    },
    workspaceName: {
        fontWeight: theme.typography.fontWeightBold
    },
    memberCard: {
        display: 'flex',
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        flexWrap: 'wrap'
    },
    memberPictureContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        flex: 1,
    },
    memberActionsContainer: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            justifyContent: 'flex-end',
        },
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
        },
        alignItems: 'center',
        flex: 2,
        flexWrap: 'wrap'
    },
    memberCardContent: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        [theme.breakpoints.up('xs')]: {
            alignItems: 'flex-start',
        },
        [theme.breakpoints.down('xs')]: {
            alignItems: 'center',
        },
        flex: 6
    },
    memberAction: {
        margin: theme.spacing(1)
    },
    themePreviewContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(3)
    },
    themePreviewBox: (props: any) => ({
        width: 25,
        height: 25,
        backgroundColor: props.colorScheme.primary,
        marginRight: theme.spacing(3)
    }),
    membersSection: {
        marginTop: theme.spacing(6)
    },
    memberName: {
        fontWeight: theme.typography.fontWeightBold,
        textAlign: 'center'
    },
    rolesContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1)
    },
    rolesIcon: {
        marginRight: theme.spacing(1)
    },
    invitationSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: theme.spacing(3)
    },
    invitationSectionTitle: {
        fontWeight: theme.typography.fontWeightBold,
        marginBottom: theme.spacing(2)
    }
}))

export default styleSheet;