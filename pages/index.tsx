import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import {
    Backdrop,
    CircularProgress,
    Container,
    Typography,
    useTheme,
    Grid,
    TextField,
    Alert,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import { ThemeProvider } from "@mui/material";
import { CssBaseline, Avatar } from "@mui/material";
import { Login } from "@mui/icons-material";
import { Box } from "@mui/system";
import axios from "axios";
import Loading from "../components/Loading";

// firebase
import { app, auth } from "../utils/firebase";
import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";

export default function Home() {
    const APIURL = process.env.NEXT_PUBLIC_API_URL;

    const router = useRouter();
    const theme = useTheme();

    const [formData, setFormData] = useState({
        nombreUsuario: "",
        contrasena: "",
    });

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        connectFirebaseAuthMutation.mutate(formData);
    }

    function connectFirebaseAuthFun(connectionData) {
        return signInWithEmailAndPassword(
            auth,
            connectionData.nombreUsuario,
            connectionData.contrasena
        );
    }

    const connectFirebaseAuthMutation = useMutation({
        mutationFn: connectFirebaseAuthFun,
        onSuccess: () => {
            console.log("Conexión exitosa", connectFirebaseAuthMutation.data);
            // connectDbMutation.mutate();
            router.push("/conversations");
        },
        onError: (error) => {
            console.log("Error", error);
            router.push("/");
        },
    });

    return (
        <div>
            <Head>
                <title>ChatApp</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <Loading
                        isLoading={connectFirebaseAuthMutation.isLoading}
                    />
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {connectFirebaseAuthMutation.isError && (
                            <Alert severity="error">
                                Wrong user or password
                            </Alert>
                        )}
                        <Avatar
                            sx={{
                                m: 1,
                                bgcolor: "secondary.main",
                                width: 100,
                                height: 100,
                            }}
                        >
                            <img
                                src="/favicon.ico"
                                alt="icon"
                                style={{ width: "100px", height: "100px" }}
                            />
                            {/* <Login /> */}
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Log In
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}
                        >
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
                                        disabled={
                                            formData.nombreUsuario === "" ||
                                            formData.contrasena === ""
                                        }
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
    );
}
