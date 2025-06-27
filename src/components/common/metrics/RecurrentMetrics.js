import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d']; // Purple for Recurrent, Green for Non-Recurrent

const RecurrentMetrics = ({ recurrentTotal, nonRecurrentTotal }) => {
    const metricsData = [
        {
            name: 'Recurrent',
            value: recurrentTotal,
            color: COLORS[0],
        },
        {
            name: 'Non-Recurrent',
            value: nonRecurrentTotal,
            color: COLORS[1],
        },
    ];

    return (
        <>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', paddingLeft: '1rem' }}>Recurrent vs Non-Recurrent</div>
            <div style={{ height: '200px', marginTop: '1rem', paddingRight: '1rem' }}>
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
                        layout="horizontal"
                        align="center"
                        verticalAlign="bottom"
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

export default RecurrentMetrics;
