// pages/api/fetchTopCollectors.js
import { getDbConnection } from './db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const pool = await getDbConnection();
        
        // Fetch top 10 houses by total mint from taikocampaign
        const [topHouses] = await pool.query(`
            SELECT house, SUM(totalmint) AS totalmint
            FROM taikocampaign
            GROUP BY house
            ORDER BY totalmint DESC
            LIMIT 10
        `);

        // For each house, fetch the corresponding houseaddress and permalink from collections
        const results = await Promise.all(topHouses.map(async (houseData) => {
            const [collection] = await pool.query(`
                SELECT address AS houseaddress, permalink
                FROM collections
                WHERE address = ?
            `, [houseData.house]);

            // Assuming each house has a unique address in collections
            if (collection.length > 0) {
                return {
                    house: houseData.house,
                    totalmint: houseData.totalmint,
                    houseaddress: collection[0].houseaddress,
                    permalink: collection[0].permalink
                };
            } else {
                return {
                    house: houseData.house,
                    totalmint: houseData.totalmint,
                    houseaddress: null,
                    permalink: null
                };
            }
        }));

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
}
