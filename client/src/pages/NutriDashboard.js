import React, { useEffect, useState } from 'react';
import '../styles/NutriDashboard.css';


const NutriDashboard = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [formState, setFormState] = useState({ 
    date: '', 
    time: '', 
    purpose: '', 
    userId: '',
    userName: '' 
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      // Get all regular users with their submitted details
      const usersRes = await fetch('http://localhost:5000/api/users/all-profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await usersRes.json();
      
      if (!usersRes.ok) {
        throw new Error(userData.error || 'Failed to fetch user profiles');
      }

      // Transform height data for all users
      const regularUsers = (userData || []).map(user => ({
        ...user,
        height: typeof user.height === 'string' ? user.height : 
               user.height && (user.height.feet || user.height.inches) ? 
               `${user.height.feet || 0}ft ${user.height.inches || 0}in` : 'N/A',
        weight: user.weight ? `${user.weight} kg` : 'N/A',
        goal: user.goal || 'Not specified',
        disease: user.disease || 'None reported',
        comments: user.comments || 'No comments'
      }));

      setUserDetails(regularUsers);

      // Get current nutritionist's appointments
      const proposalsRes = await fetch('http://localhost:5000/api/appointments/nutritionist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const appointmentsData = await proposalsRes.json();
      
      if (!proposalsRes.ok) {
        throw new Error(appointmentsData.error || 'Failed to fetch appointments');
      }

      setProposals(appointmentsData.appointments || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all user details submitted
  useEffect(() => {
    fetchData();
  }, []);


  const handleChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Propose a slot for a user
  const handlePropose = async (e) => {
  e.preventDefault();
  setMessage('');
  try {
    if (!formState.userId || !formState.date || !formState.time || !formState.purpose) {
      setMessage('Please fill all required fields');
      return;
    }

    const res = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user: formState.userId,
        date: formState.date,
        time: formState.time,
        purpose: formState.purpose,
        nutritionist: localStorage.getItem('userId') // Add nutritionist ID
      })
    });

    const data = await res.json();
    
    if (res.ok) {
      setMessage('Appointment proposed successfully');
      setFormState({ date: '', time: '', purpose: '', userId: '', userName: '' });
      // Refresh appointments list
      await fetchData();
    } else {
      console.error('Server response:', data);
      setMessage(data.error || data.message || 'Error saving proposal');
    }
  } catch (err) {
    console.error('Error creating appointment:', err);
    setMessage('Server error: Could not create appointment');
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

  return (
    <div className="nutri-dashboard-container">
      <div className="dashboard-header">
        <h2>Nutritionist Dashboard</h2>
        <div className="dashboard-actions">
          <button onClick={() => fetchData()} className="refresh-btn">
            Refresh Data
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <section className="user-section">
        <h3>User Profiles</h3>
        {loading ? (
          <div className="loading">Loading user profiles...</div>
        ) : userDetails.length === 0 ? (
          <div className="no-data">No user profiles available</div>
        ) : (
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Goal</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>Medical Info</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userDetails.map(user => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>
                      <div>{user.email}</div>
                      <div>{user.contact}</div>
                    </td>
                    <td>{user.goal}</td>
                    <td>{user.weight}</td>
                    <td>{user.height}</td>
                    <td>{user.disease}</td>
                    <td>{user.comments}</td>
                    <td>
                      <button 
                        onClick={() => {
                          setFormState(prev => ({ 
                            ...prev, 
                            userId: user._id,
                            userName: `${user.firstName} ${user.lastName}`
                          }));
                          document.querySelector('.proposal-form-section').scrollIntoView({ 
                            behavior: 'smooth' 
                          });
                        }}
                        className="propose-btn"
                      >
                        Propose Slot
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="proposal-form-section">
        <h3>Propose Appointment Slot</h3>
        {message && (
          <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handlePropose} className="proposal-form">
          <div className="form-group">
            <label>Selected User</label>
            {formState.userId ? (
              <div className="selected-user">
                {formState.userName || userDetails.find(u => u._id === formState.userId)?.firstName}
                <button 
                  type="button" 
                  onClick={() => setFormState(prev => ({ ...prev, userId: '', userName: '' }))}
                  className="clear-btn"
                >
                  ×
                </button>
              </div>
            ) : (
              <select
                name="userId"
                value={formState.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {userDetails.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="date"
              value={formState.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Appointment Time</label>
            <input
              type="time"
              name="time"
              value={formState.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Purpose of Appointment</label>
            <textarea
              name="purpose"
              value={formState.purpose}
              onChange={handleChange}
              placeholder="Enter the purpose of the appointment"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Send Appointment Proposal
            </button>
            <button 
              type="button" 
              onClick={() => setFormState({ date: '', time: '', purpose: '', userId: '', userName: '' })}
              className="reset-btn"
            >
              Reset Form
            </button>
          </div>
        </form>
      </section>

      <section className="proposals-section">
        <h3>Appointment Proposals</h3>
        {loading ? (
          <div className="loading">Loading appointments...</div>
        ) : proposals.length === 0 ? (
          <div className="no-data">No appointments proposed yet</div>
        ) : (
          <div className="table-container">
            <table className="proposal-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map(p => (
                  <tr key={p._id} className={`status-${p.status}`}>
                    <td>
                      {p.user ? (
                        <>
                          <div>{p.user.firstName} {p.user.lastName}</div>
                          <div className="user-contact">{p.user.email}</div>
                        </>
                      ) : (
                        'User not found'
                      )}
                    </td>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>{p.time}</td>
                    <td>{p.purpose}</td>
                    <td>
                      <span className={`status-badge ${p.status}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default NutriDashboard;
