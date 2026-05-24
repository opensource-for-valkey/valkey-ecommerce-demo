import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const SemanticSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await api.post('/ai/semantic-search', { query });
          setResults(res.data.results);
          setShowDropdown(true);
        } catch (err) {
          console.error("Semantic search failed", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="position-relative w-100 max-w-600 mx-auto" style={{ zIndex: 1000 }}>
      <div className="search-form__wrapper position-relative d-flex align-items-center bg-white rounded-pill border border-main-200 shadow-sm overflow-hidden" style={{ height: '48px' }}>
        <div className="ps-16 text-main-600 flex-center">
          <Sparkles size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-form__input common-input py-13 ps-12 pe-18 rounded-0 border-0 flex-grow-1 outline-none text-sm"
          placeholder="Describe what you want (e.g. 'cozy room essentials')..."
          onFocus={() => { if(results.length > 0) setShowDropdown(true); }}
        />
        {isSearching ? (
          <div className="pe-16 text-gray-400 flex-center">
            <div className="spinner-border spinner-border-sm text-main-600" role="status"></div>
          </div>
        ) : (
          <button type="submit" className="bg-main-two-600 flex-center text-xl text-white flex-shrink-0 w-48 h-100 hover-bg-main-two-700 transition-1" style={{ border: 'none' }}>
            <Search size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="position-absolute bg-white border border-gray-100 shadow-lg rounded-16 w-100 mt-8 overflow-hidden"
            style={{ top: '100%', left: 0, maxHeight: '400px', overflowY: 'auto' }}
          >
            <div className="p-12 bg-main-50 border-bottom border-gray-100 text-xs fw-semibold text-main-600 flex-align gap-8">
               <Sparkles size={14}/> AI Semantic Matches
            </div>
            {results.map(prod => (
              <Link 
                to={`/product-details-two?id=${prod.id}`} 
                key={prod.id}
                onClick={() => setShowDropdown(false)}
                className="d-flex align-items-center gap-16 p-16 border-bottom border-gray-100 hover-bg-gray-50 transition-1 text-decoration-none"
              >
                <img src={prod.images?.[0]} alt={prod.name} className="w-48 h-48 rounded-8 object-fit-cover" />
                <div>
                  <h6 className="text-sm fw-medium text-gray-900 mb-4 text-line-1">{prod.name}</h6>
                  <span className="text-main-600 fw-semibold text-sm">${prod.price}</span>
                  {prod.semanticScore > 0 && <span className="ms-12 text-xs text-success-600 fw-medium">Highly Relevant</span>}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemanticSearchBar;
