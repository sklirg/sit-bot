const fetch = require('node-fetch');


function generateSlackMessage(cantinaInfo, options) {
  return {
    response_type: (options && options.response_type) || 'ephemeral',
    text: `Jeg hentet informasjon om ${cantinaInfo.name} for deg.`,
    attachments: [
      {
        title: 'Åpen nå?',
        text: cantinaInfo.hours.message,
      },
      (cantinaInfo.lunch) && {
        title: 'Lunsjmeny',
        text: cantinaInfo.lunch.message,
      },
      (cantinaInfo.dinner) && {
        title: 'Middagsmeny',
        text: cantinaInfo.dinner.message,
      },
    ],
  }
}


function postDelayedSlackMessage(response_url, message) {
  fetch(response_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

module.exports = {
  generateSlackMessage,
  postDelayedSlackMessage,
}
