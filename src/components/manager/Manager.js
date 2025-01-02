import React from "react";
import {Heading, HeadingLevel} from 'baseui/heading';
import {ParagraphSmall} from 'baseui/typography';

import ManagerSubPage from "./ManagerSubPage";


const Manager = () => {
    return (
        <ManagerSubPage>
            <HeadingLevel>
                <HeadingLevel>
                 <HeadingLevel>
                    <Heading>Content Manager</Heading>

                    <ParagraphSmall>
                        This is where you can manage all your Expense Types, Income Types and Savings Types!
                    </ParagraphSmall>
                    </HeadingLevel>
                </HeadingLevel>
            </HeadingLevel>
        </ManagerSubPage>
    );
};

export default Manager;