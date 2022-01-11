import { Button, Grid, TextField } from "@mui/material";
import { FormikProps } from "formik";
import Unit from "../../extension/Unit";
import styleSheet from "../../resources/styles/components/forms";
import FileDropzone from "../FileDropzone";

export class ProfileFormModel {
    username?: string;
    firstName?: string;
    lastName?: string;
    picture?: File
}

export type Props = {
    strings: (name: any, ...args: any[]) => string,
    formik: FormikProps<ProfileFormModel>,
    onCancel: () => void
}

const ProfileEditForm = ({ strings, formik, onCancel }: Props) => {
    const classes = styleSheet();
    const {
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        handleSubmit,
        setFieldValue
    } = formik;
    return (
        <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <TextField
                        disabled
                        name="username"
                        fullWidth
                        variant="outlined"
                        label={strings('/registration/form-labels/username')}
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.username && errors.username)}
                        helperText={touched.username && errors.username}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="firstName"
                        fullWidth
                        variant="outlined"
                        label={strings('/registration/form-labels/first-name')}
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        name="lastName"
                        fullWidth
                        variant="outlined"
                        label={strings('/registration/form-labels/last-name')}
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                    />
                </Grid>
                <Grid item>
                    <FileDropzone
                        accept="image/*"
                        strings={strings}
                        value={values.picture}
                        onChange={(file?: File) => setFieldValue('picture', file, true)}
                        maxSize={5 * Unit.MEGABYTE}
                        label={strings('/profile/provide-picture')}
                        error={Boolean(touched.picture && errors.picture)}
                        helperText={touched.picture && errors.picture}
                    />
                </Grid>
                <Grid item className={classes.submitRow}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onCancel}
                        className={classes.cancelAction}
                    >
                        {strings('/base/cancel')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        {strings('/base/save')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default ProfileEditForm;