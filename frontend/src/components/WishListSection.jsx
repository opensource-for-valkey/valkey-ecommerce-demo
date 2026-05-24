import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishListSection = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product.id, 1);
    removeFromWishlist(product.id);
  };

  if (loading) {
    return (
      <section className='cart py-80'>
        <div className='container container-lg text-center'>
          <h4>Loading Wishlist...</h4>
        </div>
      </section>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <section className="cart py-80">
        <div className="container container-lg text-center">
          <div className="py-40">
            <h3>Your wishlist is empty</h3>
            <Link to="/shop" className="btn btn-main mt-24 py-18 px-32 rounded-8">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='cart py-80'>
      <div className='container container-lg'>
        <div className='row gy-4'>
          <div className='col-lg-11'>
            <div className='cart-table border border-gray-100 rounded-8'>
              <div className='overflow-x-auto scroll-sm scroll-sm-horizontal'>
                <table className='table rounded-8 overflow-hidden'>
                  <thead>
                    <tr className='border-bottom border-neutral-100'>
                      <th className='h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100'>
                        Delete
                      </th>
                      <th className='h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100'>
                        Product Name
                      </th>
                      <th className='h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100'>
                        Unit Price
                      </th>
                      <th className='h6 mb-0 text-lg fw-bold px-40 py-32 border-end border-neutral-100'>
                        Stock Status
                      </th>
                      <th className='h6 mb-0 text-lg fw-bold px-40 py-32' />
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((item) => (
                      <tr key={item.id}>
                        <td className='px-40 py-32 border-end border-neutral-100'>
                          <button
                            type='button'
                            onClick={() => removeFromWishlist(item.id)}
                            className='remove-tr-btn flex-align gap-12 hover-text-danger-600'
                          >
                            <i className='ph ph-x-circle text-2xl d-flex' />
                            Remove
                          </button>
                        </td>
                        <td className='px-40 py-32 border-end border-neutral-100'>
                          <div className='table-product d-flex align-items-center gap-24'>
                            <Link
                              to={`/product-details-two?id=${item.id}`}
                              className='table-product__thumb border border-gray-100 rounded-8 flex-center '
                            >
                              <img
                                src={item.images && item.images[0] ? item.images[0] : "/assets/images/thumbs/product-two-img1.png"}
                                alt={item.name}
                                style={{ width: '80px', height: 'auto' }}
                              />
                            </Link>
                            <div className='table-product__content text-start'>
                              <h6 className='title text-lg fw-semibold mb-8'>
                                <Link
                                  to={`/product-details-two?id=${item.id}`}
                                  className='link text-line-2'
                                  tabIndex={0}
                                >
                                  {item.name}
                                </Link>
                              </h6>
                              <div className='flex-align gap-16 mb-16'>
                                <div className='flex-align gap-6'>
                                  <span className='text-md fw-medium text-warning-600 d-flex'>
                                    <i className='ph-fill ph-star' />
                                  </span>
                                  <span className='text-md fw-semibold text-gray-900'>
                                    {item.rating || 0}
                                  </span>
                                </div>
                                <span className='text-sm fw-medium text-gray-200'>
                                  |
                                </span>
                                <span className='text-neutral-600 text-sm'>
                                  {item.reviews || 0} Reviews
                                </span>
                              </div>
                              {item.category && (
                                <div className='flex-align gap-16'>
                                  <Link
                                    to={`/shop?category=${item.category}`}
                                    className='product-card__cart btn bg-gray-50 text-heading text-sm hover-bg-main-600 hover-text-white py-7 px-8 rounded-8 flex-center gap-8 fw-medium'
                                  >
                                    <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className='px-40 py-32 border-end border-neutral-100'>
                          <span className='text-lg h6 mb-0 fw-semibold'>
                            ${(item.price || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className='px-40 py-32 border-end border-neutral-100'>
                          <span className={`text-lg h6 mb-0 fw-semibold ${item.stock > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className='px-40 py-32'>
                          <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={item.stock <= 0}
                            className={`btn btn-main-two rounded-8 px-64 ${item.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Add To Cart <i className='ph ph-shopping-cart' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishListSection;
