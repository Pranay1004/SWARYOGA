import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Search, ArrowRight, Clock, Eye, MessageSquare, Bookmark } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Science of Breath: Understanding Swar Yoga',
      excerpt: 'Discover the ancient yogic science of breath and how it can transform your health and well-being.',
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Dr. Mohan Singh',
      date: 'June 15, 2024',
      category: 'Yoga Science',
      readTime: '8 min read',
      views: 1245,
      comments: 23
    },
    {
      id: 2,
      title: 'Balancing Your Nadis: Practical Techniques for Daily Life',
      excerpt: 'Learn how to balance the solar and lunar energies in your body through simple breathing practices.',
      image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Priya Sharma',
      date: 'May 28, 2024',
      category: 'Pranayama',
      readTime: '6 min read',
      views: 987,
      comments: 15
    },
    {
      id: 3,
      title: 'The Connection Between Breath and Mental Health',
      excerpt: 'Explore the profound impact of breathing patterns on anxiety, depression, and overall mental wellbeing.',
      image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Dr. Mohan Singh',
      date: 'May 10, 2024',
      category: 'Mental Health',
      readTime: '10 min read',
      views: 1567,
      comments: 42
    },
    {
      id: 4,
      title: 'Swar Yoga for Beginners: Where to Start',
      excerpt: 'A comprehensive guide for those new to the practice of Swar Yoga and breath awareness.',
      image: 'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Amit Patel',
      date: 'April 22, 2024',
      category: 'Beginners',
      readTime: '5 min read',
      views: 2134,
      comments: 18
    },
    {
      id: 5,
      title: 'Seasonal Breathing: Adapting Your Practice Throughout the Year',
      excerpt: 'How to modify your breathing practices according to different seasons for optimal health.',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Priya Sharma',
      date: 'April 5, 2024',
      category: 'Seasonal Practices',
      readTime: '7 min read',
      views: 876,
      comments: 9
    },
    {
      id: 6,
      title: 'The Yogic Diet: Foods that Support Breath Awareness',
      excerpt: 'Discover the traditional yogic approach to nutrition that enhances respiratory health and pranayama practice.',
      image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Amit Patel',
      date: 'March 18, 2024',
      category: 'Nutrition',
      readTime: '9 min read',
      views: 1432,
      comments: 27
    }
  ];

  const categories = [
    { name: 'Yoga Science', count: 12 },
    { name: 'Pranayama', count: 8 },
    { name: 'Mental Health', count: 15 },
    { name: 'Beginners', count: 10 },
    { name: 'Seasonal Practices', count: 6 },
    { name: 'Nutrition', count: 9 },
    { name: 'Meditation', count: 14 },
    { name: 'Research', count: 7 }
  ];

  const popularPosts = [
    {
      id: 7,
      title: 'How Breath Awareness Changed My Life',
      image: 'https://images.pexels.com/photos/3820296/pexels-photo-3820296.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      date: 'February 12, 2024'
    },
    {
      id: 8,
      title: 'The Science Behind Alternate Nostril Breathing',
      image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      date: 'January 28, 2024'
    },
    {
      id: 9,
      title: '5 Morning Breathing Exercises for Energy',
      image: 'https://images.pexels.com/photos/4325484/pexels-photo-4325484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      date: 'January 15, 2024'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Swar Yoga Blog</h1>
              <p className="text-xl text-green-100 mb-8">
                Insights, research, and practical wisdom on the science of breath and yogic living
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full px-5 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Blog Posts */}
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Latest Articles</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {blogPosts.map(post => (
                    <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-green-600 transition-colors">
                          <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-2">
                              {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="text-sm">
                              <p className="text-gray-800 font-medium">{post.author}</p>
                              <p className="text-gray-500">{post.date}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 text-gray-500 text-sm">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {post.views}
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              {post.comments}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                
                <div className="mt-10 flex justify-center">
                  <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors">
                    <span>Load More Articles</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:w-1/3 space-y-8">
                {/* About */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">About Our Blog</h3>
                  <p className="text-gray-600 mb-4">
                    The SwarYoga blog is dedicated to sharing authentic knowledge about the science of breath, 
                    yogic practices, and holistic wellness. Our articles are written by experienced practitioners 
                    and researchers in the field.
                  </p>
                  <Link 
                    to="/about" 
                    className="text-green-600 hover:text-green-700 font-medium flex items-center"
                  >
                    <span>Learn more about us</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
                
                {/* Categories */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.map(category => (
                      <li key={category.name}>
                        <Link 
                          to={`/blog/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="flex items-center text-gray-700">
                            <Tag className="h-4 w-4 mr-2 text-green-600" />
                            {category.name}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {category.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Popular Posts */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Posts</h3>
                  <div className="space-y-4">
                    {popularPosts.map(post => (
                      <Link 
                        key={post.id}
                        to={`/blog/${post.id}`}
                        className="flex items-center space-x-3 group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Newsletter */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-md p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                  <p className="text-green-100 mb-4">
                    Get the latest articles, research, and practical tips delivered to your inbox.
                  </p>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white text-green-700 hover:bg-green-100 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                  <p className="text-xs text-green-100 mt-3">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
                
                {/* Tags */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Pranayama', 'Meditation', 'Wellness', 'Breathing', 'Yoga', 'Health', 'Mindfulness', 'Stress Relief', 'Nadis', 'Chakras', 'Ayurveda'].map(tag => (
                      <Link 
                        key={tag}
                        to={`/blog/tag/${tag.toLowerCase()}`}
                        className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;