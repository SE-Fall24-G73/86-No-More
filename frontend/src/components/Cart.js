import React, { Component } from 'react'
import { connect } from 'react-redux'
import Job1 from './Job1'
import { fetchJobs, createMenu } from '../actions/job'
import { clearsearchstate } from '../actions/search'
class Cart extends Component {
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
        }
    }

    handleInputChange = (fieldName, val) => {
        this.setState({
            [fieldName]: val,
        })
    }

    handleCartTotal = (val) => {
        this.setState({
            ['cartTotal']: this.state.cartTotal + val,
        })
    }

    componentDidMount() {
        this.props.dispatch(fetchJobs())
    }
    clearSearch = () => {
        this.props.dispatch(clearsearchstate([]))
        console.log('UNMOUNT')
    }

    render() {
        const { menu } = this.props
        {console.log('eeeeeee', menu)}
        return (
            <div style={{ display: 'flex' }}>
                <h1>Menu and Cart</h1>
                <div style={{ marginLeft: '57px' }}>
                    {menu?.map((menu) => (
                        <Job1
                            menu={menu}
                            handleCartTotal={this.handleCartTotal}
                        />
                    ))}
                </div>
                <div>
                    <h1 style={{ marginLeft: '100px' }}>
                        {' '}
                        Total: {this.state.cartTotal}
                    </h1>
                    <div>
                        <button
                            style={{ marginLeft: '100px' }}
                            className="button delete-btn"
                            onClick={() => {
                                this.handleInputChange('setInput', '1')
                            }}
                        >
                            Pay
                        </button>
                        <div style={{ marginTop: '20px', marginLeft: '100px' }}>
                            {this.state.setInput === '1' ? (
                                <div>
                                    <input
                                        placeholder="Amount"
                                        style={{
                                            border: '1px solid rgba(0, 0, 0, 0.12)',
                                            height: '40px',
                                            marginTop: '20px',
                                            padding: '5px',
                                            borderRadius: '6px',
                                            fontSize: '15px',
                                        }}
                                        onChange={(e) => {
                                            this.handleInputChange(
                                                'cartChange',
                                                e.target.value
                                            )
                                        }}
                                    ></input>
                                    <h3>
                                        Get change :{' '}
                                        {this.state.cartChange -
                                            this.state.cartTotal}
                                    </h3>
                                </div>
                            ) : null}
                        </div>
                    </div>
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
export default connect(mapStateToProps)(Cart)
