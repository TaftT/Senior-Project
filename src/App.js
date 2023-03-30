import React from 'react';
import Nav from './components/nav'
import Header from './components/header'
import {Routes,Route} from "react-router-dom"
import Login from "./pages/login"
import LandingPage from "./pages/landingPage"
import Home from "./pages/home"
import SignUp from "./pages/signUp"
import Explore from "./pages/explore"
import NewLocation from "./pages/newLocation"
import MyLocations from "./pages/myLocations"

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<LandingPage/>}/>
      <Route exact path='/login' element={<Login/>}/>
      <Route exact path='/signUp' element={<SignUp/>}/>
      <Route exact path='/home' element={<Home/>}/>
      <Route exact path='/explore' element={<Explore/>}/>
      <Route exact path='/newLocation' element={<NewLocation/>}/>
      <Route exact path='/myLocations' element={<MyLocations/>}/>
    </Routes>
  );
}

export default App;
