const axios = require('axios');
const Transaction = require('../models/transactionModel');

// Fetch data from third-party API 
const initializeDB = async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        //console.log(data)

        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to initialize database', error });
    }
};


//Get all data api
const getTransactions = async (req, res) => {
    try {
        const { month, page = 1, perPage = 10, search = '' } = req.query;

        let query = {};
        
        
        if (month) {
            const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;
            query.$expr = { $eq: [{ $month: "$dateOfSale" }, monthNumber] };
        }

        
        let searchQuery = [];

        
        if (search) {
            searchQuery.push(
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            );

            // Add number-based search condition for price if search is a number
            if (!isNaN(search)) {
                searchQuery.push({ price: parseFloat(search) });
            }
        }

        // Add search conditions to the main query, if any
        if (searchQuery.length) {
            query.$or = searchQuery;
        }

        // Calculate pagination parameters
        const skip = (page - 1) * perPage;

        
        const transactions = await Transaction.find(query)
            .skip(skip)
            .limit(parseInt(perPage));

        const totalTransactions = await Transaction.countDocuments(query);

        
        res.status(200).json({
            transactions,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalTransactions / perPage),
            totalTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

module.exports = { getTransactions };


// Get statistics for a selected month
const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }
        const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;

        
        const matchMonth = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            }
        };

        
        const totalSaleAmount = await Transaction.aggregate([
            { $match: matchMonth },
            { $match: { sold: true } },
            { $group: { _id: null, totalAmount: { $sum: "$price" } } }
        ]);

        
        const totalSoldItems = await Transaction.countDocuments({
            ...matchMonth,
            sold: true
        });

        
        const totalNotSoldItems = await Transaction.countDocuments({
            ...matchMonth,
            sold: false
        });

        // Send the response with calculated statistics
        res.status(200).json({
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
            totalSoldItems,
            totalNotSoldItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error });
    }
};

module.exports = { getStatistics };

//Bar chart data api
const getBarChartData = async (req, res) => {
    try {
        const { month } = req.query;

        
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }
        const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;

        // Define price ranges
        const priceRanges = [
            { range: "0 - 100", min: 0, max: 100 },
            { range: "101 - 200", min: 101, max: 200 },
            { range: "201 - 300", min: 201, max: 300 },
            { range: "301 - 400", min: 301, max: 400 },
            { range: "401 - 500", min: 401, max: 500 },
            { range: "501 - 600", min: 501, max: 600 },
            { range: "601 - 700", min: 601, max: 700 },
            { range: "701 - 800", min: 701, max: 800 },
            { range: "801 - 900", min: 801, max: 900 },
            { range: "901 - above", min: 901, max: Infinity }
        ];

        
        const result = [];

        
        const matchMonth = {
            $expr: {
                $eq: [{ $month: "$dateOfSale" }, monthNumber]
            }
        };

    
        for (const range of priceRanges) {
            const count = await Transaction.countDocuments({
                ...matchMonth,
                price: { $gte: range.min, $lt: range.max === Infinity ? Infinity : range.max + 1 }
            });
            result.push({ range: range.range, count });
        }

        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error });
    }
};

module.exports = { getBarChartData };


//Pie chart
const getPieChartData = async (req, res) => {
    try {
        const { month } = req.query;

        
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }
        const monthNumber = new Date(Date.parse(month + " 1")).getMonth() + 1;

        
        const result = await Transaction.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, monthNumber]
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    category: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);

        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error });
    }
};

module.exports = { getPieChartData };



const getCombinedData = async (req, res) => {
    try {
        const { month } = req.query;

        
        if (!month) {
            return res.status(400).json({ message: 'Month is required' });
        }

        
        const statisticsUrl = `http://localhost:8000/api/statistics?month=${month}`;
        const barChartUrl = `http://localhost:8000/api/bar-chart?month=${month}`;
        const pieChartUrl = `http://localhost:8000/api/pie-chart?month=${month}`;

        
        const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(statisticsUrl),
            axios.get(barChartUrl),
            axios.get(pieChartUrl)
        ]);

        
        const combinedData = {
            statistics: statisticsResponse.data,
            barChart: barChartResponse.data,
            pieChart: pieChartResponse.data
        };

        
        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error: error.message });
    }
};

module.exports = { getCombinedData };

module.exports = {
    initializeDB,
    getTransactions,
    getStatistics,
    getBarChartData,
    getPieChartData,
    getCombinedData
};