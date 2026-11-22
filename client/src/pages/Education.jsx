import { useState, useEffect } from 'react';
import auth from '../auth/auth-helper';

export default function Education() {
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt && jwt.user && jwt.user.role === 'admin';

  const formalCollegeQualificationsList = [
    {
      id: 1,
      diplomaTitle: "AI Software Engineering Technology (Advanced Diploma - Co-op)",
      collegeName: "Centennial College",
      locationCity: "Toronto, ON",
      durationTimeline: "2024 - Present (Expected Graduation: 2028)",
      courseHighlights: "Maintaining a 3.5 overall GPA. Intensive study in Artificial Intelligence systems, Web Application development, Python OOP fundamentals, C++, Java, Oracle SQL, Linux command operations, and structural Software Requirements Specifications (SRS)."
    },
    {
      id: 2,
      diplomaTitle: "Business Marketing Diploma",
      collegeName: "Centennial College",
      locationCity: "Toronto, ON",
      durationTimeline: "Graduated: October 2024",
      courseHighlights: "Studied corporate marketing frameworks, campaign designs, operational communication strategies, and performance metrics tracking."
    },
    {
      id: 3,
      diplomaTitle: "Electrical Techniques Certificate",
      collegeName: "Georgian College",
      locationCity: "Owen Sound, ON",
      durationTimeline: "Completed: May 2020",
      courseHighlights: "Selected as an Ambassador for Women in Trades. Featured in 'Our Homes' Magazine and appeared on a live Rogers TV interview segment to discuss the trade certification initiative."
    },
    {
      id: 4,
      diplomaTitle: "Personal Support Worker Certificate",
      collegeName: "Georgian College",
      locationCity: "Owen Sound, ON",
      durationTimeline: "Completed: May 2015",
      courseHighlights: "Honored with the 'Care Giver Recognition for Heroes in the Home' award. Developed high-accountability medical logging discipline and crisis management collaboration protocols."
    }
  ];

  const [dbQualifications, setDbQualifications] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    firstname: 'Michelle',
    lastname: 'Green',
    email: 'Alyssamichellegreen22@gmail.com',
    completion: '',
    description: ''
  });

  const fetchQualifications = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/qualifications');
      const data = await res.json();
      if (Array.isArray(data)) setDbQualifications(data);
    } catch (err) {
      console.error('Error loading qualifications:', err);
    }
  };

  useEffect(() => {
    fetchQualifications();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveQualification = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3000/api/qualifications/${editingId}`
      : 'http://localhost:3000/api/qualifications';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt.token
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setEditingId(null);
        setFormData({
          title: '',
          firstname: 'Michelle',
          lastname: 'Green',
          email: 'Alyssamichellegreen22@gmail.com',
          completion: '',
          description: ''
        });
        fetchQualifications();
      } else {
        const err = await res.json();
        alert(err.error || err.message || 'Error saving qualification');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleEditClick = (qual) => {
    setEditingId(qual._id);
    setFormData({
      title: qual.title,
      firstname: qual.firstname,
      lastname: qual.lastname,
      email: qual.email,
      completion: qual.completion ? qual.completion.split('T') : '',
      description: qual.description
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Delete this qualification from MongoDB?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/qualifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + jwt.token }
      });
      if (res.ok) fetchQualifications();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Education & Qualifications</h1>
      <p style={styles.sub}>A chronological look at my academic degrees, certificates, and professional honors.</p>

      {isAdmin && (
        <form onSubmit={handleSaveQualification} style={styles.adminForm}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2B1A2F' }}>
            {editingId ? 'Edit Qualification' : 'Admin: Add New Qualification'}
          </h3>
          <div style={styles.formRow}>
            <input type="text" name="title" placeholder="Degree / Certificate Title *" value={formData.title} onChange={handleChange} required style={styles.input} />
            <input type="date" name="completion" value={formData.completion} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formRow}>
            <input type="text" name="firstname" placeholder="First Name *" value={formData.firstname} onChange={handleChange} required style={styles.input} />
            <input type="text" name="lastname" placeholder="Last Name *" value={formData.lastname} onChange={handleChange} required style={styles.input} />
            <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required style={styles.input} />
          </div>
          <textarea name="description" rows="3" placeholder="Institution & Course Highlights *" value={formData.description} onChange={handleChange} required style={{ ...styles.input, width: '100%', boxSizing: 'border-box', marginBottom: '0.8rem' }} />
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button type="submit" style={styles.saveBtn}>{editingId ? 'Update Qualification' : '+ Add Qualification'}</button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
            )}
          </div>
        </form>
      )}

      <div style={styles.track}>
        {dbQualifications.map((qual) => (
          <div key={qual._id} style={styles.node}>
            <div style={{ ...styles.dot, backgroundColor: '#D4AF37', boxShadow: '0 0 0 3px #D4AF37' }}></div>
            <div style={{ ...styles.card, borderTop: '3px solid #D4AF37' }}>
              <div style={styles.cardHeader}>
                <h2 style={styles.degree}>{qual.title}</h2>
                <span style={styles.dateTag}>
                  Completed: {qual.completion ? new Date(qual.completion).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <h3 style={styles.college}>
                {qual.firstname} {qual.lastname} <span style={styles.city}>• {qual.email}</span>
              </h3>
              <p style={styles.body}>{qual.description}</p>

              {isAdmin && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEditClick(qual)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => handleDeleteClick(qual._id)} style={styles.delBtn}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {formalCollegeQualificationsList.map((eduCardItem) => (
          <div key={eduCardItem.id} style={styles.node}>
            <div style={styles.dot}></div>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.degree}>{eduCardItem.diplomaTitle}</h2>
                <span style={styles.dateTag}>{eduCardItem.durationTimeline}</span>
              </div>
              <h3 style={styles.college}>
                {eduCardItem.collegeName} <span style={styles.city}>• {eduCardItem.locationCity}</span>
              </h3>
              <p style={styles.body}>{eduCardItem.courseHighlights}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '850px', margin: '2rem auto', fontFamily: 'system-ui, sans-serif', color: '#2B1A2F', padding: '0 1rem' },
  heading: { fontSize: '2.5rem', borderBottom: '2px solid #5D3A66', paddingBottom: '0.5rem', marginBottom: '0.5rem' },
  sub: { fontSize: '1.1rem', color: '#605263', marginBottom: '3rem' },
  track: { position: 'relative', borderLeft: '3px solid #E3D9E3', paddingLeft: '2rem', marginLeft: '1rem' },
  node: { position: 'relative', marginBottom: '2.5rem' },
  dot: { position: 'absolute', left: 'calc(-2rem - 9px)', top: '18px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#5D3A66', border: '3px solid #FAF6FA', boxShadow: '0 0 0 3px #5D3A66' },
  card: { backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(43,26,47,0.04)', border: '1px solid #E8E2E8' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' },
  degree: { fontSize: '1.25rem', margin: 0, color: '#2B1A2F', fontWeight: '700', flex: '1', minWidth: '250px' },
  dateTag: { backgroundColor: '#FAF0FA', color: '#5D3A66', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', whiteSpace: 'nowrap', border: '1px solid #E8DCE8' },
  college: { fontSize: '1.1rem', color: '#605263', fontWeight: '500', margin: '0 0 1rem 0' },
  city: { color: '#8B7E8C', fontSize: '0.95rem' },
body: { fontSize: '0.95rem', lineHeight: '1.6', color: '#443A45', margin: 0 },
adminForm: { backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', borderTop: '4px solid #D4AF37', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '2.5rem' },
formRow: { display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' },
input: { flex: 1, minWidth: '180px', padding: '0.6rem', borderRadius: '5px', border: '1px solid #CCC0CD', fontSize: '0.95rem' },
saveBtn: { backgroundColor: '#2B1A2F', color: '#D4AF37', border: '1px solid #D4AF37', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
cancelBtn: { backgroundColor: '#605263', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
editBtn: { backgroundColor: '#5D3A66', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
delBtn: { backgroundColor: '#b00020', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};


