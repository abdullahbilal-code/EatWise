import React, { useEffect, useState } from 'react';
import '../styles/UserDashboard.css';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    goal: '',
    weight: '',
    heightFeet: '',
    heightInches: '',
    disease: '',
    comments: '',
  });

  const [availabilityList, setAvailabilityList] = useState([]);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const height = `${formData.heightFeet}ft ${formData.heightInches}in`;
    const submissionData = {
      goal: formData.goal,
      weight: formData.weight,
      height: height,
      disease: formData.disease,
      comments: formData.comments,
    };

    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const res = await fetch('http://localhost:5000/api/users/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Details submitted successfully!');
        setFormData({
          goal: '',
          weight: '',
          heightFeet: '',
          heightInches: '',
          disease: '',
          comments: '',
        });
      } else {
        setMessage(data.message || 'Failed to submit details.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error: Could not connect to server.');
    }
  };

  const fetchAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/availability', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAvailabilityList(data);
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/availability/${id}/confirm`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAvailabilityList((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: 'confirmed' } : item))
        );
      }
    } catch (err) {
      console.error('Error confirming availability:', err);
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/availability/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAvailabilityList((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status: 'cancelled' } : item))
        );
      }
    } catch (err) {
      console.error('Error cancelling availability:', err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-form">
        <div className="dashboard-header">
          <h2 className="dashboard-heading">User Dashboard</h2>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Goal</label>
          <select name="goal" value={formData.goal} onChange={handleChange} required>
            <option value="">Select Goal</option>
            <option value="Loose">Loose Weight</option>
            <option value="Gain">Gain Weight</option>
          </select>

          <label>Weight (KGs)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight in KGs"
            required
          />

          <label>Height</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              name="heightFeet"
              value={formData.heightFeet}
              onChange={handleChange}
              placeholder="Feet"
              required
              style={{ flex: 1 }}
            />
            <input
              type="number"
              name="heightInches"
              value={formData.heightInches}
              onChange={handleChange}
              placeholder="Inches"
              required
              style={{ flex: 1 }}
            />
          </div>

          <label>Any Chronic Disease</label>
          <input
            type="text"
            name="disease"
            value={formData.disease}
            onChange={handleChange}
            placeholder="e.g., Diabetes, Hypertension"
          />

          <label>Comments (optional)</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Any additional information..."
          ></textarea>

          <button type="submit" className="dashboard-submit">Submit</button>
          {message && <p className="dashboard-message">{message}</p>}
        </form>
      </div>

      <div className="availability-section">
        <h3>Nutritionist Availability</h3>
        {availabilityList.length === 0 ? (
          <p>No availability requests yet.</p>
        ) : (
          availabilityList.map((item) => (
            <div key={item._id} className="availability-item">
              <p><strong>Nutritionist:</strong> {item.nutritionistName}</p>
              <p><strong>Date:</strong> {item.date}</p>
              <p><strong>Time:</strong> {item.time}</p>
              <p><strong>Status:</strong> {item.status}</p>
              {item.status === 'pending' && (
                <div className="availability-actions">
                  <button onClick={() => handleConfirm(item._id)} className="confirm-btn">Confirm</button>
                  <button onClick={() => handleCancel(item._id)} className="cancel-btn">Cancel</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
