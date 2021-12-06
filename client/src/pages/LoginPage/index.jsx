import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {useHistory} from 'react-router-dom';
import {Button, Divider, Form, Grid, Header, Input, Message, Segment} from 'semantic-ui-react';

function LoginPage({authHandler}) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginEmailError, setLoginEmailError] = useState(null);
    const [loginPasswordError, setLoginPasswordError] = useState(null);
    const [loginError, setLoginError] = useState(false);

    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
    const [signUpEmailError, setSignUpEmailError] = useState(null);
    const [signUpPasswordError, setSignUpPasswordError] = useState(null);
    const [signUpConfirmPasswordError, setSignUpConfirmPasswordError] = useState(null);
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [signUpError, setSignUpError] = useState(false);

    const history = useHistory();

    async function login() {
        const isValidEmail = validateEmail(loginEmail, setLoginEmailError);
        const isValidPassword = validatePassword(loginPassword, 1, setLoginPasswordError);


        if (isValidEmail && isValidPassword) {
            try {
                const {data} = await axios.post('/user/login', {username: loginEmail, password: loginPassword});

                if (data.username) {
                    setLoginError(false);
                    console.log('Get User: There is a user saved in the server session: ');
                    console.log(data.username);
                    // history.push('/')
                    authHandler(true);

                    // this.setState({
                    //     loggedIn: true,
                    //     username: response.data.user.username
                    // })
                } else {
                    console.log('Get user: no user');
                    // this.setState({
                    //     loggedIn: false,
                    //     username: null
                    // });
                }
            } catch (e) {
                if (e.response && e.response.status === 401) {
                    setLoginError(true);
                }
            }
        }
    }

    async function signUp() {
        const isValidEmail = validateEmail(signUpEmail, setSignUpEmailError);
        const isValidPassword = validatePassword(signUpPassword, 8, setSignUpPasswordError);
        const isValidConfirmPassword = signUpConfirmPassword === signUpPassword;

        if (isValidPassword) {
            setSignUpConfirmPasswordError(isValidConfirmPassword ? null : 'Passwords must match');
        }

        if (isValidEmail && isValidPassword && isValidConfirmPassword) {
            const {data} = await axios.post('/user', {username: signUpEmail, password: signUpPassword});
            if (data.error) {
                setSignUpSuccess(false);
                setSignUpError(true);
            } else if (data.email || data.username) {
                setSignUpSuccess(true);
                setSignUpError(false);

                setSignUpEmail('');
                setSignUpPassword('');
                setSignUpConfirmPassword('');
            }
        }
    }

    function validatePassword(password, length, setError) {
        if (password.length === 0) {
            setError('Please enter a password');
            return false;
        }
        const isValid = password.length >= length;
        setError(isValid ? null : 'Password must be at least 8 characters long');
        return isValid;
    }

    function validateEmail(email, setError) {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setError(isValid ? null : 'Please enter a valid email address');
        return isValid;
    }

    return (
        <Segment className="login-page">
            <Header as="h1" textAlign="center">Welcome!</Header>
            <Grid columns={3} padded={true} relaxed="very" stackable>
                <Grid.Column className="login-page__login">
                    <Header as="h3" textAlign="center">Login</Header>
                    <Form onSubmit={login} error={loginError}>
                        <Form.Field
                            icon="mail"
                            iconPosition="left"
                            id="login-email"
                            control={Input}
                            label="Email"
                            placeholder="Enter your email..."
                            error={loginEmailError}
                            value={loginEmail}
                            onChange={e => {
                                setLoginEmail(e.target.value);
                            }}
                        />
                        <Form.Field
                            type="password"
                            icon="lock"
                            iconPosition="left"
                            id="login-password"
                            control={Input}
                            label="Password"
                            placeholder="Enter your password..."
                            error={loginPasswordError}
                            value={loginPassword}
                            onChange={e => {
                                setLoginPassword(e.target.value);
                            }}
                        />
                        <Message
                            error
                            header="Login Failed"
                            content="Please check your email and password"
                        />
                        <Button content="Login" primary floated="right"/>
                    </Form>
                </Grid.Column>
                <Grid.Column className="login-page__divider">
                    <Divider vertical>Or</Divider>
                </Grid.Column>
                <Grid.Column className="login-page__sign-up">
                    <Header as="h3" textAlign="center">Sign Up</Header>
                    <Form onSubmit={signUp} success={signUpSuccess} error={signUpError}>
                        <Form.Field
                            icon="mail"
                            iconPosition="left"
                            id="sign-up-email"
                            control={Input}
                            label="Email"
                            placeholder="Enter your email..."
                            error={signUpEmailError}
                            value={signUpEmail}
                            onChange={e => {
                                setSignUpEmail(e.target.value);
                            }}
                        />
                        <Form.Field
                            type="password"
                            icon="lock"
                            iconPosition="left"
                            id="sign-up-password"
                            control={Input}
                            label="Password"
                            placeholder="Enter your password..."
                            error={signUpPasswordError}
                            value={signUpPassword}
                            onChange={e => {
                                setSignUpPassword(e.target.value);
                            }}
                        />
                        <Form.Field
                            type="password"
                            icon="lock"
                            iconPosition="left"
                            id="sign-up-confirm-password"
                            control={Input}
                            label="Confirm Password"
                            placeholder="Enter your password..."
                            error={signUpConfirmPasswordError}
                            value={signUpConfirmPassword}
                            onChange={e => {
                                setSignUpConfirmPassword(e.target.value);
                            }}
                        />
                        <Message
                            error
                            header="Sign Up Failed"
                            content="A user already exists with that email, please try a different one"
                        />
                        <Message
                            success
                            header="Sign Up Successful"
                            content="Please login using your email and password"
                        />
                        <Button content="Sign Up" primary floated="right"/>
                    </Form>
                </Grid.Column>
            </Grid>
        </Segment>
    );
}

export default LoginPage;