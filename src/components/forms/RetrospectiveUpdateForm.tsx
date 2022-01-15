import { DateTimePicker, LoadingButton } from "@mui/lab";
import { Box, FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { FormikProps, getIn } from "formik";
import moment from "moment";
import { Moment } from "moment";
import { useMemo } from "react";
import { v4 } from "uuid";
import RetroDesign from "../../extension/RetroDesign";
import styleSheet from "../../resources/styles/components/forms";
import { getQuestionsResolvedLabelsList } from "../../utils/RetroQuestionUtil";
import ConditionalView from "../ConditionalView";

export class RetrospectiveUpdateFormModel {
    title?: string;
    startDate?: Moment;
    config?: {
        votes?: number;
        answerTime?: number;
        votingTime?: number;
        design?: string;
    }
}

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<RetrospectiveUpdateFormModel>,
    hideSave: boolean
}

const RetrospectiveUpdateForm = ({ strings, formik, hideSave }: Props) => {
    const classes = styleSheet();
    const {
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        touched,
        errors,
        handleSubmit,
        isSubmitting
    } = formik;
    const designs: RetroDesign[] = useMemo(() => [
        RetroDesign.DEFAULT,
        RetroDesign.GML,
        RetroDesign.KSS,
        RetroDesign.MLSS
    ], []);
    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <TextField
                        name="title"
                        variant="outlined"
                        label={strings('/retro/field-title')}
                        value={values.title}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && strings(errors.title)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item>
                    <DateTimePicker
                        ampm={false}
                        label={strings('/retro/start-date')}
                        value={values.startDate}
                        onChange={(val) => {
                            setFieldTouched('startDate', true);
                            setFieldValue('startDate', moment(val), true);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={Boolean(touched.startDate && errors.startDate)}
                                helperText={touched.startDate && strings(errors.startDate)}
                            />
                        )}
                    />
                </Grid>
                <Grid item>
                    <FormLabel>{strings('/retro/design')}</FormLabel>
                    <RadioGroup
                        value={values.config?.design}
                        onChange={handleChange}
                    >
                        {designs.map((design) => (
                            <Box key={v4()}>
                                <FormControlLabel
                                    label={getQuestionsResolvedLabelsList(RetroDesign[design], strings)}
                                    control={
                                        <Radio
                                            name="config.design"
                                            value={RetroDesign[design]}
                                        />
                                    }
                                />
                            </Box>
                        ))}
                    </RadioGroup>
                    <FormHelperText 
                        error={Boolean(getIn(touched, 'config.design') && getIn(errors, 'config.design'))}>
                        {getIn(touched, 'config.design') && strings(getIn(errors, 'config.design'))}
                    </FormHelperText>
                </Grid>
                <Grid item>
                    <TextField
                        type="number"
                        name="config.votes"
                        variant="outlined"
                        label={strings('/retro/config-fields/votes')}
                        value={values.config?.votes}
                        error={Boolean(getIn(touched, 'config.votes') && getIn(errors, 'config.votes'))}
                        helperText={getIn(touched, 'config.votes') && strings(getIn(errors, 'config.votes'))}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        type="number"
                        name="config.answerTime"
                        variant="outlined"
                        label={strings('/retro/config-fields/answer-time')}
                        value={values.config?.answerTime}
                        error={Boolean(getIn(touched, 'config.answerTime') && getIn(errors, 'config.answerTime'))}
                        helperText={getIn(touched, 'config.answerTime') && strings(getIn(errors, 'config.answerTime'))}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        type="number"
                        name="config.votingTime"
                        variant="outlined"
                        label={strings('/retro/config-fields/voting-time')}
                        value={values.config?.votingTime}
                        error={Boolean(getIn(touched, 'config.votingTime') && getIn(errors, 'config.votingTime'))}
                        helperText={getIn(touched, 'config.votingTime') && strings(getIn(errors, 'config.votingTime'))}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <ConditionalView condition={!hideSave}>
                    <Grid item className={classes.submitRow}>
                        <LoadingButton
                            loading={isSubmitting}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {strings('/base/save')}
                        </LoadingButton>
                    </Grid>
                </ConditionalView>
            </Grid>
        </form>
    );
}

RetrospectiveUpdateForm.defaultProps = {
    hideSave: false
};

export default RetrospectiveUpdateForm;