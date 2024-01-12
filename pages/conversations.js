
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

export default function Home() {
  
  const APIURL = 'http://localhost:3000'
    const drawerWidth = 240;

    const router = useRouter()

    const [newMessage, setNewMessage] = useState('');
    const [conversationName, setConversationName] = useState('');
    const [selectedConversationID, setSelectedConversationID] = useState(0);


    const handleSendMessage = async () => {
        await axios.post(`${APIURL}/api/sendMessageAPI`, {message: newMessage, conversation_id: selectedConversationID})
        setNewMessage('');
        mutationSelectedConversation.mutate(selectedConversationID);
    }

    const sendMessageMutation = useMutation(handleSendMessage)

    const handleAddConversation = () => {
        axios.post(`${APIURL}/api/addConversationAPI`, {name: conversationName})
    }



    async function fetchSelectedConversation(id) {
        setSelectedConversationID(id);
        return axios.post(`${APIURL}/api/changeConversationAPI`, {id: id})
    }

    const mutationSelectedConversation = useMutation(id => fetchSelectedConversation(id));



    async function fetchConversations() {
        return axios.get(`${APIURL}/api/conversationsAPI`)
    }

    const queryConversations = useQuery(['conversations'], fetchConversations)
    

    if (queryConversations.isLoading || sendMessageMutation.isLoading) {
        return <Loading isLoading={queryConversations.isLoading || sendMessageMutation.isLoading}/>
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
                        {queryConversations.data.data.map((conversation, index) => (
                            <Button 
                                onClick={() => mutationSelectedConversation.mutate(conversation.conversation_id)} 
                                style={{width: '100%', justifyContent: 'flex-start'}}
                            >
                                <ListItem key={index} style={{border: '1px solid #ccc', margin: '10px 0'}}>
                                    <ListItemText primary={conversation.name} />
                                </ListItem>
                            </Button>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ bgcolor: 'background.default', p: 2, mt: 7,ml: 2 }}>
                    <Stack direction="column" spacing={2} alignItems="flex-start" justifyContent="center">
                        {mutationSelectedConversation.isLoading ? 
                        <Typography> Loading Messages</Typography> :
                        mutationSelectedConversation.data?.data.map((message, index) => (
                            <Chip 
                                label={message.is_ai_response ? `Ai: ${message.text}` : `You: ${message.text}`} 
                                key={index} 
                                sx={{ ml: 0, backgroundColor: message.is_ai_response ? 'secondary.main' : 'primary.main' }}
                            />
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