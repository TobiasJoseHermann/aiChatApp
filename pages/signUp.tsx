import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import {
    Container,
    Typography,
    useTheme,
    Grid,
    TextField,
    Alert,
} from "@mui/material";
import { useMutation } from "react-query";
import { ThemeProvider } from "@mui/material";
import { CssBaseline, Avatar } from "@mui/material";
import { Box } from "@mui/system";
import Loading from "../components/Loading";

// firebase
import { app, auth } from "../utils/firebase";
import {
    createUserWithEmailAndPassword,
    getIdToken,
    signInWithEmailAndPassword,
} from "firebase/auth";

export default function signUp() {
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
        postFirebaseAuthMutation.mutate(formData);
    }

    function postFirebaseAuthFun(connectionData) {
        return createUserWithEmailAndPassword(
            auth,
            connectionData.nombreUsuario,
            connectionData.contrasena
        );
    }

    const postFirebaseAuthMutation = useMutation({
        mutationFn: postFirebaseAuthFun,
        onSuccess: () => {
            console.log(
                "User created succesfully",
                postFirebaseAuthMutation.data
            );
            router.push("/");
        },
        onError: (error) => {
            console.log("Error", error);
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
                    <Loading isLoading={postFirebaseAuthMutation.isLoading} />
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {postFirebaseAuthMutation.isError && (
                            <Alert severity="error">Error creating user</Alert>
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
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
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
                                        label="Email"
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
                                        Sign Up
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
