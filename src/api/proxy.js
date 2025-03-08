export default async function handler(req, res) {
    const targetUrl = 'http://194.31.53.238:8080' + req.url.replace('/api', '');
    
    try {
      const fetchOptions = {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json'
        }
      };
      
      // Add body data for POST requests
      if (req.method === 'POST' && req.body) {
        fetchOptions.body = JSON.stringify(req.body);
      }
      
      const response = await fetch(targetUrl, fetchOptions);
      const data = await response.json();
      
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }