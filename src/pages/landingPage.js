import React from 'react';
import { Link } from 'react-router-dom';


class landingPage extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    advertizing:false
  };
}

  render() {
    return (
      <>
      <main className='p-5 w-full'>
          <Link to="/signUp">
              <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mt-5 mb-5 hover:bg-sky-700'>Sign Up</button>
          </Link>
      {
        this.state.advertizing?
        <div>
          <h1 className='text-center font-bold text-3xl mb-5'>Advertizing</h1>
          
          
          <div className='p-5 w-full bg-white shadow-md rounded-md'>
            <ol className='list-disc ml-10 mb-2' type="i">
                <li>Get more people to visit your business.</li>
                <li>Attract new customers by rewarding them for visiting your business</li>
                <li>Get more people through your doors by incentivizing them with points that can be spent on prizes and raffle drawings</li>
                <li>Use PinDasher to advertise your location and increase foot traffic.</li>
                <li>Pay per Visit</li>
            </ol>
            <button className='rounded-md bg-sky-900 mt-5 text-white font-bold p-3 w-full hover:bg-sky-700'
              onClick={()=>{
                this.setState({advertizing:false})
              }}
            >Learn More: Exploring Your Area</button>
          </div>
          
        </div>
        
          
 

        :

        <div>
           <h1 className='text-center font-bold text-3xl mb-5'>Exploring</h1>
          
          <div className='p-5 w-full bg-white shadow-md rounded-md'>
          <h1 className='font-bold text-3xl mb-5'>Welcome to PinDasher!</h1>
            <p>PinDasher is unique new app that gets you out and about to explore your community and score great prizes! With PinDasher, simply visit any of the participating businesses in your area to earn points. The more businesses you visit, the more points you'll rack up. And those points can be redeemed for fabulous prizes like restaurant gift cards, car washes, and much more. So get out there and start dashing to all the great places PinDasher takes you!</p>
            <button className='rounded-md bg-sky-900 mt-5 text-white font-bold p-3 w-full hover:bg-sky-700'
              onClick={()=>{
                this.setState({advertizing:true})
              }}
            >Learn More: Advertizing Your Location</button>
          </div>

        </div>
         
           
       

      }
  
      
      
  
      </main>
  
      </>
    );
  }
}


// #endregion

export default landingPage;

