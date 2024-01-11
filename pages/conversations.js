
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorJSX from '../components/ErrorJSX';
import { useState } from 'react';
import { AppBar, Toolbar, Stack, Typography, Button, Grid, List, ListItem, ListItemText, TextField, Box, CssBaseline, Drawer, Divider, Container,Tabs, Tab, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { useMutation } from 'react-query';
import { set } from 'mongoose';

export default function Home() {
  
  const APIURL = 'http://localhost:3000'
    const drawerWidth = 240;

  const router = useRouter()

    const [newMessage, setNewMessage] = useState('');
    const [conversationName, setConversationName] = useState('');
    const [selectedConversationID, setSelectedConversationID] = useState(0);


    const handleSendMessage = () => {
        axios.post(`${APIURL}/api/sendMessageAPI`, {message: newMessage, conversation_id: selectedConversationID})
        setNewMessage('');
    }

    const handleAddConversation = () => {
        axios.post(`${APIURL}/api/addConversationAPI`, {name: conversationName})
    }



    async function fetchMessages() {
        return axios.get(`${APIURL}/api/messagesAPI`)
    }

    const { isLoading, isError, data: messagesData, error } = useQuery(['messages'], fetchMessages)

    async function fetchSelectedConversation(id) {
        setSelectedConversationID(id);
        return axios.post(`${APIURL}/api/changeConversationAPI`, {id: id})
    }

    const mutationSelectedConversation = useMutation(id => fetchSelectedConversation(id));



    async function fetchConversations() {
        return axios.get(`${APIURL}/api/conversationsAPI`)
    }

    const { isLoading: isLoadingConversations, isError: isErrorConversations, data: conversationsData, error: errorConversations } = useQuery(['conversations'], fetchConversations)
    

    if (isLoadingConversations) {
        return <Loading isLoading={isLoading}/>
    }

    if (isErrorConversations) {
        return <ErrorJSX error={error} />
    }

    // if (messagesData.msg && messagesData.msg === "command find requires authentication") {
    // return <span>Command requieres auth</span>
    // }

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
                        <Button sx={{mr: 2}} color="secondary" variant="contained" onClick={handleAddConversation}>Add Conversation</Button> 
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
                    <Toolbar />
                    <Divider />
                    <List>
                        {conversationsData.data.map((conversation, index) => (
                            <Button 
                                onClick={() => mutationSelectedConversation.mutate(conversation.conversation_id)} 
                                style={{width: '100%', justifyContent: 'flex-start'}}
                            >
                                <ListItem key={index} style={{border: '1px solid #ccc', margin: '10px 0'}}>
                                    <ListItemText primary={conversation.conversation_id} />
                                    <ListItemText primary={conversation.name} />
                                </ListItem>
                            </Button>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ bgcolor: 'background.default', p: 2, mt: 7,ml: 2 }}>
                    <Stack direction="column" spacing={2} alignItems="flex-start" justifyContent="center">
                        {mutationSelectedConversation.data?.data.map((message, index) => (
                            <Chip label={message.text} key={index} sx={{ ml: 0}}/>
                        ))}
                    </Stack>
                    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 500, p: 1, width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
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
                            <IconButton color="inherit" onClick={handleSendMessage}>
                                <SendIcon fontSize="large" />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </Box>
            </Box>
    </div>
    )
}