import { MenuItem, TextField } from "@mui/material";
import { FormikProps } from "formik";

export class EstimationFormModel {
    estimation?: string
};

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<EstimationFormModel>
}

const EstimationForm = ({ strings, formik }: Props) => {
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched
    } = formik;
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                select
                fullWidth
                name="estimation"
                variant="outlined"
                value={values.estimation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.estimation && errors.estimation)}
                helperText={touched.estimation && strings(errors.estimation)}
            >
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
                <MenuItem value="XXL">XXL</MenuItem>
                <MenuItem value="XXXL">XXXL</MenuItem>
                <MenuItem value="XXXXL">XXXXL</MenuItem>
            </TextField>
        </form>
    );
}

export default EstimationForm;
