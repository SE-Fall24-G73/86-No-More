import React, { Component } from 'react'
import Carousel from 'react-material-ui-carousel'
import image1 from "../images/image1.jpeg"
import img2 from "../images/img2.jpeg"
import img3 from "../images/img3.jpeg"
import img4 from "../images/img4.jpeg"
class Awareness extends Component {
    render(){
        return(
            <div style={{marginLeft: "523px",
            marginRight: "499px"}}>
            <h1> Awareness</h1>
            <Carousel >
            <div>
                <img src={img2} class="center" height={500}  width={500}/>
            </div> 
            <div>
                <img src={img3} height={500}  width={500}/>
            </div> 
            <div>
                <img src={img4} height={500}  width={500}/>
            </div> 
            <div>
                <img src={image1} height={500}  width={500}/>
            </div> 
            </Carousel>  
            </div>
        )
    }
}
export default Awareness;
