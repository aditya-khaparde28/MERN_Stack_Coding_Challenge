"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StatisticsPage.css';

const StatisticsPage = () => {
    const [statistics, setStatistics] = useState({});
    const [month, setMonth] = useState('January');

    useEffect(() => {
        const fetchStatistics = async () => {
            const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/statistics?month=${month}`;
            try {
                const { data } = await axios.get(url);
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };
        fetchStatistics();
    }, [month]);

    return (
        <div className="container">
            <h1 className="header">Statistics for {month}</h1>
            <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="select"
            >
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
            <div className="statistics">
                <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
                <p>Total Sold Items: {statistics.totalSoldItems}</p>
                <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
            </div>
        </div>
    );
};

export default StatisticsPage;