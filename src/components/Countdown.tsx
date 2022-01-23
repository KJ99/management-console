import { Typography } from "@mui/material";
import clsx from "clsx";
import moment from "moment";
import numeral from "numeral";
import { useCallback, useEffect, useState } from "react";
import styleSheet from "../resources/styles/components/Countdown";

export type Props = {
    initialSeconds: number
};

let counter: any = null;

const Countdown = ({ initialSeconds }: Props) => {
    const classes = styleSheet();
    const [time, setTime] = useState(0);
    const [passed, setPassed] = useState<boolean>(false);
    const [nearlyEnd, setNearlyEnd] = useState<boolean>(false);
    
    useEffect(() => {
        if (counter != null) {
            clearInterval(counter);
        }
        setTime(initialSeconds);
        counter = setInterval(() => setTime((prev) => prev - 1), 1000);
        return () => {
            clearInterval(counter);
        }
    }, [initialSeconds]);

    useEffect(() => {
        setNearlyEnd(time >= 0 && time < 60);
        setPassed(time <= 0);
    }, [time]);

    return (
        <Typography className={clsx(classes.label, {
            [classes.passed]: passed,
            [classes.nearlyEnd]: nearlyEnd
        })}>
            {numeral(Math.abs(time)).format('00:00:00')}
        </Typography>
    );
}

export default Countdown;