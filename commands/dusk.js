const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { playerRoleId, stRoleId, nightCategoryId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dusk')
        .setDescription('Move all active players into cottages.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        await interaction.reply('Moving to cottages...');
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.followUp('Unable to move to cottages - Guild not available');
            return;
        }

        const nightCategory = await guild.channels.fetch(nightCategoryId);
        const playerRole = await guild.roles.fetch(playerRoleId);
        const playerList = playerRole.members;
        const cottageList = nightCategory.children.cache.randomKey(playerList.size);
        for (let index = 0; index < playerList.size; index++) {
            playerList.at(index).voice.setChannel(cottageList.at(index));
        }
        interaction.followUp('Successfully moved active players to cottages.');
    },
};