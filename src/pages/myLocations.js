import React from 'react';
import Map from '../components/map'
import LocationGetter from '../components/locationGetter'
import {db,getUser,storage} from '../config/firebase'
import {getDocs,collection, query, where,addDoc, deleteDoc, updateDoc, doc} from "firebase/firestore"
import Nav from '../components/nav'
import {ref,uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import {v4} from "uuid"
import Form from '../components/form'
import { Link } from 'react-router-dom';

const propTypes = {};

const defaultProps = {};


class MyLocations extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        user:{},
        locations:[],
        locationInputScreen:false,
        buttonDisable:false,
        locationInfo:{},
        position:{},
        errorMsg:"",
        user:{},
        logoFile:null,
        img1File:null,
        img2File:null,
        logoURL:"",
        img1URL:"",
        img2URL:"",
        resetPin:false,
        locationConfirmed:false,
        editing:false,
        newLocationPin:false,
        selectedLocation:{},
        formFeilds: { 
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
                type:"number",
                value:10,
                min:10,
                max:500,
                step:10,
                placeHolder:"Geofence Radius in feet",
                label:"Geofence Radius in feet"
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
    };
}

loadHours(locationId){
    return new Promise(async (resolve, reject) =>  {
        const hoursOpen = collection(db,"hoursOpen")
        const q = query(hoursOpen,where("locationId", "==", locationId))
        let hourLocationIndex = []
        getDocs(q).then((data)=>{
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
            }))
            resolve(filteredData)
        }).catch((error)=>{
            console.log(error)
        })   
    })
}

clearForm(){
    return new Promise(async (resolve, reject) =>  {
        let newPosition ={}
        let newForm = { 
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
                type:"number",
                value:10,
                min:10,
                max:500,
                step:10,
                placeHolder:"Geofence Radius in feet",
                label:"Geofence Radius in feet"
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
            
        this.setState({
            position:newPosition,
            formFeilds:newForm,
            editing:true,
            logoFile:null,
            img1File:null,
            img2File:null,
            logoURL:"",
            img1URL:"",
            img2URL:"",
            resetPin:false,
            locationConfirmed:false,
            editing:false,
            newLocationPin:false,
            selectedLocation:{},
            buttonDisable:false,
            locationInfo:{},
            position:{},
        },()=>{
            resolve(true)
        })

    }).catch((error)=>{
        console.log(error)
    })

}

autoFillFor(location){
    return new Promise(async (resolve, reject) =>  {
        this.loadHours(location.id).then((hours)=>{
            let locationHours = hours[0]
            let newPosition ={
                altitude:location.altitude,
                latitude:location.latitude,
                longitude:location.longitude,
            }
            let newForm = { 
                locationName:{
                    type:"text",
                    value:location.name,
                    label:"Name*",
                    placeHolder:"Name..."
                    },
                description:{
                    type:"textarea",
                    value:location.description,
                    label:"Description*",
                    placeHolder:"Description..."
                    },
                radius:{
                    type:"number",
                    value:location.radius,
                    min:10,
                    max:500,
                    step:10,
                    placeHolder:"Geofence Radius in feet",
                    label:"Geofence Radius in feet"
                    },
                website:{
                    type:"text",
                    label:"Website Url",
                    placeHolder:"Website...",
                    value:location.websiteURL,
                    },                      
                placeId:{
                    type:"text",
                    value:location.placeId,
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
                    selected:location.category,
                    },
                sunday:{
                    type:"hourrange",
                    placeHolder:"Sunday Hours",
                    selectedStart:locationHours.sunday.hourStart,
                    selectedEnd:locationHours.sunday.hourEnd,
                    },
                monday:{
                    type:"hourrange",
                    placeHolder:"Monday Hours",
                    selectedStart:locationHours.monday.hourStart,
                    selectedEnd:locationHours.monday.hourEnd,
                    },
                tuesday:{
                    type:"hourrange",
                    placeHolder:"Tuesday Hours",
                    selectedStart:locationHours.tuesday.hourStart,
                    selectedEnd:locationHours.tuesday.hourEnd,
                    },
                wednesday:{
                    type:"hourrange",
                    placeHolder:"Wednesday Hours",
                    selectedStart:locationHours.wednesday.hourStart,
                    selectedEnd:locationHours.wednesday.hourEnd,
                    },
                thursday:{
                    type:"hourrange",
                    placeHolder:"Thursday Hours",
                    selectedStart:locationHours.thursday.hourStart,
                    selectedEnd:locationHours.thursday.hourEnd,
                    },
                friday:{
                    type:"hourrange",
                    placeHolder:"Friday Hours",
                    selectedStart:locationHours.friday.hourStart,
                    selectedEnd:locationHours.friday.hourEnd,
                    },
                saturday:{
                    type:"hourrange",
                    placeHolder:"Saturday Hours",
                    selectedStart:locationHours.saturday.hourStart,
                    selectedEnd:locationHours.saturday.hourEnd,
                    },
                agreement:{
                    type:"checkbox",
                    value:[false,false],
                    label:["I have read and agree to the terms and conditions.","I have authorization to allow people onto this land."],
                    placeHolder:""
                    },
                
            }
            this.setState({
                position:newPosition,
                formFeilds:newForm,
                editing:true
            },()=>{
                console.log("there")
                resolve(true)
            })

        }).catch((error)=>{
            console.log(error)
        })
    })
}

loadLocations(){
    return new Promise(async (resolve, reject) =>  {
        const locationColection = collection(db,"locations")
        const q = query(locationColection,where("ownerUserId", "==", this.state.user.uid))
        getDocs(q).then((data)=>{
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
            }))
            this.setState({locations:filteredData},()=>{
                console.log(this.state.locations)
            })
        }).catch((error)=>{
            console.log(error)
        })
        
    })
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

deleteFile(imageURL,imageSpot,locationId){
    return new Promise(async (resolve, reject) =>  {
        if(imageURL){
            let splitUrl = imageURL.split("/")
            let imageNameEncoded = splitUrl[splitUrl.length-1].split("?")[0]
            let imageName = decodeURI(imageNameEncoded)
            let imageFileName = imageName.split("%2F")
            console.log(imageFileName[0]+"/"+imageFileName[1])
            const fileRef = ref(storage,imageFileName[0]+"/"+imageFileName[1])
            deleteObject(fileRef).then(async (res)=>{
                console.log(res)
                const locationDoc = doc(db, "locations", locationId)
                if(imageSpot==='logo'){
                    await updateDoc(locationDoc, {logoURL:""})
                    let newSelected = this.state.selectedLocation
                    newSelected.logoURL =""
                    this.setState({logoURL:"",selectedLocation:newSelected})
                } else if(imageSpot==='img1'){
                    await updateDoc(locationDoc, {img1URL:""})
                    let newSelected = this.state.selectedLocation
                    newSelected.img1URL =""
                    this.setState({img1URL:"",selectedLocation:newSelected})
                } else if(imageSpot==='img2'){
                    await updateDoc(locationDoc, {img2URL:""})
                    let newSelected = this.state.selectedLocation
                    newSelected.img2URL =""
                    this.setState({img2URL:"",selectedLocation:newSelected})
                }
                resolve(true)
            })
        }else{
            resolve(false)
        }  
    })
}

async locationSave(data){
    try{
        let img1URL=this.state.img2URL
        let img2URL=this.state.img1URL
        let logoURL=this.state.logoURL
        
        if(this.state.logoFile && this.state.logoURL !==""){
            logoURL = await this.uploadFile(this.state.logoFile,"locationLogos",data.locationName+" logo")
        }
         if(this.state.img1File && this.state.img1URL !==""){
            img1URL = await this.uploadFile(this.state.img1File,"locationImages",data.locationName+" img1")
        }
        if(this.state.img2File && this.state.img2URL !==""){
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
            ownerUserId:this.state.user.uid,
            sunday:data.sunday,
            monday:data.monday,
            tuesday:data.tuesday,
            wednesday:data.wednesday,
            thursday:data.thursday,
            friday:data.friday,
            saturday:data.saturday
        })
        
    } catch (error){
        console.log(error)
    }
}

async saveEditedLocation(data,id){
    try{
        let img1URL=this.state.img2URL
        let img2URL=this.state.img1URL
        let logoURL=this.state.logoURL
        
        if(this.state.logoFile && this.state.logoURL !==""){
            logoURL = await this.uploadFile(this.state.logoFile,"locationLogos",data.locationName+" logo")
        }
         if(this.state.img1File && this.state.img1URL !==""){
            img1URL = await this.uploadFile(this.state.img1File,"locationImages",data.locationName+" img1")
        }
        if(this.state.img2File && this.state.img2URL !==""){
            img2URL = await this.uploadFile(this.state.img2File,"locationImages",data.locationName+" img2")
        }
        const dataDoc = doc(db,"locations",id)
        let newLocation = await updateDoc(dataDoc,{
            active:true,
            description:data.description,
            img1URL:img1URL,
            img2URL:img2URL,
            logoURL:logoURL,
            altitude:this.state.position.altitude,
            latitude:this.state.position.latitude,
            longitude:this.state.position.longitude,
            name:data.locationName,
            websiteURL:data.website,
            totalVisits:0,
            radius:data.radius,
            placeId:data.placeId,
            category:data.category
        })
        const hoursColection = collection(db,"hoursOpen")
        const q = query(hoursColection,where("locationId", "==", id))
        getDocs(q).then(async (hourData)=>{
            const filteredData = hourData.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
            }))
            console.log(data)
            const openHoursDoc = doc(db,"hoursOpen",filteredData[0].id)
            let newHours = await updateDoc(openHoursDoc,{
                sunday:data.sunday,
                monday:data.monday,
                tuesday:data.tuesday,
                wednesday:data.wednesday,
                thursday:data.thursday,
                friday:data.friday,
                saturday:data.saturday
            })
        })  
    } catch (error){
        console.log(error)
    }
}

async deleteLocation(location){
    const hoursColection = collection(db,"hoursOpen")
    const q = query(hoursColection,where("locationId", "==", location.id))
    getDocs(q).then(async (data)=>{
        const filteredData = data.docs.map((doc)=>({
            ...doc.data(),
            id: doc.id
        }))
        const locationDoc = doc(db, "locations", location.id)
        
        if(location.logoURL.includes("firebasestorage.googleapis.com")){
            this.deleteFile(location.logoURL,'logo',location.id)
        }
        if(location.img1URL.includes("firebasestorage.googleapis.com")){
            this.deleteFile(location.img1URL,'img1',location.id)
        }
        if(location.img2URL.includes("firebasestorage.googleapis.com")){
            this.deleteFile(location.img2URL,'img2',location.id)
        }
        if(filteredData.length>0){
            const hoursDoc = doc(db, "hoursOpen", filteredData[0].id)
            await deleteDoc(hoursDoc)
        }
        await deleteDoc(locationDoc)
        
        this.loadLocations()
        
    })
}

async savePoints(location){
    if(location.newAvailablePoints && location.newAvailablePoints != location.availablePoints){
        const dataDoc = doc(db,"locations",location.id)
        await updateDoc(dataDoc,{
            availablePoints:location.newAvailablePoints
        })
        this.loadLocations()
    }
}

async addPoints(index){
    let newLocations = this.state.locations
    if( !newLocations[index].newAvailablePoints){
        newLocations[index]["newAvailablePoints"]= newLocations[index].availablePoints + 10
    } else {
        newLocations[index].newAvailablePoints= newLocations[index].newAvailablePoints + 10
    }
    this.setState({locations:newLocations})
}

async subPoints(index){
    let newLocations = this.state.locations
    let newPoints=0
    if( !newLocations[index].newAvailablePoints){
        newLocations[index]["newAvailablePoints"]= newLocations[index].availablePoints
    }
    if(newLocations[index].newAvailablePoints-10>0){
        newPoints = newLocations[index].newAvailablePoints-10
    }
    newLocations[index]["newAvailablePoints"]=newPoints
    this.setState({locations:newLocations})
}

componentDidMount() {
    getUser().then((user)=>{
        console.log(user)
        this.setState({user:user},()=>{
            this.loadLocations()
        })

    }).catch((error)=>{
        // window.location.replace("http://localhost:3000/");
        window.location.replace("https://pindasher.com/");
    });
    
}

    render() {
        return (
        <>
            <main className='p-5 w-full'>
                {
                    this.state.locationInputScreen?

                    <div>
                        <h1 className='text-center font-bold text-3xl mb-5'>New Location</h1>
                        <button className='rounded-md bg-gray-600 text-white font-bold p-3 w-1/4 mb-5 hover:bg-gray-400' 
                            onClick={()=>{
                                this.clearForm().then(()=>{
                                    this.setState({locationInputScreen:false,arrived:false})
                                })
                            }}
                        >Back</button>

                        <div className='p-5 w-full bg-white shadow-md rounded-md'>
                            <Map render={this.state.position.latitude && this.state.position.longitude } latitude={this.state.position.latitude} longitude={this.state.position.longitude}/>
                            <LocationGetter buttonText={this.state.editing?"Change Pin":"Pin My Location"} reset={this.state.resetPin} resetCallBack={()=>{this.setState({resetPin:false})}} callBackSuccess={(data)=>{
                                console.log("Success",data)
                                this.setState({position:data})
                                if(this.state.editing){
                                    this.setState({newLocationPin:true})
                                }
                                }}/>
                            {
                            (this.state.position.latitude && !this.state.editing) || (this.state.position.latitude && this.state.editing && this.state.newLocationPin)?
                            <div className="flex mb-5">
                                    <button className='flex justify-center items-center rounded-md bg-green-900 text-white font-bold p-3 w-1/2 hover:bg-green-700'
                                    onClick={()=>{
                                        this.setState({locationConfirmed:true})
                                    }}>
                                        {
                                            this.state.locationConfirmed?
                                            <svg className="h-5 mr-1 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
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
                            <Form id="createLocation" fields={this.state.formFeilds} callBack={(data)=>{
                                this.setState({errorMsg:"",buttonDisable:true})
                                console.log(this.state.position)
                                if(this.state.position!={}){
                                    if(this.state.locationConfirmed || (this.state.editing && !this.state.newLocationPin) || (this.state.editing && this.state.newLocationPin && this.state.locationConfirmed)){
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
                                                    if(!this.state.editing){
                                                        this.locationSave(data)
                                                    } else {
                                                        this.saveEditedLocation(data,this.state.selectedLocation.id)
                                                    }
                                                    
                                                    this.setState({locationInputScreen:false,buttonDisable:false},()=>{
                                                        this.loadLocations()
                                                    })
                                                    console.log(data)
                                                }
                
                                            }else {
                                                this.setState({errorMsg:"You must agree to all terms before submitting",buttonDisable:false})
                                            }
                                        } else {
                                            this.setState({errorMsg:"Please add a location name AND description",buttonDisable:false})
                                        }

                                    } else {
                                        this.setState({errorMsg:"Please Confirm your pin location",buttonDisable:false})
                                    }
                                } else {
                                    this.setState({errorMsg:"Please Pin your location",buttonDisable:false})
                                }
                                
                                
                                
                            }}/>
                            <Link className=" w-full cursor-pointer text-center mb-3 " to="/terms" target="_blank">
                                <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700'>Terms and Conditions</button>
                            </Link>

                            
                        
                            <div className="">
                                {
                                    this.state.selectedLocation.logoURL?.includes("firebasestorage.googleapis.com")?
                                    <button className='rounded-md bg-red-700 text-white font-bold p-3 w-full hover:bg-red-600' 
                                            onClick={()=>{
                                                this.deleteFile(this.state.selectedLocation.logoURL,"logo",this.state.selectedLocation.id)
                                            }}
                                        >Remove</button>
                                    :
                                    <input disabled={this.state.logoFile} className={this.state.logoFile? 'w-full p-2 rounded-md border-2 bg-gray-200':'w-full p-2 rounded-md border-2'} type="text" defaultValue={this.state.selectedLocation.logoURL} placeholder="Logo URL" 
                                        onBlur={(e)=>{
                                        this.setState({logoURL:e.target.value})
                                        }}/>
                                }
                                
                                {
                                    this.state.selectedLocation.logoURL || this.state.logoURL?
                                    <div className='bg-gray-300 h-48 w-full rounded-md mb-4 ' style={{backgroundImage:`url('${this.state.logoURL?this.state.logoURL:this.state.selectedLocation.logoURL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                    :
                                    <label className="block mb-4" style={{width:"225px"}}>
                                        <span className="">Upload your Logo (Under 50KB)</span>
                                        <input type="file" className="block text-sm text-slate-500
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
                                }
                                {
                                    this.state.selectedLocation.img1URL?.includes("firebasestorage.googleapis.com")?
                                    <button className='rounded-md bg-red-700 text-white font-bold p-3 w-full hover:bg-red-600' 
                                            onClick={()=>{
                                                this.deleteFile(this.state.selectedLocation.img1URL, "img1",this.state.selectedLocation.id)
                                            }}
                                        >Remove</button>
                                    :
                                    <input disabled={this.state.img1File} className={this.state.img1File? 'w-full p-2 rounded-md border-2 bg-gray-200':'w-full p-2 rounded-md border-2'} type="text" defaultValue={this.state.selectedLocation.img1URL} placeholder="Featured Image URL" 
                                        onBlur={(e)=>{
                                            this.setState({img1URL:e.target.value})
                                        }}/>
                                }
                                
                                

                                {
                                    this.state.selectedLocation.img1URL || this.state.img1URL?
                                    <div className='bg-gray-300 h-48 w-full rounded-md mb-4' style={{backgroundImage:`url('${this.state.img1URL?this.state.img1URL:this.state.selectedLocation.img1URL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                    :
                                    <label className="block mb-4" style={{width:"225px"}}>
                                        <span className="">Upload a featured image (Under 100KB)</span>
                                        <input type="file" className="block text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-sky-900 file:text-white
                                            hover:file:bg-sky-700
                                            "
                                            style={{width:"300px"}}

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
                                }

                                {
                                    this.state.selectedLocation.img2URL?.includes("firebasestorage.googleapis.com")?
                                    <button className='rounded-md bg-red-700 text-white font-bold p-3 w-full hover:bg-red-600' 
                                            onClick={()=>{
                                                console.log(this.state.selectedLocation.id)
                                                // this.deleteFile(this.state.selectedLocation.img2URL,"img2",this.state.selectedLocation.id)
                                            }}
                                        >Remove</button>
                                    :
                                    <input disabled={this.state.img2File} className={this.state.img2File? 'w-full p-2 rounded-md border-2 bg-gray-200':'w-full p-2 rounded-md border-2'} type="text" defaultValue={this.state.selectedLocation.img2URL} placeholder="Secondary Image URL" 
                                    onBlur={(e)=>{
                                        this.setState({img2URL:e.target.value})
                                    }}/>
                                }
                                
                                
                                {
                                    this.state.selectedLocation.img2URL || this.state.img2URL?
                                    <div className='bg-gray-300 h-48 w-full rounded-md mb-4 ' style={{backgroundImage:`url('${this.state.img2URL?this.state.img2URL:this.state.selectedLocation.img2URL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                    :
                                    <label className="block mb-4" style={{width:"225px"}}>
                                    <span className="">Upload a secondary image (Under 100KB)</span>
                                    <input type="file" className="block  text-sm text-slate-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-sky-900 file:text-white
                                        hover:file:bg-sky-700
                                        "
                                        style={{width:"300px"}}
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
                                }
                                
                                

                                
                               
                                <p className="text-red-500">{this.state.errorMsg}</p>
                                <input disabled={this.state.buttonDisable} className={this.state.buttonDisable?'rounded-md  text-white font-bold p-3 w-full hover:bg-gray-500 bg-gray-700':'rounded-md  text-white font-bold p-3 w-full hover:bg-sky-700 bg-sky-900'}  type="submit" form="createLocation" value="Save Location"/>
                            </div>
                                
                
                        </div>
                    </div>
                    :
                    <div>
                        <h1 className='text-center font-bold text-3xl mb-5'>My Locations</h1>
 
             
                        <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700' 
                            onClick={()=>{
                                this.setState({locationInputScreen:true})
                            }}
                        >New Location</button>
                    {
                        this.state.locations.map((location,index)=>{
                            return(
                                <div key={index} className='bg-white p-5 rounded-md mb-5'>
                                    <div className='bg-gray-300 h-48 w-full rounded-md mb-4' style={{backgroundImage:`url('${location.img1URL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                    <div className='flex'>
                                        <div className='bg-gray-300 h-16 w-1/2 rounded-md mb-4' style={{backgroundImage:`url('${location.logoURL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                        <div className='w-1/2 p-1'>
                                            <h2 className='font-bold text-l md:text-xl'>{location.name}</h2>
                                            <p>{location.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <button className='flex justify-center items-center rounded-md bg-sky-900 text-white font-bold p-3 w-1/3 hover:bg-sky-700'
                                            onClick={()=>{
                                                this.subPoints(index)
                                            }}
                                        >
                                            <svg className='w-6 h-6'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                                        </button>
                                        <div className='flex justify-center rounded-md items-center text-white bg-gray-500 w-1/3 ml-1 mr-1 text-center font-bold text-xl'>
                                            {
                                                location.newAvailablePoints && location.newAvailablePoints != location.availablePoints?
                                                <>
                                                    <svg className='w-6 h-6 mr-3 cursor-pointer' onClick={()=>{this.savePoints(location)}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                                                    {location.newAvailablePoints}
                                                </>
                                                :
                                                location.availablePoints
                                            }
                                            
                                        </div>
                                        <button className='flex justify-center  items-center rounded-md bg-sky-900 text-white font-bold p-3 w-1/3 hover:bg-sky-700'
                                            onClick={()=>{
                                                this.addPoints(index)
                                            }}
                                        >
                                            <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"/></svg>
                                        </button>
                                    </div>
                                    
                                    

                                    <div className="flex ">
                                        <button className='flex justify-center items-center rounded-md bg-yellow-500 text-white font-bold p-3 w-1/2 hover:bg-yellow-400'
                                            onClick={()=>{
                                                console.log(location)
                                                this.autoFillFor(location).then(()=>{
                                                    console.log("here")
                                                    this.setState({locationInputScreen:true,selectedLocation:location})
                                                })
                                            }}
                                        >
                                        Edit</button>
                                        <button className='flex justify-center ml-3 items-center rounded-md bg-red-700 text-white font-bold p-3 w-1/2 hover:bg-red-500'
                                            onClick={()=>{
                                                this.deleteLocation(location)
                                            }}
                                        >Delete</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                }
                
            </main>
            
            <Nav />
        </>)
    }
}

// #endregion

export default MyLocations;

