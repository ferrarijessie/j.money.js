import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ffbb28'];

const CategoryMetrics = ({ totals }) => {
    // Convert totals object to array of {name, value} pairs
    const metricsData = Object.entries(totals).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', paddingLeft: '1rem' }}>Categories</div>
            <div style={{ height: '200px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={metricsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                    >
                        {metricsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                    />
                    <Tooltip 
                        formatter={(value) => `R$ ${value.toFixed(2)}`}
                        contentStyle={{ backgroundColor: '#fff', color: '#000' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
        </>
    );
};

export default CategoryMetrics;
