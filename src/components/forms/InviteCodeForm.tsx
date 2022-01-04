import { TextField } from "@mui/material";
import { FormikProps } from "formik";

export class InviteCodeFormModel {
    code: string = ''
}

export type Props = {
    formik: FormikProps<InviteCodeFormModel>,
    strings: (name: any, ...args: any[]) => string
}

const InviteCodeForm = ({ formik, strings }: Props) => {
    const {
        values,
        touched,
        errors,
        handleSubmit,
        handleChange,
        handleBlur
    } = formik;

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                name="code"
                variant="outlined"
                fullWidth
                label={strings("/workspaces/invite-code")}
                value={values.code}
                error={Boolean(touched.code && errors.code)}
                helperText={touched.code && strings(errors.code)}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </form>
    );
}

export default InviteCodeForm;