const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
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

        const gameChannel = await guild.channels.fetch(gameChatId);
        const logo = new AttachmentBuilder('assets/logo.png');
        const embed = new EmbedBuilder()
            .setTitle('Dusk falls...')
            .setColor(0xFF0000)
            .setDescription('Everybody go to sleep!')
            .setThumbnail('attachment://logo.png')
            .setFooter({ text: 'Sleep tight...' })
            .setTimestamp();
        gameChannel.send({ embeds: [embed], files: [logo] });

        const nightCategory = await guild.channels.fetch(nightCategoryId);
        const playerRole = await guild.roles.fetch(playerRoleId);
        const stRole = await guild.roles.fetch(stRoleId);
        const playerList = playerRole.members;
        const stList = stRole.members;
        const cottageList = nightCategory.children.cache.randomKey(playerList.size + 1);
        const stuckList = [];
        for (let index = 0; index < playerList.size; index++) {
            if (playerList.at(index).voice.channel) {
                playerList.at(index).voice.setChannel(cottageList.at(index));
            }
            else {
                stuckList.push(guild.members.resolve(playerList.at(index)).displayName);
            }
        }
        for (let sti = 0; sti < stList.size; sti++) {
            if (stList.at(sti).voice.channel) {
                stList.at(sti).voice.setChannel(cottageList.at(cottageList.length - 1));
            }
            else {
                stuckList.push(guild.members.resolve(playerList.at(sti)).displayName);
            }
        }
        if (stuckList.length > 0) {
            let message = 'Failed to move the following players (disconnected from voice chat):\n';
            for (const str of stuckList) {
                message += str + '\n';
            }
            interaction.reply({ content: message, ephemeral: true });
        }
        else {
            interaction.reply({ content: 'Successfully moved active players to cottages.', ephemeral: true });
        }
    },
};