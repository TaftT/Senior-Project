import React from 'react';

let ORIENTATIONCOUNTER = 0
let LOCATIONCOUNTER = 0

class LocationTracker extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        disableButton:false,
        buttonText:this.props.buttonText?this.props.buttonText:"Check My Location",
        GEOID:-1,
        accuracy:0,
        latitude:0,
        longitude:0,
        altitude:0,
        heading:0,
        speed:0,
        altitudeAccuracy:0,
        alpha:0,
        beta:0,
        gamma:0,
        finishedGettingOrientation:false,
        finishedGettingLocation:false,
        sentData:false,
        timer:false
    };
}
handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    if(absolute && alpha % 1 != 0 && beta % 1 != 0 && gamma % 1 != 0 && alpha<180 && beta<180 && gamma<100){
        ORIENTATIONCOUNTER+= 1
    }
    if(ORIENTATIONCOUNTER==50){
        console.log(absolute,alpha,beta,gamma)
        this.setState({alpha:alpha,beta:beta,gamma:gamma,absoluteOrientation:absolute,finishedGettingOrientation:true},()=>{
            if(this.state.finishedGettingLocation && !this.state.sentData){
                this.setState({sentData:true,buttonText:"Location Collected"},()=>{
                    console.log("Orientation",this.state.sentData)
                    this.props.callBackSuccess({
                        accuracy:this.state.accuracy,
                        latitude:this.state.latitude,
                        longitude:this.state.longitude,
                        altitude:this.state.altitude,
                        heading:this.state.heading,
                        speed:this.state.speed,
                        altitudeAccuracy:this.state.altitudeAccuracy,
                        alpha:this.state.alpha,
                        beta:this.state.beta,
                        gamma:this.state.gamma,
                    })

                })
                
            }
        })
    }
  }

getLocation(){
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
    const success = (pos) => {
        const crd = pos.coords;
        console.log(crd)
        const accuracy = crd.accuracy
        const latitude = crd.latitude;
        const longitude = crd.longitude;
        const altitude = crd.altitude
        
        const mylocation ='Latitude: ' + latitude + ' Longitude: ' + longitude;
        console.log(mylocation)
        // this.checkLocation(crd.latitude,crd.longitude)
        // if(LOCATIONCOUNTER==0 || (latitude != this.state.latitude && longitude!==this.state.longitude && (latitude<this.state.latitude+0.5 && latitude>this.state.latitude-0.5 && longitude<this.state.longitude+0.5 && longitude>this.state.longitude-0.5))){
            // 
            LOCATIONCOUNTER+=1
            this.setState({
                accuracy:crd.accuracy,
                latitude:crd.latitude,
                longitude:crd.longitude,
                altitude:crd.altitude,
                altitudeAccuracy:crd.altitudeAccuracy,
                heading:crd.heading,
                speed:crd.speed,
            })
        // }
        
        console.log(LOCATIONCOUNTER)
        if(LOCATIONCOUNTER>1){
            this.setState({finishedGettingLocation:true},()=>{
                this.stopGettingLocation()
            })
     
        }
        
       
        return {latitude:crd.latitude,longitude:crd.longitude,accuracy:crd.accuracy}
    }
    const error = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    let GEOID = navigator.geolocation.watchPosition(success, error, options);
    ORIENTATIONCOUNTER=0
    LOCATIONCOUNTER=0
    window.addEventListener("deviceorientation", (event)=>this.handleOrientation(event), true);
    this.setState({GEOID:GEOID})

}

stopGettingLocation() {
    console.log("stopGettingLocation")
    if(this.state.GEOID>=0){
        navigator.geolocation.clearWatch(this.state.GEOID)
        this.setState({GEOID:-1},()=>{
            if(this.state.finishedGettingOrientation && this.state.finishedGettingLocation && !this.state.sentData){
                this.setState({sentData:true,buttonText:"Location Collected"},()=>{
                    console.log("Location",this.state.sentData)
                    this.props.callBackSuccess({
                        accuracy:this.state.accuracy,
                        latitude:this.state.latitude,
                        longitude:this.state.longitude,
                        altitude:this.state.altitude,
                        heading:this.state.heading,
                        speed:this.state.speed,
                        altitudeAccuracy:this.state.altitudeAccuracy,
                        alpha:this.state.alpha,
                        beta:this.state.beta,
                        gamma:this.state.gamma,
                    })

                })
            }
        })
    }
}

buttonEnable(){
    this.setState({timer:true,},()=>{
        setTimeout(()=>{
            this.setState({disableButton:false,timer:false, buttonText:this.props.buttonText?this.props.buttonText:"Check My Location"},()=>{
                
            })
        }, 5000)
    })
    

}

    render() {
        return <button disabled={this.state.disableButton} 
        className={this.state.disableButton? 'flex justify-center items-center rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5':'flex justify-center items-center rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700'} onClick={()=>{
            this.setState({disableButton:true,buttonText:"Getting Your Location"},()=>{
                this.getLocation()
                setTimeout(()=>{
                    console.log("here",this.state.sentData)
                    if(!this.state.sentData){
                        this.setState({buttonText:"We could not verify your location."},()=>{
                            this.stopGettingLocation() 
                            this.buttonEnable()
                        })
                    }
                }, 5000)
            })
        }}>
            {
                this.state.disableButton?
                // <svg className="animate-spin -ml-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                //     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                //     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                // </svg>
                <svg className='w-5 h-5 mr-3 text-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>
                :<div className="w-5"></div>
            }
            {this.state.buttonText}
            {
                this.state.disableButton && this.state.timer?
                    <svg className="animate-spin -ml-1 ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                :<div className="w-5"></div>
            }
        
        </button>;
    }
}



export default LocationTracker;