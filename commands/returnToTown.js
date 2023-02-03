const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { commandsChannelId, townSquareId, playerRoleId, stRoleId, gameChatId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('return')
        .setDescription('Move all active players to Town Square.')
        .addBooleanOption(option =>
            option
                .setName('dragon')
                .setDescription('Dragon?')),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to return to Town Square - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to return to Town Square - This command must be run in the commands channel', ephemeral: true });
            return;
        }
        
        const gameChannel = await guild.channels.fetch(gameChatId);
        const isDragon = interaction.options.getBoolean('dragon') ?? false;
        const logo = new AttachmentBuilder('assets/logo.png');
        const embed = new EmbedBuilder()
            .setTitle(isDragon ? 'The dragon rages!' : 'Dawn breaks...')
            .setColor(0xFF0000)
            .setDescription(isDragon ? 'Everyone back to town square!' : 'Everyone wake up!')
            .setThumbnail('attachment://logo.png')
            .setTimestamp();
        gameChannel.send({ embeds: [embed], files: [logo] });

        const playerRole = await guild.roles.fetch(playerRoleId);
        playerRole.members.forEach((member, memberId, map) => {
            member.voice.setChannel(townSquareId);
        });

        const stRole = await guild.roles.fetch(stRoleId);
        stRole.members.forEach((member, memberId, map) => {
            member.voice.setChannel(townSquareId);
        });

        interaction.reply({ content: 'Successfully returned active players to Town Square.', ephemeral: true});
    },
};