const { SlashCommandBuilder } = require('discord.js');
const { commandsChannelId, playerRoleId, townSquareId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('openvoice')
        .setDescription('Unmute everyone after a spotlight'),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to unmute everyone - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to unmute everyone - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const playerRole = await guild.roles.fetch(playerRoleId);
        playerRole.members.forEach((value, _key, _map) => {
            if (value.voice.channel?.id === townSquareId) {
                value.voice.setMute(false);
            }
        });
        interaction.reply({ content: 'Successfully unmuted all players', ephemeral: true });
    },
};