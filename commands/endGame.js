const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { commandsChannelId, stRoleId, playerRoleId, gameChatId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('endgame')
        .setDescription('End the game and remove game roles from all members.')
        .addBooleanOption(option =>
            option
                .setName('goodwin')
                .setDescription('Did good win?')),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to remove roles - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to remove roles - This command must be run in the commands channel', ephemeral: true });
            return;
        }

        const stRole = await guild.roles.fetch(stRoleId);
        const playerRole = await guild.roles.fetch(playerRoleId);
        if (!stRole && !playerRole) {
            interaction.reply('Unable to remove roles - No roles specified');
            return;
        }
        const gameChannel = await guild.channels.fetch(gameChatId);

        const memberManager = guild.members;
        const memberList = memberManager.cache;
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

        const goodWin = interaction.options.getBoolean('goodwin') ?? null;
        const logo = new AttachmentBuilder('assets/logo.png');
        const embed = new EmbedBuilder()
            .setTitle('Game over!')
            .setColor(0xFF0000)
            .setDescription(goodWin === null ? 'I hope everyone had fun!' :
                (goodWin ? 'Congrats, good team!' : 'Congrats, evil team!'))
            .setThumbnail('attachment://logo.png')
            .setTimestamp();
        gameChannel.send({ embeds: [embed], files: [logo] });
        interaction.reply({ content: 'Successfully removed game roles from all members.', ephemeral: true });
    },
};