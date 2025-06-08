import React, { useState } from 'react'
import './Login.css' 

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await login(formData);
            console.log("Login success:", data);
    
            // Store user data in localStorage (optional)
            localStorage.setItem('profile', JSON.stringify(data));

            
        } catch (error) {
            console.error("Login error:", error);
            document.getElementById('error').textContent = 'Invalid username or password';
        }
    }

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
 
    return (    
        <>
            <div className="left">
                <div className="title">
                    Welcome to Shell Maintenance System
                </div>
            </div>
            
            <div className="right">
                <div className="container">
                    <h2>User Login</h2>
                    <p className="warning">Authorised Users Only!</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <i className="fas fa-user"></i>
                            <input className="form-input" type="text" placeholder="Username" name="username" onChange={handleFormChange} required/>
                        </div>
                        
                        <div className="input-container">
                            <i className="fas fa-lock"></i>
                            <input className="form-input" type={showPassword ? "text" : "password"} placeholder="Password" name="password" onChange={handleFormChange} required/>
                            <i className={showPassword ? "fas fa-eye-slash end" : "fas fa-eye end"} onClick={handleShowPassword}></i>
                        </div>
                        
                        <p id="error"></p>
                        <button type="submit" className="submit-button">Log In</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
 