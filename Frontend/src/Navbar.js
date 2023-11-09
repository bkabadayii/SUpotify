import { Link } from 'react-router-dom';

const Navbar = () => {
  return (  
    <nav className="navbar">
      <h1>SUpotify</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup" style={{
          color: "white",
          backgroundColor: "#2b197a",
          borderRadius: "8px"
        }}>Sign Up</Link>
      </div>

    </nav>
  );
}
 
export default Navbar;