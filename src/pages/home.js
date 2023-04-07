import React from 'react';
import {getUser} from '../config/firebase'
import Nav from '../components/nav'

class Home extends React.Component {
constructor(props) {
  super(props);

  this.state = {
  };
}


componentDidMount() {
  getUser().then((user)=>{
      

  }).catch((error)=>{
      // window.location.replace("http://localhost:3000/");
      window.location.replace("https://pindasher.com/");
  });
  
}

  render() {
    return  (
      <>
        <h1>Home</h1>
      <Nav />
      </>
    )
  }
}

export default Home;