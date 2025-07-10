import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [log, setLog] = useState([]);

  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.clear();
    navigate('/', { replace: true });
    window.location.reload();
  };

  const handleSearch = async () => {
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&pageSize=5&api_key=gYnNap7tYFctk95SWFLb2VYoMjpsYVGFABAVMj8X`
    );
    const data = await res.json();
    setSearchResults(data.foods || []);
  };

const addFoodLog = async (food, quantity = 1) => {
  const nutrients = extractMacros(food);

  try {
    const res = await fetch('http://localhost:9000/nutrition_add', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        food: food.description,
        quantity,
        nutrients
      })
    });
    const data = await res.json();

    if (!res.ok || data.code !== 0) {
      window.alert(`Failed to add log: ${data.message || 'Unknown error'}`);
    } else {
      window.alert('Food added successfully!');
      fetchLog();
    }
  } catch (err) {
    console.error("Network or unexpected error:", err);
    window.alert('Failed to connect to server. Please try again.');
  }
};


  const fetchLog = async () => {
    try {
      const res = await fetch('http://localhost:9000/retrieve_log', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Fetch log failed: ${res.status}`);
      const data = await res.json();
      const logData = Array.isArray(data) ? data : data.data;
      setLog(Array.isArray(logData) ? logData : []);
    } catch (error) {
      console.error("Error fetching log:", error);
    }
  };

  const extractMacros = (food) => {
    const result = {
      calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0, sodium: 0,
    };

    food.foodNutrients?.forEach(n => {
      const name = n.nutrientName.toLowerCase();
      const val = n.value || 0;
      if (name.includes('protein')) result.protein += val;
      if (name.includes('total lipid')) result.fat += val;
      if (name.includes('carbohydrate')) result.carbs += val;
      if (name.includes('energy')) result.calories += val;
      if (name.includes('fiber')) result.fiber += val;
      if (name.includes('sugar')) result.sugar += val;
      if (name.includes('sodium')) result.sodium += val;
    });

    return result;
  };

  useEffect(() => {
    if (!token) {
      alert('Please log in to access the dashboard.');
      navigate('/', { replace: true });
    } else {
      fetchLog();
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <header className="dashboard-header">
          <h2>Nutrition Tracker</h2>
          <div className="user-info">
            <span>Welcome, Users</span>
            <button onClick={handleLogout} className="logout-button">Sign Out</button>
          </div>
        </header>

        <div className="search-section">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for food..."
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>

        <ul className="search-results">
          {searchResults.map((item, idx) => (
            <li key={idx} className="search-item">
              <div className="item-info">
                <strong>{item.description}</strong><br />
                <small>
                  <b>Brand:</b> {item.brandName || '—'} | <b>Category:</b> {item.foodCategory || '—'}<br />
                  <b>Serving:</b> {item.servingSize || '—'} {item.servingSizeUnit || ''} | 
                  <b> Type:</b> {item.dataType} | 
                  <b> FDC ID:</b> {item.fdcId}
                </small>
              </div>
              <button onClick={() => addFoodLog(item)} className="add-button">Add</button>
            </li>
          ))}
        </ul>

        <h3>Today’s Log</h3>
        <ul className="log-list">
          {log.map((entry, idx) => (
            <li key={idx} className="log-item">
              {entry.food} — {entry.quantity}x — {entry.nutrients?.calories || 0} kcal
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
