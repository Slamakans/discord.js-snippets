/**
 * THIS CODE IS NOT PLUG&PLAY READY
 * The purpose of it is too look at how somebody else
 * has done it and try to adapt it to your own project.
 *
 * Originally created by Kye (189696688657530880)
 *
 * Attaches a presenceUpdate listener that will notify
 * the guilds in common's default channels that a member
 * has started streaming when they do.
 *
 * Uses the modules: request-promise, canvas
 */
const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const Canvas = require('canvas');

const TWITCH_CLIENT_ID = 'your twitch client id here';

const async = func => (...args) => new Promise((resolve, reject) => {
  func(...args, (err, res) => err ? reject(err) : resolve(res));
});

/* https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=presenceUpdate */
client.on('presenceUpdate', async (o, n) => { // eslint-disable-line no-undef
  const { streaming } = n.user.presence.game || {};
  if (!streaming) return;

  const start = new Date().getTime();

  /* Timestamps are stored to prevent spam
   * due to some oddities with the APIs.
   */
  const timestamps = JSON.parse(await async(fs.readFile)('./data/timestamps.json', 'utf8'));

  if (!timestamps[n.id] || start > timestamps[n.id].timestamp + (360 * 6e4)) {
    timestamps[n.id] = timestamps[n.id] || {};
    timestamps[n.id].timestamp = start;
    const streamID = n.user.presence.game.url.split('/').slice(3).join();

    /* Set url and headers for api */
    const options = {
      uri: `https://api.twitch.tv/kraken/streams/${streamID}`,
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
      },
      json: true,
    };

    /* Requests api information with options created above */
    try {
      const res = await request(options);

      const status = res.stream.channel.status;
      const wrapRegex = new RegExp(`.{1,${44}}`, 'g');
      const lines = status.match(wrapRegex) || [];

      const wrappedStatus = lines.reduce((tot, cur) =>
        /\S$/.test(tot) && /^\S/.test(cur) ?
          `${tot}-\n${cur}` :
          `${tot.trim()}\n${cur.trim()}`
      );

      const canvas = new Canvas(800, 200);
      const ctx = canvas.getContext('2d');
      const Image = Canvas.Image;
      const twitchLogo = new Image();
      const profileBanner = new Image();
      /* http://i.imgur.com/yht9Iz8m.png */
      twitchLogo.src = path.join(__dirname, './images/twitch.png');
      if (res.stream.channel.profile_banner) {
        profileBanner.src = await request({
          uri: res.stream.channel.profile_banner,
          encoding: null,
        });
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(twitchLogo, 0, 0, 200, 200);

      ctx.globalAlpha = 0.25;
      try {
        ctx.drawImage(profileBanner, 200, 0, 800, 200);
      } catch (err) {
        // No profile banner
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#000000';
      ctx.font = '27px Arial';
      ctx.fillText(`${res.stream.channel.display_name}, is now live!`, 235, 50);

      ctx.font = '22px Arial';
      ctx.fillText(wrappedStatus, 235, 80);

      ctx.fillStyle = '#565656';
      ctx.fillText(`Playing: ${res.stream.game}`, 235, 180);

      await n.guild.defaultChannel.sendFile(
        canvas.toBuffer(), undefined, `Go check them out! <${res.stream.channel.url}>`
      );
    } catch (err) {
      console.error(err);
    }
  }

  fs.writeFile('./data/timestamps.json', JSON.stringify(timestamps), (err) => { if (err) console.error(err); });
});
