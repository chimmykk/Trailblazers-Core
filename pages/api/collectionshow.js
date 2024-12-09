// import { getDbConnection } from './db';
// // get the list of connections
// export default async (req, res) => {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ error: 'Method not allowed' });
//     }

//     const limit = req.query.limit ? parseInt(req.query.limit, 10) : 1000;
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
//     res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET method
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

//     try {

//         const pool = await getDbConnection();

// // Maybe use this for getting the collection links
//         const [results] = await pool.query(`
//             SELECT symbol, permalink, address FROM collections
//             WHERE chain_id = 167009
//             AND created_at > '2024-07-28 00:00:00'
//             LIMIT ?
//         `, [limit]);

//         if (results.length === 0) {
//             return res.json({ message: 'No records found in the collections table.' });
//         }

//         res.json(results);
//     } catch (error) {
//         console.error('Error fetching data from collections table:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
