import React from 'react';
import Paper from '@material-ui/core/Paper';

import './Main.css'
import { Redirect, Route, HashRouter as Router, Switch as RouterSwitch } from 'react-router-dom';
import { AppBar, Switch, Toolbar, Typography } from '@material-ui/core';
import NotificationManager from '../common/notificationsManager';
import Games from '../games/Games';
import Game from '../games/Game';


const Main = () => {

    //const match = useRouteMatch()

    const [checked, setChecked] = React.useState(false)
    
    NotificationManager.subscribed.then(
        value => setChecked(value)
    )

    async function toggleChecked(){
        if(!checked){
            const response = await NotificationManager.subscribe()
            if(response.status === 1){
                setChecked(prev => !prev)
            }
            else{
                console.log(response.message)
            }
        }
        else {
            const response = await NotificationManager.unsubscribe()
            console.log(response)
            setChecked(prev => !prev)
        }

    }



    return <div className="main-container">
        <AppBar position="static" className="appbar">
            <Toolbar style={{display: "flex", justifyContent: "space-between"}}>
                <a href="#/games" style={{display: "flex"}}>
                    <img src="assets/images/white-icon-512x512.png" alt="" className="toolbar-icon" srcSet="assets/images/icon.svg"/>
                    <Typography variant="h6" className="main-title" >
                        gamehub
                    </Typography>
                </a>
                <div style={{display: "flex"}}>
                    <span style={{marginRight: "10px"}}>
                        Notificaciones
                    </span>     
                    <Switch size="small" checked={checked} onChange={toggleChecked} color="secondary" />
                </div>
            </Toolbar>
        </AppBar>
        <div style={{ display: "flex", height: "min-content", backgroundColor: "#f5f5f5", paddingBottom: '50px' }}>

            <Paper style={{ width: "95%", margin: "10px auto", height: "min-content"}} elevation={3}>
                <Router>
                    <RouterSwitch>
                        <Route path="/games" exact={true}>
                            <Games></Games>
                        </Route>
                        <Route path="/games/:id" exact={true} component={Game}>
                        </Route>
                        <Redirect path="" to="/games" />
                    </RouterSwitch>
                </Router>
            </Paper>
        </div>
    </div >
}

export default Main