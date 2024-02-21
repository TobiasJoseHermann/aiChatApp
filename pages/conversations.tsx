import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
import Loading from "../components/Loading";
import { useState } from "react";
import {
    AppBar,
    ListItemIcon,
    Toolbar,
    Stack,
    Typography,
    Button,
    List,
    ListItemText,
    TextField,
    Box,
    CssBaseline,
    Drawer,
    Divider,
    Chip,
    ListItemButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import { useMutation } from "react-query";
import { getAuth, signOut } from "firebase/auth";
import { app, auth } from "../utils/firebase";
import DeleteIcon from "@mui/icons-material/Delete";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";
import ErrorTSX from "../components/ErrorTSX";

export default function Home() {
    const APIURL = process.env.NEXT_PUBLIC_API_URL;
    const drawerWidth = 240;

    const router = useRouter();

    const [newMessage, setNewMessage] = useState<string>("");
    const [conversationName, setConversationName] = useState<string>("");
    const [selectedConversationID, setSelectedConversationID] =
        useState<number>(0);

    // Log Out:

    function logOutMutationFunction(): Promise<void> {
        return signOut(auth);
    }

    const logOutFirebaseAuthMutation = useMutation({
        mutationFn: logOutMutationFunction,
        onSuccess: () => {
            router.push("/");
        },
        onError: (error) => {
            console.log("Error on Log Out", error);
        },
    });

    // Messages:

    async function getMessages(ID: number) {
        setSelectedConversationID(ID);
        return axios.get(`${APIURL}/getMessages/${ID}`, {
            headers: {
                authtoken: await auth.currentUser.getIdToken(),
            },
        });
    }

    const queryMessages = useQuery(["messages", selectedConversationID], () =>
        getMessages(selectedConversationID)
    );

    const handlePostMessage = async () => {
        const MessageToSend: Message = {
            ID: null,
            Text: newMessage,
            ConversationID: selectedConversationID,
            IsAiResponse: false,
            CreatedAt: null,
            UpdatedAt: null,
            DeletedAt: null,
        };

        console.log("MessageToSend", MessageToSend);

        await axios.post(`${APIURL}/postMessage`, MessageToSend, {
            headers: {
                authtoken: await auth.currentUser.getIdToken(),
            },
        });
        setNewMessage("");
        queryMessages.refetch();
    };

    const postMessageMutation = useMutation({ mutationFn: handlePostMessage });

    // Conversations:

    async function getConversations() {
        return axios.get(
            `${APIURL}/getConversations/${auth.currentUser.email}`,
            {
                headers: {
                    authtoken: await auth.currentUser.getIdToken(),
                },
            }
        );
    }

    const queryConversations = useQuery(["conversations"], getConversations);

    const handlePostConversation = async () => {
        return axios.post(
            `${APIURL}/postConversation`,
            { Name: conversationName, Email: auth.currentUser.email },
            {
                headers: {
                    authtoken: await auth.currentUser.getIdToken(),
                },
            }
        );
    };

    const postConversationMutation = useMutation({
        mutationFn: handlePostConversation,
        onSuccess: () => {
            queryConversations.refetch();
        },
    });

    async function handleDeleteConversation(ID: number) {
        const token = await auth.currentUser.getIdToken();

        return axios.delete(`${APIURL}/deleteConversation/${ID}`, {
            headers: { authtoken: token },
        });
    }

    const deleteConversationMutation = useMutation({
        mutationFn: handleDeleteConversation,
        onSuccess: () => {
            queryConversations.refetch();
        },
    });

    // Loading and Error:

    if (
        queryConversations.isLoading ||
        postMessageMutation.isLoading ||
        postConversationMutation.isLoading ||
        deleteConversationMutation.isLoading
    ) {
        return (
            <Loading
                isLoading={
                    queryConversations.isLoading ||
                    postMessageMutation.isLoading ||
                    postConversationMutation.isLoading ||
                    deleteConversationMutation.isLoading
                }
            />
        );
    }

    if (
        queryConversations.isError ||
        postMessageMutation.isError ||
        postConversationMutation.isError ||
        deleteConversationMutation.isError
    ) {
        return (
            <ErrorTSX
                error={
                    queryConversations.error ||
                    postMessageMutation.error ||
                    postConversationMutation.error ||
                    deleteConversationMutation.error
                }
            />
        );
    }

    return (
        <div>
            <Head>
                <title>ChatApp</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />

                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`,
                    }}
                >
                    <Toolbar>
                        <Button
                            sx={{ mr: 2 }}
                            color="secondary"
                            variant="contained"
                            onClick={() => postConversationMutation.mutate()}
                        >
                            Add Conversation
                        </Button>
                        <TextField
                            sx={{ flexGrow: 1, mr: 2 }}
                            placeholder="Conversation name"
                            value={conversationName}
                            onChange={(e) =>
                                setConversationName(e.target.value)
                            }
                            InputProps={{
                                style: { color: "white" },
                            }}
                            inputProps={{
                                style: { color: "white" },
                            }}
                        />
                        <Button
                            sx={{ mr: 2 }}
                            color="secondary"
                            variant="contained"
                            onClick={() => logOutFirebaseAuthMutation.mutate()}
                        >
                            Log Out
                        </Button>
                    </Toolbar>
                </AppBar>

                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            backgroundColor: "#001D35",
                        }}
                    >
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="icon"
                        >
                            <img
                                src="/favicon.ico"
                                alt="icon"
                                style={{ width: "47px", height: "47px" }}
                            />
                        </IconButton>
                    </Toolbar>

                    <Divider />
                    <List>
                        {queryConversations.data.data.map(
                            (conversation: Conversation) => (
                                <ListItemButton
                                    onClick={() =>
                                        setSelectedConversationID(
                                            conversation.ID
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        justifyContent: "flex-start",
                                    }}
                                    sx={{ pl: 4, pr: 0 }}
                                    selected={
                                        conversation.ID ===
                                        selectedConversationID
                                    }
                                >
                                    <ListItemText primary={conversation.Name} />
                                    <ListItemIcon sx={{ p: 0, m: 0 }}>
                                        <IconButton
                                            sx={{ p: 0, m: 0 }}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                deleteConversationMutation.mutate(
                                                    conversation.ID
                                                );
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemIcon>
                                </ListItemButton>
                            )
                        )}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{ bgcolor: "background.default", p: 2, mt: 7, ml: 2 }}
                >
                    <Stack
                        direction="column"
                        spacing={2}
                        alignItems="flex-start"
                        justifyContent="center"
                        sx={{
                            overflowY: "auto",
                            maxHeight: "calc(100vh - 160px)",
                        }}
                    >
                        {queryMessages.isLoading ? (
                            <Typography> Loading Messages</Typography>
                        ) : (
                            (queryMessages.data?.data || []).map(
                                (message: Message, index: number) => (
                                    <Chip
                                        label={
                                            message.IsAiResponse
                                                ? `Ai: ${message.Text}`
                                                : `You: ${message.Text}`
                                        }
                                        key={index}
                                        sx={{
                                            ml: 0,
                                            backgroundColor:
                                                message.IsAiResponse
                                                    ? "secondary.main"
                                                    : "primary.main",
                                            color: "white",
                                            height: "auto",
                                            padding: "5px",
                                            "& .MuiChip-label": {
                                                display: "block",
                                                whiteSpace: "normal",
                                            },
                                        }}
                                    />
                                )
                            )
                        )}
                    </Stack>
                    <AppBar
                        position="fixed"
                        color="primary"
                        sx={{
                            top: "auto",
                            bottom: 0,
                            p: 1,
                            width: `calc(100% - ${drawerWidth}px)`,
                            ml: `${drawerWidth}px`,
                        }}
                    >
                        <Toolbar>
                            <TextField
                                multiline
                                sx={{ flexGrow: 1, mr: 2 }}
                                placeholder="Enter message here"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                InputProps={{
                                    style: { color: "white" },
                                }}
                                inputProps={{
                                    style: { color: "white" },
                                }}
                            />
                            <IconButton
                                color="inherit"
                                onClick={() => postMessageMutation.mutate()}
                            >
                                <SendIcon fontSize="large" />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </Box>
            </Box>
        </div>
    );
}
