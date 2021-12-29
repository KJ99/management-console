import { LoadingButton } from '@mui/lab';
import { Box, FormHelperText, Grid, Link, TextField, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import LoginModel from '../../models/auth/LoginModel';
import styleSheet from '../../resources/styles/components/forms';
import { preparePath } from '../../utils/PathUtil';
import paths from '../../routings/paths.json';
import { Link as RouterLink } from 'react-router-dom';
import ConditionalView from '../ConditionalView';

export class LoginFormModel {
    username: string = '';
    password: string = '';
    submit: any = null;
}

export type Props = {
    formik: FormikProps<LoginFormModel>,
    strings: (name: string, ...args: string[]) => string
};

const LoginForm = ({ strings, formik }: Props) => {
    const classes = styleSheet();
    const {
        isSubmitting,
        handleSubmit,
        values,
        handleChange,
        handleBlur,
        errors
    } = formik;
    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <ConditionalView condition={errors.submit != null}>
                    <Grid item>
                        <FormHelperText error>
                            {errors.submit}
                        </FormHelperText>
                    </Grid>
                </ConditionalView>
                <Grid item>
                    <TextField
                        fullWidth
                        name="username"
                        variant="outlined"
                        label={strings('/login/username')}
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        name="password"
                        type="password"
                        variant="outlined"
                        label={strings('/login/password')}
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Grid>
                <Grid item className={classes.submitRow}>
                    <LoadingButton
                        type="submit"
                        loading={isSubmitting}
                        variant="contained"
                        color="primary"
                    >
                        {strings('/login/submit')}
                    </LoadingButton>
                </Grid>
                <Grid item>
                    <Box display="flex" justifyContent="center">
                       <Typography mr={2}>
                            {strings('/login/no-account')}
                        </Typography>
                        <Link component={RouterLink} to={paths.auth.register}>
                            {strings('/login/sign-up')}
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}

export default LoginForm;