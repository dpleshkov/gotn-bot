# GOTN Bot

Starblast `simstatus.json` listener that can be configured to post links to Starblast Game of the Night across
several Discord servers. 

### Installation

```bash
# Clone repository
git clone https://github.com/dpleshkov/gotn-bot
cd gotn-bot

# Install dependencies
npm install

# Move config.example.js to config.js
mv config.example.js config.js

# Make sure to edit config.js to set GOTN times as well as 
# include Discord webhook links

# Once done, run using
npm start
```