import React from 'react';
import {auth,getUser} from '../config/firebase'
import {signOut} from "firebase/auth"
import {Link} from "react-router-dom"


// #region constants

// #endregion

// #region styled-components

// #endregion

// #region functions

// #endregion

// #region component
const propTypes = {};

const defaultProps = {};

/**
 * 
 */
class Header extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        homePage:"http://localhost:3000/home",
        showLogout:false,
    };
}
    async logout(){
        console.log("logout")
        try{
            await signOut(auth);
            window.location.replace("http://localhost:3000");
        } catch (error){
            console.log(error)
        }
    }
     componentDidMount() {
        getUser().then((user)=>{
             this.setState({homePage:"/home", showLogout:true})
        }).catch((error)=>{
            this.setState({homePage:"/"})
            console.log(error)
        });
        
    }

    render() {
        getUser().then(()=>{
           
        })
        return (
            
            <header className='bg-white  shadow-lg w-full p-2 flex justify-between items-center'>
                <Link to={this.state.homePage} className='flex w-full justify-start'>
                    <svg  xmlns="http://www.w3.org/2000/svg" width="27" height="36" viewBox="0 0 27 36" fill="none">
                        <path className="text-sky-600" d="M15.1664 35.1C18.7734 30.5859 27 19.6453 27 13.5C27 6.04688 20.9531 0 13.5 0C6.04688 0 0 6.04688 0 13.5C0 19.6453 8.22656 30.5859 11.8336 35.1C12.6984 36.1758 14.3016 36.1758 15.1664 35.1ZM13.5 18C11.018 18 9 15.982 9 13.5C9 11.018 11.018 9 13.5 9C15.982 9 18 11.018 18 13.5C18 15.982 15.982 18 13.5 18Z" fill="rgb(2 132 199)"/>
                    </svg>
                    
                    <h1 className="text-4xl text-sky-600 ml-2">PinDasher</h1>
                    
                </Link>
                {
                    this.state.showLogout?
                    <button className='rounded-md bg-sky-900 text-white font-bold p-2 w-50px  hover:bg-sky-700' onClick={()=>{
                        this.logout()
                        
                    }}>Logout</button> 
                    :
                    <></>
                }
                
            </header>
        );
    }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;
// #endregion

export default Header;