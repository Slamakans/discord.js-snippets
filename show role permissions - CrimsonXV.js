/*
 * The purpose of it is too look at how somebody else
 * has done it and try to adapt it to your own project.
 *
 * Originally created by CrimsonXV (180093157554388993)
 *
 * Edits the executing message so it shows
 * the permissions for the specified role
 *
 * This command is written for a selfbot, to make it work for a regular bot
 * you would need to make a few changes.
 */

exports.run = (client, msg, args) => {
  const roleName = args.join(' ');
  const role = msg.guild.roles.find('name', roleName);

  if (!role) {
    return msg.edit(`Role '**${roleName}**' not found!`);
  }

  const json = JSON.stringify(role.serialize())
    .replace(/{|}|"/g, '')
    .replace(/:/g, ' - ')
    .replace(/,/g, '\n');

  return msg.edit(`**Permissions for role**: ${role.name}\n\`\`\`xl\n${json}\n\`\`\``);
};

exports.help = 'Displays permissions for the specified role';
