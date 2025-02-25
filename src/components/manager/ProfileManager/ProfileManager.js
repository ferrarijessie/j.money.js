import React from "react";

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE as ButtonSize } from "baseui/button";
import { Input, SIZE as InputSize } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { ParagraphLarge } from "baseui/typography";
import { styled } from "styletron-react";

import { PROFILE_MANAGER_PATH } from "../../../AppPaths";
import { useUserPut } from "../../../hooks/auth/useUserPut";

import { setToken } from "../../utils";


import { 
    managerSummaryGridOverrides,
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";

const SectionTitleUI = styled(ParagraphLarge, {
    fontWeight: 600,
    borderBottom: '1px solid #eeeeee',
});


const ProfileManager = () => {

    const user = JSON.parse(sessionStorage.getItem('user'));

    const [username, setUserName] = React.useState(user['username']);
    const [email, setEmail] = React.useState(user['email']);

    const [formErrors, setFormErrors] = React.useState({});

    const { mutateAsync: updateProfileRequest, isLoading } = useUserPut();

    const onSaveClick = async () => {
        try {
            const resp = await updateProfileRequest({
                "username": username
            });
            setToken(resp);
            window.location.reload();
        } catch(error) {
            setFormErrors({"username": "Username already taken"})
        }
    };

    const validateAndSave = () => {
        const requiredMessage = "This field is required"
        let errors = {}

        if (username === ""){
            errors["username"] = requiredMessage;
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        onSaveClick();
    };

    return (
        <ManagerSubPage 
            activeItem={PROFILE_MANAGER_PATH}
            itemTitle={"Profile"}
        >
            
            <SectionTitleUI>Update Personal Information</SectionTitleUI>
            <FlexGrid flexGridColumnCount={2} flexGridColumnGap={'5px'}>
                <FlexGridItem>
                    <FormControl 
                        error={"username" in formErrors ? formErrors["username"] : null}
                    >
                        <Input
                            clearable
                            value={username}
                            onChange={e => setUserName(e.target.value)}
                            placeholder="Username"
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
                <FlexGridItem>
                    <FormControl 
                        error={"email" in formErrors ? formErrors["email"] : null}
                    >
                        <Input
                            clearable
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="E-mail"
                            size={InputSize.compact}
                        />
                    </FormControl>
                </FlexGridItem>
            </FlexGrid>
            <Button 
                type={'submit'} 
                onClick={() => validateAndSave()} 
                isLoading={isLoading}
                size={ButtonSize.compact}
            >
                Save
            </Button>
            
        </ManagerSubPage>
    );
};

export default ProfileManager;