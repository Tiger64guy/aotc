const { SlashCommandBuilder } = require('discord.js');
const { townSquareId, stRoleId, playerRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assignroles')
        .setDescription('Assigns game roles to all active players.'),
    async execute(interaction) {
        await interaction.reply('Assigning player roles...');
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.followUp('Unable to assign roles - Guild not available');
            return;
        }

        const channel = await guild.channels.fetch(townSquareId);
        const stRole = await guild.roles.fetch(stRoleId);
        const playerRole = await guild.roles.fetch(playerRoleId);

        let count = 0;
        channel.members.forEach((member, memberId, map) => {
            if(member.displayName.startsWith('(ST)')) {
                guild.members.addRole({
                    user: member,
                    role: stRole
                });
                count++;
            }
            else if(!member.displayName.startsWith('!')) {
                guild.members.addRole({
                    user: member,
                    role: playerRole
                });
                count++;
            }
        });
        interaction.followUp(`Successfully assigned roles to ${count} members.`);
    },
};