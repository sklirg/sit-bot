# Sit-bot

<a href="https://slack.com/oauth/authorize?client_id=274699598467.362635732451&scope=commands"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

A Slack app providing useful tools for querying the Sit canteens at NTNU in Trondheim.

It makes use of the [Notiwire API](https://github.com/dotkom/notiwire) which parses their menus and opening hours.

![https://i.imgur.com/0H4wudb.png](https://i.imgur.com/0H4wudb.png)

## Usage

| Command | Parameters | Description |
| ---     | ---        | ---         |
| `/sit` | - | Ask for information about the default canteens. |
| `/sit` | `<canteen>`[^1](#parameters) | Ask for information about the specified canteen(s). Multiple canteens can be specified by separating them by a comma (`,`) |
| `/sit` | help | Show a help text |

### Parameters

The canteens must currently be supplied by their identifier. The identifier is the one listed as the key in the dictionary in [Notiwire](https://github.com/dotkom/notiwire/blob/8b25461d39563f64b9109d8ce2f131778427c209/libs/cantina.js#L122) (or [as JSON](https://passoa.online.ntnu.no/api/cantina/)).

Example: `/sit hangaren` or `/sit hangaren,elektro`
