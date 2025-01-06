import React from "react";

import { Block } from "baseui/block";
import { Heading, HeadingLevel } from 'baseui/heading';
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { styled } from "styletron-react";

import Navigation from "./Navigation";

import { 
    headingOverrides,
    headingGridOverrides,
    buttonGridOverrides 
} from "./common/overrides";


const ContainerUI = styled(Block, {
    padding: "30px 90px"
});


const ManagerSubPage = ({
    children,
    activeItem = null,
    activeSubItem= null,
    pageTitle="Page Title",
    actions=null
}) => {
    return (
        <>
            <Navigation activeItem={activeItem} activeSubItem={activeSubItem} />

            <ContainerUI>
                <FlexGrid flexGridColumnCount={2} {...headingGridOverrides}>
                    <FlexGridItem>
                        <HeadingLevel>
                            <HeadingLevel>
                                <HeadingLevel>
                                    <Heading {...headingOverrides}>{pageTitle}</Heading>
                                </HeadingLevel>
                            </HeadingLevel>
                        </HeadingLevel>
                    </FlexGridItem>
                    <FlexGridItem {...buttonGridOverrides}>
                        {actions}
                    </FlexGridItem>
                </FlexGrid>

                {children}
            </ContainerUI>
        </>
    );
};

export default ManagerSubPage;