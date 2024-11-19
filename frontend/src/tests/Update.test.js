import React from 'react'
import { shallow, mount } from 'enzyme'
import { Provider } from 'react-redux'
import Update from '../components/Update'
import { configureStore } from '../store'

const store = configureStore()

const error = {}

test('render', () => {
    const wrapper = mount(
        <Provider store={store}>
            <Update error={error} />
        </Provider>
    )
    expect(wrapper).toMatchSnapshot()
})
