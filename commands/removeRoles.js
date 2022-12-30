const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeroles')
        .setDescription('Remove game roles from all members.')
        .addRoleOption(option =>
            option
                .setName('strole')
                .setDescription('The role used for the storyteller(s).'))
        .addRoleOption(option =>
            option
                .setName('playerrole')
                .setDescription('The role used for players.')),
    async execute(interaction) {
        await interaction.reply('Removing player roles...');
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.followUp('Unable to remove roles - Guild not available');
            return;
        }

        const stRole = interaction.options.getRole('strole');
        const playerRole = interaction.options.getRole('playerrole');
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