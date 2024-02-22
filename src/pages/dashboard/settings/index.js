import React from "react";
// material-ui
import { Box, Stack } from "@mui/material";

// project import
import MainCard from "../../../components/MainCard";

import SystemStatus from "./system-status";
import OrderConfirmation from "./order-confirmation";

function Settings() {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <SystemStatus />
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <OrderConfirmation />
      </Box>
    </MainCard>
  );
}

export default Settings;
