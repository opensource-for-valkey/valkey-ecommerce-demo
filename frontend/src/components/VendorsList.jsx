import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const VendorsList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/vendors');
        setVendors(response.data);
      } catch (err) {
        console.error("Failed to load vendors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <section className="vendors py-80">
        <div className="container container-lg text-center">
          <h4>Loading Vendors...</h4>
        </div>
      </section>
    );
  }

  return (
    <section className="vendors py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          {vendors.map(vendor => (
            <div className="col-lg-4 col-md-6 col-sm-6" key={vendor.id}>
              <div className="vendor-card border border-gray-100 rounded-16 p-24 bg-white hover-bg-main-50 transition-2">
                <div className="vendor-card__logo w-80 h-80 flex-center rounded-circle border border-gray-100 mb-24">
                  <img src="/assets/images/thumbs/vendor-logo1.png" alt={vendor.name} />
                </div>
                <h5 className="mb-12">
                  <Link to={`/vendor-details?id=${vendor.id}`} className="text-gray-900 hover-text-main-600">
                    {vendor.name}
                  </Link>
                </h5>
                <div className="flex-align gap-8 mb-16">
                  <span className="text-md fw-medium text-warning-600 d-flex">
                    <i className="ph-fill ph-star" />
                  </span>
                  <span className="text-gray-900 fw-semibold">{vendor.rating}</span>
                  <span className="text-gray-500">({vendor.reviews} Reviews)</span>
                </div>
                <div className="flex-align gap-8 mt-24">
                  <Link to={`/vendor-details?id=${vendor.id}`} className="btn btn-outline-main rounded-pill py-9 px-24">
                    Visit Store
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VendorsList;
