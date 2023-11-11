import { Link } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {

  const handleLogout = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    const res = await axios.post("http://localhost:4000/auth/logout", { username }, { withCredentials: true });
    console.log(res);

    if (res.data.success) {
      // Remove the item
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('username');

      window.location.href = '/login';
    } else {
      alert('Problem occurred when logging out.');
    }
  }

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
                
        <a href="/login" onClick = {handleLogout} style={{
          color: "white",
          backgroundColor: "#2b197a",
          borderRadius: "8px"
        }}>Log Out</a>
      </div>

    </nav>
  );
}
 
export default Navbar;