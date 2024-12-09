import connection from '../../../../lib/db';

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { address } = req.query;

    try {
        const [results] = await connection.query('SELECT totalmint FROM taikocampaign WHERE address = ?', [address]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No records found for the specified address.' });
        }

        const response = { nfts: results[0].totalmint };
        res.json(response);
    } catch (error) {
        console.error('Error fetching data from taikocampaign table:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
