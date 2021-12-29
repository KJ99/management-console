import { ReactElement, useEffect } from "react"

export type Props = {
    children: ReactElement,
    otherwise?: ReactElement,
    condition: boolean
}

const ConditionalView = ({ condition, children, otherwise }: Props) => {
    // useEffect(() => console.log('condi'), [condition]);
    // useEffect(() => console.log('child'), [children]);
    // useEffect(() => console.log('other'), [otherwise]);
    
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