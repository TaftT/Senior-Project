import React from 'react';
import Nav from '../components/nav'
import {db,getUser,storage} from '../config/firebase'
import {getDocs,collection, query, orderBy, limit } from "firebase/firestore"

// #region constants

// #endregion

// #region styled-components

// #endregion

// #region functions

// #endregion

// #region component

class points extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        topPoints:[]
    };
}

async getTopPoints(){
    return new Promise(async (resolve, reject) => {
        try{
            const pointsCollection = collection(db,"userPoints")
            console.log(this.state.user.uid,this.state.selectedLocation)
            let q = query(pointsCollection,orderBy("totalPointsEarned", "desc"), limit(10))
            getDocs(q).then(async (res)=>{
                const filteredPoints = await Promise.all(res.docs.map(async (doc)=>({
                    ...doc.data(),
                    id: doc.id
                })));
                this.setState({topPoints:filteredPoints})
            })
        } catch(error){
            console.log(error)
            return false
        }

    })
    
}


componentDidMount() {
    this.setState({loading:true})
    getUser().then((user)=>{
        this.setState({user:user},()=>{
            this.getTopPoints().then(()=>{
                
            })
 
        })

    }).catch((error)=>{
        window.location.replace("https://pindasher.com/");
    });
    
}

    render() {
        return (
        <>
            
            <main className='p-5 w-full'>
                <h1 className='text-center font-bold text-3xl mb-5'>Leaderboard</h1>
                <h1 className='text-center font-bold text-xl mb-5'>Top Ten</h1>
                <table className="min-w-full text-left text-sm font-light bg-white">
                    <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                        <th scope="col" className="px-6 py-4">Rank</th>
                        <th scope="col" className="px-6 py-4">Username</th>
                        <th scope="col" className="px-6 py-4">Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.topPoints.map((user,index)=>{
                            return(
                                <tr key={index} className="border-b dark:border-neutral-500">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">#{index+1}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.totalPointsEarned}</td>
                                </tr> 
                            )
                        })
                    }
                    </tbody>
                </table>

            


            </main>
            
        <Nav />
        </>
                )
    }
}


export default points;