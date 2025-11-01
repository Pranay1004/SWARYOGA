import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Heart, Users, Award, Calendar, Clock, Tag, Filter, Search, X, Phone, LayoutDashboard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  const [showMembershipPopup, setShowMembershipPopup] = useState(false);

  const membershipDetails = {
    price: 11000,
    maxParticipants: 201,
    accommodationDays: 50,
    validity: '5 years',
    stayPerYear: '10 days',
    peoplePerStay: 2,
    discountRate: 50,
    priceRange: {
      min: 11000,
      max: 21000
    }
  };

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg"
            alt="Peaceful nature yoga setting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6">
                <span className="text-white font-light block mb-2">Welcome to</span>
                <span className="text-green-400 font-medium">Swar Yoga</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                The Science of Breath - Ancient yogic practices that unlock the secrets of conscious breathing for optimal health and vitality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/workshops"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center group hover:translate-y-[-2px] hover:shadow-lg"
              >
                <span className="text-lg">Start Your Journey</span>
                <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg transition-all duration-300 text-center text-lg hover:translate-y-[-2px]"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-serif text-[#2A5654] mb-6">Discover Swar Yoga</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                At Swar Yoga, we believe in the transformative power of breath to bring balance and harmony to your life. 
                Our approach combines traditional yoga practices with modern wellness techniques to create a holistic 
                experience for practitioners of all levels.
              </p>
              <p className="text-gray-700 mb-8 leading-relaxed">
                Whether you're looking to deepen your practice, find stress relief, or embark on a journey of 
                self-discovery, our experienced instructors are here to guide you every step of the way.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <span>Learn more about our philosophy</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="aspect-[4/5] md:aspect-auto md:h-[500px] relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://i.postimg.cc/J4zrWKT7/temp-Image6-FKl-H4.avif"
                  alt="Swar Yoga practice and meditation"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-red-500 text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="text-xl font-serif">25+ Years</p>
                <p className="text-sm">of teaching experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshops Call-to-Action Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2A5654] mb-4">Transform Your Practice</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Join our comprehensive workshop programs and discover the ancient science of breath
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Single Workshop Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-xl mb-8"
            >
              <img
                src="https://i.postimg.cc/kGRQhYJg/tempImageai7DlM.avif"
                alt="Swar Yoga Workshops - Ancient Science of Brain Breathing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Discover Ancient Wisdom
                </h3>
                <p className="text-lg text-gray-200">
                  Join our transformative workshops and retreats
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">8000+</div>
                <div className="text-gray-600">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                <div className="text-gray-600">Countries Reached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </motion.div>

            {/* View All Workshops Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/workshops"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition-all duration-300 text-lg font-medium hover:shadow-lg hover:translate-y-[-2px] group"
              >
                <Calendar size={24} className="mr-3" />
                <span>Explore Our Workshops</span>
                <ArrowRight size={20} className="ml-3 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Resort Section */}
      <section className="py-20 bg-[#2A5654] text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Experience Our Yoga Resort</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Nestled in the serene mountains, our yoga resort offers a peaceful retreat from the hustle and bustle of everyday life. 
                Immerse yourself in nature while deepening your yoga practice in our beautiful studios and tranquil surroundings.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Enjoy comfortable accommodations, nourishing organic meals, and a variety of wellness activities 
                designed to rejuvenate your body, mind, and spirit in our pristine natural environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/resort" 
                  className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  
                  <span>Explore Our Resort</span>
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <button
                  onClick={() => setShowMembershipPopup(true)}
                  className="inline-flex items-center bg-white text-[#2A5654] px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  View Membership Plan
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                src="https://i.postimg.cc/vZ4BFXPF/temp-Image-IIb-JFp.avif"
                alt="Resort exterior and natural surroundings"
                className="rounded-lg h-56 object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                src="https://i.postimg.cc/MKmQ9snW/aaa-candal.avif"
                alt="Yoga studio and meditation spaces"
                className="rounded-lg h-56 object-cover mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                src="https://i.postimg.cc/5NTZkmTR/temp-Image-Gmbma-U.avif"
                alt="Resort amenities and wellness facilities"
                className="rounded-lg h-56 object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                src="https://i.postimg.cc/hGJyQCn0/tempImageCNl8Fp.avif"
                alt="Dining area and organic cuisine"
                className="rounded-lg h-56 object-cover mt-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Begin Your Yoga Journey Today</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join our community and discover the transformative power of yoga. Whether you're a beginner or an experienced practitioner, we have classes and workshops for every level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/workshops"
              className="bg-white hover:bg-gray-100 text-green-600 px-6 py-3 rounded-lg transition-colors"
            >
              Browse Workshops
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-green-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Popup */}
      <AnimatePresence>
        {showMembershipPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setShowMembershipPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-[#2A5654] mb-2">Resort Membership</h3>
                  <p className="text-gray-600">Limited time offer - Only {membershipDetails.maxParticipants} spots available</p>
                </div>

                <div className="bg-gradient-to-br from-[#2A5654] to-[#1F4240] rounded-lg p-6 text-white mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-300">Starting from</p>
                      <p className="text-3xl font-bold">₹{membershipDetails.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">Valid for</p>
                      <p className="text-xl font-semibold">{membershipDetails.validity}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p>✓ {membershipDetails.accommodationDays} days free accommodation</p>
                    <p>✓ {membershipDetails.stayPerYear} days per year for {membershipDetails.peoplePerStay} people</p>
                    <p>✓ {membershipDetails.discountRate}% discount on room rates for friends</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Price Range</h4>
                    <p className="text-gray-600">
                      Early bird pricing from ₹{membershipDetails.priceRange.min.toLocaleString()} to ₹{membershipDetails.priceRange.max.toLocaleString()} based on booking sequence
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/resort"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-center transition-colors"
                      onClick={() => setShowMembershipPopup(false)}
                    >
                      Learn More
                    </Link>
                    <a
                      href="tel:+919779006820"
                      className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg transition-colors"
                    >
                      <Phone size={18} className="mr-2" />
                      Call for Details
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default HomePage;