import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import { Backdrop,CircularProgress,Container, Typography, useTheme, Grid, TextField, Alert } from '@mui/material';
import { useMutation, useQuery } from 'react-query';
import { ThemeProvider } from '@mui/material';
import { CssBaseline, Avatar} from '@mui/material';
import { Login } from '@mui/icons-material';
import { Box } from '@mui/system';
import axios from 'axios';
import Loading from '../components/Loading';

export default function Home() {
  
  const APIURL = 'http://localhost:3000'

  const router = useRouter()
  const theme = useTheme()

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    contrasena: ""
  })

  function handleChange(event) {
      const {name, value, type, checked} = event.target
      setFormData(prevFormData => ({
          ...prevFormData,
          [name]: type === "checkbox" ? checked : value
      }))
  }

  async function handleSubmit(event) {
    event.preventDefault();

    connectDBMutation.mutate(formData)

  };

  function connectDBMutFun(connectionData) {
    return axios.post(`${APIURL}/api/connectDBAPI`, connectionData)
  }

  const connectDBMutation = useMutation({mutationFn: connectDBMutFun,
    onSuccess: () => {
      router.push('/conversations')
    },
  })

  return (
    <div>
      <Head>
        <title>ChatApp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <Loading isLoading={connectDBMutation.isLoading} />
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {connectDBMutation.isError && <Alert severity="error">Wrong user or password</Alert> }
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <Login />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="nombreUsuario"
                    required
                    fullWidth
                    id="nombreUsuario"
                    label="Username"
                    onChange={handleChange}
                    value={formData.nombreUsuario}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="contrasena"
                    required
                    fullWidth
                    type="password"
                    id="contrasena"
                    label="Password"
                    onChange={handleChange}
                    value={formData.contrasena}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={formData.nombreUsuario === "" || formData.contrasena === "" }
                  >
                    Log In
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}