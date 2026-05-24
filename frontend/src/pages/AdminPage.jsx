import React, { useState, useEffect } from 'react';
import HeaderTwo from '../components/HeaderTwo';
import FooterTwo from '../components/FooterTwo';
import Preloader from '../helper/Preloader';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, vendRes, adRes] = await Promise.all([
          fetch('http://localhost:5000/api/products?limit=100').then(r => r.json()),
          fetch('http://localhost:5000/api/categories').then(r => r.json()),
          fetch('http://localhost:5000/api/vendors').then(r => r.json()),
          fetch('http://localhost:5000/api/ads/all').then(r => r.json())
        ]);
        
        setProducts(prodRes.products || prodRes.results || []);
        setCategories(catRes || []);
        setVendors(vendRes || []);
        setAds(adRes || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Preloader />
      <HeaderTwo category={false} />
      
      <div className="container mt-40 mb-80">
        <h1 className="mb-24 text-heading">Admin Dashboard</h1>
        
        {loading ? (
          <div className="py-40 text-center w-100">Loading Dashboard Data...</div>
        ) : (
          <div className="row g-4">
            
            {/* Quick Stats */}
            <div className="col-12">
              <div className="d-flex gap-24 mb-40">
                <div className="bg-main-50 p-24 rounded-16 flex-grow-1 border border-main-200">
                  <h4 className="text-main-600 mb-8">{products.length}</h4>
                  <p className="text-gray-600 mb-0">Total Products</p>
                </div>
                <div className="bg-success-50 p-24 rounded-16 flex-grow-1 border border-success-200">
                  <h4 className="text-success-600 mb-8">{categories.length}</h4>
                  <p className="text-gray-600 mb-0">Total Categories</p>
                </div>
                <div className="bg-warning-50 p-24 rounded-16 flex-grow-1 border border-warning-200">
                  <h4 className="text-warning-600 mb-8">{vendors.length}</h4>
                  <p className="text-gray-600 mb-0">Active Vendors</p>
                </div>
                <div className="bg-danger-50 p-24 rounded-16 flex-grow-1 border border-danger-200">
                  <h4 className="text-danger-600 mb-8">{ads.length}</h4>
                  <p className="text-gray-600 mb-0">Active Ads</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="col-12 mb-40">
              <h3 className="mb-16">Products Library</h3>
              <div className="bg-white border border-gray-100 rounded-16 overflow-hidden">
                <table className="table mb-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-16">Product Name</th>
                      <th className="p-16">Price</th>
                      <th className="p-16">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map((p, i) => (
                      <tr key={i} className="border-top border-gray-100">
                        <td className="p-16">{p.name}</td>
                        <td className="p-16">${p.price?.current || 0}</td>
                        <td className="p-16">
                          <span className={`px-8 py-4 rounded-4 text-xs ${p.status === 'active' ? 'bg-success-50 text-success-600' : 'bg-gray-50 text-gray-600'}`}>
                            {p.status || 'active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendors Table */}
            <div className="col-12">
              <h3 className="mb-16">Registered Vendors</h3>
              <div className="bg-white border border-gray-100 rounded-16 overflow-hidden">
                <table className="table mb-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-16">Vendor ID</th>
                      <th className="p-16">Vendor Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((v, i) => (
                      <tr key={i} className="border-top border-gray-100">
                        <td className="p-16 text-xs text-gray-500">{v.id}</td>
                        <td className="p-16">{v.name}</td>
                      </tr>
                    ))}
                    {vendors.length === 0 && (
                      <tr>
                        <td colSpan="2" className="p-16 text-center text-gray-500">No vendors found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>

      <FooterTwo />
    </>
  );
};

export default AdminPage;
