import { CheckCircle, CheckCircleOutline, KeyboardArrowDown, KeyboardArrowUp, PlayArrow, Refresh, Stop } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, ListItem, Typography } from "@mui/material";
import ConditionalView from "../../components/ConditionalView";
import Page from "../../components/Page";
import IMemberVote from "../../models/live/IMemberVote";
import VotePayload from "../../models/live/payloads/VotePayload";
import Member from "../../models/member/Member";
import Planning from "../../models/planning/Planning";
import PlanningItem from "../../models/planning/PlanningItem";
import Team from "../../models/team/Team";
import styleSheet from "../../resources/styles/pages/plannings/PlanningLivePage";
import { v4 } from "uuid";
import clsx from "clsx";
import { FormikProps } from "formik";
import EstimationForm, { EstimationFormModel } from "../../components/forms/EstimationForm";
import { Fragment, useCallback, useEffect, useState } from "react";
import ProfilePicture from "../../components/ProfilePicture";
import { NavLink } from "react-router-dom";
import { preparePath } from "../../utils/PathUtil";
import paths from '../../routings/paths.json';

export type Props = {
    strings: (name: any, ...args: any[]) => string
    workspace?: Team,
    planning?: Planning,
    onRun: () => void,
    onStopVoting: () => void,
    onResetVoting: () => void,
    started: boolean,
    itemsToEstimate: PlanningItem[];
    focusedItem?: PlanningItem
    estimatedItems: PlanningItem[]
    votingEnabled: boolean
    voters: Member[],
    votes: IMemberVote[],
    estimationFormik: FormikProps<EstimationFormModel>,
    completed: boolean
};

const PlanningLivePage = ({
    strings,
    planning,
    workspace,
    onRun,
    onStopVoting,
    started,
    itemsToEstimate,
    focusedItem,
    estimatedItems,
    votingEnabled,
    voters,
    votes,
    onResetVoting,
    estimationFormik,
    completed
}: Props) => {
    const classes = styleSheet();
    const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(false);
    useEffect(() => {
        setDescriptionExpanded(false);
    }, [focusedItem]);
    const [estimationDialogOpen, setEstimationDialogOpen] = useState<boolean>(false);
    return (
        <Page title={strings('/plannings/live/title', planning?.title)}>
            <Box className={classes.header}>
                <Box>
                    <Typography variant="h4">{planning?.title}</Typography>
                    <Typography variant="body2">{workspace?.name}</Typography>
                </Box>
                <ConditionalView condition={!started}>
                    <Button
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={onRun}
                    >
                        {strings('/plannings/live/run')}
                    </Button>
                </ConditionalView>
            </Box>
            <Grid container spacing={3} justifyContent="align">
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={strings('/plannings/live/to-estimate')} />
                        <CardContent>
                            <List>
                                {itemsToEstimate.map((item) => (
                                    <ListItem key={v4()}>
                                        <Typography className={clsx({
                                            [classes.focusedItem]: item.id == focusedItem?.id
                                        })}>
                                            {item.title}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid
                    item 
                    md={6}
                    xs={12} 
                    container
                    direction="column"
                    spacing={2}
                >
                    <Grid item>
                        <ConditionalView condition={focusedItem != null}>
                            <Card>
                                <CardContent>
                                    <Typography className={classes.itemTitle}>
                                        {focusedItem?.title}
                                    </Typography>
                                    <Collapse 
                                        in={descriptionExpanded} 
                                        collapsedSize={focusedItem?.description ? 50 : 0}
                                    >
                                        {focusedItem?.description}
                                    </Collapse>
                                    <Box className={classes.expandButtonContainer}>
                                        <ConditionalView condition={focusedItem?.description != null}>
                                            <ConditionalView
                                                condition={!descriptionExpanded}
                                                otherwise={
                                                    <Button
                                                        variant="text"
                                                        color="primary"
                                                        onClick={() => setDescriptionExpanded(false)}
                                                        startIcon={<KeyboardArrowUp />}
                                                    >
                                                        {strings('/plannings/live/collapse-desc')}
                                                    </Button>
                                                }
                                            >
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    onClick={() => setDescriptionExpanded(true)}
                                                    startIcon={<KeyboardArrowDown />}
                                                >
                                                    {strings('/plannings/live/expand-desc')}
                                                </Button>
                                            </ConditionalView>
                                        </ConditionalView>
                                    </Box>
                                </CardContent>
                            </Card>
                        </ConditionalView>
                    </Grid>
                    <Grid item>
                        <ConditionalView condition={votingEnabled}>
                            <Card>
                                <CardHeader
                                    title={strings('/plannings/live/voters')}
                                    action={
                                        <Button
                                            variant="contained"
                                            startIcon={<Stop />}
                                            onClick={onStopVoting}
                                        >
                                            {strings('/plannings/live/stop-voting')}
                                        </Button>
                                    }
                                />
                                <CardContent>
                                    <List>
                                        {voters.map((voter) => (
                                            <ListItem key={v4()}>
                                                <ProfilePicture
                                                    user={voter}
                                                />
                                                <Typography className={classes.memberName}>
                                                    {voter.firstName} {voter.lastName}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </ConditionalView>
                    </Grid>
                    <Grid item>
                        <ConditionalView condition={focusedItem != null && !votingEnabled}>
                            <Card>
                                <CardHeader
                                    title={strings('/plannings/live/votes')}
                                    action={
                                        <Fragment>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Refresh />}
                                                className={classes.votesAction}
                                                onClick={onResetVoting}
                                            >
                                                {strings('/plannings/live/clear-votes')}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                className={classes.votesAction}
                                                onClick={() => setEstimationDialogOpen(true)}
                                            >
                                                {strings('/plannings/live/estimate')}
                                            </Button>
                                        </Fragment>
                                    }
                                />
                                <CardContent>
                                    <List>
                                        {votes.map((vote) => (
                                            <ListItem key={v4()}>
                                                <ProfilePicture
                                                    user={vote.member}
                                                />
                                                <Typography className={classes.memberName}>
                                                    {vote.member?.firstName} {vote.member?.lastName}
                                                </Typography>
                                                <Box flexGrow={1} />
                                                <Typography>
                                                    {vote.estimation}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </ConditionalView>
                    </Grid>
                </Grid>
                <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
                    <Card>
                        <CardHeader title={strings('/plannings/live/estimated')} />
                        <CardContent>
                            <List>
                                {estimatedItems.map((item) => (
                                    <ListItem key={v4()}>
                                        <Typography>{item.title}</Typography>
                                        <Box flexGrow={1} />
                                        <Typography>{item.estimation}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Dialog
                open={estimationDialogOpen}
                onClose={() => setEstimationDialogOpen(false)}
            >
                <DialogTitle>
                    {strings('/plannings/live/estimate-item', focusedItem?.title)}
                </DialogTitle>
                <DialogContent>
                    <EstimationForm
                        strings={strings}
                        formik={estimationFormik}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={() => setEstimationDialogOpen(false)}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            estimationFormik.submitForm()
                                .then(() => {
                                    setEstimationDialogOpen(false);
                                });
                        }}
                    >
                        {strings('/base/save')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={completed}>
                <DialogContent>
                    <Box className={classes.completedDialogContent}>
                        <CheckCircleOutline color="success" fontSize="large" />
                        <Typography className={classes.completedDialogText}>
                            {strings('/plannings/live/completed', planning?.title)}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="info"
                            component={NavLink}
                            to={preparePath(
                                paths.app.workspaces.planning.details,
                                {
                                    workspaceId: workspace?.id,
                                    planningId: planning?.id
                                }
                            )}
                        >
                            {strings('/plannings/live/see-results')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Page>
    );
};

PlanningLivePage.defaultProps = {
    strings: (name: any, ...args: any[]) => '',
    workspace: null,
    planning: null,
    onRun: () => {},
    onStopVoting: () => {},
    started: false,
    itemsToEstimate: [],
    estimatedItems: [],
    votingEnabled: false,
    voters: [],
    votes: [],
    onResetVoting: () => {},
    estimationFormik: {},
    completed: false
}

export default PlanningLivePage;
