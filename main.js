const axios = require("axios");
const config = require("./config");

async function getSimstatus() {
    return (await axios.get(`https://starblast.io/simstatus.json?cachebypass=${Math.random()}`)).data;
}

async function getGames(simstatus, mode, region) {
    let output = {};
    for (let location of simstatus) {
        if (location.location === region) {
            for (let system of location.systems) {
                if (system.mode === mode) {
                    output[system.name] = system;
                }
            }
        }
    }
    return output;
}

function getSuffix(int) {
    if (int % 100 > 10 && int % 100 < 20) return "th";
    if (int % 10 === 1) return "st";
    if (int % 10 === 2) return "nd";
    if (int % 10 === 3) return "rd";
    return "th";
}

function getGOTNCount(region) {
    let now = new Date();
    let fullDaysSinceEpoch = Math.floor(now/8.64e7);
    if (region === "Europe") {
        return fullDaysSinceEpoch - 19024 + 258;
    } else {
        return fullDaysSinceEpoch - 19024 + 1 - 3;
    }
}

async function main() {
    let america = {};
    let europe = {};
    let asia = {};
    let lastUpdatedEurope = new Date();
    let lastUpdatedAmerica = new Date();
    let lastUpdatedAsia = new Date();

    async function tick() {
        let simstatus = await getSimstatus();
        let newAmerica = await getGames(simstatus, "team", "America");
        let newEurope = await getGames(simstatus, "team", "Europe");
        let newAsia = await getGames(simstatus, "team", "Asia");
        let now = new Date();
        console.log(((now.getUTCHours() * 3600) + (now.getUTCMinutes() * 60) + now.getUTCSeconds()));

        for (let system of Object.keys(newEurope)) {
            console.log(system);
            if (!Object.keys(europe).includes(system)) {
                console.log("Detected new system", newEurope[system].id);
                if (((now.getUTCHours() * 3600 + (now.getUTCMinutes() * 60) + now.getUTCSeconds()) >= config.europeTime &&
                    ((lastUpdatedEurope.getUTCHours() * 3600) + (lastUpdatedEurope.getUTCMinutes() * 60) + lastUpdatedEurope.getUTCSeconds()) < config.europeTime)) {
                    let count = getGOTNCount("Europe");
                    if (config.ignored.europe.includes(count)) break;
                    for (let subscriber of config.subscribers.europe) {
                        axios.post(subscriber.webhook, {
                            username: subscriber.username,
                            content: subscriber.messageContent,
                            avatar_url: subscriber.avatar,
                            embeds: [
                                {
                                    "type": "rich",
                                    "title": `Game of the Night™ - Europe`,
                                    "description": `Europe's **${count}${getSuffix(count)} Game of the Night™** is now **LIVE** on https://starblast.io/#${newEurope[system].id}. Have fun!`,
                                    "color": 0xFF00DE
                                }
                            ]
                        }, {
                            headers: {
                                "Content-type": "application/json"
                            }
                        });
                    }
                }
                europe = newEurope;
                lastUpdatedEurope = now;
            }
        }
        
        for (let system of Object.keys(newAmerica)) {
            console.log(system);
            if (!Object.keys(america).includes(system)) {
                console.log("Detected new system", newAmerica[system].id);
                if (((now.getUTCHours() * 3600 + (now.getUTCMinutes() * 60) + now.getUTCSeconds()) >= config.americaTime &&
                    ((lastUpdatedAmerica.getUTCHours() * 3600) + (lastUpdatedAmerica.getUTCMinutes() * 60) + lastUpdatedAmerica.getUTCSeconds()) < config.americaTime)) {
                    let count = getGOTNCount("America");
                    if (config.ignored.america.includes(count)) break;
                    for (let subscriber of config.subscribers.america) {
                        axios.post(subscriber.webhook, {
                            username: subscriber.username,
                            content: subscriber.messageContent,
                            avatar_url: subscriber.avatar,
                            embeds: [
                                {
                                    "type": "rich",
                                    "title": `Game of the Night™ - America`,
                                    "description": `America's **${count}${getSuffix(count)} Game of the Night™** is now **LIVE** on https://starblast.io/#${newAmerica[system].id}. Have fun!`,
                                    "color": 0xFF00DE
                                }
                            ]
                        }, {
                            headers: {
                                "Content-type": "application/json"
                            }
                        });
                    }
                }
                america = newAmerica;
                lastUpdatedAmerica = now;
            }
        }

        for (let system of Object.keys(newAsia)) {
            console.log(system);
            if (!Object.keys(asia).includes(system)) {
                console.log("Detected new system", newAsia[system].id);
                if (((now.getUTCHours() * 3600 + (now.getUTCMinutes() * 60) + now.getUTCSeconds()) >= config.asiaTime &&
                    ((lastUpdatedAsia.getUTCHours() * 3600) + (lastUpdatedAsia.getUTCMinutes() * 60) + lastUpdatedAsia.getUTCSeconds()) < config.asiaTime)) {
                    let count = getGOTNCount("Asia");
                    if (config.ignored.asia.includes(count)) break;
                    for (let subscriber of config.subscribers.asia) {
                        axios.post(subscriber.webhook, {
                            username: subscriber.username,
                            content: subscriber.messageContent,
                            avatar_url: subscriber.avatar,
                            embeds: [
                                {
                                    "type": "rich",
                                    "title": `Game of the Night™ - Asia`,
                                    "description": `Asia's **${count}${getSuffix(count)} Game of the Night™** is now **LIVE** on https://starblast.io/#${newAsia[system].id}. Have fun!`,
                                    "color": 0xFF00DE
                                }
                            ]
                        }, {
                            headers: {
                                "Content-type": "application/json"
                            }
                        });
                    }
                }
                asia = newAsia;
                lastUpdatedAsia = now;
            }
        }

        setTimeout(tick, config.pollingRate);
    }

    tick().then();
}

main().then()