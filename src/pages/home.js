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
          <p>Thank you for using PinDasher! We really appreciate your support and hope you enjoy the app's experience.</p>
          <h1 className='text-center font-bold text-xl mt-5'>Bata Testing</h1>
          <p>We wanted to let you know that PinDasher is currently in beta testing, which means there may still be some bugs and glitches that we're working to fix. While we're doing our best to ensure a smooth user experience, there may be instances where data could be erased, reset, or lost.</p>
          <p className='mt-3'>If you notice any bugs or have suggestions please email us at <a className='cursor-pointer text-sky-500' href = "mailto: pindasher.com@gmail.com">pindasher.com@gmail.com</a> we would love your feedback.</p>
          <Link className=" w-full cursor-pointer text-center mb-3 " to="/terms" target="_blank">
              <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mt-5  hover:bg-sky-700'>Terms and Conditions</button>
          </Link>

        </main>
        <Nav />
      </>
    )
  }
}

export default Home;