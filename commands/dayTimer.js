const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { commandsChannelId, gameChatId, playerRoleId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daytimer')
        .setDescription('Start a timer for daytime conversations.')
        .addIntegerOption(option =>
            option
                .setName('duration')
                .setDescription('The number of minutes to set the timer for')
                .setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to start day timer - Guild not available', ephemeral: true });
            return;
        }
        if(interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to start day timer - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const gameChannel = await guild.channels.fetch(gameChatId);
        const playerRole = await guild.roles.fetch(playerRoleId);
        const duration = interaction.options.getInteger('duration');
        if(duration < 1) {
            interaction.reply({ content: 'Unable to start day timer - Duration must be at least 1 minute', ephemeral: true });
            return;
        }
        const now = Math.floor(interaction.createdTimestamp / 1000);
        const end = now + duration * 60;
        const logo = new AttachmentBuilder('assets/logo.png');
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Whispers are now open!')
            .setDescription(`You have ${duration} minutes; whispers close at <t:${end}:t> (<t:${end}:R>)`)
            .setThumbnail('attachment://logo.png')
            .setTimestamp()
        gameChannel.send({ embeds: [embed], files: [logo] });
        interaction.reply({ content: `Successfully started a timer for ${duration} minutes.`, ephemeral: true });
        setTimeout(() => {
            const warning = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('One minute left!')
                .setDescription('Finish up your conversations!')
                .setThumbnail('attachment://logo.png')
                .setTimestamp()
            gameChannel.send({ embeds: [warning], files: [logo] });
        }, (duration - 1) * 60000);
        setTimeout(() => {
            interaction.followUp({ content: "Time's up!", ephemeral: true });
        }, duration * 60000);
    },
};