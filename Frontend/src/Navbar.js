const Navbar = () => {
  return (  
    <nav className="navbar">
      <h1>SUpotify</h1>
      <div className="links">
        <a href="/">Home</a>
        <a href="/signup" style={{
          color: "white",
          backgroundColor: "#2b197a",
          borderRadius: "8px"
        }}>Sign Up</a>
      </div>

    </nav>
  );
}
 
export default Navbar;