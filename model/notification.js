const testNotification = async () => {
  const userToken =
    'fHH8f05jSZaV0gMhDrINzO:APA91bGPyqcsh63S3yymn2kk3zT1DT6laF6Ypj1IIv11RAcU5lDMDo1cmuiPvQAaG2epEOFH4Rldr1gRwoJi1158XHNN3FLE3WnIbG2sWpjoJfOmZtIziXK9djmHu-9TtPfrWsQ9AdY6';
  const DELIVERY_PARTNER_FIREBASE_API_KEY =
    'AAAA206GD2Q:APA91bEaq_P49bzza39abiiZgUe_-vVytc7JacVYblNvLgqGPWgKYWZhT-6zdw68tmAsM4wkDDyftgYlXNFaMA5C8IVbEFqaTUUqXLsDA21-6HuiEJqcz-QsDaVkPKVckTAIYL3u3glj';
  const message = {
    to: userToken,
    notification: {
      title: 'Success',
      body: 'Message received successfully. Test Notification Function working properly',
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
    data: {
      title: 'Success',
      body: 'Message received successfully. Test Notification Function working properly',
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
  });
  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.json();
  console.log(response);
};

const sendNotification = async () => {
  const userToken =
    'fHH8f05jSZaV0gMhDrINzO:APA91bGPyqcsh63S3yymn2kk3zT1DT6laF6Ypj1IIv11RAcU5lDMDo1cmuiPvQAaG2epEOFH4Rldr1gRwoJi1158XHNN3FLE3WnIbG2sWpjoJfOmZtIziXK9djmHu-9TtPfrWsQ9AdY6';
  const DELIVERY_PARTNER_FIREBASE_API_KEY =
    'AAAA206GD2Q:APA91bEaq_P49bzza39abiiZgUe_-vVytc7JacVYblNvLgqGPWgKYWZhT-6zdw68tmAsM4wkDDyftgYlXNFaMA5C8IVbEFqaTUUqXLsDA21-6HuiEJqcz-QsDaVkPKVckTAIYL3u3glj';
  const message = {
    to: userToken,
    notification: {
      title: 'New Message',
      body: 'Test message',
      vibrate: 1,
      sound: 1,
      show_in_foreground: true,
      priority: 'high',
      content_available: true,
    },
    data: {
      title: 'New Message',
      body: 'Test message',
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'key=' + DELIVERY_PARTNER_FIREBASE_API_KEY,
  });
  let response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  response = await response.json();
  console.log(response);
};

export {testNotification, sendNotification};
