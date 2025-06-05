import { useState } from 'react'
import './App.css'
import Login from './components/login/login2.jsx';
import './index.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Food from './components/Food.jsx'

function App() {
  return (
    <>
      <Login />  // ✅ Display login UI
      <Header></Header>
      <Food/>
      <Footer/>
      
    </>
    
  );
}

export default App;
