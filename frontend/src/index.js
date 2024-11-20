import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './components/App'
import { configureStore } from './store'
import { Toaster } from 'react-hot-toast'

const store = configureStore()

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <Toaster />
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
)
