import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ffbb28'];

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const SavingsLineChart = ({ savingsData }) => {
    // Group savings by type and month
    const groupedData = savingsData.reduce((acc, saving) => {
        const monthIndex = saving.month - 1;
        const typeName = saving.typeName;
        
        if (!acc[typeName]) {
            acc[typeName] = MONTHS.map(() => 0);
        }
        
        acc[typeName][monthIndex] += saving.value;
        
        return acc;
    }, {});

    // Convert to format suitable for recharts with cumulative values
    const chartData = MONTHS.map((month, index) => {
        const data = { month };
        Object.entries(groupedData).forEach(([typeName, values]) => {
            // Calculate cumulative sum up to this month
            data[typeName] = values.slice(0, index + 1).reduce((acc, val) => acc + val, 0);
        });
        return data;
    });

    return (
        <>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', paddingLeft: '1rem' }}>Monthly Savings</div>
            <div style={{ height: '300px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                            tickFormatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip 
                            formatter={(value) => `R$ ${value.toFixed(2)}`}
                            contentStyle={{ backgroundColor: '#fff', color: '#000' }}
                        />
                        <Legend />
                        {Object.keys(groupedData).map((typeName, index) => (
                            <Line
                                key={typeName}
                                type="monotone"
                                dataKey={typeName}
                                name={typeName}
                                stroke={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default SavingsLineChart;
