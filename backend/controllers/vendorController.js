const { client } = require('../config/db');

const vendorController = {
  getVendors: async (req, res) => {
    try {
      const vendorIds = await client.zRange('vendors', 0, -1, { REV: true });
      
      const vendors = [];
      for (const id of vendorIds) {
        const vendor = await client.json.get(`vendor:${id}`);
        if (vendor) vendors.push(vendor);
      }
      
      res.status(200).json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getTopVendors: async (req, res) => {
    try {
      const vendorIds = await client.zRange('vendors', 0, 5, { REV: true });
      
      const vendors = [];
      for (const id of vendorIds) {
        const vendor = await client.json.get(`vendor:${id}`);
        if (vendor) vendors.push(vendor);
      }
      
      res.status(200).json(vendors);
    } catch (error) {
      console.error('Error fetching top vendors:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getVendor: async (req, res) => {
    try {
      const { id } = req.params;
      const vendor = await client.json.get(`vendor:${id}`);
      
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      
      // Also get vendor products (simplistic approach for demo)
      const allProductIds = await client.zRange('product_index', 0, -1);
      const products = [];
      for (const pId of allProductIds) {
        const product = await client.json.get(`product:${pId}`);
        if (product && product.vendorId === id) {
          products.push(product);
        }
      }
      
      res.status(200).json({ ...vendor, products });
    } catch (error) {
      console.error('Error fetching vendor:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = vendorController;
