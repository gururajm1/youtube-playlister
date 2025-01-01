import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/input';
import axios from "axios";
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import useForm from '../hooks/useForm';

const initialState = {
  fullName: '',
  email: '',
  password: '',
};

export default function Signup({ setUser }) {
  const navigate = useNavigate();
  const [formData, handleChange, resetForm] = useForm(initialState);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validate Gmail-specific and general email format
  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const isValidGmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const isValidPassword = (password) => password.length >= 8;
  const isValidName = (name) => name.length >= 4;

  useEffect(() => {
    // Check if access_token exists in localStorage
    let access_token = localStorage.getItem('access_token');
    
    if (!access_token) {
      // If not, retrieve it from the .env file and set it in localStorage
      access_token = process.env.REACT_APP_ACCESS_TOKEN;
      if (access_token) {
        localStorage.setItem('access_token', access_token);
      }
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
  
    // Validate fields
    if (!formData.fullName.trim()) {
      setError('Full Name is required.');
      setIsLoading(false);
      return;
    }
    if (!isValidName(formData.fullName)) {
      setError('Full Name must be at least 4 characters.');
      setIsLoading(false);
      return;
    }
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
  
    try {
      // Check if user already exists in the database by email
      const signInMethods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (signInMethods.length > 0) {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  
      // Prepare user object
      const newUser = {
        email: userCredential.user.email,
        playlists: [], // Initialize empty playlist
      };
  
      // Send the user object directly, without stringifying
      const response = await axios.post("http://localhost:5000/api/store", newUser);
      
      console.log(response);
  
      // Store user info in local storage
      localStorage.setItem('user', JSON.stringify(newUser));
  
      // Update the user state
      setUser(newUser);
  
      resetForm();
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

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
              <p className="text-sm text-gray-400">Enter Account Details to Sign Up</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mt-2">Create Your Account</h1>
            <p className="text-gray-400 mt-2">
              Already have an account?
              <Link to="/login" className="text-blue-500 hover:text-blue-400 ml-2">
                Login here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set Password"
              required
            />

            {error && <ErrorMessage message={error} />}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
