import styled from 'styled-components';
import { Avatar, Button, IconButton } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
function Sidebar() {
    //const [user2ChatSnapshot,loading2,error2] = useCollection(db.collection('chats'));
    //const yedek=user2ChatSnapshot?.docs.map(chat=>chat.data().users);
    //console.log(yedek)


    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatSnapshot, loading, error] = useCollection(userChatRef);

    
    const createChat = () => {
        const input = prompt("Please enter an email address for the user you wish to chat with")
        if (!input) return null;
        if (EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email) {
            db.collection('chats').add({
                users: [user.email, input]

            })
        }
    }

    const chatAlreadyExists = (recipientEmail) => {
        !!chatSnapshot?.docs.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)


    }
    return (
        <Container>
            <Header>
                <UserAvatar onClick={() => auth.signOut()} src={user?.photoURL} />
                <IconContainer>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </IconContainer>

            </Header>
            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search in chats" />
            </Search>
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

            {
                chatSnapshot?.docs.map(chat => (<Chat key={chat.id} id={chat.id} users={chat.data().users} />))
            }


        </Container>
    )
}

export default Sidebar;


const Container = styled.div`
flex:0.45;
border-right: 1px solid whitesmoke;
height:100vh;
min-width:300px;
max-width:350px;
overflow-y: scroll;

::-webkit-scrollbar {
    display:none;
}
-ms-overflow-style:none;
scrollbar-width: none;
`


const Header = styled.div`
display: flex;
position: sticky;
top: 0;
background-color:white;
z-index:1;
justify-content:space-between;
align-items: center;
border-bottom: 1px solid whitesmoke;
padding: 15px;
height: 80px;`

const UserAvatar = styled(Avatar)`
cursor: pointer;
:hover{
    opacity: 0.8;
}`

const IconContainer = styled.div``


const Search = styled.div`
display: flex;
align-items: center;
padding:5px;
border-radius: 2px;
`
const SearchInput = styled.input`
flex: 1;
border: none;
outline-width:0;
`
const SidebarButton = styled(Button)`
width: 100%;
&&&{
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    }
`

