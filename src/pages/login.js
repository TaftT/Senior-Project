import React from 'react';
import Nav from '../components/nav'
import Header from '../components/header'
import Form from '../components/form'
import {auth, googleProvider, getUser,db} from '../config/firebase'
import {signInWithPopup,signInWithEmailAndPassword,RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth"
import {collection, getDocs, query, where} from "firebase/firestore"

const propTypes = {};

const defaultProps = {};

/**
 * 
 */
class Login extends React.Component {
constructor(props) {
  super(props);

  this.state = {
    errorMsg:"",
    signInConfirmObj:{},
    OTPCode:"",
    OTP:"",
    hideButton:false
  };
}

// async signInWithGoogle(){
//   try{
//       await signInWithPopup(auth, googleProvider);
//       window.location.replace("http://localhost:3000/home");
//   } catch (error){
//       console.log(error)
//   }
// }

// async signInWithEmail(data){
//   try{
//       await signInWithEmailAndPassword(auth, data.email, data.password);
//       window.location.replace("http://localhost:3000/home");
//   } catch (error){
//       console.log(error)
//   }
// }
setUpPhoneRecaptcha(number){
  return new Promise(async (resolve, reject) =>  {
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth)
      recaptchaVerifier.render()
      this.setState({hideButton:true})
      resolve(await signInWithPhoneNumber(auth,number,recaptchaVerifier)) 
  })
}

async signInWithPhone(data){
  try{
    this.setState({errorMsg:""})
    this.checkPhoneNumber(data.phone).then((isNew)=>{
      if(isNew){
        this.setState({errorMsg:"It looks like you need to sign up!"})
      }else{
        this.setUpPhoneRecaptcha(data.phone).then((res)=>{
          this.setState({signInConfirmObj:res,OTPCode:"",OTP:true})
        })
      }

    })
  } catch (error){
      console.log(error)
  }
}

checkPhoneNumber(number){
  return new Promise(async (resolve, reject) =>  {
      const phoneCollection = collection(db,"phoneNumbers")
      const q = query(phoneCollection,where("number", "==", number))
      getDocs(q).then((res)=>{
          const filteredData = res.docs.map((doc)=>({
              ...doc.data(),
              id: doc.id
          }))
          console.log(filteredData)
          if(filteredData.length>0){
              resolve(false)
          } else {
              resolve(true)
          }
          
      }).catch((error)=>{
          console.log(error)
      })
      
  })
}

componentDidMount() {
  getUser().then((user)=>{
      console.log(user)
      window.location.replace("http://localhost:3000/home");
  }).catch((error)=>{
      console.log(error)
  });
  
}

  render() {
    let formFeilds = { 
      phone:{
        type:"tel",
        value:"",
        label:"Cell Phone Number*",
        placeHolder:"Cell Phone Number..."
        },
  }
    return <>
    <Header />
    <main className='p-5 w-full'>
      <h1 className='text-center font-bold text-3xl mb-5'>Login</h1>
      <div className='p-5 w-full bg-white shadow-md rounded-md'>
      {/* <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700' onClick={()=>{
                this.signInWithGoogle()
            }}>Sign in with Google</button> */}
      {/* <h2 className="text-center">OR</h2> */}
      <Form fields={formFeilds} id="loginForm" callBack={(data)=>{ this.signInWithPhone(data)}}/>
      <p>{this.state.errorMsg}</p>
      
      {
        this.state.OTP?
        <div>
          <label className="font-bold text-sm">Enter Code Recived By Text</label>
              <input className='w-full p-2 rounded-md border-2' type="text" maxLength="6" disabled={this.state.OTPCode.length==6} placeholder="Verification Code" onChange={(e)=>{
                  this.setState({OTPCode:e.target.value}, async ()=>{
                      if(this.state.OTPCode.length==6){
                          this.state.signInConfirmObj.confirm(this.state.OTPCode).then((result)=>{
                              window.location.replace("http://localhost:3000/home");
                          }).catch((error)=>{
                              if(error.message.includes("invalid-verification-code")){
                                  e.target.value=""
                                  this.setState({errorMsg:"Verification code was incorrect",OTPCode:""})
                              } 
                          })
                      }
                  })
              }}/>
              {
                  this.state.OTPCode.length==6?
                  <h2>Verifying...</h2>
                  :
                  <></>
              }
        </div>
        :
        <>
          <div id='recaptcha-container'></div>
          {
            this.state.hideButton?
            <></>
            :
            <input className='rounded-md bg-sky-900 text-white font-bold p-3 w-full hover:bg-sky-700' type="submit" form="loginForm" value="Login"/>
          }
          
        
        </>
        
      }
      </div>
        
    </main>
      

    </>;
  }
}

export default Login;