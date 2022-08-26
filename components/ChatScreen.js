import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Message from './Message';
import { useState,useRef } from 'react';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    const router = useRouter();
    const [input, setInput] = useState("");
    const endOfMessagesRef=useRef(null);
    const [messagesSnapShot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'));
    const [recipientSnapshot]=useCollection(db.collection('users').where('email','==',getRecipientEmail(chat.users,user)))
    const showMessages = () => {
        if (messagesSnapShot) {
            return messagesSnapShot.docs.map((message) =>( 
                <Message key={message.id}
                    user={message.data().user}
                    message={
                        {
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime(),
                        }
                    }
                />
            ))
        }else{
            JSON.parse(messages).map(message => {
                <Message key={message.id}
                    user={message.user}
                    message={message}
                    
                />
            })
        }

    }
    const scrollToBottom=()=>{
        endOfMessagesRef.current.scrollIntoView({
            behavior:"smooth",
            block:"start"
        })
    }
    const sendMessage = (e) => {
        e.preventDefault();

        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL

        })
        setInput("");
        scrollToBottom();
    }
    const recipientEmail=getRecipientEmail(chat.users,user)
    const recipient=recipientSnapshot?.docs?.[0]?.data();
    return (
        <Container>
            <Header>
            {recipient?.photoURL?   (<Avatar src={recipient.photoURL}/>): (<Avatar>{recipientEmail[0]}</Avatar>)}
                
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot?(
                        <p>
                            Last Active:{" "}
                            {recipient?.lastSeen.toDate() ? (
                                <TimeAgo datetime={recipient.lastSeen.toDate()}/>
                            ):(
                                "Unavaliable"
                            )}
                        </p>
                    ):(
                        <p>Loading Last active...</p>
                    )}
                   
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton><MoreVertIcon /></IconButton>
                    <IconButton><AttachFileIcon /></IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndofMessage ref={endOfMessagesRef} />
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon />
                <Input placeholder="Write a message" value={input} onChange={e => setInput(e.target.value)} />
                <IconButton disabled={!input} type="submit" onClick={sendMessage}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </InputContainer>

        </Container>
    )
}

export default ChatScreen
const Container = styled.div``

const Header = styled.div`
position: sticky;
background-color:white;
z-index:100;
top:0;
display:flex;
padding:11px;
height:80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`

const HeaderInformation = styled.div`
margin-left: 15px;
flex:1;
font-family: Arial, Helvetica, sans-serif;
>h3{
    margin-bottom: 3px;
   
}
>p{
    font-size:14px;
    color:gray;
}
`
const HeaderIcons = styled.div``

const MessageContainer = styled.div`
min-height:90vh;
background-color:#e5ded8;
padding: 30px;
`

const EndofMessage = styled.div`
margin-bottom: 50px;
`

const InputContainer = styled.form`
display:flex;
align-items: center;
padding: 10px;
position:sticky;
bottom:0;
background-color:white;
z-index: 100;
`

const Input = styled.input`
flex:1;
padding: 14px;
align-items: center;
outline:0;
border:none;
border-radius: 20px;
background-color:whitesmoke;
margin-left: 15px;
margin-right:15px
`