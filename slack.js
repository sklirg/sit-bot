const fetch = require('node-fetch');
const querystring = require('querystring');


async function slackInstall(req, res, next) {
  // https://slack.com/api/oauth.access
  const queryparams = {
    code: req.query.code || '',
    redirect_uri: req.query.redirect_uri || '',
    client_id: process.env.SITBOT_SLACK_CLIENT_ID,
    client_secret: process.env.SITBOT_SLACK_CLIENT_SECRET,
  };

  const url = `https://slack.com/api/oauth.access?${querystring.stringify(queryparams)}`;

  const resp = await fetch(url);

  res.send();
  next();
}

function menuItemsToFields(menu) {
  return menu.map((item) => {
    const flags = item.flags ? `[${item.flags}]` : '';
    const price = item.price ? `(${item.price},-)` : '';
    return {
      // Ugly hack to remove adde whitespace if prices and/or flags is empty.
      value: `${item.text} ${price} ${flags}`.replace('  ', ' ').trim(),
      short: true,
    }
  });
}


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
        fields: Array.isArray(cantinaInfo.lunch) && menuItemsToFields(cantinaInfo.lunch),
      },
      (cantinaInfo.dinner) && {
        title: 'Middagsmeny',
        text: cantinaInfo.dinner.message,
        fields: Array.isArray(cantinaInfo.dinner) && menuItemsToFields(cantinaInfo.dinner),
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
  slackInstall,
}
