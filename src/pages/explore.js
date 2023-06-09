import React from 'react';
import {db,getUser} from '../config/firebase'
import {getDocs,collection,addDoc,updateDoc,query, where, doc, serverTimestamp, toDate, fromDate} from "firebase/firestore"
import Nav from '../components/nav'
import dayjs from 'dayjs'
import Map from '../components/map'

let ORIENTATIONCOUNTER = 0
let LOCATIONCOUNTER = 0

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

class Explore extends React.Component {
constructor(props) {
    super(props);

    let tips = ["Walking around while verifying your location will give more accurate position",
    "Be aware of your surroundings and watch where you are walking",
    "Explore in groups or with a partner, Invite Your friends to use Pin Dasher",
    "Use the buddy system",
    "Stay in well-lit areas",
    "Don't trespass: stay out of private property",
    "Be aware of the weather",
    "Stay hydrated",
    "Be cautious with strangers",
    "Respect other people's property",
    "Refresh you page while exploring to sort the location based on your location",
    "Provide value to our Pin Dasher community by staying longer at locations and supporting business owners.",
    // "Unsponsored points count towards! Go to sponsored locations to earn points to spend on raffles."
 
]

    this.state = {
        loading:false,
        user:{},
        locations:[],
        hoursOpen:[],
        hourLocationIndex:[],
        selectedLocation:null,
        selectedLocationIsOpen:false,
        selectedLocationHours:[],
        gettingLocation:false,
        cannotgettingLocation:false,
        accuracy:0,
        latitude:0,
        longitude:0,
        altitude:0,
        altitudeAccuracy:0,
        heading:0,
        speed:0,
        alpha:0,
        beta:0,
        gamma:0,
        absoluteOrientation:false,
        newSnap:true,
        arrived:false,
        locationFeedBack:"",
        buttonClass:"",
        testing:false,
        listOfVisitedIds:[],
        randomTip:Math.floor(Math.random() * tips.length),
        tips:tips,
        userPoints:{}
        // getmylocation:false
    };
}

loadLocations(){
    return new Promise(async (resolve, reject) =>  {
        const locationColection = collection(db,"locations")
        getDocs(locationColection).then((data)=>{
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
            }))
            this.sortLocationsByDistance(this.state.latitude, this.state.longitude, filteredData).then((locations)=>{
               
                this.setState({locations:locations},()=>{
                    this.getListOfVisited()
                        resolve(true)
                })
            })
        }).catch((error)=>{
            console.log(error)
        })
        
    })
}

loadAllHours(){
    return new Promise(async (resolve, reject) =>  {
        const hoursOpen = collection(db,"hoursOpen")
        let hourLocationIndex = []
        getDocs(hoursOpen).then((data)=>{
            const filteredData = data.docs.map((doc)=>({
                ...doc.data(),
                id: doc.id
            }))
            hourLocationIndex = filteredData.map((locationHours)=>{
                return locationHours.locationId
            })
            this.setState({hoursOpen:filteredData, hourLocationIndex:hourLocationIndex},()=>{
                
                resolve(true)
            })
        }).catch((error)=>{
            console.log(error)
        })   
    })
}

createVisitLog(){
    try{
        const visitsCollection = collection(db,"visits")
            let q = query(visitsCollection,where("ownerUserId", "==", this.state.user.uid),where("locationId", "==", this.state.selectedLocation.id))
            getDocs(q).then(async (res)=>{
                const visits = await res.docs.map(async (doc)=>({
                    ...doc.data(),
                    id: doc.id
                }))
                
                if(visits.length>0){
                    
                    return false
                } else {
                   
//                  const specificDate = new Date("2022-01-01"); // set specific date
//                  const timestamp = Timestamp.fromDate(specificDate); // create a Timestamp object from specific date
                    const timestamp = serverTimestamp();
                    const dataCollection = collection(db,"visits")
                    let newVisit = await addDoc(dataCollection,{
                        ownerUserId:this.state.user.uid,
                        locationId:this.state.selectedLocation.id,
                        dateVeiwed:timestamp,
                        dateVisited:null,
                        dateExpires:"",
                        expired:false,
                        visitedWebsite:false,
                    })
                    
                    return true
                }
            })

    } catch(error){
        console.log(error)
        return false
    }
}

websiteVisit(){
    try{
        const visitsCollection = collection(db,"visits")
            let q = query(visitsCollection,where("ownerUserId", "==", this.state.user.uid),where("locationId", "==", this.state.selectedLocation.id))
            getDocs(q).then(async (res)=>{
                const filteredVisits = await Promise.all(res.docs.map(async (doc)=>({
                    ...doc.data(),
                    id: doc.id
                })));
                if(filteredVisits.length>0){
                    const visitsDoc = doc(db, "visits", filteredVisits[0].id)
                    await updateDoc(visitsDoc, {visitedWebsite:true}) 
                } else {
                    
                    return false
                }
            })

    } catch(error){
        console.log(error)
        return false
    }
}

resetVisit(){
    try{
        if(this.state.selectedLocation.id){
            const visitsCollection = collection(db,"visits")
            let q = query(visitsCollection,where("ownerUserId", "==", this.state.user.uid),where("locationId", "==", this.state.selectedLocation.id))
            getDocs(q).then(async (res)=>{
                const filteredVisits = await Promise.all(res.docs.map(async (doc)=>({
                    ...doc.data(),
                    id: doc.id
                })));
                if(filteredVisits.length>0){
                    const visitsDoc = doc(db, "visits", filteredVisits[0].id)
                    await updateDoc(visitsDoc, {dateVisited:null}) 
                } else {
                    
                    return false
                }
            })
        }
    } catch(error){
        console.log(error)
        return false
    }
}



getListOfVisited(){
    const today = new Date();
    const visitsCollection = collection(db,"visits");
    let q = query(
        visitsCollection,
        where("ownerUserId", "==", this.state.user.uid)
      )
        getDocs(q).then(async (res) => {
                let filteredVisits = await Promise.all(res.docs.map(async (doc)=>({
                    ...doc.data(),
                    id: doc.id
                })));
                let listOfVisitedIds=[]
                
                filteredVisits = filteredVisits.filter((visit) => {
                    return (visit.dateExpires == "" || visit.dateExpires.toDate() <= today) && visit.expired == false && visit.dateVisited !== null;
                  });
                  
                for (let index = 0; index < filteredVisits.length; index++) {
                    const visit = filteredVisits[index];
                    listOfVisitedIds.push(visit.locationId) 
                }
                this.setState({listOfVisitedIds:listOfVisitedIds},
                    ()=>{
                        // console.log("list of visitied", this.state.listOfVisitedIds)
                    })
            })
            .catch((error) => {
                console.log('Error getting documents: ', error);
            });

}

convertHourToString(num) {
    // Use modulus to convert 13 to 1
    let hour=String(num % 12 || 12)
    if(num>11){
        hour+="pm"
    } else {
        hour+="am"
    }
    return hour
  }

isOpen(locationId){
    let days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
    let hourNow = dayjs().hour()
    let dayNow = days[dayjs().day()]
    let openHours =this.state.hoursOpen[this.state.hourLocationIndex.indexOf(locationId)][dayNow]
    if(hourNow >= openHours.hourStart && hourNow < openHours.hourEnd ){
        let openString = this.convertHourToString(openHours.hourStart)+"-"+this.convertHourToString(openHours.hourEnd)
        if(openHours.hourStart==-1){
            openString="Closed All Day"
        }
        return [true, openString]
    } else {
        let openString = this.convertHourToString(openHours.hourStart)+"-"+this.convertHourToString(openHours.hourEnd)
        if(openHours.hourStart==-1){
            openString="Closed All Day"
        }
        return [false, openString]
    }
}

handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    if(absolute && alpha % 1 !== 0 && beta % 1 !== 0 && gamma % 1 !== 0 && alpha<180 && beta<180 && gamma<100){
        ORIENTATIONCOUNTER+= 1
    }
    if(ORIENTATIONCOUNTER===100){
        // console.log(absolute,alpha,beta,gamma)
        this.setState({newSnap:true,alpha:alpha,beta:beta,gamma:gamma,absoluteOrientation:absolute,finishedGettingOrientation:true})
    }
  }

getLocation(){
    return new Promise(async (resolve, reject) =>  {
    const options = {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      };
    const success = (pos) => {
            const crd = pos.coords;
            // console.log("getLocation")
            if(this.state.latitude !== crd.latitude || this.state.longitude !== crd.longitude){
                    this.setState({
                        gettingLocation:false,
                        newSnap:false,
                        accuracy:crd.accuracy,
                        latitude:crd.latitude,
                        longitude:crd.longitude,
                        altitude:crd.altitude,
                        altitudeAccuracy:crd.altitudeAccuracy,
                        heading:crd.heading,
                        speed:crd.speed,
                    },()=>{
                        const arrived = this.checkLocation()
                        // console.log("arrived",arrived)
                        if(arrived){
                            this.visited()
                        }
                    })
            } else {
                // console.log("Closer")
                this.setState({gettingLocation:false,locationFeedBack:"Please Move Closer"})
            }
            resolve(true)
    } 
    const error = (err) => {
        this.setState({cannotgettingLocation:true})
        console.warn(`ERROR(${err.code}): ${err.message}`);
        reject(err)
    }
    let GEOID = navigator.geolocation.getCurrentPosition(success, error, options);
    ORIENTATIONCOUNTER=0
    LOCATIONCOUNTER=0
    window.addEventListener("deviceorientationabsolute", (event)=>this.handleOrientation(event), true);
    this.setState({gettingLocation:true,GEOID:GEOID})
    })
}

getLocationAverage() {
    return new Promise(async (resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      };
      let collectGoal = 20
      let count = 0;
      let lat = 0;
      let long = 0;
      let acc = 0;
      let alt = 0;
      let altAcc = 0;
      let head = 0;
      let speed = 0;
      const startTime = new Date()
  
      const success = (pos) => {
        
            const crd = pos.coords;
        // console.log("getLocation");
  
        lat += crd.latitude;
        long += crd.longitude;
        acc += crd.accuracy;
        alt += crd.altitude;
        altAcc += crd.altitudeAccuracy;
        head += crd.heading;
        speed += crd.speed;
  
        count++;
  
        if (count === collectGoal || new Date() - startTime >= 5000) {
          lat /= count;
          long /= count;
          acc /= count;
          alt /= count;
          altAcc /= count;
          head /= count;
          speed /= count;
  
          if (
            this.state.latitude !== lat ||
            this.state.longitude !== long ||
            this.state.heading !== head ||
            this.state.speed !== speed
          ) {
            this.setState(
              {
                newSnap: false,
                accuracy: acc,
                latitude: lat,
                longitude: long,
                altitude: alt,
                altitudeAccuracy: altAcc,
                heading: head,
                speed: speed,
              },
              () => {
                if(!this.state.arrived){
                    const arrived = this.checkLocation();
                    if (arrived) {
                    this.visited();
                    }
                }
                this.stopGeoWatch()
              }
            );
          } else {
            console.log("Closer");
            this.setState({
              locationFeedBack: "Please move around for a better reading.",
            });
          }
          resolve(true);
        } 
        // else if(count == 1){
        //     console.log("location set")
        //     this.setState(
        //         {
        //           
        //           newSnap: false,
        //           accuracy: crd.accuracy,
        //           latitude: crd.latitude,
        //           longitude: crd.longitude,
        //           altitude: crd.altitude,
        //           altitudeAccuracy: crd.altitudeAccuracy,
        //           heading: crd.heading,
        //           speed: crd.speed,
        //         },
        //         () => {
                  
        //         }
        //       );
        // }
      };
  
      const error = (err) => {
        const { code } = err;
        let feedback = ""
        switch (code) {
            case "TIMEOUT":
            // Handle timeout.
            
            break;
            case "PERMISSION_DENIED":
            // User denied the request.
            feedback = "Please grant location permissions to this site"
            break;
            case "POSITION_UNAVAILABLE":
            // Position not available.
            feedback = "Cannot get Location"
            break;
        }
        this.setState({ cannotgettingLocation: true, gettingLocation:false ,locationFeedBack:feedback});
        console.warn(`ERROR(${err.code}): ${err.message}`);
        reject(err);
        
      };
  
      let GEOID = navigator.geolocation.watchPosition(success, error, options);
      ORIENTATIONCOUNTER = 0;
      LOCATIONCOUNTER = 0;
      window.addEventListener(
        "deviceorientationabsolute",
        (event) => this.handleOrientation(event),
        true
      );
      this.setState({ gettingLocation: true, GEOID: GEOID, locationFeedBack:"Please 5 seconds to verify your Location"  });
    });
  }
stopGeoWatch() {
    navigator.geolocation.clearWatch(this.state.GEOID);
    this.setState({GEOID:-1,gettingLocation:false})
  }



async giveUserPoints(){
    return new Promise(async (resolve, reject) =>  {
        try{
            if(this.state.selectedLocation && this.state.selectedLocation.availablePoints>=10 ){
                const pointsCollection = collection(db,"userPoints")
                // console.log(this.state.user.uid,this.state.selectedLocation)
                let q = query(pointsCollection,where("userId", "==", this.state.user.uid))
                getDocs(q).then(async (res)=>{
                    const filteredPoints = await Promise.all(res.docs.map(async (doc)=>({
                        ...doc.data(),
                        id: doc.id
                    })));
                    this.setState({userPoints:filteredPoints[0]},async ()=>{
                        //check if points are still available
                        let userPoints = filteredPoints[0]
                        let location = this.state.selectedLocation
                        console.log(userPoints, location, this.state.selectedLocation.id)
                        const dataDoc = doc(db,"locations",this.state.selectedLocation.id)
                        let newLocation = await updateDoc(dataDoc,{
                            availablePoints:location.availablePoints-10,
                            totalVisits:location.totalVisits+1,
                        })
                        const userPointsDoc = doc(db,"userPoints",this.state.userPoints.id)
                        await updateDoc(userPointsDoc,{
                            totalPointsEarned:userPoints.totalPointsEarned+10,
                            totalVisits:userPoints.totalVisits+1,
                        })
                        resolve(true)
                    })
                })
            }
        } catch(error){
            console.log(error)
            reject(false) 
        }
    })
    
}



visited(){
    try{
        const visitsCollection = collection(db,"visits")
        // console.log(this.state.user.uid,this.state.selectedLocation)
        let q = query(visitsCollection,where("ownerUserId", "==", this.state.user.uid),where("locationId", "==", this.state.selectedLocation.id))
        getDocs(q).then(async (res)=>{
            const filteredVisits = await Promise.all(res.docs.map(async (doc)=>({
                ...doc.data(),
                id: doc.id
            })));
            if(filteredVisits.length>0){
                const visitsDoc = doc(db, "visits", filteredVisits[0].id)
                const timestamp = serverTimestamp();
                await updateDoc(visitsDoc, {dateVisited:timestamp}) 
                this.giveUserPoints().then(()=>{
                    this.loadLocations()
                    return
                })
            } else {
                return false
            }
        })
        
    } catch(error){
        console.log(error)
        return false
    }
}

// checkLocation() {
//     if(this.state.selectedLocation){
//         console.log("checkLocation")
        
//         const radius = this.state.selectedLocation.radius; // feet
//         const earthRadius = 6371000; // meters
//         const latDistance = this.toRadians(this.state.selectedLocation.latitude - this.state.latitude);
//         const lonDistance = this.toRadians(this.state.selectedLocation.longitude - this.state.longitude);
//         const a =
//         Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
//         Math.cos(this.toRadians(this.state.latitude)) *
//             Math.cos(this.toRadians(this.state.longitude)) *
//             Math.sin(lonDistance / 2) *
//             Math.sin(lonDistance / 2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         const distance = earthRadius * c;
//         let arrived = distance <= radius
//         let locationFeedBack = ""
//         if(arrived){
//             this.setState({arrived:arrived,locationFeedBack:"Arrived",buttonClass:"rounded-md text-white font-bold p-3 w-full mb-5 bg-green-600 hover:bg-green-700",})
//         } else {
//             this.setState({arrived:arrived,locationFeedBack:"Please Move Closer",buttonClass:"rounded-md text-white font-bold p-3 w-full mb-5 bg-yellow-500 hover:bg-yellow-400"})
//         }
        
//         return arrived;  
        
//     }
//   }

  
checkLocation() {
    if (this.state.selectedLocation) {
    //   console.log("checkLocation");
      const latitude = this.state.latitude
      const longitude = this.state.longitude;
      const radius = this.state.selectedLocation.radius; // meters
      const lat1 = this.toRadians(latitude);
      const lat2 = this.toRadians(this.state.selectedLocation.latitude);
      const lon1 = this.toRadians(longitude);
      const lon2 = this.toRadians(this.state.selectedLocation.longitude);
      const deltaLat = lat2 - lat1;
      const deltaLon = lon2 - lon1;
      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371000 * c; // earth's radius in meters
      const arrived = distance <= radius;
      const locationFeedBack = arrived ? "Arrived" : "Please Move Closer";
      const buttonClass = arrived
        ? "rounded-md text-white font-bold p-3 w-full mb-5 bg-green-600 hover:bg-green-700"
        : "rounded-md text-white font-bold p-3 w-full mb-5 bg-yellow-500 hover:bg-yellow-400";
      this.setState({ arrived, locationFeedBack, buttonClass });
      return arrived;
    }
  }

componentDidMount() {
    this.setState({loading:true})
    getUser().then((user)=>{
        this.setState({user:user},()=>{
            this.getLocation().then(()=>{
                this.loadLocations().then(()=>{
                    this.loadAllHours().then(()=>{
                        this.setState({loading:false})
                    })
                })
            })
 
        })

    }).catch((error)=>{
        window.location.replace("https://pindasher.com/");
    });
    
}


toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

sortLocationsByDistance(currentLat, currentLong, locations) {
    return new Promise(async (resolve, reject) =>  {
        // Loop through each location and calculate the distance to the current location
        // console.log(locations)
        const sortedLocations = locations.map(location => {
            const lat1 = this.toRadians(currentLat);
            const lon1 = this.toRadians(currentLong);
            const lat2 = this.toRadians(location.latitude);
            const lon2 = this.toRadians(location.longitude);

            const dlon = lon2 - lon1;
            const dlat = lat2 - lat1;

            const a =
            Math.pow(Math.sin(dlat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = 6371 * c; // Earth's radius is approximately 6,371 kilometers

            return { ...location, distance };
        });

        // Sort the locations by distance
        sortedLocations.sort((a, b) => a.distance - b.distance);

        resolve(sortedLocations);
    }) 
  }
  


    render() {
        return <div>
           {
                this.state.gettingLocation?
                <div className="fixed" style={{bottom:"110px", left:"12px"}} onClick={()=>{
                    this.setState({testing:true})
                }}>
                    <span className="absolute flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <div className="relative flex justify-center items-center rounded-full h-5 w-5 bg-sky-500">
                            <svg  className="w-3 h-3"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="white" d="M80.3 44C69.8 69.9 64 98.2 64 128s5.8 58.1 16.3 84c6.6 16.4-1.3 35-17.7 41.7s-35-1.3-41.7-17.7C7.4 202.6 0 166.1 0 128S7.4 53.4 20.9 20C27.6 3.6 46.2-4.3 62.6 2.3S86.9 27.6 80.3 44zM555.1 20C568.6 53.4 576 89.9 576 128s-7.4 74.6-20.9 108c-6.6 16.4-25.3 24.3-41.7 17.7S489.1 228.4 495.7 212c10.5-25.9 16.3-54.2 16.3-84s-5.8-58.1-16.3-84C489.1 27.6 497 9 513.4 2.3s35 1.3 41.7 17.7zM352 128c0 23.7-12.9 44.4-32 55.4V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V183.4c-19.1-11.1-32-31.7-32-55.4c0-35.3 28.7-64 64-64s64 28.7 64 64zM170.6 76.8C163.8 92.4 160 109.7 160 128s3.8 35.6 10.6 51.2c7.1 16.2-.3 35.1-16.5 42.1s-35.1-.3-42.1-16.5c-10.3-23.6-16-49.6-16-76.8s5.7-53.2 16-76.8c7.1-16.2 25.9-23.6 42.1-16.5s23.6 25.9 16.5 42.1zM464 51.2c10.3 23.6 16 49.6 16 76.8s-5.7 53.2-16 76.8c-7.1 16.2-25.9 23.6-42.1 16.5s-23.6-25.9-16.5-42.1c6.8-15.6 10.6-32.9 10.6-51.2s-3.8-35.6-10.6-51.2c-7.1-16.2 .3-35.1 16.5-42.1s35.1 .3 42.1 16.5z"/></svg>
                        </div>
                    </span>
                </div>
                :
                <></>
            }
            {/* {
                this.state.testing?
                <div>
                    <p>lat:{this.state.latitude}</p>
                    <p>lon:{this.state.longitude}</p>
                    <p>accuracy:{this.state.accuracy}</p>
                    <p>altitude:{this.state.altitude}</p>
                    <p>altitude Accuracy:{this.state.altitudeAccuracy}</p>
                    <p>heading:{this.state.heading}</p>
                    <p>speed:{this.state.speed}</p>
                    <p>alpha:{this.state.alpha}</p>
                    <p>beta:{this.state.beta}</p>
                    <p>gamma:{this.state.gamma}</p>
                    <Map render={true} latitude={this.state.latitude} longitude={this.state.longitude}/>
                    <button className="mb-5 justify-center items-center rounded-md bg-gray-500 text-white font-bold p-3 w-full"
                    onClick={()=>{
                        this.resetVisit()
                    }}>reset location</button>
                    <button className="mb-5 justify-center items-center rounded-md bg-gray-500 text-white font-bold p-3 w-full"
                    onClick={async ()=>{
                        this.giveUserPoints()
                    }}>test</button>
                </div>
                :
                <></>
            } */}
            
            
            <main className='p-5 w-full'>
            <div className={'flex flex-col w-full justify-center items-center rounded-md bg-gray-400 text-white font-bold p-1 mb-5'}>
                <p className='text-center text-sm'>Tips:</p>
                <p className='text-center'>{this.state.tips[this.state.randomTip]}</p>  
                
            </div>
            {this.state.loading?
                <h1 className='text-center w-5/6 font-bold text-3xl'>Loading...</h1>
                :
                <div>
                     {
                        this.state.selectedLocation?
                            <div>
                                <div className='flex justify-between'>
                                    <div className="w-1/6" onClick={()=>{
                                        scrollToTop()
                                        this.setState({selectedLocation:null,buttonClass:"",locationFeedBack:"",arrived:false})
                                    }}>
                                        <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z"/></svg>
                                    </div>
                                    <h1 className='text-center w-5/6 font-bold text-3xl mb-5'>Location Info</h1>
                                </div>
                                <div  className='bg-white p-5 rounded-md mb-5'>
                                    {
                                        this.state.selectedLocation.logoURL?
                                        <div className='flex'>
                                            <div className='bg-gray-300 h-16 w-1/2 rounded-md mb-4' style={{backgroundImage:`url('${this.state.selectedLocation.logoURL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                            <div className='w-1/2 p-1'>
                                                <h2 className='font-bold text-l md:text-xl'>{this.state.selectedLocation.name}</h2>
                                                <p>{this.state.selectedLocation.category}</p>
                                            </div>
                                        </div>
                                        :
                                        <div className='w-1/2 p-1'>
                                            <h2 className='font-bold text-l md:text-xl'>{this.state.selectedLocation.name}</h2>
                                            <p>{this.state.selectedLocation.category}</p>
                                        </div>
                                    }
                                    
                                    <Map render={this.state.selectedLocation.latitude && this.state.selectedLocation.longitude } latitude={this.state.selectedLocation.latitude} longitude={this.state.selectedLocation.longitude}/>
                                    {
                                        this.state.listOfVisitedIds.includes(this.state.selectedLocation.id)?
                                        <button disabled={true} className='rounded-md bg-green-600 text-white font-bold p-3 w-full mb-5' 
                                        ><p>You have claimed these points</p>
                                        <p className='text-sm'>Check back later when more points are available</p></button>
                                        :
                                        <>
                                            {
                                                !this.state.cannotgettingLocation?
                                                <>
                                                    {
                                                        this.state.selectedLocationIsOpen?
                                                        <button disabled={this.state.arrived} className={this.state.buttonClass?this.state.buttonClass:"rounded-md text-white font-bold p-3 w-full mb-5 bg-sky-900 hover:bg-sky-700"}
                                                        onClick={()=>{
                                                            if(this.state.selectedLocation){   
                                                                // console.log("There")   
                                                                this.getLocationAverage();
                                                                
                                                            }
                                                        }}
                                                    >{this.state.locationFeedBack?this.state.locationFeedBack: "Verify Location to Claim 10 Points"}</button>
                                                    :
                                                    <button disabled={true} className='rounded-md bg-gray-600 text-white font-bold p-3 w-full mb-5' 
                                                    >CLOSED Visit later to Claim 10 points</button>
                                                    }
                                                </>
                                                :
                                                <button disabled={true} className="flex flex-col mb-5 justify-center items-center rounded-md bg-gray-500 text-white font-bold p-3 w-full mb-5'"
                                                    >
                                                    <p>Cannot access your location</p>
                                                    <p className='text-sm'>Try refreshing the page or check your browser permissions</p>
                                                </button>
                                            }
                                        </>
                                    }
                                    <div className="flex justify-between mb-2">
                                        <div className={'flex flex-col w-full justify-center items-center rounded-md bg-gray-400 text-white font-bold p-1'}>
                                            <p className='text-center text'>Apx Diameter in Feet: {this.state.selectedLocation.radius*2}</p>  
                                            <p className='text-sm'> </p>
                                        </div>
                                    </div>
                                   
                                    <div className="flex justify-between">
                                        
                                        <div className={this.state.selectedLocation.availablePoints>=50?'flex flex-col w-1/2 justify-center items-center rounded-md bg-green-600 text-white font-bold p-1':'flex flex-col w-1/2 justify-center items-center rounded-md bg-yellow-500 text-white font-bold p-1'}>
                                            <p className='text-center text-sm'>Available Points:</p>  
                                            <p>{this.state.selectedLocation.availablePoints}</p>
                                        </div>
                                        <div className={this.state.selectedLocationIsOpen?'flex w-1/2 justify-center ml-3 items-center rounded-md bg-sky-600 text-white font-bold p-1':'flex w-1/2 justify-center ml-3 items-center rounded-md bg-red-700 text-white font-bold p-3'}>
                                        {this.state.selectedLocationIsOpen?
                                            <div className="text-center">
                                                <p>Open</p>
                                            </div>
                                            :
                                            <div className="text-center">
                                                <p>Closed</p>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between flex-wrap mt-5 ">

                                    {
                                        Object.keys(this.state.selectedLocationHours).sort((a,b)=>{
                                            let days=['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
                                            let aDay = -1
                                            let bDay = -1
                                            if(days.includes(String(a))){
                                                aDay = days.indexOf(String(a))
                                            }
                                            if(days.includes(String(b))){
                                                bDay = days.indexOf(String(b))
                                            }
                                           
                                            if(aDay>bDay){
                                                return 1
                                            }
                                            if(aDay<bDay){
                                                return -1
                                            }
    
                                            return 0
                                           
                                        }).map((key, index)=> {
                                            let day = this.state.selectedLocationHours[key]
                                            if(key.includes("day")){
                                                return (
                                                    <div key={index} className="bg-gray-300 p-1 rounded-sm text-center text-sm mb-3"  style={{width:"77px"}}>
                                                        <p>{key.charAt(0).toUpperCase()+key.slice(1)}</p>
                                                        {day.hourStart!=-1?this.convertHourToString(day.hourStart)+"-"+this.convertHourToString(day.hourEnd):"Closed"}
                                                    </div>
                                                    
                                                    )
                                            }
                                        })
                                    }
                                    </div>
                             
                                    {
                                        this.state.selectedLocation.img1URL?
                                        <div className='bg-gray-300 h-48 w-full rounded-md mb-4 mt-4' style={{backgroundImage:`url('${this.state.selectedLocation.img1URL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                        :
                                        <></>
                                    }
                                    <p>{this.state.selectedLocation.description}</p>
                                    {
                                        this.state.selectedLocation.img2URL?
                                        <div className='bg-gray-300 h-48 w-full rounded-md mb-4 mt-4' style={{backgroundImage:`url('${this.state.selectedLocation.img2URL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                        :
                                        <></>
                                    }
                                    {
                                        this.state.selectedLocation.websiteURL?
                                        <a href={this.state.selectedLocation.websiteURL} target="_blank" onClick={()=>{
                                            this.websiteVisit()
                                        }}>
                                            <button className='flex justify-center items-center rounded-md bg-sky-900 text-white font-bold p-3 w-full hover:bg-sky-700'>
                                                <svg className='w-5 h-5 mr-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>
                                                <span>Visit Us Virtually</span>
                                            </button>
                                        </a>
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                       
                        :
                        <div>
                            <h1 className='text-center font-bold text-3xl mb-5'>Explore</h1>
                            {
                                this.state.locations.map((location,index)=>{
                                    if(location.active && location.availablePoints>0){
                                        let [isOpen , hoursOpen] = this.isOpen(location.id)
                                        return(
                                            <div key={index} className='bg-white p-5 rounded-md mb-5 cursor-pointer'
                                            onClick={()=>{
                                                let hours=this.state.hoursOpen[this.state.hourLocationIndex.indexOf(location.id)]
                                                this.setState({selectedLocation:location,selectedLocationHours:hours,selectedLocationIsOpen:this.isOpen(location.id)[0]},()=>{
                                                    scrollToTop()
                                                    this.createVisitLog()
                                                })
                                            }}>
                                                {
                                                    location.img1URL?
                                                    <div className='bg-gray-300 h-48 w-full rounded-md mb-4 mt-4' style={{backgroundImage:`url('${location.img1URL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                                    :
                                                    <></>
                                                }
                                                {
                                                    location.logoURL?
                                                    <div className='flex'>
                                                        <div className='bg-gray-300 h-16 w-1/2 rounded-md mb-4' style={{backgroundImage:`url('${location.logoURL}')`,backgroundRepeat:"no-repeat",backgroundPosition:"center", backgroundSize:"cover"}}></div>
                                                        <div className='w-1/2 p-1'>
                                                            <h2 className='font-bold text-l md:text-xl'>{location.name}</h2>
                                                            <p>{location.category}</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='w-1/2 p-1'>
                                                        <h2 className='font-bold text-l md:text-xl'>{location.name}</h2>
                                                        <p>{location.category}</p>
                                                    </div>
                                                }
                                                

                                                <div className="flex justify-between">
                                                    {
                                                        this.state.listOfVisitedIds?.includes(location.id)?
                                                        <div className='flex flex-col w-1/2 justify-center items-center rounded-md bg-green-600 text-white font-bold p-1'>
                                                            <svg className="h-7 mr-1 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="white" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                                                        </div>
                                                        :
                                                        <div className={location.availablePoints>=50?'flex flex-col w-1/2 justify-center items-center rounded-md bg-green-600 text-white font-bold p-1':'flex flex-col w-1/2 justify-center items-center rounded-md bg-yellow-500 text-white font-bold p-1'}>
                                                            <p className='text-center text-sm'>Available Points:</p>  
                                                            <p>{location.availablePoints}</p>
                                                        </div>
                                                    }
                                                    
                                                    <div className={isOpen?'flex w-1/2 justify-center ml-3 items-center rounded-md bg-sky-600 text-white font-bold p-1':'flex w-1/2 justify-center ml-3 items-center rounded-md bg-red-700 text-white font-bold p-3'}>
                                                    {isOpen?
                                                        <div className="text-center">
                                                            <p>Open</p>
                                                            <p>{hoursOpen}</p>
                                                        </div>
                                                        :
                                                        <div className="text-center">
                                                            <p>Closed</p>
                                                            <p>{hoursOpen}</p>
                                                        </div>
                                                        }                                       
                                                    </div>
                                                </div>
                                            </div>
                                        )

                                    } else {
                                        return null
                                    }
                                    
                                })
                            }
                        </div>
                    }
                </div>
            }
            </main>
            <Nav />
        </div>;
    }
}



export default Explore;