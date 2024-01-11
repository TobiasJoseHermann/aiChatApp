import React from 'react'
import { Alert, AlertTitle, Backdrop, CircularProgress } from '@mui/material'

export default function ErrorJSX({error}) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >

      <Alert severity="error">
        <AlertTitle>An error happened</AlertTitle>
        Error: {error.message}
      </Alert>


    </Backdrop>
  )
}
