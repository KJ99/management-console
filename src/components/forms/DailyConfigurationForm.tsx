import { LoadingButton, TimePicker } from "@mui/lab";
import { Button, Grid, TextField } from "@mui/material";
import { FormikProps } from "formik"
import { Moment } from "moment";
import styleSheet from "../../resources/styles/components/forms";

export class DailyConfigFormModel {
    hourlyDeadline?: Moment
}

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<DailyConfigFormModel>
}

const DailyConfigurationForm = ({ formik, strings }: Props) => {
    const classes = styleSheet();
    const {
        values,
        errors,
        touched,
        handleSubmit,
        handleBlur,
        setFieldValue,
        isSubmitting
    } = formik;

    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <TimePicker
                        label={strings('/daily/deadline')}
                        ampm={false}
                        value={values.hourlyDeadline}
                        onChange={(value) => {
                            setFieldValue('hourlyDeadline', value, true);
                        }}
                        renderInput={(props) => (
                            <TextField
                                {...props}
                                onBlur={handleBlur}
                                error={Boolean(touched.hourlyDeadline && errors.hourlyDeadline)}
                                helperText={touched.hourlyDeadline && strings(errors.hourlyDeadline)}
                            />
                        )}
                    />
                </Grid>
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
            </Grid>
        </form>
    );
}

export default DailyConfigurationForm;