const { SlashCommandBuilder } = require('discord.js');
const { commandsChannelId, playerRoleId, townSquareId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotlight')
        .setDescription('Mute all players except one so they can speak freely.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to leave unmuted')
                .setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to spotlight player - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to spotlight player - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const user = interaction.option.getMember('user');
        if (!user.roles.cache.has(playerRoleId)) {
            interaction.reply({ content: 'Unable to spotlight player - Member is not in the current game', ephemeral: true });
            return;
        }
        if (user.voice.channel.id !== townSquareId) {
            interaction.reply({ content: 'Unable to spotlight player - Player not in Town Square', ephemeral: true });
            return;
        }

        const playerRole = await guild.roles.fetch(playerRoleId);
        playerRole.members.forEach((value, _key, _map) => {
            if (value.id !== user.id) {
                if (value.voice.channel?.id === townSquareId) {
                    value.voice.setMute(true, 'Player spotlighted');
                }
            }
        });
        interaction.reply({ content: `Successfully spotlighted ${user.displayName}`, ephemeral: true });
    },
};