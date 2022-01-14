import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { DefaultPageSize } from "../../utils/Environment";
import { FormikHelpers, FormikProps, FormikValues, useFormik } from "formik";
import moment from "moment";
import { useNavigate } from "react-router";
import { mapper } from "../../utils/Mapper";
import { preparePath } from "../../utils/PathUtil";
import paths from '../../routings/paths.json';
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../../utils/ErrorProcessor";
import * as Yup from 'yup';
import RetrospectivesClient from "../../infrastructure/clients/retro-helper/RetrospectivesClient";
import { RetrospectiveFormModel } from "../../components/forms/RetrospectiveForm";
import RetrospectiveModel from "../../models/retrospective/RetrospectiveModel";
import RetroDesign from "../../extension/RetroDesign";

const client = new RetrospectivesClient();

const RetrospectiveCreateViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        (values: RetrospectiveFormModel, helpers: FormikHelpers<RetrospectiveFormModel>) => {
            const model = mapper.map(values, RetrospectiveModel, RetrospectiveFormModel);
            model.teamId = workspace?.id;
            client.createRetro(model)
                .then((retro) => {
                    enqueueSnackbar(strings('/retro/create-success'), { variant: 'success' });
                    navigate(
                        preparePath(
                            paths.app.workspaces.retro.details,
                            {
                                workspaceId: workspace?.id,
                                retroId: retro.id
                            }
                        )
                    );
                })
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/retro/create-fail'), { variant: 'error' });
                    }
                })
                .finally(() => helpers.setSubmitting(false));
        },
        [workspace, enqueueSnackbar, strings]
    );

    const formik = useFormik<RetrospectiveFormModel>({
        initialValues: {
            title: '',
            startDate: moment().add(1, 'day'),
            design: RetroDesign[RetroDesign.DEFAULT]
        },
        onSubmit: handleSubmit,
        validationSchema: Yup.object({
            title: Yup.string().test({
                name: 'non-empty',
                message: '/errors/non-empty',
                test: (val) => typeof val == 'string' && val.trim().length > 0
            }),
            startDate: Yup.date().min(moment().toDate(), '/errors/date-in-future')
        })
    });
    
    return Children.only(
        cloneElement(
            children,
            {
                strings,
                workspace,
                formik
            }
        )
    );
}

export default RetrospectiveCreateViewModel;