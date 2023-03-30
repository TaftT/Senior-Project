import React from 'react';
import Form from '../components/form'
import Nav from '../components/nav'
import Header from '../components/header'
import Map from '../components/map'
import LocationGetter from '../components/locationGetter'
import LocationTracker from '../components/locationTracker'
import {db,storage,getUser} from '../config/firebase'
import {collection, addDoc} from "firebase/firestore"
import {ref,uploadBytes, getDownloadURL} from "firebase/storage"
import {v4} from "uuid"



const propTypes = {};

const defaultProps = {};

let formFeilds = { 
    locationName:{
        type:"text",
        value:"",
        label:"Name*",
        placeHolder:"Name..."
        },
    description:{
        type:"textarea",
        value:"",
        label:"Description*",
        placeHolder:"Description..."
        },
    radius:{
        type:"select",
        value:["Small","Medium","Large"],
        label:["Small","Medium","Large"],
        placeHolder:"Geofence Radius",
        selected:"Medium",
        },
    website:{
        type:"text",
        label:"Website Url",
        placeHolder:"Website...",
        value:"",
        },                      
    placeId:{
        type:"text",
        value:"",
        label:"Google Place Id",
        placeHolder:"Google Place Id..."
        },
    category:{
        type:"select",
        value:[
            "Activity",
            "Antiques",
            "Arcade",
            "Art Gallery",
            "Bar",
            "Beach",
            "Books",
            "Botanical Garden",
            "Campground",
            "Cinema",
            "Clothing",
            "Concert",
            "Convenience stores",
            "Dance",
            "Electronics",
            "Entertainment",
            "Event",
            "Food and beverage",
            "Food Truck",
            "Gift shops",
            "Golf",
            "Health and beauty",
            "Historical Site",
            "Home improvement",
            "Jewelry",
            "Market",
            "Museum",
            "Music",
            "National Park",
            "Nightclub",
            "Outdoors",
            "Pets",
            "Park",
            "Restaurant",
            "Shopping Mall",
            "Ski Resort",
            "Sports",
            "Supermarkets/grocery stores",
            "Theater",
            "Theme Park",
            "Thrift",
            "Trail",
            "Toys",
            "University",
            "Zoo"
          ],
        label:[
            "Activity",
            "Antiques",
            "Arcade",
            "Art Gallery",
            "Bar",
            "Beach",
            "Books",
            "Botanical Garden",
            "Campground",
            "Cinema",
            "Clothing",
            "Concert",
            "Convenience stores",
            "Dance",
            "Electronics",
            "Entertainment",
            "Event",
            "Food and beverage",
            "Food Truck",
            "Gift shops",
            "Golf",
            "Health and beauty",
            "Historical Site",
            "Home improvement",
            "Jewelry",
            "Market",
            "Museum",
            "Music",
            "National Park",
            "Nightclub",
            "Outdoors",
            "Pets",
            "Park",
            "Restaurant",
            "Shopping Mall",
            "Ski Resort",
            "Sports",
            "Supermarkets/grocery stores",
            "Theater",
            "Theme Park",
            "Thrift",
            "Trail",
            "Toys",
            "University",
            "Zoo"
          ],
        placeHolder:"Category",
        selected:"Activity",
        },
    sunday:{
        type:"hourrange",
        placeHolder:"Sunday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    monday:{
        type:"hourrange",
        placeHolder:"Monday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    tuesday:{
        type:"hourrange",
        placeHolder:"Tuesday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    wednesday:{
        type:"hourrange",
        placeHolder:"Wednesday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    thursday:{
        type:"hourrange",
        placeHolder:"Thursday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    friday:{
        type:"hourrange",
        placeHolder:"Friday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    saturday:{
        type:"hourrange",
        placeHolder:"Saturday Hours",
        selectedStart:-1,
        selectedEnd:0,
        },
    agreement:{
        type:"checkbox",
        value:[false,false],
        label:["I have read and agree to the terms and conditions.","I have authorization to allow people onto this land."],
        placeHolder:""
        },
    
}

class NewLocation extends React.Component {
constructor(props) {
    super(props);
    this.state = {
        buttonDisable:false,
        locationInfo:{},
        position:{},
        errorMsg:"",
        user:{},
        logoFile:null,
        img1File:null,
        img2File:null,
        resetPin:false,
        locationConfirmed:false,
    };
}
uploadFile(file,folder,name){
    return new Promise(async (resolve, reject) =>  {
        if(file){
            const fileRef = ref(storage,folder+"/"+name+v4())
            uploadBytes(fileRef,file).then((res)=>{
                console.log(res)
                getDownloadURL(res.ref).then((url)=>{
                    console.log(url)
                    resolve(url)
                })
            })
        }else{
            resolve(false)
        }  
    })
}

async locationSave(data){
    try{
        let img1URL=""
        let img2URL=""
        let logoURL=""
        
        if(this.state.logoFile){
            logoURL = await this.uploadFile(this.state.logoFile,"locationLogos",data.locationName+" logo")
        }
         if(this.state.img1File){
            img1URL = await this.uploadFile(this.state.img1File,"locationImages",data.locationName+" img1")
        }
        if(this.state.img2File){
            img2URL = await this.uploadFile(this.state.img2File,"locationImages",data.locationName+" img2")
        }
        const dataCollection = collection(db,"locations")
        let newLocation = await addDoc(dataCollection,{
            active:true,
            availablePoints:0,
            description:data.description,
            img1URL:img1URL,
            img2URL:img2URL,
            logoURL:logoURL,
            altitude:this.state.position.altitude,
            latitude:this.state.position.latitude,
            longitude:this.state.position.longitude,
            name:data.locationName,
            ownerUserId:this.state.user.uid,
            websiteURL:data.website,
            totalVisits:0,
            radius:data.radius,
            placeId:data.placeId,
            category:data.category
        })
        const openHoursCollection = collection(db,"hoursOpen")
        let newHours = await addDoc(openHoursCollection,{
            locationId:newLocation.id,
            sunday:data.sunday,
            monday:data.monday,
            tuesday:data.tuesday,
            wednesday:data.wednesday,
            thursday:data.thursday,
            friday:data.friday,
            saturday:data.saturday
        })
        window.location.replace("http://localhost:3000/myLocations");
    } catch (error){
        console.log(error)
    }
}


componentDidMount() {
    getUser().then((user)=>{
        this.setState({user:user})
    }).catch((error)=>{
        window.location.replace("http://localhost:3000");
    });
    
}


    render() {
        return (
        <>
            <Header />
           
            
            <main className='p-5 w-full'>
                <h1 className='text-center font-bold text-3xl mb-5'>New Location</h1>
                <div className='p-5 w-full bg-white shadow-md rounded-md'>
                    <Map render={this.state.position.latitude && this.state.position.longitude } latitude={this.state.position.latitude} longitude={this.state.position.longitude}/>
                    <LocationGetter buttonText="Pin My Location" reset={this.state.resetPin} resetCallBack={()=>{this.setState({resetPin:false})}} callBackSuccess={(data)=>{
                        console.log("Success",data)
                        this.setState({position:data})
                        }}/>
                    {
                       this.state.position.latitude?
                       <div className="flex mb-5">
                            <button className='flex justify-center items-center rounded-md bg-green-900 text-white font-bold p-3 w-1/2 hover:bg-green-700'
                            onClick={()=>{
                                this.setState({locationConfirmed:true})
                            }}>
                                {
                                    this.state.locationConfirmed?
                                    <svg className="h-5 mr-3 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                                    :
                                    <></>
                                }
                                
                                Confirm Location</button>
                            <button className='flex justify-center ml-3 items-center rounded-md bg-gray-600 text-white font-bold p-3 w-1/2 hover:bg-gray-500'
                            onClick={()=>{
                                this.setState({position:{},resetPin:true,locationConfirmed:false})
                            }}>Cancel Pin</button>
                       </div>
                       :
                       <></> 
                    }
                    <Form id="createLocation" fields={formFeilds} callBack={(data)=>{
                        this.setState({errorMsg:"",buttonDisable:true})
                        console.log(this.state.position)
                        if(this.state.position!={}){
                            if(this.state.locationConfirmed){
                                if(data.locationName && data.description){
                                    if(!data.agreement.includes(false)){
                                        let schedule = {
                                            sunday:data.sunday,
                                            monday:data.monday,
                                            tuesday:data.tuesday,
                                            wednesday:data.wednesday,
                                            thursday:data.thursday,
                                            friday:data.friday,
                                            saturday:data.saturday,
                                        }
                                        let invalidDays =[]
                                        for (const day in schedule) {
                                            // Check if the current day has a valid "hourStart" and "hourEnd"
                                            if (schedule[day].hourStart !== -1 && schedule[day].hourEnd <= schedule[day].hourStart) {
                                                invalidDays.push(day)
                                            }
                                          }
                                          if(invalidDays.length>0){
                                            this.setState({errorMsg:"Please fix the open hours for "+invalidDays.map((day)=>{ return day+", "})},()=>{
                                                return
                                            });
                                          } else{
                                            this.locationSave(data)
                                            console.log(data)
                                          }
        
                                    }else {
                                        this.setState({errorMsg:"You must agree to all terms before submitting"})
                                    }
                                } else {
                                    this.setState({errorMsg:"Please add a location name AND description"})
                                }

                            } else {
                                this.setState({errorMsg:"Please Confirm your pin location"})
                            }
                        } else {
                            this.setState({errorMsg:"Please Pin your location"})
                        }
                        
                        
                        
                    }}/>
                
                    <div className="flex flex-col items-center">
                        <label className="block mb-4">
                            <span className="">Upload your Logo (Under 50KB)</span>
                            <input type="file" className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-sky-900 file:text-white
                            hover:file:bg-sky-700
                            " 
                            onChange={(e)=>{
                                let myFile = e.target.files[0]
                                if(myFile.size < 50000){
                                    if(myFile.type.includes("image")){
                                        this.setState({logoFile:myFile},()=>{
                                        })
                                    } else {
                                        this.setState({errorMsg:"File is not an image"})  
                                    } 
                                }else{
                                    this.setState({errorMsg:"File too big please be sure the image is under 50kb"})
                                }
                            }}/>
                        </label>
                        <label className="block mb-4">
                            <span className="">Upload a featured image (Under 100KB)</span>
                            <input type="file" className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-sky-900 file:text-white
                            hover:file:bg-sky-700
                            "
                            onChange={(e)=>{
                                let myFile = e.target.files[0]
                                if(myFile.size < 100000){
                                    if(myFile.type.includes("image")){
                                        this.setState({img1File:myFile},()=>{
                                        })
                                    } else {
                                        this.setState({errorMsg:"File is not an image"})  
                                    } 
                                }else{
                                    this.setState({errorMsg:"File too big please be sure the image is under 100kb"})
                                }
                            }}/>
                        </label>
                        <label className="block mb-4">
                            <span className="">Upload a secondary image (Under 100KB)</span>
                            <input type="file" className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-sky-900 file:text-white
                            hover:file:bg-sky-700
                            "
                            onChange={(e)=>{
                                let myFile = e.target.files[0]
                                if(myFile.size < 100000){
                                    if(myFile.type.includes("image")){
                                        this.setState({img2File:myFile},()=>{
                                        })
                                    } else {
                                        this.setState({errorMsg:"File is not an image"})  
                                    } 
                                }else{
                                    this.setState({errorMsg:"File too big please be sure the image is under 100kb"})
                                }
                            }}/>
                        </label>
                        <p>{this.state.errorMsg}</p>
                        <input disabled={this.state.buttonDisable} className={this.state.buttonDisable?'rounded-md  text-white font-bold p-3 w-full hover:bg-gray-500 bg-gray-700':'rounded-md  text-white font-bold p-3 w-full hover:bg-sky-700 bg-sky-900'}  type="submit" form="createLocation" value="Save Location"/>
                    </div>
                        
           
                </div>
            </main> 
            <Nav />
        </>)
    }
}

// #endregion

export default NewLocation;

