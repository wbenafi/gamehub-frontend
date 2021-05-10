import { useEffect, useState } from "react";
import GamesAPI from "./GamesAPI";
import LocalGroceryStoreIcon from "@material-ui/icons/LocalGroceryStore";
import { Paper } from "@material-ui/core";

const Game = (props) => {
  const [game, setGame] = useState({ stores: {} });

  const id = props.match.params.id;

  useEffect(() => {
    async function getGame() {
      const response = await GamesAPI.get(id);
      if (response.ok) {
        let gameInfo = await response.json();
        GamesAPI.orderGamesStoresByPrice([gameInfo]);
        setGame(gameInfo);
      }
    }
    getGame();
  }, [id]);

  console.log(game);

  return (
    <div className="game-container">
      <div>
        <img
          src={game.image_url}
          alt={"Imagen de " + game.name}
          className="game-img"
        />
      </div>
      <div>
        <h1 className="game-container-title">{game.name}</h1>
        <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
          {game.hltb !== undefined ? (
            <a
              className="game-hltb-container"
              href={`https://howlongtobeat.com/game?id=${game.hltb_game_id}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src="/assets/images/hltb.png" alt="" />
              <h3>{Object.keys(game.hltb[0])[1].replace("-", " ")}</h3>

              {game.hltb.map((value) => (
                <div className="game-hltb-item" key={Object.values(value)[1]}>
                  <div>{Object.values(value)[1]}</div>
                  <div>{value.Average}</div>
                </div>
              ))}
            </a>
          ) : (
            ""
          )}
          {game.metacritic !== undefined ? (
            <a
              className="game-metacritic-container"
              href={game.metacritic_url}
              target="_blank"
              rel="noreferrer"
            >
              <img src="/assets/images/metacritic.png" alt="" />
              <div>
                <h4>Metascore</h4>
                <div
                  className="game-metascore-container"
                  score={
                    Number(game.metacritic.metascore) >= 75
                      ? "nice"
                      : Number(game.metacritic.metascore) < 50
                      ? "bad"
                      : "regular"
                  }
                >
                  {game.metacritic.metascore}
                </div>
              </div>
              <div>
                <h4>Userscore</h4>
                <div
                  className="game-userscore-container"
                  score={
                    Number(game.metacritic.userscore) >= 7.5
                      ? "nice"
                      : Number(game.metacritic.userscore) < 5.0
                      ? "bad"
                      : "regular"
                  }
                >
                  {game.metacritic.userscore}
                </div>
              </div>
            </a>
          ) : (
            ""
          )}

          <div className="game-stores-container">
            <div className="game-stores-icon">
              <LocalGroceryStoreIcon></LocalGroceryStoreIcon>
            </div>
            {Object.entries(game.stores).map(([store, info], i) => (
              <a
                href={Object.values(game.stores_urls)[i]}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none !important" }}
                key={store}
              >
                <Paper className="game-store-item">
                  <img src={`assets/images/${store}.png`} alt="" />
                  <div className="game-store-price-details">
                    <span>
                      {info.discount !== "0%" ? "-" + info.discount : ""}
                    </span>
                    <div>
                      {info.discount !== "0%" ? (
                        <div>
                          $
                          {(
                            (info.price * 100) /
                            (100 - Number(info.discount.replace("%", "")))
                          ).toFixed(2)}
                        </div>
                      ) : (
                        ""
                      )}
                      ${info.price}
                    </div>
                  </div>
                </Paper>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
