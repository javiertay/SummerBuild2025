import React, { useState } from 'react'
import './Login.css' 

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
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
 