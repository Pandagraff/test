async function getActiveEvent() {
    try{
        const res = await fetch('https://awedtan.ca/api/event');
        const data = await res.json();

        const activeEvent = Array.isArray(data) ? data[0] : data.event;

        if (!activeEvent){
            return 'dry week :sob';
        }

        const name = activeEvent.name || activeEvent.title;
        const endUnix = Math.floor(new Date(activeEvent.endTime || activeEvent.end_at).getTime() / 1000);
        return 'Ongoing events: **${event.name}**\nEnds at: <t:${endUnix}:R>';
    } catch(err){
        console.error('Failed to fetch event: ', err);
        return 'Could not fetch event info'
    }
}





async function sendDiscordReminder() {
    const eventStatus = await getActiveEvent();
    const payload = {
        embeds: [
            {
                title: "Daily Reminder",
                description: "Dont forget to do your dailies!",
                color: 0x00a2ff,
                fields: [
                    {
                        name: "Active Event",
                        value: eventStatus,
                        inline: false
                    }
                ],
                footer: {text: "Arknights daily reminder bot"},
                timestamp: new Date().toISOString()
            }
        ],
        components: [
            {
                type: 1, 
                components:[
                    {
                        type: 2,
                        style: 3,
                        label: "Done",
                        custom_id: "mark_done"
                    },
                    {
                        type: 2,
                        style: 2,
                        label: "Snooze 1h",
                        custom_id: "snooze_1h"      
                    }
                ]
            }
        ]
    };
    const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    const response = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
        method: 'POST',
        headers:{
            'Authorization' : 'Bot ${BOT_TOKEN}',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if(!response.ok){
        console.error('Failed to send reminder: ', await response.text());
    }
    else{
        console.log('Reminder successfully sent by bot!')
    }
}

