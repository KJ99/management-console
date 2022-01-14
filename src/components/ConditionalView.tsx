import { ReactElement, useEffect } from "react"

export type Props = {
    children: ReactElement,
    otherwise?: ReactElement,
    condition?: boolean
}

const ConditionalView = ({ condition, children, otherwise }: Props) => {
    return condition 
        ? (
            <>
                {children}
            </>
        ) : (
            <>
                {otherwise}
            </>
        );
}

export default ConditionalView;