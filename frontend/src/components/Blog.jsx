import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/blog');
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to load blog posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <section className="blog py-80">
        <div className="container container-lg text-center">
          <h4>Loading Blog...</h4>
        </div>
      </section>
    );
  }

  return (
    <section className="blog py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          {posts.map(post => (
            <div className="col-lg-4 col-sm-6" key={post.id}>
              <div className="blog-card border border-gray-100 rounded-16 bg-white overflow-hidden">
                <Link to={`/blog-details?id=${post.id}`} className="blog-card__thumb d-block">
                  <img src={post.image || "/assets/images/thumbs/blog-img1.png"} alt={post.title} className="w-100" />
                </Link>
                <div className="blog-card__content p-24">
                  <div className="flex-align gap-16 mb-16">
                    <span className="flex-align gap-8 text-gray-500 text-sm">
                      <i className="ph ph-user" /> {post.author}
                    </span>
                    <span className="flex-align gap-8 text-gray-500 text-sm">
                      <i className="ph ph-calendar" /> {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="mb-16">
                    <Link to={`/blog-details?id=${post.id}`} className="text-gray-900 hover-text-main-600 line-clamp-2">
                      {post.title}
                    </Link>
                  </h5>
                  <p className="text-gray-500 line-clamp-3 mb-24">
                    {post.excerpt}
                  </p>
                  <Link to={`/blog-details?id=${post.id}`} className="btn btn-outline-main rounded-pill py-9 px-24">
                    Read More
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

export default Blog;