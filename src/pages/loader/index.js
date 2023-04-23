import React from "react";
import { Skeleton, Stack } from "@mui/material";

function Loader() {
  return (
    <Stack spacing={1}>
      <Skeleton />
      <Skeleton sx={{ height: 64 }} animation="wave" variant="rectangular" />
      <Skeleton />
      <Skeleton />
    </Stack>
  );
}

export default Loader;
