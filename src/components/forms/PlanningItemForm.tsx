import { DateTimePicker, LoadingButton } from "@mui/lab";
import { Grid, TextField } from "@mui/material";
import { FormikProps } from "formik";
import { Moment } from "moment";
import PlanningItemModel from "../../models/planning/PlanningItemModel";
import PlanningItemUpdateModel from "../../models/planning/PlanningItemUpdateModel";
import styleSheet from "../../resources/styles/components/forms";

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<PlanningItemModel|PlanningItemUpdateModel>
}

const PlanningItemForm = ({ strings, formik }: Props) => {
    const classes = styleSheet();
    const {
        values,
        handleChange,
        handleBlur,
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
                    <TextField
                        name="description"
                        variant="outlined"
                        label={strings('/plannings/field-description')}
                        value={values.description}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && strings(errors.description)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        multiline
                        rows={3}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default PlanningItemForm;