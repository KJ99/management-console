import { FormControlLabel, FormHelperText, Grid, Switch, TextField } from '@mui/material';
import styleSheet from '../../resources/styles/components/forms';
import LoadingButton from '@mui/lab/LoadingButton';
import { FormikProps } from 'formik';

export interface ISignUpFormValues {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    confirmPassword: string,
    accept: boolean,
    submit: unknown
}

export class SignUpFormValues implements ISignUpFormValues {
    email: string = '';
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    password: string = '';
    confirmPassword: string = '';
    accept: boolean = false;
    submit: unknown;

}

export type Props = {
    strings: (name: any, ...args: string[]) => string,
    formProps: FormikProps<ISignUpFormValues>
};

const SignUpForm = ({ strings, formProps }: Props) => {
    const classes = styleSheet();
    const {
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting
    } = formProps;
    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <FormHelperText error={true}>
                        {strings(errors.submit)}
                    </FormHelperText>
                </Grid>
                <Grid item>
                    <TextField
                        name="email"
                        fullWidth
                        variant="outlined"
                        label={strings("/registration/form-labels/email")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && strings(errors.email)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="username"
                        fullWidth
                        variant="outlined"
                        label={strings("/registration/form-labels/username")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && strings(errors.username)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="firstName"
                        fullWidth
                        variant="outlined"
                        label={strings("/registration/form-labels/first-name")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={touched.firstName && strings(errors.firstName)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="lastName"
                        fullWidth
                        variant="outlined"
                        label={strings("/registration/form-labels/last-name")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && strings(errors.lastName)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        label={strings("/registration/form-labels/password")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && strings(errors.password)}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="confirmPassword"
                        type="password"
                        fullWidth
                        variant="outlined"
                        label={strings("/registration/form-labels/confirm-password")}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        helperText={touched.confirmPassword && strings(errors.confirmPassword)}
                    />
                </Grid>
                <Grid item>
                    <FormHelperText error={Boolean(touched.accept && errors.accept)}>
                        {touched.accept && strings(errors.accept)}
                    </FormHelperText>
                    <FormControlLabel
                        control={
                            <Switch
                                name="accept"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        }
                        label={strings("/registration/form-labels/aggreement")}
                    />
                </Grid>
                <Grid item className={classes.submitRow}>
                    <LoadingButton
                        loading={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {strings("/registration/form-labels/submit")}
                    </LoadingButton>
                </Grid>
            </Grid>
        </form>
    );
}

export default SignUpForm;