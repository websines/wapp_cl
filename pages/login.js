import Head from 'next/head';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { auth, provider } from '../firebase';
function Login() {
    const signIn=()=>{
        auth.signInWithPopup(provider).catch(err=>alert(err.message))
    }
    return (
        <Container>
            <Head>
                <title>Login Page</title>
            </Head>

            <LoginContainer>
                <Logo src="http://assets.stickpng.com/thumbs/580b57fcd9996e24bc43c543.png"/>
                <LoginButton onClick={signIn} variant="outlined">Sign in with Google</LoginButton>
            </LoginContainer>

        </Container>
    )
}
const Container = styled.div`
display: grid;
place-items: center;
background-color: whitesmoke;
height: 100vh;
`
const LoginContainer = styled.div`
padding: 100px;
display: flex;
background-color:white;
flex-direction: column;
align-items: center;
border-radius: 5px;
box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`
const Logo=styled.img`
width:200px;
height: 200px;
margin-bottom: 50px;
`
const LoginButton=styled(Button)``
export default Login
