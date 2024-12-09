const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:8000','http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};


app.use(cors(corsOptions));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Koireng@1',
    database: 'mydatabase'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});
//mintpad stuff
app.post('/api/uploadImage', (req, res) => {
    const { name, base64Image } = req.body;

    if (!name || !base64Image) {
        return res.status(400).json({ error: 'Name and base64Image are required' });
    }

    const query = `UPDATE users SET profile_picture = ? WHERE name = ?`;

    connection.query(query, [base64Image, name], (err, results) => {
        if (err) {
            console.error('Error updating profile picture: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log(`Profile picture updated for user: ${name}`);
        res.status(200).json({ message: 'Profile picture updated successfully' });
    });
});

// to save player details
app.post('/api/playerdetails', (req, res) => {
    const { address, house, housetype, housename } = req.body;

    if (!address || !house || !housetype || !housename) {
        return res.status(400).json({ error: 'address, house, housetype, and housename are required' });
    }

    //check if address already exist
    const checkQuery = 'SELECT totalmint FROM taikocampaign WHERE address = ?';

    connection.query(checkQuery, [address], (err, results) => {
        if (err) {
            console.error('Error checking player details: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
           
            const currentTotalMint = parseInt(results[0].totalmint, 10) || 0;
            const newTotalMint = currentTotalMint + 1;

            const updateQuery = 'UPDATE taikocampaign SET house = ?, housetype = ?, housename = ?, totalmint = ? WHERE address = ?';
            connection.query(updateQuery, [house, housetype, housename, newTotalMint, address], (err, updateResults) => {
                if (err) {
                    console.error('Error updating player details: ' + err.stack);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                console.log(`Player details updated: ${address}, ${house}, ${housetype}, ${housename}, totalmint: ${newTotalMint}`);
                res.status(200).json({ message: 'Player details updated successfully' });
            });
        } else {
            const insertQuery = 'INSERT INTO taikocampaign (address, house, housetype, housename, totalmint) VALUES (?, ?, ?, ?, 1)';
            connection.query(insertQuery, [address, house, housetype, housename], (err, insertResults) => {
                if (err) {
                    console.error('Error saving player details: ' + err.stack);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                console.log(`Player details saved: ${address}, ${house}, ${housetype}, ${housename}, totalmint: 1`);
                res.status(200).json({ message: 'Player details saved successfully' });
            });
        }
    });
});

//create campaign endpoint to check for collection push collection list
app.post('/createcampaign', (req, res) => {
    const { symbol, name, feeRecipient } = req.body;

    if (!symbol || !name || !feeRecipient) {
        return res.status(400).json({ error: 'symbol, name, and feeRecipient are required' });
    }

    //check if the campaign already exists
    const checkQuery = 'SELECT * FROM taikocampaigncollection WHERE symbol = ?';

    connection.query(checkQuery, [symbol], (err, results) => {
        if (err) {
            console.error('Error checking campaign existence: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            // Campaign already exists
            return res.status(409).json({ error: 'Campaign already exists' });
        } else {
            const insertQuery = 'INSERT INTO taikocampaigncollection (symbol, name, feeRecipient) VALUES (?, ?, ?)';
            connection.query(insertQuery, [symbol, name, feeRecipient], (err) => {
                if (err) {
                    console.error('Error creating campaign collection: ' + err.stack);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                console.log(`Campaign collection created: Symbol: ${symbol}, Name: ${name}, Fee Recipient: ${feeRecipient}`);
                res.status(200).json({ message: 'Campaign collection created successfully' });
            });
        }
    });
});

// Endpoint to fetch details of the player with the highest totalmint
app.get('/getdetailstopone', (req, res) => {
    // Query to fetch all data from 'taikocampaign' table
    connection.query('SELECT * FROM taikocampaign', (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from taikocampaign table:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Find the record with the highest totalmint
        let highestMintRecord = null;
        results.forEach((row) => {
            if (!highestMintRecord || parseInt(row.totalmint) > parseInt(highestMintRecord.totalmint)) {
                highestMintRecord = row;
            }
        });

        // Prepare response
        let response = {};
        if (highestMintRecord) {
            response = {
                data: highestMintRecord
            };
        } else {
            response = {
                message: 'No records found in the taikocampaign table.'
            };
        }

        // Send response
        res.json(response);
    });
});

// Endpoint to fetch top player details ordered by totalmint
app.get('/getdetails', (req, res) => {
    // Default limit if not specified in query params
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    // Query to fetch top records ordered by totalmint in descending order
    connection.query(`SELECT * FROM taikocampaign ORDER BY totalmint DESC LIMIT ${limit}`, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from taikocampaign table:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        let response = {};

        if (results.length > 0) {
            response = results.map((row, index) => ({
                rank: index + 1,             // Rank starts from 1
                wallet: row.address,        // Assuming 'playerid' is the wallet address
                rankScore: index+1,    // Adjust as per your application's logic
                nfts: row.totalmint,
                labels:row.categories,
                activity: `https://mintpad-trailblazers.vercel.app/activity-example.svg`,
                         // Assuming 'totalmint' represents the number of NFTs
            avatar: `https://res.cloudinary.com/twdin/image/upload/v1719839745/avatar-example_mc0r1g.png`,
            opensea: row.opensea,
                twitter: row.twitter,
                blockscan: row.Blockscan,

            }));
        } else {
            response = {
                message: 'No records found in the taikocampaign table.'
            };
        }
        res.json(response);
    });
});

app.post('/api/taikocampaign', (req, res) => {
    const { address, ...updateFields } = req.body;

    if (!address) {
        return res.status(400).json({ error: 'address is required' });
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    const checkQuery = 'SELECT * FROM taikocampaign WHERE address = ?';
    connection.query(checkQuery, [address], (err, results) => {
        if (err) {
            console.error('Error checking taikocampaign details: ' + err.stack);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User with the given address does not exist' });
        } else {
            // Retrieve existing categories from the database result
            const existingCategories = results[0].categories;

            const fields = [];
            const values = [];

            Object.keys(updateFields).forEach(key => {
                fields.push(`${key} = ?`);
                values.push(updateFields[key]);
            });

            // If categories are not included in updateFields, retain existing categories
            if (!updateFields.hasOwnProperty('categories')) {
                fields.push('categories = ?');
                values.push(existingCategories); // Use existing categories
            }

            values.push(address);

            const updateQuery = `UPDATE taikocampaign SET ${fields.join(', ')} WHERE address = ?`;
            connection.query(updateQuery, values, (err, results) => {
                if (err) {
                    console.error('Error updating taikocampaign details: ' + err.stack);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                console.log(`taikocampaign details updated for address: ${address}`);
                res.status(200).json({ message: 'taikocampaign details updated successfully' });
            });
        }
    });
});


app.get('/gettotalmint/:address', (req, res) => {
    const address = req.params.address; // Fetch the address parameter from path params

    // Query to fetch details for the specified address
    connection.query(`SELECT totalmint FROM taikocampaign WHERE address = ?`, [address], (error, results, fields) => {
        if (error) {
            console.error('Error fetching data from taikocampaign table:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No records found for the specified address.' });
        }

        // Assuming there's only one result for a specific address, but you can adjust if needed
        const row = results[0];

        const response = {
            nfts: row.totalmint, // Assuming 'totalmint' represents the number of NFTs
        };

        res.json(response);
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});