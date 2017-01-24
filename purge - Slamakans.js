/*
 * # Fairly plug & play #
 * Originally created by Slamakans
 *
 * If no user is provided, deletes any deletable messages.
 *
 * Can only be used with a proper bot account because of bulkDelete.
 *
 * Syntax: [mention or amount] [amount]
 */

module.exports = async message => {
  const user = message.mentions.users.first();
  let amount = parseInt(message.content.split(' ').pop());

  if (!user && !amount) return message.reply('Syntax: [mention or amount] [amount]');
  if (!amount) return message.reply('Specify an amount');

  if (user) {
    const messages = (await message.channel.fetchMessage({ limit: amount })).filter(m => m.author.id === user.id);

    if (messages.size === 1) return messages.deleteAll();

    return message.channel.bulkDelete(messages);
  } else {
    if (amount === 0) return message.delete();

    if (amount === 1) amount += 1;
    return message.channel.bulkDelete(amount);
  }
};
