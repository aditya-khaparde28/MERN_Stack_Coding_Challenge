"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsPage.css';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('March');

    useEffect(() => {
        const fetchTransactions = async () => {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/transactions`, {
                params: { page, perPage, search, month }
            });
            setTransactions(data.transactions);
        };
        fetchTransactions();
    }, [page, search, month]);

    return (
        <div className="transactions-container">
            <h1>Transactions Dashboard</h1>
            <div className="controls">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
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
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Sold</th>
                        <th>Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.category}</td>
                            <td>
                                <img
                                    src={transaction.image}
                                    alt={transaction.title}
                                    className="transaction-image"
                                />
                            </td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                <span>Page {page}</span>
                <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
        </div>
    );
};
export default TransactionsPage;