import { PureComponent } from "react"
import { Navigate, Route, Routes } from 'react-router-dom'

import Admin from './components/Admin'
import Home from './components/Home'
import Login from './components/Login'

import './App.scss'

class App extends PureComponent {
    render() {
        return (
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/admin' element={<Admin />} />
                <Route path='*' element={<Navigate replace to='/home' />} />
            </Routes>
        )
    }
}

export default App
