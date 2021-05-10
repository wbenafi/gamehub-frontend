import { Paper } from "@material-ui/core"
import { Link } from 'react-router-dom';


const GameItem = (props) => {



    return <Paper className="game-item-container" elevation={3}>
        <img src={props.game.image_url} alt={"Imagen de " + props.game.name} className="game-item-img" />
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px', height: '100%' }}>
            <Link className="game-item-title" to={"/games/" + props.game.id}>
                {props.game.name}
            </Link>
            <div className="game-item-details">
                {props.game.discounts.length > 0 ? (
                    <a href={props.game.stores_urls[props.game.discounts[0].store]} target="_blank" rel="noreferrer" className="game-item-discount-container">
                        <div className="game-item-discount-price">

                            <div>
                                <span>
                                    ${props.game.stores[props.game.discounts[0].store].price}
                                </span>
                            </div>
                            <div>

                                <span>
                                    -
                                </span>
                                {props.game.discounts[0].discount}
                                <span>
                                    %
                                </span>
                            </div>
                        </div>
                        <div className="game-item-discount-store">En {props.game.discounts[0].store.replace("_", " ").toUpperCase()}</div>
                    </a>
                ) : (
                    <a href={Object.values(props.game.stores_urls)[0]} target="_blank" rel="noreferrer" className="game-item-discount-container">
                        <div className="game-item-discount-price">
                            <div>
                                ${Object.values(props.game.stores)[0].price}
                            </div>
                        </div>
                        <div className="game-item-discount-store">En {Object.keys(props.game.stores)[0].replace("_", " ").toUpperCase()}</div>
                    </a>
                )}
            </div>
        </div>
    </Paper>
}

export default GameItem