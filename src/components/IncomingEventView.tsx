import { Search, Add } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import moment from "moment";
import { NavLink } from "react-router-dom";
import WorkspaceRole from "../extension/WorkspaceRole";
import IEvent from "../models/IEvent";
import styleSheet from "../resources/styles/components/IncomingEventView";
import ConditionalView from "./ConditionalView";
import RestrictedView from "./RestrictedView";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    event?: IEvent,
    onStart: () => void,
    scheduled: boolean,
    createUrl: string
}

const IncomingEventView = ({
    event,
    onStart,
    strings,
    scheduled,
    createUrl
}: Props) => {
    const classes = styleSheet();
    return (
        <ConditionalView
            condition={scheduled}
            otherwise={
                <Card className={classes.alternativeCard}>
                    <CardMedia>
                        <Search
                            fontSize="large"
                        />
                    </CardMedia>
                    <CardContent>
                        <Typography>
                            {strings('/plannings/not-scheduled')}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <RestrictedView permittedRoles={[WorkspaceRole.SCRUM_MASTER]}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                component={NavLink}
                                to={createUrl}
                            >
                                {strings('/plannings/create')}
                            </Button>
                        </RestrictedView>
                    </CardActions>
                </Card>
            }
        >
            <Card className={classes.eventCard}>
                <CardContent className={classes.eventContent}>
                    <Typography className={classes.eventTitle}>
                        {event?.title}
                    </Typography>
                    <Typography className={classes.eventDate}>
                            {moment(event?.startDate).format('LLLL')}
                    </Typography>
                </CardContent>
                <CardActions className={classes.eventActions}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onStart}
                    >
                        {strings('/base/start')}
                    </Button>
                </CardActions>
            </Card>
        </ConditionalView>
    );
};

IncomingEventView.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    event: null,
    onStart: () => {},
    scheduled: false,
    createUrl: '#'
}

export default IncomingEventView;
