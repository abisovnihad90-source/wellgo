import React, { useState } from "react";
import "./DesktopAuth.css";
import { useNavigate } from "react-router-dom";

export default function DesktopAuth({ onLogin }) {  // <- burada əlavə et
  const navigate = useNavigate();
  const [active, setActive] = useState(false); // false = login, true = register
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });


  const [loggedInUser, setLoggedInUser] = useState(() => {
  // LocalStorage-dan əvvəlcədən daxil olan istifadəçini yüklə (əgər varsa)
  const savedUser = localStorage.getItem("loggedInUser");
  return savedUser ? JSON.parse(savedUser) : null;
});

  // Handle input change
  const handleLoginChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterChange = (e) => {
    setRegisterData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Simple email validation
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const [showPassword, setShowPassword] = useState(false);


  // Register user and save to localStorage
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = registerData;

    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (password.length < 8) {
      alert("Password should be at least 6 characters.");
      return;
    }

    // Get users from localStorage or empty array
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if username already exists
    if (users.some(user => user.username === username)) {
      alert("Username already taken.");
      return;
    }

    // Save new user
    const newUser = { username, email, password }; 
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser)); 
    onLogin(newUser); 
    alert("Registration successful!");
    navigate("/wellgo/profile");
    setRegisterData({ username: "", email: "", password: "" });
  };

  // Login user by checking localStorage
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { username, password } = loginData;

    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      alert(`Welcome back, ${user.username}!`);
      localStorage.setItem("loggedInUser", JSON.stringify(user)); // ƏLAVƏ ET
      onLogin(user);  // burada artıq onLogin var və işləyəcək
      navigate("/wellgo/profile");
    } else {
      alert("Invalid username or password.");
    }
  };


  return (
    <div className="auth-container">
      <div className={`container${active ? " active" : ""}`}>
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h2>Login</h2>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
              />
             <div  style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <span
                  className="toggle-password"
                  style={{
                    position: "absolute",
                    right: "16%",
                    top: "40%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="desktop-btn">Login</button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/"><img width="30" height="30" src="https://img.icons8.com/ios-filled/50/facebook--v1.png" alt="facebook" /></a>
              <a href="https://www.google.com/"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/google-logo--v1.png" alt="google" /></a>
              <a href="https://github.com/"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/github.png" alt="github" /></a>
              <a href="#"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/linkedin.png" alt="linkedin" /></a>
            </div>
          </form>
        </div>

        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h2>Registration</h2>
            <div className="input-box">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerData.username}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
<div style={{ position: "relative" }}>              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />
                <span
                  className="toggle-password"
                  style={{
                    position: "absolute",
                    right: "16%",
                    top: "40%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <button type="submit" className="desktop2-btn">Register</button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="https://www.facebook.com/"><img width="30" height="30" src="https://img.icons8.com/ios-filled/50/facebook--v1.png" alt="facebook" /></a>
              <a href="https://www.google.com/"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/google-logo--v1.png" alt="google" /></a>
              <a href="https://github.com/"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/github.png" alt="github" /></a>
              <a href="#"><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/linkedin.png" alt="linkedin" /></a>
            </div>
          </form>
        </div>

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <h3>Don't have an account?</h3>
            <button
              className="btn register-btn"
              onClick={() => setActive(true)}
            >
              Register
            </button>
          </div>

          <div className="toggle-panel toggle-right">
            <h1>Welcome!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => setActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}