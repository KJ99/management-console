import { Add, CalendarToday, CheckCircleOutline, ChevronRight, Delete, Edit, Person, SportsScore, ThumbUp, Timer, TimerOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tab, Tabs, Typography } from "@mui/material";
import { FormikProps } from "formik";
import { Fragment, useEffect, useMemo, useState } from "react";
import ConditionalView from "../../components/ConditionalView";
import ActionItemForm, { ActionItemFormModel } from "../../components/forms/ActionItemForm";
import NotesColumn from "../../components/NotesColumn";
import Page from "../../components/Page";
import RetroQuestionKey from "../../extension/RetroQuestionKey";
import RetroStep from "../../extension/RetroStep";
import Answer from "../../models/retrospective/Answer";
import Retrospective from "../../models/retrospective/Retrospective";
import Team from "../../models/team/Team";
import styleSheet from "../../resources/styles/pages/retrospectives/RetrospectiveLivePage";
import { getAnswerColumnLabel, getQuestions } from "../../utils/RetroQuestionUtil";
import { useTimer } from 'use-timer';
import Countdown from "../../components/Countdown";
import { v4 } from "uuid";
import ActionItem from "../../models/retrospective/ActionItem";
import Member from "../../models/member/Member";
import { NavLink } from "react-router-dom";
import { preparePath } from "../../utils/PathUtil";
import paths from '../../routings/paths.json';

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    workspace?: Team,
    retro?: Retrospective,
    onNextStep: () => void,
    actionCreateFormik: FormikProps<ActionItemFormModel>
    actionUpdateFormik: FormikProps<ActionItemFormModel>
    answers: Answer[],
    step: RetroStep,
    actionItems: ActionItem[],
    actionToUpdate?: ActionItem
    creatingAction: boolean,
    members: Member[],
    onDeleteAction: (action: ActionItem) => void,
    onCreateAction: () => void,
    onEditAction: (action: ActionItem) => void,
    onEditActionCancel: () => void,
    onCreateActionCancel: () => void,
    completed: boolean
}

const answersForQuestion = (answers: Answer[], question: RetroQuestionKey) => 
    answers.filter((ans) => ans.column === RetroQuestionKey[question]);

const sortAnswers = (a: Answer, b: Answer) =>
    (b.votes ?? 0) - (a.votes ?? 0);

const RetrospectiveLivePage = ({
    strings,
    workspace,
    retro,
    onNextStep,
    answers,
    step,
    actionItems,
    creatingAction,
    members,
    onDeleteAction,
    onCreateAction,
    onEditAction,
    actionCreateFormik,
    actionUpdateFormik,
    onEditActionCancel,
    onCreateActionCancel,
    actionToUpdate,
    completed
}: Props) => {
    const classes = styleSheet();
    const questions = useMemo(() => getQuestions(retro?.configuration?.design ?? ''), [retro]);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [timerInitialSeconds, setTimerInitialSeconds] = useState<number>(0);
    useEffect(() => {
        setTimerRunning(false);
        const base = step === RetroStep.ANSWER 
            ? retro?.configuration?.answerTime ?? 0
            : retro?.configuration?.votingTime ?? 0;
        setTimerInitialSeconds(base * 60);
    }, [step, retro]);
    return (
        <Page title={strings('/retro/live/page-title')}>
            <Box className={classes.header}>
                <Box>
                    <Typography variant="h4">{retro?.title}</Typography>
                    <Typography variant="body2">{workspace?.name}</Typography>
                </Box>
                <ConditionalView 
                    condition={step != RetroStep.SUMMARIZE}
                    otherwise={
                        <Button
                            variant="contained"
                            startIcon={<SportsScore />}
                            onClick={onNextStep}
                        >
                            {strings('/retro/live/finish')}
                        </Button>
                    }
                >
                    <Button
                        variant="contained"
                        startIcon={<ChevronRight />}
                        onClick={onNextStep}
                    >
                        {strings('/retro/live/next-step')}
                    </Button>
                </ConditionalView>
            </Box>
            <Tabs variant="fullWidth" value={step}>
                <Tab disableRipple label={strings('/retro/live/answer')} value={RetroStep.ANSWER} />
                <Tab disableRipple label={strings('/retro/live/vote')} value={RetroStep.VOTE} />
                <Tab disableRipple label={strings('/retro/live/summarize')} value={RetroStep.SUMMARIZE} />
            </Tabs>
            <Box mt={6}>
                <ConditionalView condition={step == RetroStep.ANSWER || step == RetroStep.VOTE}>
                    <Box>
                        <Box className={classes.timerContainer}>
                            <ConditionalView
                                condition={timerRunning}
                                otherwise={
                                    <Button
                                        variant="contained"
                                        startIcon={<TimerOutlined />}
                                        onClick={() => setTimerRunning(true)}
                                    >
                                        {strings('/retro/live/start-timer')}
                                    </Button>
                                }
                            >
                                <Countdown initialSeconds={timerInitialSeconds} />
                            </ConditionalView>
                        </Box>
                        <Grid container spacing={4} justifyContent="center">
                            {questions.map((question) => (
                                <Grid item md={12 / questions.length} xs={12} key={v4()}>
                                    <NotesColumn
                                        title={strings(question.label)}
                                        notes={answersForQuestion(answers, question.key)}
                                        getNoteTitle={
                                            (answer) => 
                                                step === RetroStep.VOTE ? answer.content : ''
                                        }
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </ConditionalView>
                <ConditionalView condition={step == RetroStep.SUMMARIZE}>
                    <Grid container spacing={6}>
                        <Grid item md={6} xs={12}>
                            <Box className={classes.summarizeSectionHeader}>
                                <Typography className={classes.summarizeSectionTitle}>
                                    {strings('/retro/live/action-items')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={onCreateAction}
                                >
                                    {strings('/base/create')}
                                </Button>
                            </Box>
                            {actionItems.map((action) => {
                                const assignee = members.find(
                                    (member) =>
                                        member.userId === action.assigneeId
                                );
                                return (
                                    <Card className={classes.actionItemCard} key={v4()}>
                                        <CardContent>
                                            <Typography>{action.title}</Typography>
                                            <Box className={classes.actionData}>
                                                {action.dueDate != null && (
                                                    <Fragment>
                                                        <CalendarToday className={classes.actionDataIcon} />
                                                        <Typography className={classes.actionDataItem}>
                                                            {action.dueDate}
                                                        </Typography>
                                                    </Fragment>
                                                )}
                                                {assignee != null && (
                                                    <Fragment>
                                                        <Person className={classes.actionDataIcon} />
                                                        <Typography className={classes.actionDataItem}>
                                                            {assignee.firstName} {assignee.lastName}
                                                        </Typography>
                                                    </Fragment>
                                                )}
                                            </Box>
                                        </CardContent>
                                        <CardActions className={classes.actionItemActionsContainer}>
                                            <Button
                                                variant="contained"
                                                startIcon={<Edit />}
                                                onClick={() => onEditAction(action)}
                                                className={classes.actionItemAction}
                                            >
                                                {strings('/base/edit')}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                startIcon={<Delete />}
                                                color="error"
                                                onClick={() => onDeleteAction(action)}
                                                className={classes.actionItemAction}
                                            >
                                                {strings('/base/delete')}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                );
                            })}
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box className={classes.summarizeSectionHeader}>
                                <Typography className={classes.summarizeSectionTitle}>
                                    {strings('/retro/live/answers-list')}
                                </Typography>
                            </Box>
                            {answers.sort(sortAnswers).map((answer) => (
                                <Card className={classes.answerCard} key={v4()}>
                                    <CardContent>
                                        <Typography>{answer.content}</Typography>
                                        <Typography variant="body2">
                                            {strings(getAnswerColumnLabel(answer))}
                                        </Typography>
                                    </CardContent>
                                    <CardActions className={classes.votesRow}>
                                        <ThumbUp className={classes.votesLabel} fontSize="small" />
                                        <Typography className={classes.votesLabel}>
                                            {answer.votes}
                                        </Typography>
                                    </CardActions>
                                </Card>
                            ))}
                        </Grid>
                    </Grid>
                </ConditionalView>
            </Box>
            <Dialog open={actionToUpdate != null} onClose={onEditActionCancel}>
                <DialogTitle>{strings('/retro/live/edit-action-title')}</DialogTitle>
                <DialogContent>
                    <Box pt={3}>
                    <ActionItemForm
                        strings={strings}
                        formik={actionUpdateFormik}
                        members={members}
                    />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={onEditActionCancel}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={actionUpdateFormik.submitForm}
                    >
                        {strings('/base/save')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={creatingAction} onClose={onCreateActionCancel}>
                <DialogTitle>{strings('/retro/live/create-action')}</DialogTitle>
                <DialogContent>
                    <Box pt={3}>
                        <ActionItemForm
                            strings={strings}
                            formik={actionCreateFormik}
                            members={members}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        onClick={onCreateActionCancel}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={actionCreateFormik.submitForm}
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
                            {strings('/retro/live/completed', retro?.title)}
                        </Typography>
                        <Button
                            variant="outlined"
                            color="info"
                            component={NavLink}
                            to={preparePath(
                                paths.app.workspaces.retro.details,
                                {
                                    workspaceId: workspace?.id,
                                    retroId: retro?.id
                                }
                            )}
                        >
                            {strings('/retro/live/see-results')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Page>
    );
};

RetrospectiveLivePage.defaultProps = {
    strings: () => '',
    onNextStep: () => {},
    answers: [],
    step: RetroStep.ANSWER,
    actionItems: [],
    creatingAction: false,
    members: [],
    onDeleteAction: (action: ActionItem) => {},
    onCreateAction: () => {},
    onEditAction: (action: ActionItem) => {},
    actionCreateFormik: {},
    actionUpdateFormik: {},
    onEditActionCancel: () => {},
    onCreateActionCancel: () => {},
    completed: false
}

export default RetrospectiveLivePage;
