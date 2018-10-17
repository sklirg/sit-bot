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
      title: `Rett #${item.index}`,
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
    text: `:robot_face: :hamburger: Jeg hentet informasjon om ${cantinaInfo.name} for deg.`,
    attachments: [
      // @ToDo: Find better way to conitionally include; this results in undefined if false.
      (cantinaInfo.hours) && {
        author_name: `${cantinaInfo.name}`,
        author_icon: 'https://pbs.twimg.com/profile_images/1908764294/image001_400x400.png',
        color: cantinaInfo.hours.open ? 'success' : 'danger',
        footer: 'Hentet fra Notiwire API',
        title: 'Åpen nå?',
        text: `${cantinaInfo.hours.open ? 'Ja :heavy_check_mark:' : 'Nei :heavy_multiplication_x:'} (${cantinaInfo.hours.message})`,
        ts: Date.now() / 1000,
      },
      (cantinaInfo.lunch) && {
        author_name: `${cantinaInfo.name}`,
        author_icon: 'https://pbs.twimg.com/profile_images/1908764294/image001_400x400.png',
        color: '#2d9ee0',
        footer: 'Hentet fra Notiwire API',
        title: 'Lunsjmeny',
        text: cantinaInfo.lunch.message,
        fields: Array.isArray(cantinaInfo.lunch) && menuItemsToFields(cantinaInfo.lunch),
        ts: Date.now() / 1000,
      },
      (cantinaInfo.dinner) && {
        author_name: `${cantinaInfo.name}`,
        author_icon: 'https://pbs.twimg.com/profile_images/1908764294/image001_400x400.png',
        color: '#2d9ee0',
        footer: 'Hentet fra Notiwire API',
        title: 'Middagsmeny',
        text: cantinaInfo.dinner.message,
        fields: Array.isArray(cantinaInfo.dinner) && menuItemsToFields(cantinaInfo.dinner),
        ts: Date.now() / 1000,
      },
    ],
  }
}


async function userSelectCantinaMessage(cantinas) {
  return {
    response_type: 'ephemeral',
    text: '',
    attachments: [
      {
        text: 'Velg kantine her',
        color: '#9400d3',
        attachment_type: 'default',
        actions: [
          {
            name: "cantinas_list",
            text: 'Velg en kantine',
            type: 'select',
            options: cantinas,
          }
        ],
      }
    ]
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
  userSelectCantinaMessage,
}
