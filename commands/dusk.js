const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { commandsChannelId, gameChatId, playerRoleId, stRoleId, nightCategoryId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dusk')
        .setDescription('Move all active players into cottages.'),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to move to cottages - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to move to cottages - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const nightCategory = await guild.channels.fetch(nightCategoryId);
        const gameChannel = await guild.channels.fetch(gameChatId);
        const playerRole = await guild.roles.fetch(playerRoleId);
        const playerList = playerRole.members;
        const cottageList = nightCategory.children.cache.randomKey(playerList.size);
        for (let index = 0; index < playerList.size; index++) {
            playerList.at(index).voice.setChannel(cottageList.at(index));
        }

        const logo = new AttachmentBuilder('assets/logo.png');
        const embed = new EmbedBuilder()
            .setTitle('Dusk falls...')
            .setColor(0xFF0000)
            .setDescription('Everybody go to sleep!')
            .setThumbnail('attachment://logo.png')
            .setFooter({ text: 'Sleep tight...' })
            .setTimestamp();
        gameChannel.send({ embeds: [embed], files: [logo] });
        interaction.reply({ content: 'Successfully moved active players to cottages.', ephemeral: true });
    },
};