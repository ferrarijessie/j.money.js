import * as React from "react";
import PropTypes from 'prop-types';

import { styled } from "styletron-react";
import { Button, KIND as ButtonKind, SIZE as ButtonSize, SHAPE } from "baseui/button";
import { Input, SIZE as InputSize } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { Block } from "baseui/block";
import { Banner, HIERARCHY, KIND } from "baseui/banner";
import { StyledDivider, SIZE as DividerSize } from "baseui/divider";
import { StyledLink } from "baseui/link";
import { HeadingXXLarge, ParagraphSmall, LabelLarge } from "baseui/typography";

import { useLogin } from '../../hooks/auth/useLogin';

import SignupModal from './SignupModal';


const LoginFormContainerUI = styled(Block, {
    padding: '10px 800px 200px 800px',
});

const ErrorContainerUI = styled(Block, {
    padding: '0px 735px 0px 735px',
    textAlign: 'center'
});

const HeadingContainer = styled(Block, {
    padding: '200px 735px 0px 735px',
    textAlign: 'center',
});

const SignInButtonContainer = styled(Block, {
    justifyContent: 'center',
    display: 'flex',
    marginBottom: '20px',
});

const SignUpLinkContainer = styled(Block, {
    justifyContent: 'flex-end',
    display: 'flex',
    marginBottom: '20px',
    fontSize: '14px',
    cursor: 'pointer'
});

const TitleHeadingUI = styled(HeadingXXLarge, {
    marginBottom: '0px'
});

const SubtitleHeadingUI = styled(ParagraphSmall, {
    marginTop: '3px'
});

const LoginHeadingUI = styled(LabelLarge, {
    marginBottom: '20px'
});

const signinButtonOverrides = {
    overrides: {
        BaseButton: {
            style: {
                width: '100%',
            }
        }
    }
};

export default function Login({ setToken }) {

    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [error, setError] = React.useState("");
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { mutateAsync: loginRequest } = useLogin();

    const handleLogin = async () => {

        try {
            const resp = await loginRequest({
                "username": username,
                "password": password
            });
            setToken(resp);

        } catch (error) {
            setError("Login failed. Check your credentials and try again.")
        }        
    };

    return(
        <>
            <HeadingContainer>
                <TitleHeadingUI>jMoney</TitleHeadingUI>
                <SubtitleHeadingUI>Your personal finances manager</SubtitleHeadingUI>
            </HeadingContainer>

            <ErrorContainerUI>
                {!!error &&
                    <Banner hierarchy={HIERARCHY.low} kind={KIND.negative}>
                        {error}
                    </Banner>
                }
            </ErrorContainerUI>

            <LoginFormContainerUI>
                <LoginHeadingUI>Log in</LoginHeadingUI>
                <FormControl label="Username">
                    <Input
                        clearable
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter Name..."
                        size={InputSize.compact}
                    />
                </FormControl>
                
                <FormControl label="Password">
                    <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        size={InputSize.compact}
                        type="password"
                    />
                </FormControl>
                <SignInButtonContainer>
                    <Button
                        kind={ButtonKind.primary}
                        type='submit'
                        onClick={() => handleLogin()}
                        shape={SHAPE.pill}
                        size={ButtonSize.compact}
                        {...signinButtonOverrides}
                    >
                        Sign in
                    </Button>
                </SignInButtonContainer>

                <StyledDivider $size={DividerSize.cell} />

                <SignUpLinkContainer>
                    <StyledLink
                        onClick={() => setIsModalOpen(true)}
                        animateUnderline
                    >
                        Create an account
                    </StyledLink>
                </SignUpLinkContainer>
            </LoginFormContainerUI>

            <SignupModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                setToken={setToken}
            />
        </>
        
  )
};

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};
