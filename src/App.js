import React from 'react';
import {Routes,Route} from "react-router-dom"
import Header from './components/header'
import Login from "./pages/login"
import LandingPage from "./pages/landingPage"
import Home from "./pages/home"
import SignUp from "./pages/signUp"
import Explore from "./pages/explore"
import MyLocations from "./pages/myLocations"
import Terms from "./pages/terms"
import NotFound from "./pages/notFound"


function App() {

  return (
    <div >
      <Header />
      <Routes>
        <Route exact path='/' element={<LandingPage/>}/>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/signUp' element={<SignUp/>}/>
        <Route exact path='/home' element={<Home/>}/>
        <Route exact path='/explore' element={<Explore/>}/>
        <Route exact path='/myLocations' element={<MyLocations/>}/>
        <Route exact path='/terms' element={<Terms/>}/>
        <Route element={<NotFound/>}/>
      </Routes>
      {/* Mobile only VVV */}
      <div style={{maxWidth:"500px", marginLeft:"auto",marginRight:"auto"}}>
        
      </div>

    </div>
    
  );
}

export default App;
