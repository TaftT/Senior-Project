import React from 'react';
import Nav from '../components/nav'
import Header from '../components/header'


function LandingPage() {
  return (
    <>

    <main className='p-5 w-full'>
      <h1 className='text-center font-bold text-3xl mb-5'>Landing Page</h1>
        <a href="/signUp">
            <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700'>Sign Up</button>
        </a>
        <a href="/login">
            <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full hover:bg-sky-700'>Login</button>
        </a>
    </main>
      

    </>
  );
}

export default LandingPage;