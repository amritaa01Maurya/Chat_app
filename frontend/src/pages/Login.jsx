import React, { useState } from "react";
import axios from "axios";

function Login({ setToken, setUsername }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use environment variable in real app, hardcoded for now
    const endpoint = isLogin 
      ? "http://localhost:5000/api/auth/login" 
      : "http://localhost:5000/api/auth/signup";

    try {
      const res = await axios.post(endpoint, formData);
      if (isLogin) {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.username);
        setToken(token);
        setUsername(user.username);
      } else {
        alert("Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input 
                type="text" 
                name="username" 
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Enter username" 
                onChange={handleChange}
                required 
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              name="email" 
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Enter email" 
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              name="password" 
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Enter password" 
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="w-full py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
          <button 
            className="text-sm text-blue-600 hover:underline" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;