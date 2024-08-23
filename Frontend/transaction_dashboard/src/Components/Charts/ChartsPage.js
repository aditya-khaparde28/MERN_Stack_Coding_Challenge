"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ChartPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const ChartsPage = () => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('March');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [selectedMonth]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/bar-chart`, {
                params: { month: selectedMonth }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const chartData = {
        labels: data.map(item => item.range),
        datasets: [
            {
                label: 'Number of Items',
                data: data.map(item => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="chart-page">
            <label htmlFor="month">Select Month:</label>
            <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
            >
                <option value="">--Select Month--</option>
                {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </select>
            <div className="chart-container">
                <h1>Bar Chart Stats - {selectedMonth}</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
                )}
            </div>
        </div>
    );
};

export default ChartsPage;
