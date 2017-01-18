Client.on('presenceUpdate', (oldmem, newmem) => {
    if(newmem.user.presence.game === null)return;
    if(newmem.user.presence.game.streaming === false)return;

    var currentTimeStamp = new Date().getTime();
    let timestamps = JSON.parse(fs.readFileSync('./data/timestamps.json', 'utf8'));
    if(!timestamps[newmem.id])
    {
        timestamps[newmem.id] = {"timestamp": currentTimeStamp};
        var streamId = newmem.user.presence.game.url.split("/").slice(3).join();

        //Create url and headers for api
        var options = {
            uri: 'https://api.twitch.tv/kraken/streams/'+ streamId,
            headers: {
                'Client-ID': data.keys.twitchClientId
            },
            json: true
        };
        //Requests api information with options created above
        request(options).then((res) => {
            var statusArr = res.stream.channel.status.split("");
            if(statusArr.length < 44)
            {

            }
            else if(statusArr.length > 44 && statusArr.length < 88)
            {
                statusArr[44] += "-\n";
            }
            else if(statusArr.length > 88 && statusArr.length < 132)
            {
                statusArr[44] += "-\n";
                statusArr[88] += "-\n";
            }
            else
            {
                statusArr[44] += "-\n";
                statusArr[88] += "-\n";
                statusArr[132] += "-\n";
            }
            var fullStatus = statusArr.join("");
            let canvas = new Canvas(800, 200);
            let ctx = canvas.getContext('2d');
            let Image = Canvas.Image;
            let twitch = new Image();
            twitch.src = path.join(__dirname, "./images/twitch.png");

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.drawImage(twitch, 0, 0, 200, 200);

            ctx.fillStyle = "#000000";
            ctx.font='27px Arial';
            ctx.fillText(res.stream.channel.display_name+', is now live!', 235,50);

            ctx.fillStyle = "#000000";
            ctx.font='22px Arial';
            ctx.fillText(fullStatus, 235,80);

            ctx.fillStyle = "#565656";
            ctx.font='22px Arial';
            ctx.fillText('Playing: '+ res.stream.game, 235,180);

            newmem.guild.defaultChannel.sendFile(canvas.toBuffer());
            newmem.guild.defaultChannel.sendMessage("Go check them out! <" + res.stream.channel.url + ">");
        }).catch(console.log);
    }

    if(currentTimeStamp > timestamps[newmem.id].timestamp + 21600000)
    {
        timestamps[newmem.id].timestamp = currentTimeStamp;
        var streamId = newmem.user.presence.game.url.split("/").slice(3).join();

        //Create url and headers for api
        var options = {
            uri: 'https://api.twitch.tv/kraken/streams/'+ streamId,
            headers: {
                'Client-ID': data.keys.twitchClientId
            },
            json: true
        };
        //Requests api information with options created above
        request(options).then((res) => {
            var statusArr = res.stream.channel.status.split("");
            if(statusArr.length < 44)
            {

            }
            else if(statusArr.length > 44 && statusArr.length < 88)
            {
                statusArr[44] += "-\n";
            }
            else if(statusArr.length > 88 && statusArr.length < 132)
            {
                statusArr[44] += "-\n";
                statusArr[88] += "-\n";
            }
            else
            {
                statusArr[44] += "-\n";
                statusArr[88] += "-\n";
                statusArr[132] += "-\n";
            }
            var fullStatus = statusArr.join("");
            let canvas = new Canvas(800, 200);
            let ctx = canvas.getContext('2d');
            let Image = Canvas.Image;
            let twitch = new Image();
            twitch.src = path.join(__dirname, "./images/twitch.png");

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.drawImage(twitch, 0, 0, 200, 200);

            ctx.fillStyle = "#000000";
            ctx.font='27px Arial';
            ctx.fillText(res.stream.channel.display_name+', is now live!', 235,50);

            ctx.fillStyle = "#000000";
            ctx.font='22px Arial';
            ctx.fillText(fullStatus, 235,80);

            ctx.fillStyle = "#565656";
            ctx.font='22px Arial';
            ctx.fillText('Playing: '+ res.stream.game, 235,180);

            newmem.guild.defaultChannel.sendFile(canvas.toBuffer());
            newmem.guild.defaultChannel.sendMessage("Go check them out! <" + res.stream.channel.url + ">");
        }).catch(console.log);
    }
    fs.writeFile('./data/timestamps.json', JSON.stringify(timestamps), (err) => {if(err) console.error(err)});
});
