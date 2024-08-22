import React from 'react';
import Link from 'next/link';
import './Navbar.css';


const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link href="/">Transactions</Link></li>
                <li><Link href="/statistics">Statistics</Link></li>
                <li><Link href="/charts">Charts</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;