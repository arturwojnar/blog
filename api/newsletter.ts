import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_API_KEY = process.env.BREVO_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!BREVO_API_KEY) {
    console.error('BREVO_KEY environment variable is not set');
    return res.status(500).json({ error: 'Newsletter service is not configured' });
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        emailBlacklisted: false,
        updateEnabled: true, // Update if contact already exists
        listIds: [2],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('Brevo API error:', errorData);
      console.error('Response status:', response.status);

      // Handle duplicate contact error (already subscribed)
      if (response.status === 400 && errorData.code === 'duplicate_parameter') {
        return res.status(200).json({ 
          success: true, 
          message: 'Successfully subscribed to newsletter!' 
        });
      }

      // Handle authentication errors
      if (response.status === 401) {
        return res.status(500).json({ 
          error: 'Newsletter service configuration error. Please contact support.' 
        });
      }

      return res.status(response.status).json({ 
        error: 'Failed to subscribe to newsletter',
        details: errorData 
      });
    }

    // Success - try to parse response, but handle empty responses
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (text) {
        data = JSON.parse(text);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!',
      id: data?.id 
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return res.status(500).json({ error: 'Failed to subscribe to newsletter' });
  }
}
