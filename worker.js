function showNotification(title, options) {
  return self.registration.showNotification(title, options);
}

function handleNotificationClick(event) {
  event.notification.close();

  var id = event.notification.data.id;
  var clickUrl = 'https://pushdealer.com/projects/c40700a1/notifications/' + id + '/click';

  fetch(clickUrl);

  return clients.openWindow(event.notification.data.url);
}

self.addEventListener('push', function(event) {
  event.waitUntil(self.registration.pushManager.getSubscription()
      .then(function(subscription) {
        var regID = null;

        if ('subscriptionId' in subscription) {
          regID = subscription.subscriptionId;
        } else {
          //in Chrome 44+ and other SW browsers, reg ID is part of endpoint, send the whole thing and let the server figure it out.
          regID = subscription.endpoint;
        }

        var url = 'https://pushdealer.com/projects/c40700a1/subscriptions/' + encodeURIComponent(regID) + '/notification';
        return fetch(url)
          .then(function(response) {
            return response.json()
              .then(function(json) {
                var promises = [];

                for (var i = 0; i < json.notifications.length; i++) {
                  var notification = json.notifications[i];

                  promises.push(showNotification(notification.title, notification.options));
                }

                return Promise.all(promises);
              });
          });
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.waitUntil(handleNotificationClick(event));
});
