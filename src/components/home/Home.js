import React from "react";
import moment from "moment";

import { useNavigate } from 'react-router-dom';

import { Block } from "baseui/block";
import { styled } from "baseui";
import { AppNavBar, setItemActive } from "baseui/app-nav-bar";
import { Delete } from "baseui/icon";

import { useExpensesList } from "../../hooks/expenses/useExpensesList";
import { useIncomesList } from "../../hooks/incomes/useIncomesList";

import UserItems from "../common/UserItems";



const ContainerUI = styled(Block, {
    padding: "30px 80px"
});

const HeaderContainerUI = styled(Block, {
    padding: "15px 40px"
});

const narrowItemOverrides = {
    Block: {style: {width: '5% !important'}}
};

const Home = () => {
    const navigate = useNavigate();

    const [selectedYear, setSelectedYear] = React.useState(2024);
    const [selectedMonth, setSelectedMonth] = React.useState(moment().format("M"));

    const {
        data: expensesData = [],
        isLoading: isExpensesLoading,
        refetch: reloadExpenses
    } = useExpensesList('all', selectedYear, selectedMonth);


    const {
        data: incomesData = [],
        isLoading: isIncomesLoading,
        refetch: reloadIncomes
    } = useIncomesList(selectedYear, selectedMonth);
    
    const generateMonths = (year) => {
        const months = moment.months();
        return months.map(
            (month, index) => ({
                label: month,
                id: index+1,
                info: { id: `${year}${index+1}`, type: 'month' },
                active: `${index+1}` === selectedMonth
            })
        )
    };

    function getUniqueIdentifier(item) {
        if (item.info) {
          return item.info.id;
        }
        return item.label;
      }

    const selectMonth = (item) => {
        let activeItem = item;

        if (item.info.type == 'year') {
            setSelectedYear(item.info.id);
            if (item.info.id+'' === moment().format('Y')) {
                activeItem = item.children.filter(sub => sub.id+'' === moment().format('M'))[0];
                setSelectedMonth(moment().format('M'));
            }
            else {
                activeItem = item.children[0];
                setSelectedMonth("1");
            }
        }
        if (item.info.type == 'month') {
            setSelectedMonth(item?.['id']);
        }
        setMainItems((prev) => setItemActive(prev, activeItem, getUniqueIdentifier));
    };

    const [mainItems, setMainItems] = React.useState([
        {
            active: selectedYear === 2024,
            label: "2024",
            info: { id: 2024, type: 'year' },
            navExitIcon: Delete,
            children: generateMonths(2024)
        },
        {
            active: selectedYear === 2025,
            label: "2025",
            info: { id: 2025, type: 'year' },
            navExitIcon: Delete,
            children: generateMonths(2025)
        },
        {
            active: selectedYear === 2026,
            label: "2026",
            info: { id: 2026, type: 'year' },
            navExitIcon: Delete,
            children: generateMonths(2026)
        }
    ]);

    return (
        <>
            <AppNavBar
                title="Finances Management"
                mainItems={mainItems}
                onMainItemSelect={item => selectMonth(item)}
                username="Jessica Ferrari"
                usernameSubtitle="the creator"
                userItems={UserItems()}
                onUserItemSelect={item => navigate(item.url)}
            />

            <ContainerUI>
                
            </ContainerUI>
        </>
    );
};

export default Home;
