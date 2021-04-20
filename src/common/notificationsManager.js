import NotificationsAPI from "./notificationsAPI";


class NotificationManager {

    static get subscribed(){
        return new Promise((resolve) => {
            navigator.serviceWorker.ready.then(
                (serviceWorkerRegistration) => {
                    serviceWorkerRegistration.pushManager.getSubscription().then(
                        (subscription) => {
                            if(subscription){
                                resolve(true)
                            }
                            else{
                                resolve(false)
                            }
                        }
                    ).catch(
                        error => resolve(false)
                    )
                }
            ).catch(
                error => resolve(false)
            )
        })
    }


    static checkBrowserSupport() {
        if (!('Notification' in window)) {
            console.log("This browser does not support notifications.");
            return {
                message: "El navegador no soporta notificaciones",
                status: 0
            }
        }

        else if (!('serviceWorker' in navigator)) {
            console.log("This browser does not support serviceWorkers.");
            return {
                message: "El navegador no soporta serviceWorkers para las notificaciones",
                status: 0
            }
        }

        else if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('Notifications aren\'t supported. on serviceWorkers');
            return {
                message: "El navegador no soporta serviceWorkers para las notificaciones",
                status: 0
            }
        }

        else if (!('PushManager' in window)) {
            console.warn('Push messaging isn\'t supported.');
            return {
                message: "El navegador no soporta notificaciones (WebPushNotifications)",
                status: 0
            }
        }
        
        return {
            message: "El navegador soporta las notificaciones",
            status: 1
        }
    }

    static async askNotificationPermission() {
        const browserSupport = NotificationManager.checkBrowserSupport()
        if(browserSupport.status === 0){
            return browserSupport
        }

        await Notification.requestPermission()

        if (Notification.permission === 'denied' || Notification.permission === 'default') {
            return {
                message: "No se ha brindado el permiso para enviar notificaciones",
                status: 0
            }
        }
        return {
            message: "Permiso para las notificaciones concedido",
            status: 1
        }

    }

    static async subscribe() {
        if(await NotificationManager.subscribed === true){
            return {
                message: "Ya se encuentra suscrito",
                status: 0
            }
        }
        const permisson = await NotificationManager.askNotificationPermission()
        if(permisson.status === 0) {
            return permisson
        }

        await navigator.serviceWorker.register('/service-worker.js')

        const serviceWorkerRegistration = await navigator.serviceWorker.ready

        function urlBase64ToUint8Array(base64String) {
            var padding = '='.repeat((4 - base64String.length % 4) % 4);
            var base64 = (base64String + padding)
                .replace(/-/g, '+')
                .replace(/_/g, '/');

            var rawData = window.atob(base64);
            var outputArray = new Uint8Array(rawData.length);

            for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                'BFp4VA9Bq1QWQpFVYL8mfQYgEq4BJXIYP3j7mjmMymlc8euQDJJBYTVGO3NEyjSc0TIsoIfbBXaya63duK8KoGY'
            )
            })

        const subscription = await serviceWorkerRegistration.pushManager.getSubscription()

        NotificationsAPI.sendSubscription(subscription.toJSON())

        return {
            message: "Suscrito a notificaciones",
            status: 1
        }
    }

    static async unsubscribe() {
        if(await NotificationManager.subscribed === false){
            return
        }
        const serviceWorkerRegistration = await navigator.serviceWorker.ready

        const subscription = await serviceWorkerRegistration.pushManager.getSubscription()

        NotificationsAPI.deleteSubscription(subscription.toJSON())

        subscription.unsubscribe()
    }
}

export default NotificationManager
