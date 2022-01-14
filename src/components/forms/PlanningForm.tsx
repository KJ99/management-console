import { DateTimePicker, LoadingButton } from "@mui/lab";
import { Grid, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { Moment } from "moment";
import styleSheet from "../../resources/styles/components/forms";
import ConditionalView from "../ConditionalView";

export class PlanningFormModel {
    title?: string;
    startDate?: Moment
}

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<PlanningFormModel>,
    hideSave: boolean
}

const PlanningForm = ({ strings, formik, hideSave }: Props) => {
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
    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <TextField
                        name="title"
                        variant="outlined"
                        label={strings('/plannings/field-title')}
                        value={values.title}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && strings(errors.title)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item>
                    <DateTimePicker
                        label={strings('/plannings/start-date')}
                        value={values.startDate}
                        onChange={(val) => {
                            setFieldTouched('startDate', true);
                            setFieldValue('startDate', val, true);
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

PlanningForm.defaultProps = {
    hideSave: false
};

export default PlanningForm;