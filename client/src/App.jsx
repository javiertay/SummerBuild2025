import { Routes, Route, useLocation } from 'react-router-dom' 
import Login2 from './pages/Login2';
import Signup from './pages/Signup';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/ForgetPassword';
import InternshipTable from './pages/MainTable';

function App() {
  const location = useLocation();
  return (
    <>
     <AnimatePresence mode="wait">
       <Routes location ={location} key={location.pathname}>
         <Route path="/" element={<Login2 />} />
         <Route path="/login" element={<Login2 />}/>
         <Route path="/signup" element={<Signup />} />
         <Route path="/forgot" element={<ForgotPassword />} />
         <Route path="/dashboard" element={<InternshipTable />} />
       </Routes>
      </AnimatePresence>

       {/* Global toast notification container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        closeOnClick
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
    </>
  );
}
export default App;
