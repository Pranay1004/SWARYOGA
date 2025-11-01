import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message! We will get back to you soon.'
      });
      setLoading(false);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['+91 9779006820'],
      note: 'Available 11AM to 5PM IST'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['globalswaryoga@gmail.com'],
      note: 'We respond within 24-48 hours'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: ['Swar Yoga Resort', 'Himachal Pradesh, India'],
      note: 'Nestled in the serene mountains'
    }
  ];

  const faqItems = [
    {
      question: 'What is Swar Yoga?',
      answer: 'Swar Yoga is the ancient science of breath that focuses on the flow of breath through the nostrils (swara) and its connection to our physical, mental, and spiritual well-being. It teaches how to harmonize the breath with various activities for optimal health and consciousness.'
    },
    {
      question: 'How can I book a workshop?',
      answer: 'You can book a workshop by visiting our Workshops page, selecting the workshop you\'re interested in, and following the booking instructions. Alternatively, you can contact us directly via phone or email for assistance with your booking.'
    },
    {
      question: 'Do you offer online consultations?',
      answer: 'Yes, we offer online consultations with our experienced Swar Yoga practitioners. These sessions can be booked through our website or by contacting us directly. Online consultations are perfect for those who cannot visit us in person.'
    },
    {
      question: 'What should I bring to a retreat?',
      answer: 'For retreats, we recommend bringing comfortable clothing suitable for yoga and meditation, personal toiletries, any medications you require, a notebook and pen, and an open mind. Detailed packing lists are provided upon booking a specific retreat.'
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
              <p className="text-xl text-green-100 mb-8">
                Have questions about Swar Yoga or our programs? We're here to help you on your journey.
              </p>
            </div>
          </div>
        </section>
        
        {/* Contact Information */}
        <section className="py-12 -mt-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-100 rounded-lg mr-4">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {item.details.map((detail, i) => (
                        <p key={i} className="text-gray-700">{detail}</p>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-500">{item.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Contact Form and Map */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 text-green-600 mr-3" />
                  Send Us a Message
                </h2>
                
                {formStatus && (
                  <div className={`mb-6 p-4 rounded-lg flex items-center ${
                    formStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {formStatus.success ? (
                      <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
                    )}
                    <p>{formStatus.message}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Workshop Information">Workshop Information</option>
                        <option value="Resort Booking">Resort Booking</option>
                        <option value="Private Consultation">Private Consultation</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="privacy"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-green-600 hover:text-green-700">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
              
              {/* Map and Business Hours */}
              <div className="space-y-8">
                {/* Map */}
                <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Our Location
                  </h3>
                  
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1482193/pexels-photo-1482193.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Swar Yoga Resort Location"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mt-4 text-gray-600">
                    <p className="mb-1">Swar Yoga Resort</p>
                    <p className="mb-1">Himachal Pradesh, India</p>
                    <p>Nestled in the serene mountains</p>
                  </div>
                </div>
                
                {/* Business Hours */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    Business Hours
                  </h3>
                  
                  <ul className="space-y-3">
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'Closed' }
                    ].map((item, index) => (
                      <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">{item.day}</span>
                        <span className="text-gray-600">{item.hours}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Note:</span> Phone support is available from 11:00 AM to 5:00 PM IST.
                    </p>
                  </div>
                </div>
                
                {/* FAQ */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                  
                  <div className="space-y-4">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-800 mb-2">{item.question}</h4>
                        <p className="text-gray-600 text-sm">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Swar Yoga Journey?</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Join our community and discover the transformative power of breath awareness and yogic practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/workshops"
                className="bg-white hover:bg-gray-100 text-green-700 px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Explore Workshops
              </a>
              <a
                href="/resort"
                className="border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                Visit Our Resort
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;