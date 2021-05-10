self.addEventListener('push', function(e) {
    var data;
  
    if (e.data) {
      data = JSON.parse(e.data.text());
    } else {
      data = {
        title: "Descuento en un juegazo",
        body: "Revisa nuestra página",
        icon: 'https://wbenafi.github.io/gamehub-frontend/assets/images/white-icon-512x512.png'
      };
    }
  
    var options = {
      body: data.body,
      icon: data.icon,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {action: 'explore', title: 'Ver descuento'}
      ]
    };
    e.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });