import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorJSX from '../components/ErrorJSX';
import { useState } from 'react';
import { AppBar, ListItemIcon,Toolbar, Stack, Typography, Button, Grid, List, ListItem, ListItemText, TextField, Box, CssBaseline, Drawer, Divider, Container,Tabs, Tab, Chip, ListItemButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { useMutation } from 'react-query';
import { getAuth,signOut } from 'firebase/auth';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  
    const APIURL = 'http://localhost:3000'
    const drawerWidth = 240;

    const router = useRouter()
    const auth = getAuth();

    const [newMessage, setNewMessage] = useState('');
    const [conversationName, setConversationName] = useState('');
    const [selectedConversationID, setSelectedConversationID] = useState(0);


    function logOutMutationFunction() {
        return signOut(auth)
    }

    const logOutFirebaseAuthMutation = useMutation({mutationFn: logOutMutationFunction,
        onSuccess: () => {
            router.push('/')
        },
        onError: (error) => {
            console.log("Error on Log Out", error)
        }
    })

    const handleSendMessage = async () => {
        await axios.post(`${APIURL}/api/sendMessageAPI`, {message: newMessage, conversation_id: selectedConversationID})
        setNewMessage('');
        mutationSelectedConversation.mutate(selectedConversationID);
    }

    const sendMessageMutation = useMutation(handleSendMessage)

    const handleAddConversation = () => {
        return axios.post(`${APIURL}/api/addConversationAPI`, {name: conversationName, email: auth.currentUser.email})
    }
    
    const addConversationMutation = useMutation({mutationFn: handleAddConversation,
        onSuccess: () => {
            queryConversations.refetch();
        },
        onError: (error) => {
            console.log("Error on Add Conversation", error)
        }
    })


    async function fetchSelectedConversation(id) {
        setSelectedConversationID(id);
        return axios.post(`${APIURL}/api/changeConversationAPI`, {id: id})
    }

    const mutationSelectedConversation = useMutation({
        mutationFn: id => fetchSelectedConversation(id),
    });

    async function handleDeleteConversation(id) {
        return axios.delete(`${APIURL}/api/deleteConversationAPI`, {data: {id: id}})
    }

    const deleteConversationMutation = useMutation({
        mutationFn: handleDeleteConversation,
        onSuccess: () => {
            queryConversations.refetch();
        },
    })

    async function fetchConversations() {
        return axios.post(`${APIURL}/api/conversationsAPI`, {email: auth.currentUser.email})
    }

    const queryConversations = useQuery(['conversations'], fetchConversations)
    

    if (queryConversations.isLoading || sendMessageMutation.isLoading || addConversationMutation.isLoading || deleteConversationMutation.isLoading) {
        return <Loading isLoading={queryConversations.isLoading || sendMessageMutation.isLoading || addConversationMutation.isLoading || deleteConversationMutation.isLoading}/>
    }

    if (queryConversations.isError) {
        return <ErrorJSX error={queryConversations.error} />
    }


    return (
    <div>
        <Head>
        <title>ChatApp</title>
        <link rel="icon" href="/favicon.ico" />
        </Head>
            <Box sx={{ display: 'flex'}}>
                <CssBaseline />

                <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>


                    <Toolbar>

                        <Button sx={{mr: 2}} color="secondary" variant="contained" onClick={() => addConversationMutation.mutate() }>Add Conversation</Button> 
                        <TextField 
                            sx={{ flexGrow: 1, mr: 2 }} 
                            placeholder="Conversation name" 
                            value={conversationName}
                            onChange={e => setConversationName(e.target.value)}
                            InputProps={{
                                style: { color: 'white' }
                            }}
                            inputProps={{
                                style: { color: 'white' }
                            }}
                            />
                        <Button 
                            sx={{mr: 2}} 
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
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar sx={{ display: 'flex', justifyContent: 'center', backgroundColor: '#001D35' }}>
                        <IconButton edge="center" color="inherit" aria-label="icon"
                            >
                            <img src="/favicon.ico" alt="icon" style={{ width: '47px', height: '47px' }} />
                        </IconButton>
                    </Toolbar>


                    <Divider />
                    <List>
                        {queryConversations.data.data.map((conversation, index) => (
                            <ListItemButton 
                                onClick={() => mutationSelectedConversation.mutate(conversation.conversation_id)} 
                                style={{width: '100%', justifyContent: 'flex-start'}}
                                sx = {{pl: 4, pr: 0}}
                                selected={conversation.conversation_id === selectedConversationID}
                            >
                                <ListItemText primary={conversation.name} />
                                <ListItemIcon sx={{ p: 0, m: 0 }}
>
                                    <IconButton 
                                        sx={{ p: 0, m: 0 }}
                                        onClick={(event) => {
                                            event.stopPropagation(); 
                                            deleteConversationMutation.mutate(conversation.conversation_id);
                                    }}>
                                        <DeleteIcon /> 
                                    </IconButton>
                                </ListItemIcon>
                            </ListItemButton>
                        ))}
                    </List>
                </Drawer>
                <Box 
                    component="main" 
                    sx={{ bgcolor: 'background.default', p: 2, mt: 7,ml: 2 }}
                >
                    <Stack 
                        direction="column" 
                        spacing={2} 
                        alignItems="flex-start" 
                        justifyContent="center"
                        sx={{ 
                            overflowY: 'auto', 
                            maxHeight: 'calc(100vh - 160px)', 
                        }}
                    >
                        {mutationSelectedConversation.isLoading ? 
                        <Typography> Loading Messages</Typography> :
                        mutationSelectedConversation.data?.data.map((message, index) => (
                            <Chip 
                                label={message.is_ai_response ? `Ai: ${message.text}` : `You: ${message.text}`} 
                                key={index} 
                                sx={{ ml: 0, 
                                    backgroundColor: message.is_ai_response ? 'secondary.main' : 'primary.main', 
                                    color: "white",
                                    height: 'auto',
                                    padding: '5px',
                                    '& .MuiChip-label': {
                                        display: 'block',
                                        whiteSpace: 'normal',
                                    },
                                 }}
                            />
                        ))}
                    </Stack>
                    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, p: 1, width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                        <Toolbar>
                            <TextField
                                multiline
                                sx={{ flexGrow: 1, mr: 2 }}
                                placeholder="Enter message here"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                InputProps={{
                                    style: { color: 'white' }
                                }}
                                inputProps={{
                                    style: { color: 'white' }
                                }}
                            />
                            <IconButton color="inherit" onClick={sendMessageMutation.mutate}>
                                <SendIcon fontSize="large" />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </Box>
            </Box>
    </div>
    )
}