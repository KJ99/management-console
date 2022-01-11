import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { StringsContext } from "../contexts/StringsContext";
import { ViewModelProps } from "./ViewModelProps";
import { AuthContext } from '../contexts/AuthContext';
import ProfileClient from "../infrastructure/clients/identity-server/ProfileClient";
import Profile from "../models/profile/Profile";
import User from "../models/profile/User";
import { useSnackbar } from "notistack";
import { FormikHelpers, useFormik } from "formik";
import { ProfileFormModel } from "../components/forms/ProfileEditForm";
import * as Yup from 'yup';
import { mapper } from "../utils/Mapper";
import ProfileUpdateModel from "../models/profile/ProfileUpdateModel";
import IdentityResourcesClient from "../infrastructure/clients/identity-server/IdentityResourcesClient";
import BadRequestError from "../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../utils/ErrorProcessor";
import { useLocation } from "react-router";

const client = new ProfileClient();

const ProfileViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { setUser } = useContext(AuthContext);
    const location = useLocation();
    const returnUrl: string = useMemo(() => {
        const state: any = location.state;
        return state?.returnUrl ?? '/';
    }, [location]);
    const [loaded, setLoaded] = useState(false);
    const [profile, setProfile] = useState<User|undefined>();
    const [editMode, setEditMode] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const load = useCallback(() => {
        setLoaded(false);
        client.getCurrentUserProfile()
            .then(user => setProfile(user))
            .catch(e => {
                enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' });
            })
            .finally(() => setLoaded(true));
    }, [enqueueSnackbar, strings]);

    useEffect(() => {
        load();
    }, [load]);

    const handleUpdate = useCallback(
        async (values: ProfileFormModel, helpers: FormikHelpers<ProfileFormModel>) => {
            if(profile == null) {
                return;
            }
            const model = mapper.map(values, ProfileUpdateModel, ProfileFormModel);
            if (values.picture != null) {
                try {
                    const uploadClient = new IdentityResourcesClient();
                    const file = await uploadClient.upload({ file: values.picture });
                    model.pictureId = file.id
                } catch(e) {
                    enqueueSnackbar(strings('/errors/unknown'), { variant: 'error' });
                    helpers.setSubmitting(false);
                    return;
                }
            } else {
                model.pictureId = profile?.pictureId;
            }
            try {
                await client.updateProfile(profile, model);
                enqueueSnackbar(strings('/profile/edit-success'), { variant: 'success' });
                helpers.resetForm();
                setEditMode(false);
                load();
            } catch (e) {
                if (e instanceof BadRequestError) {
                    helpers.setErrors(processFormError(e.errors));
                } else {
                    enqueueSnackbar(strings('/profile/edit-fail', { variant: 'error' }));
                }
            } finally {
                helpers.setSubmitting(false);
            }   
        },
        [load, enqueueSnackbar, strings, profile]
    );

    const formik = useFormik<ProfileFormModel>({
        initialValues: {
            firstName: '',
            lastName: '',
            username: '',
            picture: undefined
        },
        onSubmit: handleUpdate,
        validationSchema: Yup.object({
            firstName: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            }),
            lastName: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            }),
        })
    });

    const setUpFormikValues = useCallback((profile) => {
        if (profile != null) {
            formik.setValues(mapper.map(profile, ProfileFormModel, User));
        }
    }, [formik.setValues]);

    useEffect(() => {
        setUpFormikValues(profile)
    }, [setUpFormikValues, profile]);

    const handleEnterEditMode = useCallback(() => setEditMode(true), []);
    const handleQuitEditMode = useCallback(() => {
        setEditMode(false);
        setUpFormikValues(profile);
    }, [setUpFormikValues, profile]);

    useEffect(() => {
        if(profile != null) {
            setUser(profile);
        }
    }, [profile, setUser])

    return Children.only(
        cloneElement(
            children,
            {
                strings,
                profile,
                loaded,
                editMode,
                onEnterEditMode: handleEnterEditMode,
                onQuitEditMode: handleQuitEditMode,
                formik,
                returnUrl
            }
        )
    );
}

export default ProfileViewModel;