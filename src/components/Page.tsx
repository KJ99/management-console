import { Box, Container } from "@mui/material";
import { FC, Fragment, ReactNode } from "react";
import Helmet from 'react-helmet';
import styleSheet from '../resources/styles/components/Page';

type PageProps = {
    children: ReactNode,
    title?: string
}

const Page = ({ children, title }: PageProps) => {
    const classes = styleSheet();
    return (
        <Fragment>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Container className={classes.root} maxWidth={false}>
                {children}
            </Container>
        </Fragment>
    );
}

export default Page;