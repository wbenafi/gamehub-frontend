import React, { useEffect, useState } from 'react'
import GamesAPI from './GamesAPI'


import './Games.css'
import GameItem from './GameItem'
import { Paper } from '@material-ui/core'

const Games = (props) => {

    const [games, setGames] = useState([])

    const [gamesDiscount, setGamesDiscount] = useState([])

    const [loadingGames, setLoadingGames] = useState(false)

    useEffect(() => {
        async function getGames() {
            setLoadingGames(true)
            const response = await GamesAPI.getGames()
            if (response.ok) {
                const newGames = (await response.json()).data
                const discountGames = await GamesAPI.getGamesWithDiscount(6, newGames)
                GamesAPI.orderGamesStoresByPrice(newGames)
                console.log(newGames)
                setGames(newGames)

                setGamesDiscount(discountGames)
            }
            setLoadingGames(false)
        }
        getGames();
    }, [props])

    return <div className="games-container">
        <h1 className="games-container-title">Mayores descuentos</h1>
        <div className="games-items-container">
            {gamesDiscount.map(game => (
                <GameItem key={game.id} game={game}></GameItem>
            ))}

            {loadingGames === true ? (
                [...Array(6).keys()].map(i => <Paper key={i} className="game-item-container" elevation={3}>
                        <div className="game-item-img loading"></div>
                    </Paper>
                )
            ) : null}
        </div>
        <h1 className="games-container-title">Todos los juegos</h1>
        <div className="games-items-container">
            {games.map(game => (
                <GameItem key={game.id} game={game}></GameItem>
            ))}
            {loadingGames === true ? (
                [...Array(6).keys()].map(i => <Paper key={i} className="game-item-container" elevation={3}>
                        <div className="game-item-img loading"></div>
                    </Paper>
                )
            ) : null}
        </div>
    </div>
}

export default Games