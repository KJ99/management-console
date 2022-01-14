import { DateTimePicker, LoadingButton } from "@mui/lab";
import { Box, FormControlLabel, FormHelperText, FormLabel, Grid, Radio, RadioGroup, TextField } from "@mui/material";
import { FormikProps } from "formik";
import moment from "moment";
import { Moment } from "moment";
import { useMemo } from "react";
import { v4 } from "uuid";
import RetroDesign from "../../extension/RetroDesign";
import styleSheet from "../../resources/styles/components/forms";
import { getQuestionsResolvedLabelsList } from "../../utils/RetroQuestionUtil";
import ConditionalView from "../ConditionalView";

export class RetrospectiveFormModel {
    title?: string;
    startDate?: Moment;
    design?: string
}

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<RetrospectiveFormModel>,
    hideSave: boolean
}

const RetrospectiveForm = ({ strings, formik, hideSave }: Props) => {
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
                        value={values.design}
                        onChange={handleChange}
                    >
                        {designs.map((design) => (
                            <Box key={v4()}>
                                <FormControlLabel
                                    label={getQuestionsResolvedLabelsList(RetroDesign[design], strings)}
                                    control={
                                        <Radio
                                            name="design"
                                            value={RetroDesign[design]}
                                        />
                                    }
                                />
                            </Box>
                        ))}
                    </RadioGroup>
                    <FormHelperText error={Boolean(touched.design && errors.design)}>
                        {touched.design && errors.design}
                    </FormHelperText>
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

RetrospectiveForm.defaultProps = {
    hideSave: false
};

export default RetrospectiveForm;