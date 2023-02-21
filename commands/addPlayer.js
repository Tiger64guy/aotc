const { SlashCommandBuilder } = require('discord.js');
const { commandsChannelId, playerRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addplayer')
        .setDescription('Give a player the Current Game role.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to give the role to')
                .setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to add player - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to add player - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const playerRole = await guild.roles.fetch(playerRoleId);
        const user = interaction.options.getMember('user');
        user.roles.add(playerRole);
        interaction.reply({ content: `Successfully added ${user.displayName} as a player.`, ephemeral: true });
    },
};