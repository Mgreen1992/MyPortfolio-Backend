import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../auth/auth-helper';

export default function Navbar() {
  const browserLocation = useLocation();
  const navigate = useNavigate();
  const jwt = auth.isAuthenticated();

  const midnightPlumBg = '#2B1A2F';
  const champagneGold = '#D4AF37';
  const lilacText = '#D4C5D9';

  const checkIsLinkActive = (pagePath) => browserLocation.pathname === pagePath;

  const navigationMenuOptionsList = [
    { name: 'Home', urlPath: '/' },
    { name: 'About Me', urlPath: '/about' },
    { name: 'Projects', urlPath: '/projects' },
    { name: 'Education', urlPath: '/education' },
    { name: 'Services', urlPath: '/services' },
    { name: 'Contact Me', urlPath: '/contact' }
  ];

  const handleSignout = () => {
    auth.clearJWT(() => navigate('/signin'));
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.2rem 2.5rem',
      background: midnightPlumBg,
      borderBottom: `3px solid ${champagneGold}`,
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.12)',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Left branding area */}
      <div style={styles.brandContainer}>
        <div style={styles.geometricLogoBox}>
          <span style={styles.logoInitialsText}>MG</span>
        </div>
        <span style={styles.authorLegalName}>Michelle Green</span>
      </div>

      {/* Navigation menu list */}
      <ul style={styles.navigationLinkList}>
        {navigationMenuOptionsList.map((menuItem) => {
          const isCurrentTabOpen = checkIsLinkActive(menuItem.urlPath);
          return (
            <li key={menuItem.urlPath}>
              <Link
                to={menuItem.urlPath}
                style={{
                  ...styles.baseLinkElement,
                  color: isCurrentTabOpen ? champagneGold : lilacText,
                  fontWeight: isCurrentTabOpen ? '700' : '500',
                  borderBottom: isCurrentTabOpen ? `2px solid ${champagneGold}` : 'none',
                  paddingBottom: isCurrentTabOpen ? '4px' : '0'
                }}
              >
                {menuItem.name}
              </Link>
            </li>
          );
        })}

        {/* Auth Links */}
        {!jwt ? (
          <>
            <li>
              <Link
                to="/signup"
                style={{
                  ...styles.baseLinkElement,
                  color: checkIsLinkActive('/signup') ? champagneGold : lilacText,
                  fontWeight: '600'
                }}
              >
                Sign Up
              </Link>
            </li>
            <li>
              <Link
                to="/signin"
                style={styles.authButton}
              >
                Sign In
              </Link>
            </li>
          </>
        ) : (
          <>
            <li style={{ color: champagneGold, fontSize: '0.95rem', fontWeight: '600' }}>
              Hi, {jwt.user.name} ({jwt.user.role})
            </li>
            <li>
              <button onClick={handleSignout} style={styles.authButton}>
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem'
  },
  geometricLogoBox: {
    width: '45px',
    height: '45px',
    background: '#5D3A66',
    border: '2px solid #D4AF37',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  },
  logoInitialsText: {
    color: '#FBF9FC',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    letterSpacing: '1px'
  },
  authorLegalName: {
    color: '#FBF9FC',
    fontSize: '1.2rem',
    fontWeight: '600',
    fontFamily: 'system-ui, sans-serif'
  },
  navigationLinkList: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    gap: '20px',
    margin: 0,
    padding: 0,
    flexWrap: 'wrap'
  },
  baseLinkElement: {
    textDecoration: 'none',
    fontSize: '1.05rem',
    fontFamily: 'system-ui, sans-serif',
    transition: 'color 0.2s ease-in-out'
  },
  authButton: {
    backgroundColor: '#5D3A66',
    color: '#D4AF37',
    border: '1px solid #D4AF37',
    borderRadius: '6px',
    padding: '0.35rem 0.8rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};
