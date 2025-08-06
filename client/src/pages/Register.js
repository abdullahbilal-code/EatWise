import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    contact: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    const contactRegex = /^\+353\d{9}$/;

    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.email || !emailRegex.test(form.email)) newErrors.email = 'Valid Gmail is required';
    if (!form.contact || !contactRegex.test(form.contact)) newErrors.contact = 'contact must start with +353 and have 13 characters';
    if (!form.role) newErrors.role = 'User role is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        gender: form.gender,
        email: form.email.toLowerCase(),
        contact: form.contact,
        role: form.role,
        password: form.password
      };

      console.log('Sending registration data:', userData); // Debug log

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      console.log('Response status:', res.status); // Log the response status

      let data;
      const textData = await res.text();
      console.log('Raw response:', textData); // Log raw response
      
      try {
        data = JSON.parse(textData);
        console.log('Parsed response:', data);
      } catch (err) {
        console.error('Error parsing response:', err);
        throw new Error('Invalid response from server');
      }

      if (res.ok) { // Check if status is 2xx
        console.log('Registration successful');
        setMessage('Registration successful! Redirecting to login...');
        setForm({
          firstName: '',
          lastName: '',
          gender: '',
          email: '',
          contact: '',
          role: '',
          password: '',
          confirmPassword: ''
        });

        // Navigate after state is updated
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.log('Registration failed:', data.message || data.error);
        setMessage(data.message || data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-heading">EatWise Registeration </h2>

        <p>First Name</p>   
        <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="register-input" />
        {errors.firstName && <p className="error">{errors.firstName}</p>}
        
        <p>Last Name</p>
        <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="register-input" />
        {errors.lastName && <p className="error">{errors.lastName}</p>}
        
        <p>Select Gender</p>
        <select name="gender" value={form.gender} onChange={handleChange} className="register-input">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        {errors.gender && <p className="error">{errors.gender}</p>}

        <p>Enter Your Valid Email </p>
        <input type="email" name="email" placeholder="Enter Gmail" value={form.email} onChange={handleChange} className="register-input" />
        {errors.email && <p className="error">{errors.email}</p>}

        <p>Enter Your Valid Contact Number </p>
        <input name="contact" placeholder="Contact (+353...)" value={form.contact} onChange={handleChange} className="register-input" />
        {errors.contact && <p className="error">{errors.contact}</p>}

        <p>Select Your Role</p>
        <select name="role" value={form.role} onChange={handleChange} className="register-input">
          <option value="">Select Role</option>
          <option value="regular">Regular User</option>
          <option value="nutritionist">Nutritionist</option>
        </select>
        {errors.role && <p className="error">{errors.role}</p>}
        
        <p>Enter Your Password </p>
        <input type="password" name="password" placeholder="Enter Password" value={form.password} onChange={handleChange} className="register-input" />
        {errors.password && <p className="error">{errors.password}</p>}
        
        <p>Re Type Your Password </p>
        <input type="password" name="confirmPassword" placeholder="Re-enter Password" value={form.confirmPassword} onChange={handleChange} className="register-input" />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        
        <button type="submit" className="register-button">Register</button>

        {message && <p className="register-message">{message}</p>}
      </form>
    </div>
  );
}

export default Register;
