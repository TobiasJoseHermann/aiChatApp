import React from "react";
import { Backdrop, CircularProgress, LinearProgress } from "@mui/material";

export default function Loading({ isLoading }) {
    return (
        <Backdrop
            // sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
