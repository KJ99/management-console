import { Box, Typography } from "@mui/material"
import clsx from "clsx"
import Team from "../models/team/Team"
import styleSheet from "../resources/styles/components/WorkspacePicture"
import ConditionalView from "./ConditionalView"

export type Props = {
    workspace?: Team,
    className?: string
}

const getInitials = (name?: string) => {
    const words = name?.split(' ') ?? [];
    return words.map(word => word.charAt(0).toUpperCase()).join('');
}

const WorkspacePicture = ({ workspace, className }: Props) => {
    const classes = styleSheet();
    return (
        <ConditionalView
            condition={workspace?.pictureUrl != null}
            otherwise={
                <Box className={clsx(className, classes.alternative, {
                    [classes.content]: className == null
                })}>
                    <Typography className={classes.label}>
                        {getInitials(workspace?.name)}
                    </Typography>
                </Box>
            }
        >
            <img
                className={clsx(className, {
                    [classes.content]: className == null
                })}
                src={workspace?.pictureUrl}
                alt="picture"
            />
        </ConditionalView>
    )
}

export default WorkspacePicture;