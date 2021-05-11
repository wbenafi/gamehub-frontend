import APIUtils from "../common/APIUtils";
import { API_URL } from "../env";

export default class GamesAPI {
  static module = "games";

  static async get(id) {
    try {
      return await APIUtils.GET(`${API_URL}/${GamesAPI.module}/${id}`);
    } catch (error) {
      return error;
    }
  }

  static async getGames() {
    try {
      return await APIUtils.GET(`${API_URL}/${GamesAPI.module}/`);
    } catch (error) {
      return error;
    }
  }

  static async getGamesWithDiscount(quantity = 6, games = undefined) {
    if (!games) {
      const response = await GamesAPI.getGames();
      if (response.ok) {
        games = (await response.json()).data;
      }
    }
    if (games) {
      return [...games]
        .sort((a, b) => {
          if (a.discounts === undefined)
            a.discounts = Object.values(a.stores)
              .map((store, i) =>
                store.status === 1
                  ? store.discount !== "0%"
                    ? {
                        store: Object.keys(a.stores)[i],
                        discount: Number(store.discount.replace("%", "")),
                      }
                    : null
                  : null
              )
              .filter((a) => a != null)
              .sort((a, b) => b.discount - a.discount);
          if (b.discounts === undefined)
            b.discounts = Object.values(b.stores)
              .map((store, i) =>
                store.status === 1
                  ? store.discount !== "0%"
                    ? {
                        store: Object.keys(b.stores)[i],
                        discount: Number(store.discount.replace("%", "")),
                      }
                    : null
                  : null
              )
              .filter((a) => a != null)
              .sort((a, b) => b.discount - a.discount);

          if (a.discounts.length > 0 && b.discounts.length > 0) {
            return b.discounts[0].discount > a.discounts[0].discount ? 1 : -1;
          }

          if (a.discounts.length > 0) {
            return -1;
          }
          if (b.discounts.length > 0) {
            return 1;
          }

          return 0;
        })
        .slice(0, quantity - 1);
    }
  }

  static orderGamesStoresByPrice(games) {
    games.forEach((game) => {
      game.stores = Object.fromEntries(
        Object.entries(game.stores)
          .filter(([,store]) => store.status === 1)
          .sort(([, a], [, b]) => a.price - b.price)
      );
    });
  }
}
