import React, { Component } from 'react'
import { connect } from 'react-redux'
import Rating from '@material-ui/lab/Rating';
class Ratings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            restname: '',
            restid: '',
            menuname: '',
            quantity: '0',
            costmenu: '',
            cartTotal: 0,
            setInput: '0',
            cartChange: '0',
            editMode: false,
            star:0
        }
    }
    handleInputChange = (fieldName, val) => {
        this.setState({
            [fieldName]: val,
        })
    }
    render(){
        const { menu } = this.props
        return(
            <div>
                <div style={{ marginLeft: '57px' }}>
                    {menu?.map((menu) => (
                       <div
                       className="post"
                       key={menu.restname}
                       style={{ width: '50vw', marginLeft: '50px' }}
                   >
                    {
                        (1>0)?(
                            <div className="post-header">
                                <div>
                                    <h4 style={{ display: 'inline-block' }}>
                                        Restaurant Name :{' '}
                                    </h4>
                                    <span style={{ marginLeft: '10px' }}>
                                        {menu.restname}
                                    </span>
                                    <Rating style={{marginLeft:"300px"}} name="half-rating" 
                                    defaultValue={menu.star} 
                                    precision={0.5} 
                                    onChange={(e)=>{this.handleInputChange('star', e.target.value)}}
                                    />
                                    
                                </div>
                                <div>
                                    <h4
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '-12px',
                                        }}
                                    >
                                        Dish :{' '}
                                    </h4>
                                    <span style={{ marginLeft: '10px' }}>
                                        {menu.menuname}
                                    </span>
                                </div>
                                <div>
                                    <h4
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '-12px',
                                        }}
                                    >
                                        Price :{' '}
                                    </h4>
                                    <span style={{ marginLeft: '10px' }}>
                                        {menu.costmenu}
                                    </span>
                                </div>
                                <div>
                                </div>
                            </div>
                        ):null
                    }
                   </div>
                    ))}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        auth: state.auth,
        results: state.search.results,
        job: state.job,
        menu: state.menu,
    }
}
export default connect(mapStateToProps)(Ratings)