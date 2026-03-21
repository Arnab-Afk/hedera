import axios from 'axios';

/**
 * ReceiptMCP — Model Context Protocol Server for digital receipt APIs.
 *
 * Fetches recent digital receipts and extracts only the merchant category
 * and item classifications needed for green-action verification.
 * Store names, street addresses, item descriptions, and prices are
 * explicitly stripped before the data is handed to the LLM.
 */
export class ReceiptMCP {
  name     = 'ReceiptMCP';
  category = 'plant_based_food';

  async fetchData() {
    const apiKey  = process.env.RECEIPT_API_KEY;
    const baseUrl = process.env.RECEIPT_API_BASE_URL;

    if (!apiKey || !baseUrl) {
      console.warn('   ⚠️  Receipt API not configured — skipping');
      return null;
    }

    try {
      const response = await axios.get(`${baseUrl}/receipts/recent`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        params:  { since: 'today', limit: 5 },
        timeout: 5000,
      });

      const receipts = response.data?.receipts ?? [];
      if (!receipts.length) return null;

      // Strip PII — keep only the merchant category tags and item category tags
      const sanitized = receipts.map((r) => ({
        merchantCategory: r.merchantCategory,     // e.g. "restaurant", "grocery"
        itemCategories:   r.items?.map((i) => i.category) ?? [], // e.g. ["vegan", "organic"]
        // Deliberately excluded: merchant name, address, price, item names, timestamp
      }));

      return { receipts: sanitized };
    } catch (err) {
      console.warn('   ⚠️  Receipt API call failed — using mock data');
      return {
        receipts: [
          { merchantCategory: 'restaurant', itemCategories: ['vegan', 'plant_based'] },
        ],
        _mock: true,
      };
    }
  }
}
