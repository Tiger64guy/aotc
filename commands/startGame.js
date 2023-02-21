const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { gameChatId, townSquareId, stRoleId, playerRoleId, devId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startgame')
        .setDescription('Starts a new game, assigning game roles to all active players.'),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to assign roles - Guild not available', ephemeral: true });
            return;
        }

        const playerRole = await guild.roles.fetch(playerRoleId);
        if (playerRole.members.size > 0) {
            interaction.reply({ content: 'Unable to assign roles - Game already in progress.', ephemeral: true });
            return;
        }

        const gameChannel = await guild.channels.fetch(gameChatId);
        const townChannel = await guild.channels.fetch(townSquareId);
        const stRole = await guild.roles.fetch(stRoleId);

        const storytellers = [];
        const players = [];
        townChannel.members.forEach((member, _memberId, _map) => {
            if (member.displayName.startsWith('(ST)')) {
                storytellers.push(member);
            }
            else if (!member.displayName.startsWith('!')) {
                players.push(member);
            }
        });
        const fromDev = devId && interaction.user.id === devId;
        if (storytellers.length === 0 && !fromDev) {
            interaction.reply({ content: 'Unable to assign roles - No storytellers present', ephemeral: true });
            return;
        }
        const memberManager = guild.members;
        for (const player of players) {
            memberManager.addRole({
                user: player,
                role: playerRole,
            });
        }
        for (const st of storytellers) {
            memberManager.addRole({
                user: st,
                role: stRole,
            });
        }

        const thumbnail = new AttachmentBuilder('assets/logo.png');
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('New game started!')
            .setThumbnail('attachment://logo.png')
            .addFields(
                { name: 'Storytellers', value: storytellers.length > 0 ? storytellers.join('\n') : 'None' },
                { name: 'Players', value: players.length > 0 ? players.join('\n') : 'None' },
            )
            .setTimestamp()
            .setFooter({ text: 'Good luck, and have fun!' });
        gameChannel.send({ embeds: [embed], files: [thumbnail] });
        interaction.reply({ content: `Successfully assigned roles to ${storytellers.length + players.length} members.${(storytellers.length === 0 && fromDev) ? '\nDeveloper override applied.' : ''}`, ephemeral: true });
    },
};