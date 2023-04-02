import React from 'react';
import Form from '../components/form'
import {auth, googleProvider, getUser,db} from '../config/firebase'
import {createUserWithEmailAndPassword, signInWithPopup,RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth"
import {collection, addDoc, getDocs, query, where} from "firebase/firestore"
import { Link } from 'react-router-dom';

let formFeilds = { 
    name:{
        type:"text",
        value:"",
        label:"Name*",
        placeHolder:"Name..."
        },
    username:{
        type:"text",
        value:"",
        label:"Username*",
        placeHolder:"Username..."
        },
    phone:{
        type:"tel",
        value:"",
        label:"Cell Phone Number*",
        placeHolder:"Cell Phone Number..."
        },
    phoneDisclaimer:{
        type:"info",
        value:"*By entering your phone number you agree to recieve text messages.",
        },
    email:{
        type:"email",
        value:"",
        label:"Email*",
        placeHolder:"Example@Email.com..."
        },
    error:{
        type:"error",
        value:"",
        },
}

const propTypes = {};

const defaultProps = {};

/**
 * 
 */
class SignUp extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        OTP:false,
        userInfo:{},
        errorMsg:"",
        OTPCode:"",
        signInConfirmObj:{},
        hideButton:false
    };
}
    // async signUpWithGoogle(){
    //     try{
    //         const userCredential = await signInWithPopup(auth, googleProvider);
    //         await this.userSave(userCredential.user.uid)
    //         window.location.replace("http://localhost:3000/home");
    //     } catch (error){
    //         console.log(error)
    //     }
    // }
    setUpPhoneRecaptcha(number){
        return new Promise(async (resolve, reject) =>  {
            const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth)
            recaptchaVerifier.render()
            this.setState({hideButton:true})
            resolve(await signInWithPhoneNumber(auth,number,recaptchaVerifier)) 
        })
      } 

    async signUpNewUser(){
        try{
            // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // console.log(userCredential)
            // userCredential.user.uid
            await this.userSave("test")
            // window.location.replace("http://localhost:3000/home");

        } catch (error){
            console.log(error)
        }
    }

    checkPhoneNumber(number,username){
        return new Promise(async (resolve, reject) =>  {
            const phoneCollection = collection(db,"phoneNumbers")
            const q = query(phoneCollection,where("number", "==", number))
            getDocs(q).then((res)=>{
                const numbers = res.docs.map((doc)=>({
                    ...doc.data(),
                    id: doc.id
                }))
                if(numbers.length>0){
                    this.setState({errorMsg:"This Phone number is already associated with an account"})
                    resolve(false)
                } else {
                    const q2 = query(phoneCollection,where("username", "==", username))
                    getDocs(q2).then((res2)=>{
                        const usernames = res2.docs.map((doc)=>({
                            ...doc.data(),
                            id: doc.id
                        }))
                        console.log(username,usernames)
                        if(usernames.length>0 ){
                            this.setState({errorMsg:"This Username number is already taken"})
                            resolve(false)
                        } else {
                            resolve(true)
                        }
                    }).catch((error)=>{
                        console.log(error)
                    })
                }
                
                
                
            }).catch((error)=>{
                console.log(error)
            })
            
        })
    }

    async userSave(userId){
        try{
            const userCollection = collection(db,"users")
            let newUser = await addDoc(userCollection,{
                name:this.state.userInfo.name,
                username:this.state.userInfo.username,
                phone:this.state.userInfo.phone,
                email:this.state.userInfo.email,
                firebaseUserId:userId,
            })
            const phoneNumber = collection(db,"phoneNumbers")
            let newPhoneNumber = await addDoc(phoneNumber,{
                number:this.state.userInfo.phone,
                username:this.state.userInfo.username,
                userId:newUser.id,
            })
        } catch (error){
            console.log(error)
        }
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
        return (<>
        <main className='p-5 w-full'>
            <h1 className='text-center font-bold text-3xl mb-5'>Sign Up</h1>
            {/* <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700' onClick={()=>{
                
            }}>Sign Up with Google</button> */}
            {
                !this.state.OTP?
                <div className='p-2 w-full bg-white shadow-md rounded-md'>
                    <Form id="signUpForm" fields={formFeilds} callBack={(data)=>{
                        console.log(data)
                        
                        this.setState({errorMsg:""})
                        if(!data.phone || !Number(data.phone)){
                            this.setState({errorMsg:"Please Enter a valid phone number"})
                            return
                        }
                        if(!data.name){
                            this.setState({errorMsg:"Please Enter a your name"})
                            return
                        }
                        if(!data.email){
                            this.setState({errorMsg:"Please Enter a your email"})
                            return
                        }
                        if(!data.username){
                            this.setState({errorMsg:"Please Enter a username"})
                            return
                        }
                        this.checkPhoneNumber(data.phone, data.username).then((isNew)=>{
                            if(isNew){
                                this.setState({userInfo:data,},()=>{
                                        this.setUpPhoneRecaptcha(data.phone).then((res)=>{
                                            this.setState({signInConfirmObj:res,OTPCode:"",OTP:true})
                                        })
                                    })
                            }
                            // 
                        })
                        
                        
                        }}/>
                        <div id='recaptcha-container'></div>
                        <p>{this.state.errorMsg}</p>
                        {
                            this.state.hideButton?
                            <></>
                            :
                            <>
                                <input className='rounded-md bg-sky-900 text-white font-bold p-3 w-full hover:bg-sky-700' type="submit" form="signUpForm" value="Sign Up"/>
                                <Link className=" w-full cursor-pointer text-center mb-3 " to="/terms" target="_blank">
                                    <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mt-5 hover:bg-sky-700'>Terms and Conditions</button>
                                </Link>
                            </>
                        }
                        
                </div>
                :
                <div className='p-2 w-full bg-white shadow-md rounded-md'>
                    <div className="mb-3">
                        <label className="font-bold text-sm">Enter Code Recived By Text</label>
                        <input className='w-full p-2 rounded-md border-2' type="text" maxLength="6" disabled={this.state.OTPCode.length==6} placeholder="Verification Code" onChange={(e)=>{
                            this.setState({OTPCode:e.target.value}, async ()=>{
                                if(this.state.OTPCode.length==6){
                                    this.state.signInConfirmObj.confirm(this.state.OTPCode).then((result)=>{
                                        this.userSave(result.user.uid).then(()=>{
                                            window.location.replace("http://localhost:3000/home");
                                        })
                                    }).catch((error)=>{
                                        if(error.message.includes("invalid-verification-code")){
                                            e.target.value=""
                                            this.setState({errorMsg:"Verification code was incorrect",OTPCode:""})
                                        }
                                        
                                    })
                                }
                            })
                        }}/>
                    </div>
                    {
                        this.state.OTPCode.length==6?
                        <h2>Verifying...</h2>
                        :
                        <></>
                    }
                    
                    <p>{this.state.errorMsg}</p>
                    
                </div>

            }
            
        </main>
    </>)
            
    }
        
}


// #endregion

export default SignUp;


