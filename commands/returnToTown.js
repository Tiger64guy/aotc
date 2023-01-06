const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { townSquareId, playerRoleId, stRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('return')
        .setDescription('Move all active players to Town Square.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.PrioritySpeaker),
    async execute(interaction) {
        await interaction.reply('Returning to town square...');
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.followUp('Unable to return to Town Square - Guild not available');
            return;
        }

        const playerRole = await guild.roles.fetch(playerRoleId);
        playerRole.members.forEach((member, memberId, map) => {
            member.voice.setChannel(townSquareId);
        });

        const stRole = await guild.roles.fetch(stRoleId);
        stRole.members.forEach((member, memberId, map) => {
            member.voice.setChannel(townSquareId);
        })
        interaction.followUp('Successfully returned active players to Town Square.');
    },
};