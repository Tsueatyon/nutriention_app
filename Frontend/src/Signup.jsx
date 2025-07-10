import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    height: '',
    weight: '',
    age: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const res = await fetch('http://localhost:9000/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/'); 
        }, 2500);
      } else {
        const data = await res.json();
        setError(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }
  };
  
  return (
    <div className="signup-container">
      {!success ? (
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            value={formData.height}
            onChange={handleChange}
          />
          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
          />
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
          {error && <div className="error-message">{error}</div>}
        </form>
      ) : (
        <div className="success-message">
          Sign Up Successful!<br />
          Redirecting to login...
        </div>
      )}
    </div>
  );
};

export default SignUp;
