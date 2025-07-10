import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (data.code === 0) {
        const data = await response.json();
        localStorage.setItem('access_token', data.data.access_token);
        navigate('/dashboard');
    } else {
        alert("Username and Password does not match");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2 className="form-title">Welcome Back</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button onClick={handleLogin} className="form-button">
          Log In
        </button>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Don’t have an account?{' '}
          <a href="/signup" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
            Sign Up
          </a>
        </p>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </div>
    </div>
  );
}

export default Login;
