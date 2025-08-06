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

  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointments/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched appointments:', data.appointments); // Debug log
        if (Array.isArray(data.appointments)) {
          setAppointments(data.appointments);
        } else {
          console.error('Appointments data is not an array:', data);
          setAppointments([]);
        }
      } else {
        console.error('Failed to fetch appointments:', data.error);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    if (!appointmentId) {
      console.error('No appointment ID provided');
      setMessage('Error: Invalid appointment ID');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Appointment Action Details:', {
        appointmentId,
        action,
        url: `http://localhost:5000/api/appointments/${appointmentId}`
      });
      
      // Try PATCH first, fallback to PUT if PATCH fails
      let response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: `${action}ed`
        })
      });
      
      const data = await response.json();
      console.log('Server response:', data);
      
      if (response.ok) {
        await fetchAppointments(); // Refresh appointments after action
        setMessage(`Appointment ${action}ed successfully`);
      } else {
        const errorMsg = data.error || data.message || `Failed to ${action} appointment`;
        console.error('Error response:', errorMsg);
        setMessage(errorMsg);
      }
    } catch (err) {
      console.error(`Error ${action}ing appointment:`, err);
      setMessage(`Error: Could not ${action} appointment. Please try again.`);
    }
  };



  return (
    <div className="dashboard-container">
    
      <div className="dashboard-header">
        <h2 className="dashboard-heading">User Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-form">
          <h3>Update Profile</h3>
          <form onSubmit={handleSubmit}>
            <label>Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} required>
              <option value="">Select Goal</option>
              <option value="Lose">Lose Weight</option>
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

      <div className="appointments-section">
        <h3>My Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-details">
                  <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Purpose:</strong> {appointment.purpose}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  {appointment.nutritionist && (
                    <p><strong>Nutritionist:</strong> {appointment.nutritionist.firstName} {appointment.nutritionist.lastName}</p>
                  )}
                </div>
                {appointment.status === 'pending' && (
                  <div className="appointment-actions">
                    <button
                      onClick={() => {
                        console.log('Appointment ID:', appointment._id); // Debug log
                        handleAppointmentAction(appointment._id, 'confirm');
                      }}
                      className="confirm-btn"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        console.log('Appointment ID:', appointment._id); // Debug log
                        handleAppointmentAction(appointment._id, 'cancel');
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Dashboard;
