const { client } = require('../config/db');

const blogController = {
  getPosts: async (req, res) => {
    try {
      // Return mock blog posts for now
      const posts = [
        {
          id: '1',
          title: 'The Best Laptops of 2026',
          author: 'Tech Guru',
          date: new Date().toISOString(),
          excerpt: 'A comprehensive review of the latest laptops...',
          image: '/assets/images/thumbs/blog-img1.png'
        },
        {
          id: '2',
          title: 'Smart Home Automation Guide',
          author: 'Smart Living',
          date: new Date().toISOString(),
          excerpt: 'How to make your home smarter...',
          image: '/assets/images/thumbs/blog-img2.png'
        }
      ];
      
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  },

  getPost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = {
          id: id,
          title: 'The Best Laptops of 2026',
          author: 'Tech Guru',
          date: new Date().toISOString(),
          content: 'Full content goes here...',
          image: '/assets/images/thumbs/blog-img1.png'
      };
      
      res.status(200).json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  }
};

module.exports = blogController;
