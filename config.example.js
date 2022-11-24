const defaults = {
    username: "ServerList+",
    avatar: "https://starblast.dankdmitron.dev/dankdmitron.png"
}

module.exports = {
    // GOTN daily times in terms of seconds elapsed since midnight (UTC)
    americaTime: 7200,
    asiaTime: 43200,
    europeTime: 63000,
    // Webhooks to post GOTN link to for certain regions
    subscribers: {
        america: [
            {
                username: defaults.username,
                avatar: defaults.avatar,
                messageContent: "additional text to put, ex: role ping",
                webhook: "webhookURL"
            }
        ],
        europe: [
            {
                username: defaults.username,
                avatar: defaults.avatar,
                messageContent: "additional text to put, ex: role ping",
                webhook: "webhookURL"
            }
        ],
        asia: [
            {
                username: defaults.username,
                avatar: defaults.avatar,
                messageContent: "additional text to put, ex: role ping",
                webhook: "webhookURL"
            }
        ]
    },
    // Ignore certain GOTN numbers
    ignored: {
        america: [1],
        europe: [1, 100],
        asia: [1]
    },
    // rate at which to query simstatus.json endpoint
    pollingRate: 15000
}
