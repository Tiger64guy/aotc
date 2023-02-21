const { SlashCommandBuilder } = require('discord.js');
const { commandsChannelId, playerRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeplayer')
        .setDescription('Remove the Current Game role from a player.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to remove the role from')
                .setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to remove player - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to remove player - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const playerRole = await guild.roles.fetch(playerRoleId);
        const user = interaction.options.getMember('user');
        user.roles.remove(playerRole);
        interaction.reply({ content: `Successfully removed ${user.displayName} as a player.`, ephemeral: true });
    },
};