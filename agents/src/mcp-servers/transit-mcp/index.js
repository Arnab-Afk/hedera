import axios from 'axios';

/**
 * TransitMCP — Model Context Protocol Server for public transit APIs.
 *
 * Connects to a city transit API and checks whether the user has made
 * a verified public transit trip today. Returns a minimal boolean result;
 * no route, station, or personal data is retained.
 */
export class TransitMCP {
  name     = 'TransitMCP';
  category = 'public_transit';

  async fetchData() {
    const apiKey  = process.env.TRANSIT_API_KEY;
    const baseUrl = process.env.TRANSIT_API_BASE_URL;

    if (!apiKey || !baseUrl) {
      console.warn('   ⚠️  Transit API not configured — skipping');
      return null;
    }

    try {
      // In production, this would authenticate with the user's transit account
      // and check for a validated trip scan today.
      const response = await axios.get(`${baseUrl}/trips/today`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 5000,
      });

      const trips = response.data?.trips ?? [];
      return {
        tripsToday: trips.length,
        hasPublicTransitTrip: trips.length > 0,
        // Deliberately discard: route names, station names, GPS, timestamps
      };
    } catch (err) {
      // Return mock data for development / hackathon demo
      console.warn('   ⚠️  Transit API call failed — using mock data');
      return {
        tripsToday: 1,
        hasPublicTransitTrip: true,
        _mock: true,
      };
    }
  }
}
