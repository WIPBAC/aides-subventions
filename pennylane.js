export default async function handler(req, res) {
  // CORS — autorise l'appli à appeler ce proxy
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
 
  // Récupère le token depuis l'en-tête Authorization envoyé par l'appli
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
 
  // Reconstruit l'URL Pennylane avec les paramètres de recherche
  const params = new URLSearchParams(req.query).toString();
  const pennylaneUrl = `https://app.pennylane.com/api/external/firm/v1/companies${params ? '?' + params : ''}`;
 
  try {
    const response = await fetch(pennylaneUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
 
    const data = await response.json();
    return res.status(response.status).json(data);
 
  } catch (err) {
    return res.status(500).json({ error: 'Erreur proxy', detail: err.message });
  }
}
 
