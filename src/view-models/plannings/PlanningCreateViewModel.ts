import { Children, cloneElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { StringsContext } from "../../contexts/StringsContext";
import { ViewModelProps } from "../ViewModelProps";
import { WorkspaceContext } from "../../contexts/WorkspaceContext";
import ReportsClient from "../../infrastructure/clients/daily-helper/ReportsClient";
import { DefaultPageSize } from "../../utils/Environment";
import { FormikHelpers, FormikProps, FormikValues, useFormik } from "formik";
import { PlanningFormModel } from "../../components/forms/PlanningForm";
import moment from "moment";
import PlanningsClient from "../../infrastructure/clients/planning-poker/PlanningsClient";
import { useNavigate } from "react-router";
import { mapper } from "../../utils/Mapper";
import PlanningModel from "../../models/planning/PlanningModel";
import { preparePath } from "../../utils/PathUtil";
import paths from '../../routings/paths.json';
import BadRequestError from "../../infrastructure/api/exceptions/BadRequestError";
import { processFormError } from "../../utils/ErrorProcessor";
import * as Yup from 'yup';

const client = new PlanningsClient();

const PlanningCreateViewModel = ({ children }: ViewModelProps) => {
    const { strings } = useContext(StringsContext);
    const { workspace } = useContext(WorkspaceContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = useCallback(
        (values: PlanningFormModel, helpers: FormikHelpers<PlanningFormModel>) => {
            const model = mapper.map(values, PlanningModel, PlanningFormModel);
            model.teamId = workspace?.id;
            console.log(model);
            client.createPlanning(model)
                .then((planning) => {
                    enqueueSnackbar(strings('/plannings/create-success'), { variant: 'success' });
                    navigate(
                        preparePath(
                            paths.app.workspaces.planning.details,
                            {
                                workspaceId: workspace?.id,
                                planningId: planning.id
                            }
                        )
                    );
                })
                .catch((e) => {
                    if (e instanceof BadRequestError) {
                        helpers.setErrors(processFormError(e.errors));
                    } else {
                        enqueueSnackbar(strings('/plannings/create-fail'), { variant: 'error' });
                    }
                })
                .finally(() => helpers.setSubmitting(false));
        },
        [workspace, enqueueSnackbar, strings]
    );

    const formik = useFormik<PlanningFormModel>({
        initialValues: {
            title: '',
            startDate: moment().add(1, 'day')
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

export default PlanningCreateViewModel;