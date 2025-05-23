export default async function handler(req, res) {
    try {
      // Fetch data from Mintpad's gettopcollector API
      const response = await fetch('https://app.mintpad.co/api/gettopcollector');
      
      if (!response.ok) {
        throw new Error('Failed to fetch top collectors');
      }
  
      const data = await response.json();
      // Return the fetched data as JSON
      res.status(200).json(data);
    } catch (error) {
      // Handle errors and return a 500 response
      res.status(500).json({ error: error.message });
    }
  }
  