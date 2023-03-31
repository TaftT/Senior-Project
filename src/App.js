import React from 'react';
import Nav from './components/nav'
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
  let page = <NotFound/>
  switch(window.location.pathname){
    case "/":
      page=<LandingPage/>
      break
    case "/login":
      page=<Login/>
      break
    case "/signUp":
      page=<SignUp/>
      break
    case "/home":
      page=<Home/>
      break
    case "/terms":
      page=<Terms/>
      break
    case "/explore":
      page=<Explore/>
      break
    case "/myLocations":
      page=<MyLocations/>
      break

  }
  return (
    <div >
      <Header />
      {page}
      {/* Mobile only VVV */}
      <div style={{maxWidth:"500px", marginLeft:"auto",marginRight:"auto"}}>
        
      </div>

    </div>
    
  );
}

export default App;
