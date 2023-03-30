import React from 'react';
import Nav from '../components/nav'
import Header from '../components/header'
import {Link} from "react-router-dom"

function LandingPage() {
  return (
    <>
    <Header />
    <main className='p-5 w-full'>
    <h1 className='text-center font-bold text-3xl mb-5'>Landing Page</h1>
        <Link to="/signUp">
            <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700'>Sign Up</button>
        </Link>
        <Link to="/login">
            <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full hover:bg-sky-700'>Login</button>
        </Link>
    </main>
      

    </>
  );
}

export default LandingPage;