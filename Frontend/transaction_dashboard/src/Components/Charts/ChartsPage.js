"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartsPage = () => {
    const [selectedMonth, setSelectedMonth] = useState('March');
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    

    useEffect(() => {
        if (selectedMonth) {
            axios.get(`/api/bar-chart-data?month=${selectedMonth}`)
                .then(response => {
                    const data = response.data || []; // Ensure data is an array
                    console.log(data);
                    console.log("i am here");
                    if (Array.isArray(data)) {
                        const labels = data?.map(item => item.range || 'Unknown');
                        const counts = data?.map(item => item.count || 0);

                        setChartData({
                            labels,
                            datasets: [
                                {
                                    label: 'Number of Items',
                                    data: counts,
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                },
                            ],
                        });
                        setError(null); // Clear any previous errors
                    } else {
                        setError('Invalid data format from the server.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching bar chart data:', error);
                    setError('Error fetching data. Please try again later.');
                });
        }
    }, [selectedMonth]);

    return (
        <div>
            <h1>Charts</h1>
            <div>
                <label htmlFor="month">Select Month: </label>
                <select id="month" value={selectedMonth} onChange={handleMonthChange}>
                    <option value="">--Select a month--</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                </select>
            </div>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `Count: ${context.raw}`;
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Price Range',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Number of Items',
                                },
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default ChartsPage;



