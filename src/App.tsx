import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LifePlanner from './pages/LifePlanner';
import LifePlannerLogin from './pages/LifePlannerLogin';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/lifeplanner-login" element={<LifePlannerLogin />} />
            <Route 
              path="/lifeplanner" 
              element={
                <ProtectedRoute>
                  <LifePlanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route path="/workshops" element={<div>Workshops Page - Coming Soon</div>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resort" element={<div>Resort Page - Coming Soon</div>} />
            <Route path="/about" element={<div>About Page - Coming Soon</div>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;