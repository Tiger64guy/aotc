const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { gameChatId, townSquareId, stRoleId, playerRoleId } = require('../config.json');

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
            interaction.reply({ content: 'Unable to assign roles - Game already in progress.', ephemeral: true})
            return;
        }
        
        const gameChannel = await guild.channels.fetch(gameChatId);
        const townChannel = await guild.channels.fetch(townSquareId);
        const stRole = await guild.roles.fetch(stRoleId);

        let count = 0;
        let storytellers = [];
        let players = [];
        townChannel.members.forEach((member, memberId, map) => {
            if(member.displayName.startsWith('(ST)')) {
                guild.members.addRole({
                    user: member,
                    role: stRole
                });
                count++;
                storytellers.push(member.displayName);
            }
            else if(!member.displayName.startsWith('!')) {
                guild.members.addRole({
                    user: member,
                    role: playerRole
                });
                count++;
                players.push(member.displayName);
            }
        });

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
        interaction.reply({ content: `Successfully assigned roles to ${count} members.`, ephemeral: true });
    },
};