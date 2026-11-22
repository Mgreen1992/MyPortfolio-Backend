import { useState, useEffect } from 'react';
import auth from '../auth/auth-helper';

export default function Projects() {
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt && jwt.user && jwt.user.role === 'admin';

  const centennialCollegeProjectsList = [
    {
      id: 1,
      projectTitle: "Recipe Finder Application",
      imagePath: "/recipe-project.png",
      studentRole: "Agile Scrum Team Member",
      detailsDescription: "Collaborated with a development team to engineer a functional recipe search application using agile development frameworks. Managed structural tasks, prioritized workflows, and created comprehensive user stories.",
      projectOutcome: "Successfully utilized the Scrum framework and Jira to organize code sprints, maintain project timeline transparency, and deliver a collaborative software solution."
    },
    {
      id: 2,
      projectTitle: "Lost2Found Platform Specification",
      imagePath: "/lost-project.png",
      studentRole: "Software Requirements Analyst",
      detailsDescription: "Designed a comprehensive blueprint and planned structural user mechanics for a campus utility application designed to report, track, and recover missing items for institutional faculty and students.",
      projectOutcome: "Authored formal functional and non-functional engineering requirements, drafted structural system diagrams, and completed a professional Software Requirements Specification (SRS) document."
    },
    {
      id: 3,
      projectTitle: "Object-Oriented Architecture Labs",
      imagePath: "/labs-project.png",
      studentRole: "Software Engineering Student",
      detailsDescription: "Constructed desktop application logic, underlying data objects, and recursive operational modules leveraging structured programming languages including Python and C++ fundamentals.",
      projectOutcome: "Mastered core object-oriented structures, local environment configurations, basic Linux shell syntax, and secure code compilation practices."
    }
  ];

  const [dbProjects, setDbProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    firstname: 'Michelle',
    lastname: 'Green',
    email: 'Alyssamichellegreen22@gmail.com',
    completion: '',
    description: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) setDbProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:3000/api/projects/${editingId}`
      : 'http://localhost:3000/api/projects';
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
        fetchProjects();
      } else {
        const err = await res.json();
        alert(err.error || err.message || 'Error saving project');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleEditClick = (proj) => {
    setEditingId(proj._id);
    setFormData({
      title: proj.title,
      firstname: proj.firstname,
      lastname: proj.lastname,
      email: proj.email,
      completion: proj.completion ? proj.completion.split('T')[0] : '',
      description: proj.description
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Delete this project from MongoDB?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + jwt.token }
      });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Highlighted Projects</h1>
      <p style={styles.sub}>Academic engineering projects and software analysis completed at Centennial College.</p>

      <div style={styles.grid}>
        {centennialCollegeProjectsList.map((projectCard) => (
          <div key={projectCard.id} style={styles.card}>
            <div style={styles.imgFrame}>
              <img src={projectCard.imagePath} alt={projectCard.projectTitle} style={styles.img} />
            </div>
            <div style={styles.cardBody}>
              <h2 style={styles.cardTitle}>{projectCard.projectTitle}</h2>
              <div style={styles.badge}>{projectCard.studentRole}</div>
              <p style={styles.copy}><strong>Description:</strong> {projectCard.detailsDescription}</p>
              <p style={styles.copy}><strong>Outcome:</strong> {projectCard.projectOutcome}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ ...styles.heading, fontSize: '1.8rem', marginTop: '3.5rem' }}>
        Additional Portfolio Projects (Database)
      </h2>

      {isAdmin && (
        <form onSubmit={handleSaveProject} style={styles.adminForm}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#2B1A2F' }}>
            {editingId ? 'Edit Project' : 'Admin: Add New Project'}
          </h3>
          <div style={styles.formRow}>
            <input type="text" name="title" placeholder="Project Title *" value={formData.title} onChange={handleChange} required style={styles.input} />
            <input type="date" name="completion" value={formData.completion} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.formRow}>
            <input type="text" name="firstname" placeholder="First Name *" value={formData.firstname} onChange={handleChange} required style={styles.input} />
            <input type="text" name="lastname" placeholder="Last Name *" value={formData.lastname} onChange={handleChange} required style={styles.input} />
            <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required style={styles.input} />
          </div>
          <textarea name="description" rows="3" placeholder="Project Description *" value={formData.description} onChange={handleChange} required style={{ ...styles.input, width: '100%', boxSizing: 'border-box', marginBottom: '0.8rem' }} />
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button type="submit" style={styles.saveBtn}>{editingId ? 'Update Project' : '+ Add Project'}</button>
            {editingId && (
              <button type="button" onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
            )}
          </div>
        </form>
      )}

      {dbProjects.length === 0 ? (
        <p style={{ color: '#605263' }}>No additional database projects added yet.</p>
      ) : (
        <div style={styles.grid}>
          {dbProjects.map((proj) => (
            <div key={proj._id} style={{ ...styles.card, borderTop: '4px solid #D4AF37' }}>
              <div style={styles.cardBody}>
                <h2 style={styles.cardTitle}>{proj.title}</h2>
                <div style={styles.badge}>
                  Completed: {proj.completion ? new Date(proj.completion).toLocaleDateString() : 'N/A'}
                </div>
                <p style={styles.copy}><strong>Lead:</strong> {proj.firstname} {proj.lastname} ({proj.email})</p>
                <p style={styles.copy}>{proj.description}</p>

                {isAdmin && (
                  <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditClick(proj)} style={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDeleteClick(proj._id)} style={styles.delBtn}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '2rem auto', fontFamily: 'system-ui, sans-serif', color: '#2B1A2F', padding: '0 1rem' },
  heading: { fontSize: '2.5rem', borderBottom: '2px solid #5D3A66', paddingBottom: '0.5rem', marginBottom: '0.5rem' },
  sub: { fontSize: '1.1rem', color: '#605263', marginBottom: '2.5rem' },
  grid: { display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(43, 26, 47, 0.08)', overflow: 'hidden', width: '320px', display: 'flex', flexDirection: 'column', border: '1px solid #E8E2E8' },
  imgFrame: { width: '100%', height: '200px', backgroundColor: '#F5EFF5', borderBottom: '1px solid #E8E2E8', padding: '0.5rem', boxSizing: 'border-box' },
  img: { width: '100%', height: '100%', objectFit: 'contain' },
  cardBody: { padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  cardTitle: { fontSize: '1.3rem', margin: '0 0 0.5rem 0', color: '#2B1A2F', lineHeight: '1.3' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#FAF0FA', color: '#5D3A66', padding: '0.3rem 0.7rem', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', border: '1px solid #E8DCE8' },
  copy: { fontSize: '0.95rem', lineHeight: '1.5', color: '#443A45', margin: '0 0 0.8rem 0' },

  adminForm: { backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', borderTop: '4px solid #D4AF37', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', marginBottom: '2rem' },
formRow: { display: 'flex', gap: '0.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' },
input: { flex: 1, minWidth: '180px', padding: '0.6rem', borderRadius: '5px', border: '1px solid #CCC0CD', fontSize: '0.95rem' },
saveBtn: { backgroundColor: '#2B1A2F', color: '#D4AF37', border: '1px solid #D4AF37', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
cancelBtn: { backgroundColor: '#605263', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' },
editBtn: { backgroundColor: '#5D3A66', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
delBtn: { backgroundColor: '#b00020', color: '#fff', border: 'none', padding: '0.4rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};
