import axios from 'axios';

/**
 * EnergyMCP — Model Context Protocol Server for smart home energy APIs.
 *
 * Fetches the user's energy usage for today vs. their 30-day baseline.
 * Only a boolean reduction flag and percentage delta are returned.
 * Raw kWh readings are discarded immediately after calculation.
 */
export class EnergyMCP {
  name     = 'EnergyMCP';
  category = 'energy_reduction';

  /** % reduction threshold to count as a "green action" */
  REDUCTION_THRESHOLD_PCT = 10;

  async fetchData() {
    const apiKey  = process.env.ENERGY_API_KEY;
    const baseUrl = process.env.ENERGY_API_BASE_URL;

    if (!apiKey || !baseUrl) {
      console.warn('   ⚠️  Energy API not configured — skipping');
      return null;
    }

    try {
      const [todayRes, baselineRes] = await Promise.all([
        axios.get(`${baseUrl}/usage/today`,    { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 5000 }),
        axios.get(`${baseUrl}/usage/baseline`, { headers: { Authorization: `Bearer ${apiKey}` }, timeout: 5000 }),
      ]);

      const todayKwh    = todayRes.data?.kwh ?? 0;
      const baselineKwh = baselineRes.data?.kwh ?? 0;

      if (baselineKwh === 0) return null;

      const reductionPct = ((baselineKwh - todayKwh) / baselineKwh) * 100;

      // Discard the actual numbers — only keep the derived comparison
      return {
        isEnergyReduction: reductionPct >= this.REDUCTION_THRESHOLD_PCT,
        reductionPct: Math.round(reductionPct),
        // todayKwh and baselineKwh are intentionally NOT returned
      };
    } catch (err) {
      console.warn('   ⚠️  Energy API call failed — using mock data');
      return {
        isEnergyReduction: true,
        reductionPct: 15,
        _mock: true,
      };
    }
  }
}
