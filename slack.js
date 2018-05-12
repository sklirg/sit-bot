const fetch = require('node-fetch');


function generateSlackMessage(cantinaInfo, options) {
  if (cantinaInfo.request_error) {
    return {
      response_type: 'ephemeral',
      text: `${cantinaInfo.request_error} (${cantinaInfo.cantina})}`,
    };
  }

  return {
    response_type: (options && options.response_type) || 'ephemeral',
    text: `Jeg hentet informasjon om ${cantinaInfo.name} for deg.`,
    attachments: [
      // @ToDo: Find better way to conitionally include; this results in undefined if false.
      (cantinaInfo.hours) && {
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


async function postDelayedSlackMessage(response_url, message) {
  console.log('posting to slack', response_url, message)
  const resp = await fetch(response_url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  console.log('post resp', resp.status);
}

module.exports = {
  generateSlackMessage,
  postDelayedSlackMessage,
}
