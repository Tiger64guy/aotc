const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { stRoleId, playerRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeroles')
        .setDescription('Remove game roles from all members.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.PrioritySpeaker),
    async execute(interaction) {
        await interaction.reply('Removing player roles...');
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.followUp('Unable to remove roles - Guild not available');
            return;
        }

        const stRole = await guild.roles.fetch(stRoleId);
        const playerRole = await guild.roles.fetch(playerRoleId);
        if (!stRole && !playerRole) {
            interaction.followUp('Unable to remove roles - No roles specified');
            return;
        }

        const memberManager = guild.members;
        const memberList = await memberManager.list();
        memberList.forEach((member, memberId, map) => {
            if(stRole) {
                memberManager.removeRole({
                    user: member,
                    role: stRole
                });
            }
            if(playerRole) {
                memberManager.removeRole({
                    user: member,
                    role: playerRole
                });
            }
        });
        interaction.followUp('Successfully removed game roles from all members.');
    },
};