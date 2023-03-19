Ambush on the Clocktower
=============
## Setup Guide
### Server Setup
Coming Soon
### Bot Creation
Comin Soon
### Installing Node
Coming Soon
### Download Dependencies
Coming Soon
### Create Config File
1. In the root directory, create a file name "config.json".
2. In this file, you'll need to specify a number of fields:
   - `token` - Your bot's token
   - `clientId` - Your bot's client ID
   - `guildId` - The ID of the server you're adding the bot to
   - `townSquareId` - The ID of the Town Square voice channel
   - `nightCategoryId` - The ID of the category channel containing your cottages
   - `stRoleId` - The ID of the role to give to storytellers
   - `playerRoleId` - The ID of the role to give to players in the current game
   - `gameChatId` - The ID of the text channel where game chat occurs
   - `commandsChannelId` - The ID of the text channel where bot commands should be used
### Running the Bot
1. Run `node deploy-commands.js` to create the commands for your bot. If you make any modifications to the command definitions (adding/removing commands, changing command names or parameters, etc.) (or if you pull any command updates from this repo) you'll need to stop your bot and rerun this to get the new commands.
2. Once that finished, run `node .` to start the bot.
## Commands
Coming Soon