import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../auth/auth-helper';

export default function Contact() {
  const pageViewNavigator = useNavigate();
  const jwt = auth.isAuthenticated();
  const isAdmin = jwt && jwt.user && jwt.user.role === 'admin';

  const [formInputValuesState, setFormInputValuesState] = useState({
    firstNameText: '',
    lastNameText: '',
    contactNumberPhone: '',
    emailAddressField: '',
    messageTextBoxPayload: ''
  });

  const [contactsList, setContactsList] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchContacts = async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch('http://localhost:3000/api/contacts', {
        headers: { Authorization: 'Bearer ' + jwt.token }
      });
      const data = await res.json();
      if (Array.isArray(data)) setContactsList(data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [isAdmin]);

  const handleTextFieldInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputValuesState((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/contacts', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: formInputValuesState.firstNameText,
          lastname: formInputValuesState.lastNameText,
          email: formInputValuesState.emailAddressField
        })
      });

      if (response.ok) {
        alert(`Thank you, ${formInputValuesState.firstNameText}! Your message has been saved.`);
        setFormInputValuesState({
          firstNameText: '',
          lastNameText: '',
          contactNumberPhone: '',
          emailAddressField: '',
          messageTextBoxPayload: ''
        });
        if (isAdmin) fetchContacts();
        else pageViewNavigator('/');
      } else {
        const errData = await response.json();
        setStatusMessage(errData.message || 'Failed to save contact.');
      }
    } catch (err) {
      setStatusMessage('Server error while submitting contact.');
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + jwt.token }
      });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Me</h1>
      <p style={styles.sub}>Get in touch for student co-op positions, collaborative projects, or academic inquiries.</p>
      {statusMessage && <p style={{ color: 'red', marginBottom: '1rem' }}>{statusMessage}</p>}

      <div style={styles.panel}>
        <form style={styles.form} onSubmit={handleContactSubmitEvent}>
          <h2 style={styles.subHeading}>Send a Message</h2>
          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>First Name *</label>
              <input type="text" name="firstNameText" required value={formInputValuesState.firstNameText} onChange={handleTextFieldInputChange} style={styles.input} />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Last Name *</label>
              <input type="text" name="lastNameText" required value={formInputValuesState.lastNameText} onChange={handleTextFieldInputChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.group}>
              <label style={styles.label}>Contact Number</label>
              <input type="tel" name="contactNumberPhone" value={formInputValuesState.contactNumberPhone} onChange={handleTextFieldInputChange} style={styles.input} />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Email Address *</label>
              <input type="email" name="emailAddressField" required value={formInputValuesState.emailAddressField} onChange={handleTextFieldInputChange} style={styles.input} />
            </div>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Message *</label>
            <textarea name="messageTextBoxPayload" rows="4" required value={formInputValuesState.messageTextBoxPayload} onChange={handleTextFieldInputChange} style={styles.textarea}></textarea>
          </div>
          <button type="submit" style={styles.button}>Send Message →</button>
        </form>

        <div style={styles.aside}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 1.2rem 0', color: '#5D3A66' }}>Direct Details</h3>
          <p style={styles.meta}><strong>Legal Name:</strong> Michelle Green</p>
          <p style={styles.meta}><strong>Location:</strong> Port Elgin, ON</p>
          <p style={styles.meta}><strong>Email:</strong> Alyssamichellegreen22@gmail.com</p>
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E8DCE8' }}>
            <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem 0', color: '#2B1A2F' }}>Availability</h4>
            <p style={{ fontSize: '0.9rem', color: '#605263', lineHeight: '1.5' }}>Currently seeking student co-op placements or software engineering internships.</p>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div style={styles.adminSection}>
          <h2 style={styles.subHeading}>Admin: Submitted Contacts ({contactsList.length})</h2>
          {contactsList.length === 0 ? (
            <p>No contacts submitted yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>First Name</th>
                  <th style={styles.th}>Last Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {contactsList.map((contact) => (
                  <tr key={contact._id} style={{ borderBottom: '1px solid #E8E2E8' }}>
                    <td style={styles.td}>{contact.firstname}</td>
                    <td style={styles.td}>{contact.lastname}</td>
                    <td style={styles.td}>{contact.email}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleDeleteContact(contact._id)} style={styles.delBtn}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px', margin: '2rem auto', fontFamily: 'system-ui, sans-serif', color: '#2B1A2F', padding: '0 1rem' },
  heading: { fontSize: '2.5rem', borderBottom: '2px solid #5D3A66', paddingBottom: '0.5rem', marginBottom: '0.5rem' },
  sub: { fontSize: '1.1rem', color: '#605263', marginBottom: '2.5rem' },
  panel: { backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(43,26,47,0.08)', border: '1px solid #E8E2E8', display: 'flex', flexWrap: 'wrap', overflow: 'hidden' },
  form: { padding: '2rem', flex: '2', minWidth: '320px' },
  subHeading: { fontSize: '1.4rem', margin: '0 0 1.5rem 0', color: '#2B1A2F' },
  row: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
  group: { display: 'flex', flexDirection: 'column', flex: '1', minWidth: '140px', marginBottom: '1rem' },
  label: { fontSize: '0.9rem', fontWeight: 'bold', color: '#605263', marginBottom: '0.4rem' },
  input: { padding: '0.6rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #CCC0CD', outlineColor: '#5D3A66' },
  textarea: { padding: '0.6rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #CCC0CD', outlineColor: '#5D3A66', resize: 'vertical' },
  button: { backgroundColor: '#5D3A66', color: '#FBF9FC', border: 'none', padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer', marginTop: '0.5rem' },
  aside: { backgroundColor: '#FAF6FA', padding: '2rem', flex: '1', minWidth: '250px', borderLeft: '1px solid #E8DCE8', display: 'flex', flexDirection: 'column' },
  meta: { fontSize: '0.95rem', margin: '0 0 0.8rem 0', color: '#443A45' },
  adminSection: { marginTop: '2.5rem', backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '10px', borderTop: '4px solid #D4AF37', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { backgroundColor: '#2B1A2F', color: '#D4AF37', textAlign: 'left' },
  th: { padding: '0.75rem' },
  td: { padding: '0.75rem' },
  delBtn: { backgroundColor: '#b00020', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};
