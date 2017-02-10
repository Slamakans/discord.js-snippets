/*
 * # Fairly plug & play #
 * Originally created by Slamakans
 *
 * If no user is provided, deletes any deletable messages.
 *
 * Can only be used with a proper bot account because of bulkDelete.
 *
 * Syntax: [mention or amount] [amount]
 *
 * Resolves with an array of the messages deleted, or Promise<Message> if the command is executed improperly.
 * # resolve part untested at the moment, functionality should be fine though #
 */

module.exports = async message => {
  const user = message.mentions.users.first();
  let amount = parseInt(message.content.split(' ').pop());

  if (!user && !amount) return message.reply('Syntax: [mention or amount] [amount]');
  if (!amount) return message.reply('Specify an amount');

  if (user) {
    const messages = (await message.channel.fetchMessages({ limit: amount }))
      .filter(m => m.author.id === user.id)
      .filter(m => m.deletable);

    if (!messages.size) return [];

    if (messages.size === 1) {
      return [await messages.first().delete()];
    }

    return (await message.channel.bulkDelete(messages)).array();
  } else {
    if (amount === 0 || amount === 1) {
      return [await message.delete()];
    }

    return (await message.channel.bulkDelete(amount)).array();
  }
};
