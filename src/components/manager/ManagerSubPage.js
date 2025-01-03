import React from "react";

import { Block } from "baseui/block";
import { styled } from "styletron-react";

import Navigation from "./Navigation";


const ContainerUI = styled(Block, {
    padding: "30px 310px"
});


const ManagerSubPage = ({
    children,
    activeItem = null,
    activeSubItem= null
}) => {
    return (
        <>
            <Navigation activeItem={activeItem} activeSubItem={activeSubItem} />

            <ContainerUI>
                {children}
            </ContainerUI>
        </>
    );
};

export default ManagerSubPage;