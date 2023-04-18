import React from 'react';
import {getUser} from '../config/firebase'
import Nav from '../components/nav'
import { Link } from 'react-router-dom';

class Home extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    user:{}
  };
}



componentDidMount() {
  this.setState({loading:true})
  getUser().then((user)=>{
      this.setState({user:user},()=>{
         

      })

  }).catch((error)=>{
      window.location.replace("https://pindasher.com/");
  });
  
}

  render() {
    return  (
      <>
        <main className='p-5 w-full'>
          <h1 className='text-center font-bold text-3xl mb-5'>Home</h1>
          <Link className=" w-full cursor-pointer text-center mb-3 " to="/terms" target="_blank">
              <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full  hover:bg-sky-700'>Terms and Conditions</button>
          </Link>

        </main>
        <Nav />
      </>
    )
  }
}

export default Home;