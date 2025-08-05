import React, { useEffect, useState } from 'react';
import '../styles/NutriDashboard.css';
const baseURL = process.env.REACT_APP_API_URL;


const NutriDashboard = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [formState, setFormState] = useState({ date: '', time: '', purpose: '', userId: '' });
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  // Fetch all user details submitted
  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Get all users with their submitted details
      const usersRes = await fetch('http://localhost:5000/api/users/all-profiles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const users = await usersRes.json();
      setUserDetails(users);

      // Get current nutritionist's availability or appointment proposals
      const proposalsRes = await fetch('http://localhost:5000/api/appointments/nutritionist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const proposals = await proposalsRes.json();
      setProposals(proposals);

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

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
        purpose: formState.purpose
      })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Proposal saved');
      setFormState({ date: '', time: '', purpose: '', userId: '' });

      const updated = await fetch('http://localhost:5000/api/appointments/nutritionist', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());

      setProposals(updated);
    } else {
      setMessage(data.message || 'Error saving proposal');
    }
  } catch (err) {
    console.error(err);
    setMessage('Server error');
  }
};

  return (
    <div className="nutri-dashboard-container">
      <h2>Nutritionist Dashboard</h2>

      <section className="user-section">
        <h3>Submitted User Details</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Goal</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Disease</th>
              <th>Comments</th>
              <th>Propose Slot</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map(u => (
              <tr key={u._id}>
                <td>{u?.firstName} {u?.lastName}</td>
                <td>{u?.contact}</td>
                <td>{u?.goal}</td>
                <td>{u?.weight}</td>
                <td>{u?.height.feet}ft {u?.height.inches}in</td>
                <td>{u?.disease}</td>
                <td>{u?.comments}</td>
                <td>
                  <button onClick={() => setFormState({ ...formState, userId: u._id })}>
                    Propose
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="proposal-form-section">
        <h3>Propose Appointment Slot</h3>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handlePropose} className="proposal-form">
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

          <input
            type="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="time"
            placeholder="e.g., 10:00 AM - 11:00 AM"
            value={formState.time}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="purpose"
            placeholder="Purpose"
            value={formState.purpose}
            onChange={handleChange}
            required
          />

          <button type="submit">Save Proposal</button>
        </form>
      </section>

      <section className="proposals-section">
        <h3>Your Proposals</h3>
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
              <tr key={p._id}>
                <td>{p.user.firstName} {p.user.lastName}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>{p.time}</td>
                <td>{p.purpose}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default NutriDashboard;
