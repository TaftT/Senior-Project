import React from 'react';

class Map extends React.Component {
constructor(props) {
    super(props);

    this.state = {
    };
}

    render() {
        return (<>
            <div className="w-full mb-3  rounded-md">
                {
                    this.props.render?
                    <div >
                        <iframe className='w-full rounded-md bg-gray-300' style={{height:"350px"}} src={'https://maps.google.com/maps?q=' + this.props.latitude + ',%20' + this.props.longitude +'&t=k&z=17&ie=UTF8&iwloc=&output=embed'} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>   
                    </div>
                    :
                    <div className='w-full rounded-md bg-gray-300' style={{height:"350px"}}>
                       
                    </div>
                }
            </div>
        </>);
    }
}


// #endregion

export default Map;