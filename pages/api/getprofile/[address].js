import connection from '../../../lib/db';
// Not used
export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { address } = req.query;

    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    const query = 'SELECT profilepic FROM taikocampaign WHERE address = ?';

    try {
        const [results] = await connection.query(query, [address]);

        if (results.length > 0 && results[0].profilepic) {
            const profileData = {
                data: Array.from(results[0].profilepic)
            };
            res.status(200).json(profileData);
        } else {
            res.status(404).json({ error: 'No profile picture found' });
        }
    } catch (error) {
        console.error('Error querying database: ', error.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
};
