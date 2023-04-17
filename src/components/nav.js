import React from 'react';
import { Link } from 'react-router-dom';


// #region constants

// #endregion

// #region styled-components
const navStyle = {
    boxShadow: '0 -10px 8px rgb(0 0 0 / 0.04)',
}

// #endregion

// #region functions

// #endregion

// #region component
const propTypes = {};

const defaultProps = {};

/**
 * 
 */
class Nav extends React.Component {
constructor(props) {
    super(props);

    this.state = {
    };
}

    render() {
        return (
            <nav className='bg-white fixed w-full bottom-0' style={navStyle}>
                <div className='flex w-full justify-between'>
                    <Link to="/myLocations" className="flex flex-col items-center justify-between cursor-pointer hover:bg-gray-100 w-1/3 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="36" viewBox="0 0 27 36" fill="none">
                            <path d="M15.1664 35.1C18.7734 30.5859 27 19.6453 27 13.5C27 6.04688 20.9531 0 13.5 0C6.04688 0 0 6.04688 0 13.5C0 19.6453 8.22656 30.5859 11.8336 35.1C12.6984 36.1758 14.3016 36.1758 15.1664 35.1ZM13.5 18C11.018 18 9 15.982 9 13.5C9 11.018 11.018 9 13.5 9C15.982 9 18 11.018 18 13.5C18 15.982 15.982 18 13.5 18Z" fill="black"/>
                        </svg>
                        <p className="text-sm">My Locations</p>
                    </Link>
                    <Link to="/explore" className="flex flex-col items-center justify-between cursor-pointer hover:bg-gray-100 w-1/3 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <g clipPath="url(#clip0_21_128)">
                            <path d="M4.05703 13.5703L4.71797 14.7234C5.30156 15.743 6.25781 16.4953 7.38984 16.8188L11.4609 17.9789C12.6703 18.3234 13.5 19.4273 13.5 20.6859V23.4914C13.5 24.2648 13.9359 24.968 14.625 25.3125C15.3141 25.657 15.75 26.3602 15.75 27.1336V29.8758C15.75 30.9727 16.7977 31.7672 17.8523 31.4648C18.9844 31.1414 19.8633 30.2344 20.1516 29.0883L20.3484 28.3008C20.6437 27.1125 21.4172 26.093 22.4789 25.4883L23.0484 25.1648C24.1031 24.5672 24.75 23.4422 24.75 22.2328V21.6492C24.75 20.7563 24.3914 19.8984 23.7586 19.2656L23.4844 18.9914C22.8516 18.3586 21.9937 18 21.1008 18H18.0703C17.2898 18 16.5164 17.7961 15.8344 17.4094L13.4086 16.0242C13.1062 15.8484 12.8742 15.5672 12.7617 15.2367C12.5367 14.5617 12.8391 13.8305 13.4789 13.5141L13.8938 13.3031C14.3578 13.0711 14.8992 13.0289 15.3914 13.1977L17.0227 13.7391C17.5992 13.9289 18.232 13.7109 18.5625 13.2117C18.893 12.7195 18.8578 12.0656 18.4781 11.6086L17.5219 10.4625C16.8188 9.61875 16.8258 8.38828 17.543 7.55859L18.6469 6.27187C19.2656 5.54766 19.3641 4.51406 18.893 3.69141L18.7242 3.39609C18.4781 3.38203 18.2391 3.375 17.993 3.375C11.468 3.375 5.93438 7.65703 4.05703 13.5703ZM32.625 18C32.625 15.4125 31.95 12.9797 30.7688 10.8633L28.9688 11.5875C27.8648 12.0305 27.2953 13.2609 27.668 14.3859L28.8562 17.9508C29.1023 18.682 29.7 19.2375 30.4453 19.4203L32.4914 19.9336C32.5758 19.3008 32.618 18.6539 32.618 18H32.625ZM36 18C36 27.9422 27.9422 36 18 36C8.05781 36 0 27.9422 0 18C0 8.05781 8.05781 0 18 0C27.9422 0 36 8.05781 36 18Z" fill="black"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_21_128">
                            <rect width="36" height="36" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                        <p className="text-sm">Explore</p>
                    </Link>
                    <Link to="/points" className="flex flex-col items-center justify-between cursor-pointer hover:bg-gray-100 w-1/3 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="39" viewBox="0 0 34 39" fill="none">
                            <path d="M0 6.09376V17.4815C0 18.7764 0.508482 20.018 1.4192 20.932L14.7763 34.3383C16.6737 36.2426 19.7473 36.2426 21.6446 34.3383L31.7763 24.1693C33.6737 22.265 33.6737 19.1801 31.7763 17.2758L18.4192 3.86954C17.5085 2.95548 16.2714 2.44513 14.9812 2.44513H3.64286C1.6317 2.43751 0 4.0752 0 6.09376ZM8.5 13.4063C7.1567 13.4063 6.07143 12.317 6.07143 10.9688C6.07143 9.62052 7.1567 8.53126 8.5 8.53126C9.8433 8.53126 10.9286 9.62052 10.9286 10.9688C10.9286 12.317 9.8433 13.4063 8.5 13.4063Z" fill="black"/>
                        </svg>
                        <p className="text-sm">Points</p>
                    </Link>
                </div> 
                
            </nav>
        )
    }
}

Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;
// #endregion

export default Nav;