import { FormikHelpers, useFormik } from "formik";
import { useCallback, useContext, useState } from "react";
import { EstimationFormModel } from "../../components/forms/EstimationForm";
import { StringsContext } from "../../contexts/StringsContext";
import IMemberVote from "../../models/live/IMemberVote";
import Member from "../../models/member/Member";
import PlanningItem from "../../models/planning/PlanningItem";
import PlanningLivePage from "../../pages/plannings/PlanningLivePage";
import PlanningLiveViewModel from "../../view-models/plannings/PlanningLiveViewModel";

const PlanningLiveView = () => (
    <PlanningLiveViewModel>
        <PlanningLivePage />
    </PlanningLiveViewModel>
);

export default PlanningLiveView;
