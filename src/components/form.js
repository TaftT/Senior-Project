import React from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

// #region constants

// #endregion

// #region styled-components

// #endregion

// #region functions

// #endregion

// #region component

// let formFeilds = { 
//     Name:{
//         type:"text",
//         value:"this",
//         label:"This",
//         placeHolder:""
//         },
//     TextArea:{
//         type:"textarea",
//         value:"",
//         label:"This",
//         placeHolder:"Place"
//         },
//     empty:{
//         type:"password",
//         value:"",
//         label:"",
//         placeHolder:"that"
//         },
//     Checkboxs:{
//         type:"checkbox",
//         value:[false,false,false,false],
//         label:["Cool1","Cool2","Cool3","Cool4"],
//         placeHolder:""
//         },
//     Radios:{
//         type:"radio",
//         value:[false,false,false,false],
//         label:["Cool1","Cool2","Cool3","Cool4"],
//         placeHolder:""
//         },
//     select:{
//         type:"select",
//         value:["1","2","3","4"],
//         label:["Cool1","Cool2","Cool3","Cool4"],
//         placeHolder:"Select",
//         selected:"",
//         },
//     error:{
//         type:"error",
//         value:"",
//         },
        // sunday:{
        //     type:"hourrange",
        //     placeHolder:"Sunday Hours",
        //     selectedStart:-1,
        //     selectedEnd:0,
        //     },
//     Submit:{
//         type:"submit",
//         value:true,
//         label:"Sign Up",
//         placeHolder:""
//         },
// }
const propTypes = {
};

const defaultProps = {};

/**
 * 
 */
class form extends React.Component {
constructor(props) {
    super(props);

    this.state = {
        copyFields:this.props.fields,
    };
}

    render() {
        if(this.props.hideForm){
            return <></>
        }
        return (
            <form id={this.props.id} onSubmit={(e)=>{
                e.preventDefault();
                let returnVals={}
                Object.keys(this.state.copyFields).forEach((key) => {
                    let field = this.state.copyFields[key]
                    if(field.type==='text' || field.type==='password' || field.type==='number' || field.type==='email' || field.type==='tel'){
                        returnVals[key]=field.value
                    } else if(field.type==='checkbox'){
                        returnVals[key]=field.value
                    } else if(field.type==='radio'){
                        returnVals[key]=field.value
                        for (let i = 0; i < field.value.length; i++) {
                            if(field.value[i]){
                                returnVals[key]=field.label[i]
                                break
                            }
                            
                        }
                    }else if(field.type==='number'){
                        // console.log(field)
                        if(field.selected){
                            returnVals[key]=field.selected
                        } else {
                            returnVals[key]=field.value[0]
                        }
                        
                    } else if(field.type==='select'){
                        // console.log(field)
                        if(field.selected){
                            returnVals[key]=field.selected
                        } else {
                            returnVals[key]=field.value[0]
                        }
                        
                    }else if(field.type==='hourrange'){
                        // console.log(field)
                        if(field.selectedStart&&field.selectedEnd){
                            returnVals[key]={hourStart:Number(field.selectedStart),hourEnd:Number(field.selectedEnd)}
                        } else {
                            returnVals[key]={hourStart:-1,hourEnd:-1}
                        }
                        
                    }else if(field.type==='textarea'){
                        returnVals[key]=field.value
                    } else {
                        
                    }
                });
                this.props.callBack(returnVals)
                }}>
                {
                    Object.keys(this.props.fields).map((name,index)=>{
                        let field =this.props.fields[name]
                        if(field.type==='text' || field.type==='password' || field.type==='email'){
                            return(
                                <div key={index} className="mb-3">
                                    {field.label?<label className="font-bold text-sm">{field.label}</label> :null }
                                    <input className='w-full p-2 rounded-md border-2' name={name} type={field.type} defaultValue={field.value} placeholder={field.placeHolder?field.placeHolder:null} onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].value = e.target.value;
                                        this.setState({copyFields:newFeilds})
                                    }}/>
                                </div>
                            )
                        } else if(field.type==='number'){
                            return(
                                <div key={index} className="mb-3">
                                    {field.label?<label className="font-bold text-sm">{field.label}</label> :null }
                                    <input className='w-full p-2 rounded-md border-2' name={name} type="number" defaultValue={field.value} max={field.max?field.max:null} min={field.min?field.min:null} placeholder={field.placeHolder?field.placeHolder:null} onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].value = e.target.value;
                                        this.setState({copyFields:newFeilds})
                                    }}/>
                                </div>
                            )
                        } else if(field.type==='tel'){
                            return(
                            <div key={index} className="mb-3">
                                    {field.label?<label className="font-bold text-sm">{field.label}</label> :null }
                                    <PhoneInput
                                        className='w-full p-2 rounded-md border-2'
                                        defaultCountry='US'
                                        name={name}
                                        placeholder={field.placeHolder?field.placeHolder:null}
                                        onChange={(val)=>{
                                            let newFeilds = this.state.copyFields;
                                            newFeilds[name].value = val;
                                            this.setState({copyFields:newFeilds})
                                        }}
                                    />
                                </div>   
                            )      
                        } else if(field.type==='checkbox'){
                            return(
                                <div key={index} className="flex justify-around flex-wrap mb-3">
                                    { field.label.map((label,jndex)=>{
                                            return(
                                               <div key={jndex} className="p-2">
                                                <label>{label}</label>
                                                <input type="checkbox" className="ml-2" name={name+label} checked={field.value[jndex]} onChange={(e)=>{
                                                     let newFeilds = this.state.copyFields;
                                                     newFeilds[name].value[jndex] = e.target.checked;
                                                     this.setState({copyFields:newFeilds})
                                                }}/>
                                               </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        } else if(field.type==='radio'){
                            return(
                                <div key={index} className="flex justify-around flex-wrap mb-3">
                                    <p  className="w-full text-center"><b>{field.placeHolder}</b></p>
                                    { field.label.map((label,jndex)=>{
                                            return(
                                               <div key={jndex}>
                                                <label>{label}</label>
                                                <input type="radio" className="ml-2" name={name} checked={field.value[jndex]} onChange={(e)=>{
                                                     let newFeilds = this.state.copyFields;
                                                     for (let k = 0; k < newFeilds[name].value.length; k++) {
                                                        newFeilds[name].value[k]=false;
                                                     }
                                                     newFeilds[name].value[jndex] = e.target.checked;
                                                     this.setState({copyFields:newFeilds})
                                                     
                                                }}/>
                                               </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }else if(field.type==='submit'){
                            return(
                                <div key={index} className="mb-3">
                                    <input className='rounded-md bg-sky-900 text-white font-bold p-3 w-full hover:bg-sky-700' type="submit" value={field.label}/>
                                </div>
                            )
                        } else if(field.type==='reset'){
                            return(
                                <div key={index} className="mb-3">
                                    <input className='rounded-md bg-gray-500 text-white font-bold p-3 w-full hover:bg-gray-700' type="reset" value={field.label}/>
                                </div>
                            )
                        } else if(field.type==='select'){
                            return(
                                <div key={index} className=" mb-3">
                                    <label className="font-bold text-sm ">{field.placeHolder}</label>
                                    <select name={name} value={this.state.copyFields[name].selected} className='w-full p-2 rounded-md border-2' onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].selected = e.target.value
                    
                                        this.setState({copyFields:newFeilds})
                                    }}>
                                        { field.value.map((value,jndex)=>{
                                                return(
                                                    <option key={jndex} value={value}>{field.value[jndex]?field.value[jndex]:value}</option>
                                                )
                                            })
                                        }   
                                    </select>
                                    
                                </div>
                            )
                        } else if(field.type==='hourrange'){
                            const timesStr =["5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"]
                            const timesNum =[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
                            return(
                                <div key={index} className="flex justify-between items-center mb-3">
                                    <label className="font-bold text-sm w-1/3">{field.placeHolder}</label>
                                    <select name={name} value={this.state.copyFields[name].selectedStart} className='w-1/3 p-2 rounded-md border-2' onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].selectedStart = e.target.value
                                        newFeilds[name].selectedEnd = -1
                                        this.setState({copyFields:newFeilds})
                                    }}>
                                        <option value={-1}>Closed</option>
                                        {
                                            timesNum.map((num,index)=>{
                                                return <option key={index} value={num}>{timesStr[index]}</option>
                                            })
                                        }
                                    </select>
                                    <select name={name} value={this.state.copyFields[name].selectedEnd} className='w-1/3 p-2 rounded-md border-2 ml-2' onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].selectedEnd = e.target.value
                    
                                        this.setState({copyFields:newFeilds})
                                    }}>
                                        <option value={-1}>{this.state.copyFields[name].selectedStart!==-1?"Select the last hour open":"Closed"}</option>
                                        {
                                            timesNum.map((num,index)=>{
                                                if(this.state.copyFields[name].selectedStart!==-1 && num>this.state.copyFields[name].selectedStart){
                                                    return <option key={index} value={num}>{timesStr[index]}</option>
                                                }
                                            })
                                        }  
                                    </select>
                                </div>
                            )
                        }else if(field.type==='textarea'){
                            return(
                                <div key={index} className=" mb-3">
                                    {field.label?<label className="font-bold text-sm">{field.label}</label> :null }
                                    <textarea rows="3" className='w-full p-2 rounded-md border-2' name={name}  defaultValue={field.value} placeholder={field.placeHolder?field.placeHolder:null} onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].value = e.target.value;
                                        this.setState({copyFields:newFeilds})
                                    }}></textarea>
                                    
                                </div>
                            )
                        } else if(field.type==='error'){
                            return(
                                <div key={index} className=" mb-3">
                                    <p className='text-red-700'>{field.value}</p>
                                </div>
                            )
                        } else if(field.type==='info'){
                            return(
                                <div key={index} className=" mb-3">
                                    <p>{field.value}</p>
                                </div>
                            )
                        }  else {
                            return(
                                <div key={index} className="mb-3">
                                    {field.label?<label className="font-bold text-sm">{field.label}</label> :null }
                                    <input className='w-full p-2 rounded-md border-2' name={name} type={field.type} defaultValue={field.value} placeholder={field.placeHolder?field.placeHolder:null} onChange={(e)=>{
                                        let newFeilds = this.state.copyFields;
                                        newFeilds[name].value = e.target.value;
                                        this.setState({copyFields:newFeilds})
                                    }}/>
                                </div>
                            )
                        }
                    
                    })
                }
            </form>
        );
    }
}

form.propTypes = propTypes;
form.defaultProps = defaultProps;
// #endregion

export default form;

