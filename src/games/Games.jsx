import React, { useEffect, useState } from 'react'
import GamesAPI from './GamesAPI'


import './Games.css'
import GameItem from './GameItem'
import { InputAdornment, OutlinedInput, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';

let gamesWithoutFilter = []

const Games = (props) => {
    const [filter, setFilter] = useState('')

    const [games, setGames] = useState([])

    const [gamesDiscount, setGamesDiscount] = useState([])

    const [loadingGames, setLoadingGames] = useState(false)

    

    useEffect(() => {
        async function getGames() {
            setLoadingGames(true)
            const response = await GamesAPI.getGames()
            if (response.ok) {
                const newGames = (await response.json()).data
                const discountGames = await GamesAPI.getGamesWithDiscount(5, newGames)
                GamesAPI.orderGamesStoresByPrice(newGames)
                console.log(newGames)
                setGames(newGames)
                gamesWithoutFilter = newGames;

                setGamesDiscount(discountGames)
            }
            setLoadingGames(false)
        }
        getGames();
    }, [props])

    useEffect(() => {
        setGames(gamesWithoutFilter.filter(game => game.name.toLowerCase().includes(filter.toLowerCase())))
    }, [filter])

    const handleFilterInput = (e) => {
        setFilter(e.target.value)
    }



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
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap"}}>
            <h1 className="games-container-title">Todos los juegos</h1>
            <OutlinedInput placeholder="Buscar juego..." className="games-search" onChange={handleFilterInput} variant="outlined"
            endAdornment={
                <InputAdornment position="end">
                    <SearchIcon></SearchIcon>
                </InputAdornment>
              }
            style={{margin: "auto 0", width: "50%", minWidth: "200px"}}></OutlinedInput>
        </div>
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