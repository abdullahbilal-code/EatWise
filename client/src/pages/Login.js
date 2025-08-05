import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add link to REG FORM
import '../styles/Login.css';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {

        const token = data.token;
        
        const decoded = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
        const expiresAt = decoded.exp * 1000;

        localStorage.setItem('token', token);
        localStorage.setItem('expiresAt', expiresAt);

        if (data.user.role === 'nutritionist') {
          navigate('/nutridashboard');
        }
        else {
          navigate('/userdashboard');
        }
        
        // Save token and user info
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('userRole', data.user.role);
        // localStorage.setItem('userName', data.user.name || data.user.firstName);
        // localStorage.setItem('userEmail', data.user.email);

        setMessage('Login successful! Redirecting...');
        onLogin && onLogin();

        // //Role-based navigation
        // setTimeout(() => {
        //   if (data.user.role === 'nutritionist') {
        //     navigate('/nutridashboard');
        //   } else {
        //     navigate('/userdashboard');
        //   }
        // }, 1000);
      } else {
        setMessage(data.message || data.error || 'Login failed');
      }
    } catch (err) {
      setMessage('Error: Could not connect to server');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-heading">EatWise Login</h2>

        <p>Email</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="register-input"
        />

        <p>Password</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="register-input"
        />

        <button type="submit" className="register-button">Login</button>

        {/* Link to Register page */}
        <p style={{ marginTop: '1rem' }}>
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>

        {message && <p className="register-message">{message}</p>}
      </form>
    </div>
  );
}

export default Login;
