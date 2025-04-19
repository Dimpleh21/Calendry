self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "snooze") {
    setTimeout(() => {
      self.registration.showNotification("Event Snoozed", {
        body: event.notification.data.body,
        tag: "snoozed-event",
        actions: [
          { action: "snooze", title: "Snooze" },
          { action: "stop", title: "Stop" },
        ],
        data: event.notification.data,
      });
    }, 5 * 60 * 1000); // Snooze for 5 minutes
  } else if (event.action === "stop") {
    // No action, just closes the notification
  } else {
    // Default click
    event.waitUntil(clients.openWindow("/"));
  }
});

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "Default Title";
  const options = {
    body: payload.body || "Default notification body",
    icon: "icon.png",
    badge: "badge.png",
    actions: [
      { action: "snooze", title: "Snooze" },
      { action: "stop", title: "Stop" },
    ],
    data: payload,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
