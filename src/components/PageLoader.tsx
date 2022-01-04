import { Box, CircularProgress } from "@mui/material";

const PageLoader = () => {
    return (
        <Box height="calc(100vh - 120px)" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress
                variant="indeterminate"
                size="5rem"
                color="primary"
            />
        </Box>
    );
}

export default PageLoader;