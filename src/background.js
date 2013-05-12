(function() {
	localStorage.interval || (localStorage.interval = 120000);
	localStorage.displayTime || (localStorage.displayTime = 15000);

	var container = document.createElement('div');
	function get_notifications(success, failure) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://github.com/inbox/notifications', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					notifications = parse_notifications(xhr.responseText);
					success(notifications);
				} else {
					failure();
				}
			}
		}
		xhr.send();
	}

	function parse_notifications(responseText) {
		container.innerHTML = responseText;
		var notificationNodes = container.querySelectorAll('#notification-center .list-browser-item');
		var notifications = Array.prototype.slice.call(notificationNodes).map(function(item, key) {
			var item = {
				image: item.querySelector('img.avatar').src,
				title: item.querySelector('h4').innerText,
				content: item.querySelector('h4').innerHTML
			};
			return item;
		})
		return notifications;
	}

	function notify(notification) {
		var notification = webkitNotifications.createHTMLNotification(
			'notification.html#image=' + encodeURIComponent(notification.image) +
				'&title=' + encodeURIComponent(notification.title) +
				'&content=' + encodeURIComponent(notification.content)
		);
		notification.show();
		localStorage.displayTime > 0 && setTimeout(function(){notification.cancel();}, localStorage.displayTime);
	}

	(function pull() {
		get_notifications(function(notifications) {
			if (localStorage.last_notification_content !== undefined) {
				var new_notifications = [];
				notifications.some(function(notification, index){
					return notification.content === localStorage.last_notification_content ||
						!new_notifications.push(notification);
				});
				new_notifications.length && (localStorage.last_notification_content = new_notifications[0].content);
				new_notifications.reverse().map(notify);
			} else {
				if (notifications[0] !== undefined) {
					localStorage.last_notification_content = notifications[0].content;
				}
			}
			setTimeout(pull, localStorage.interval);
		}, function() {
			var notification = webkitNotifications.createNotification(
				'48.png',
				'Error fetching GitHub notifications',
				'Make sure you\'re connected to your GitHub account. Retrying in '+(localStorage.interval/1000)+' seconds.'
			);
			notification.show();
			setTimeout(function(){notification.cancel();}, 5000);
			setTimeout(pull, localStorage.interval);
		});
	})();
})();
