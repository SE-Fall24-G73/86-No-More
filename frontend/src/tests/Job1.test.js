import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import { configureStore } from '../store'
import Job1 from '../components/Job1'

const store = configureStore()

test('createJob', () => {
    const wrapper = shallow(<createJob />)
    expect(wrapper).toMatchSnapshot()
})

const job = {
    _id: 1,
    name: 'test',
    status: '0',
    location: 'test',
    description: 'test',
    pay: 'test',
    schedule: 'test',
    managerid: 'test',
}

const user = {
    _id: 1,
}

test('Job', () => {
    const wrapper = shallow(
        <Provider store={store}>
            <Job1 job={job} />
        </Provider>
    )
})

test('render', () => {
    const wrapper = mount(
        <Provider store={store}>
            <Job1 menu={job} />
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})

test('HandleApplyTest', () => {
    const wrapper = mount(
        <Provider store={store}>
            <Job1 menu={job} auth={{ user }} />
        </Provider>
    )
})
