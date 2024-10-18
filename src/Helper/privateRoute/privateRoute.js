import React from 'react'
import {
    Outlet,
    Navigate
} from 'react-router-dom'
import RoutingPaths from 'Helper/routingPath'

const PrivateRoutes = () => {
    let auth = localStorage.getItem('session')
    return (
        auth ?
            <Outlet /> :
            <Navigate to={RoutingPaths.login}/>
    )
}

export default PrivateRoutes