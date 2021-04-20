import { API_URL } from "../env"
import APIUtils from "./APIUtils"


class NotificationsAPI {

    static module = "notifications"

    static sendSubscription(subscription) {
        console.log(subscription)

        APIUtils.POST(`${API_URL}/${NotificationsAPI.module}`, subscription)
    }

    static deleteSubscription(subscription) {
        console.log(subscription)
    }
}

export default NotificationsAPI