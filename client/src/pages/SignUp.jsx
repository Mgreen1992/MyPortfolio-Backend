import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    open: false,
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value, error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ name: "", email: "", password: "", error: "", open: true });
      }
    } catch (err) {
      setValues({ ...values, error: "Could not connect to server." });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create an Account</h2>
      {values.error && <p style={styles.error}>{values.error}</p>}
      {values.open && (
        <div style={styles.success}>
          Account successfully created! <Link to="/signin" style={styles.link}>Click here to Sign In</Link>.
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          value={values.name}
          onChange={handleChange("name")}
          required
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          required
          style={styles.input}
        />

        <label style={styles.label}>Password (min 6 characters)</label>
        <input
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      <p style={{ marginTop: "1rem", textAlign: "center" }}>
        Already have an account? <Link to="/signin" style={styles.link}>Sign In</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "420px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    borderTop: "4px solid #D4AF37",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    fontFamily: "system-ui, sans-serif",
  },
  heading: { color: "#2B1A2F", textAlign: "center", marginBottom: "1.5rem" },
  form: { display: "flex", flexDirection: "column", gap: "0.8rem" },
  label: { fontWeight: "600", color: "#2B1A2F", fontSize: "0.95rem" },
  input: {
    padding: "0.7rem",
    borderRadius: "6px",
    border: "1px solid #D4C5D9",
    fontSize: "1rem",
  },
  button: {
    marginTop: "0.8rem",
    padding: "0.8rem",
    backgroundColor: "#2B1A2F",
    color: "#D4AF37",
    border: "2px solid #D4AF37",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: { color: "#b00020", backgroundColor: "#fdecea", padding: "0.6rem", borderRadius: "6px" },
  success: { color: "#155724", backgroundColor: "#d4edda", padding: "0.8rem", borderRadius: "6px", marginBottom: "1rem" },
  link: { color: "#5D3A66", fontWeight: "bold" },
};
