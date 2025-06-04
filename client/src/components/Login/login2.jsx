import React from 'react';

const Login = () => {
  return (
    //Background take from public
    <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center"
  style={{backgroundImage: "url('/HD-wallpaper-view-ultra-artistic-drawings-view-landscape-drawing.jpg')",}}> 

    {/* this is the frosted box thing */}
      <div className="bg-white/35 backdrop-blur-md p-8 rounded-3xl h-[600px] w-[550px] text-center shadow-xl">
    {/* add image inside the box */}
        {/* <img src="/login-illustration.png" alt="Login Art" className="mx-auto w-32 h-32 mb-4" /> */}
        <div className="text-5xl font-bold m-10 mb-1 ">Login</div>

      </div>
    </div>
  );
};

export default Login;
