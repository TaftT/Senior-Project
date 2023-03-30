import React from 'react';
import {Link} from "react-router-dom"
import {db,getUser} from '../config/firebase'
import {getDocs,collection, query, where} from "firebase/firestore"
import Nav from '../components/nav'
import Header from '../components/header'

const propTypes = {};

const defaultProps = {};

/**
 * 
 */
class MyLocations extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        user:{},
        locations:[]
    };
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

componentDidMount() {
    getUser().then((user)=>{
        console.log(user)
        this.setState({user:user},()=>{
            this.loadLocations()
        })

    }).catch((error)=>{
        window.location.replace("http://localhost:3000");
    });
    
}

    render() {
        return (
        <>
            <Header />
            <main className='p-5 w-full'>
                <h1 className='text-center font-bold text-3xl mb-5'>My Locations</h1>
 
                <Link to="/newLocation">
                    <button className='rounded-md bg-sky-900 text-white font-bold p-3 w-full mb-5 hover:bg-sky-700'>New Location</button>
                </Link>
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
                                            this.setState({locationConfirmed:true})
                                        }}
                                    >
                                        <svg className='w-6 h-6'  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M416 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/></svg>
                                    </button>
                                    <div className='flex justify-center rounded-md items-center text-white bg-gray-500 w-1/3 ml-1 mr-1 text-center font-bold text-xl'>{location.availablePoints}</div>
                                    <button className='flex justify-center  items-center rounded-md bg-sky-900 text-white font-bold p-3 w-1/3 hover:bg-sky-700'
                                        onClick={()=>{
                                            this.setState({position:{},resetPin:true,locationConfirmed:false})
                                        }}
                                    >
                                        <svg className='w-6 h-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"/></svg>
                                    </button>
                                </div>
                                
                                

                                <div className="flex ">
                                    <button className='flex justify-center items-center rounded-md bg-yellow-500 text-white font-bold p-3 w-1/2 hover:bg-yellow-400'
                                        onClick={()=>{
                                            this.setState({locationConfirmed:true})
                                        }}
                                    >
                                    Edit</button>
                                    <button className='flex justify-center ml-3 items-center rounded-md bg-red-700 text-white font-bold p-3 w-1/2 hover:bg-red-500'
                                        onClick={()=>{
                                            this.setState({position:{},resetPin:true,locationConfirmed:false})
                                        }}
                                    >Delete</button>
                                </div>
                            </div>
                        )
                    })
                }
            </main>
            
            <Nav />
        </>)
    }
}

// #endregion

export default MyLocations;

