import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase'; // Ensure Firebase is correctly initialized
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const initialState = {
  email: '',
  password: '',
};

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isValidPassword = (password) => password.length >= 8;

  // Handle login function
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked"); // Ensure the function is triggered
    setError(null);
    setIsLoading(true);

    // Validation checks
    if (!formData.email.trim()) {
      setError('Email is required.');
      setIsLoading(false);
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (!isValidGmail(formData.email)) {
      setError('Please use a Gmail address (example: yourname@gmail.com).');
      setIsLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required.');
      setIsLoading(false);
      return;
    }
    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 8 characters.');
      setIsLoading(false);
      return;
    }

    // Attempt sign-in
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user; // Extract user object
      setIsLoading(false);
      console.log("User signed in: ", user.email); // Log email for verification
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage

      // Check if access_token is present in localStorage
      let access_token = localStorage.getItem('access_token');
      if (!access_token) {
        // If access_token is not found, get it from .env file
        access_token = process.env.REACT_APP_ACCESS_TOKEN;
        if (access_token) {
          localStorage.setItem('access_token', access_token); // Store access_token in localStorage
        } else {
          console.error('Access token not found in .env file');
        }
      }

      // After access_token is created, navigate to dashboard
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (error) {
      console.error('Error during sign-in:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No user found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if access_token exists in localStorage on component mount
    let access_token = localStorage.getItem('access_token');
    if (!access_token) {
      access_token = process.env.REACT_APP_ACCESS_TOKEN; // Retrieve from .env
      if (access_token) {
        localStorage.setItem('access_token', access_token); // Store access_token in localStorage
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white flex">
      <div className="w-80 bg-[#22242a] p-8 relative">
        <div className="mb-12">
          <img src="/placeholder.svg?height=40&width=120" alt="Logo" className="w-32" />
        </div>
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white">
              1
            </div>
            <div>
              <h3 className="font-medium">Account details</h3>
              <p className="text-sm text-gray-400">Login to Your Account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mt-2">Welcome Back</h1>
            <p className="text-gray-400 mt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:text-blue-400 ml-2">
                Sign up here
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full bg-[#22242a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                className="w-full bg-[#22242a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {error && <ErrorMessage message={error} />}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
