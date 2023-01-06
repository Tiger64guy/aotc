const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with "Pong!"')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.PrioritySpeaker),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
