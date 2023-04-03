import React from 'react';

let ORIENTATIONCOUNTER = 0
let LOCATIONCOUNTER = 0

class LocationGetter extends React.Component {
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
        timer:false,
        reset:false,
        gettingLocation:false,
        error:"",
    };
}
handleOrientation(event) {
    const absolute = event.absolute;
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;
    if(absolute && alpha % 1 !== 0 && beta % 1 !== 0 && gamma % 1 !== 0 && alpha<180 && beta<180 && gamma<100){
        ORIENTATIONCOUNTER+= 1
    }
    if(ORIENTATIONCOUNTER===50){
        console.log(absolute,alpha,beta,gamma)
        let newError=this.state.error + absolute+alpha+beta+gamma 
        this.setState({error:newError})
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

reset(){
    this.setState({
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
        timer:false,
        reset:true
    })
    this.props.resetCallBack()
}
componentDidUpdate(){
    if(this.props.reset){
        this.reset()

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
        
        const mylocation =' Latitude: ' + latitude + ' Longitude: ' + longitude;
        let newError=this.state.error + mylocation 
        this.setState({error:newError})
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
    window.addEventListener("deviceorientationabsolute", (event)=>this.handleOrientation(event), true);
    this.setState({GEOID:GEOID})

}

stopGettingLocation() {
    console.log("stopGettingLocation")
    if(this.state.GEOID>=0){
        navigator.geolocation.clearWatch(this.state.GEOID)
        this.setState({GEOID:-1},()=>{
            if(this.state.finishedGettingOrientation && this.state.finishedGettingLocation && !this.state.sentData){
                this.setState({gettingLocation:false,sentData:true,buttonText:"Location Collected"},()=>{
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
        return (<>
        <p>{this.state.error}</p>
        <button disabled={this.state.disableButton} 
        className={this.state.disableButton? 'flex justify-center items-center rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5':'flex justify-center items-center rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700'} 
        onClick={()=>{
            
            this.setState({gettingLocation:true,disableButton:true,buttonText:"Getting Your Location",reset:false},()=>{
                this.getLocation()
                setTimeout(()=>{
                    console.log("here",this.state.sentData)
                    if(!this.state.sentData && !this.state.reset){
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
             {
                this.state.gettingLocation?
                <div className="fixed" style={{bottom:"110px", left:"12px"}}>
                    <span className="absolute flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <div className="relative flex justify-center items-center rounded-full h-5 w-5 bg-sky-500">
                            <svg  className="w-3 h-3"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="white" d="M80.3 44C69.8 69.9 64 98.2 64 128s5.8 58.1 16.3 84c6.6 16.4-1.3 35-17.7 41.7s-35-1.3-41.7-17.7C7.4 202.6 0 166.1 0 128S7.4 53.4 20.9 20C27.6 3.6 46.2-4.3 62.6 2.3S86.9 27.6 80.3 44zM555.1 20C568.6 53.4 576 89.9 576 128s-7.4 74.6-20.9 108c-6.6 16.4-25.3 24.3-41.7 17.7S489.1 228.4 495.7 212c10.5-25.9 16.3-54.2 16.3-84s-5.8-58.1-16.3-84C489.1 27.6 497 9 513.4 2.3s35 1.3 41.7 17.7zM352 128c0 23.7-12.9 44.4-32 55.4V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V183.4c-19.1-11.1-32-31.7-32-55.4c0-35.3 28.7-64 64-64s64 28.7 64 64zM170.6 76.8C163.8 92.4 160 109.7 160 128s3.8 35.6 10.6 51.2c7.1 16.2-.3 35.1-16.5 42.1s-35.1-.3-42.1-16.5c-10.3-23.6-16-49.6-16-76.8s5.7-53.2 16-76.8c7.1-16.2 25.9-23.6 42.1-16.5s23.6 25.9 16.5 42.1zM464 51.2c10.3 23.6 16 49.6 16 76.8s-5.7 53.2-16 76.8c-7.1 16.2-25.9 23.6-42.1 16.5s-23.6-25.9-16.5-42.1c6.8-15.6 10.6-32.9 10.6-51.2s-3.8-35.6-10.6-51.2c-7.1-16.2 .3-35.1 16.5-42.1s35.1 .3 42.1 16.5z"/></svg>
                        </div>
                    </span>
                </div>
                :<></>
            }
        
        </button>
        
        </>);
    }
}



export default LocationGetter;