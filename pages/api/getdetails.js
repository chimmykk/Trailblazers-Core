import { getDbConnection } from '../../lib/db';

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // Allow only GET method
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

    try {
        // Get the database connection pool
        const pool = await getDbConnection();

        // Query to get data from taikocampaign table
        const [results] = await pool.query(`
            SELECT * FROM taikocampaign
            ORDER BY totalmint DESC
            LIMIT ?
        `, [limit]);

        // Format the response
        const response = results.length > 0
            ? results
                .sort((a, b) => b.totalmint - a.totalmint)
                .map((row, index) => ({
                    rank: index + 1,
                    wallet: row.address,
                    username: row.username,
                    rankScore: index + 1,
                    nfts: row.totalmint,
                    labels: row.categories,

                    avatar: `https://res.cloudinary.com/twdin/image/upload/v1719839745/avatar-example_mc0r1g.png`,
                    opensea: row.opensea,
                    twitter: row.twitter,
                    blockscan: row.Blockscan,
                    profile: row.profilepic,
                    activity: row.latestactivity,
                }))
            : { message: 'No records found in the taikocampaign table.' };

        res.json(response);
    } catch (error) {
        console.error('Error fetching data from taikocampaign table:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
