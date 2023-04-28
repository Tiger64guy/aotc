const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { commandsChannelId, playerRoleId, gameChatId } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('psychopath')
        .setDescription('Trigger a round of roshambo between a psychopath and their accuser.')
        .addUserOption(option =>
            option
                .setName('psycho')
                .setDescription('The psychopath.')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('accuser')
                .setDescription('The accuser.')
                .setRequired(true)),
    async execute(interaction) {
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.reply({ content: 'Unable to roshambo - Guild not available', ephemeral: true });
            return;
        }
        if (interaction.channelId !== commandsChannelId) {
            interaction.reply({ content: 'Unable to roshambo - This command can only be used in the commands channel', ephemeral: true });
            return;
        }

        const psycho = interaction.options.getMember('psycho');
        const accuser = interaction.options.getMember('accuser');
        if (!psycho.roles.cache.has(playerRoleId)) {
            interaction.reply({ content: 'Unable to roshambo - Chosen Psychopath is not in the game', ephemeral: true });
            return;
        }
        if (!accuser.roles.cache.has(playerRoleId)) {
            interaction.reply({ content: 'Unable to roshambo - Chosen accuser is not in the game', ephemeral: true });
            return;
        }

        const gameChannel = await guild.channels.fetch(gameChatId);
        const roleIcon = new AttachmentBuilder('assets/characters/psychopath.png');
        const initialEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`The Psychopath, ${psycho.displayName}, has been executed!`)
            .setDescription(`Time for some high-stakes roshambo! ${psycho.displayName}, make your choice!`)
            .setThumbnail('attachment://psychopath.png')
            .setTimestamp();
        gameChannel.send({ embeds: [initialEmbed], files: [roleIcon] });

        interaction.reply({ content: 'Roshambo successfully initiated', ephemeral: true });

        const rock = new ButtonBuilder()
            .setCustomId('Rock')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Secondary);
        const paper = new ButtonBuilder()
            .setCustomId('Paper')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Secondary);
        const scissors = new ButtonBuilder()
            .setCustomId('Scissors')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder()
            .addComponents(rock, paper, scissors);

        const psychoDM = await psycho.createDM();
        let psychoChoice = '';
        const psychoPrompt = await psychoDM.send({ content: `Three options lay before you. Which shall you choose? Your time expires <t:${Math.floor(Date.now() / 1000) + 15}:R>.`, components: [row] });
        try {
            const psychoResponse = await psychoPrompt.awaitMessageComponent({ time: 15000 });
            psychoChoice = psychoResponse.customId;
            await psychoResponse.update({ content: `You've chosen ${psychoChoice}. Good luck!`, components: [] });
        }
        catch (e) {
            await psychoPrompt.edit({ content: "Sorry, time's up!", components: [] });
        }

        if (psychoChoice === '') {
            const noPsychoEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`${psycho.displayName} did not respond in time!`)
                .setDescription(`${psycho.displayName}, the Psychopath, loses by default and dies.`)
                .setThumbnail('attachment://psychopath.png')
                .setTimestamp();
            gameChannel.send({ embeds: [noPsychoEmbed], files: [roleIcon] });
            interaction.followUp({ content: 'Roshambo has concluded.', ephemeral: true });
            return;
        }
        const psychoChosenEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`${psycho.displayName}, the Psychopath, has made their choice!`)
            .setDescription(`Now it's time for ${accuser.displayName}, the accuser, to make *their* choice.`)
            .setThumbnail('attachment://psychopath.png')
            .setTimestamp();
        gameChannel.send({ embeds: [psychoChosenEmbed], files: [roleIcon] });

        const accuserDM = await accuser.createDM();
        let accuserChoice = '';
        const accuserPrompt = await accuserDM.send({ content: `Three symbols, but only one of them right. Make your choice. Carefully. Your time expires <t:${Math.floor(Date.now() / 1000) + 15}:R>.`, components: [row] });
        try {
            const accuserResponse = await accuserPrompt.awaitMessageComponent({ time: 15000 });
            accuserChoice = accuserResponse.customId;
            await accuserResponse.update({ content: `You've chosen ${accuserChoice}. But was that the correct choice?`, components: [] });
        }
        catch (e) {
            await accuserPrompt.edit({ content: "Sorry, time's up~", components: [] });
        }

        if (accuserChoice === '') {
            const noAccuserEmbed = new EmbedBuilder()
                .setColor(0xFF000)
                .setTitle(`${accuser.displayName} did not respond in time!`)
                .setDescription(`${accuser.displayName}, the accuser, loses by default. ${psycho.displayName}, the Psychopath, lives.`)
                .setThumbnail('attachment://psychopath.png')
                .setTimestamp();
            gameChannel.send({ embeds: [noAccuserEmbed], files: [roleIcon] });
            interaction.followUp({ content: 'Roshambo has concluded.', ephemeral: true });
            return;
        }
        const resultEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('The results are in!')
            .setDescription("Both players have made their choices. Let's see the results...")
            .setThumbnail('attachment://psychopath.png')
            .addFields(
                { name: `Psychopath: ${psycho.displayName}`, value: psychoChoice, inline: true },
                { name: `Accuser: ${accuser.displayName}`, value: accuserChoice, inline: true },
                { name: 'Result', value:
                    (psychoChoice === 'Rock' && accuserChoice === 'Paper') ||
                    (psychoChoice === 'Paper' && accuserChoice === 'Scissors') ||
                    (psychoChoice === 'Scissors' && accuserChoice === 'Rock') ?
                        `${accuser.displayName}, the accuser, wins! ${psycho.displayName}, the Psychopath, dies!` :
                        (psychoChoice === accuserChoice ?
                            `It's a draw! ${psycho.displayName}, the Psychopath, lives.` :
                            `${psycho.displayName}, the Psychopath, wins! They live!`),
                })
            .setTimestamp();
        gameChannel.send({ embeds: [resultEmbed], files: [roleIcon] });
        interaction.followUp({ content: 'Roshambo has concluded.', ephemeral: true });
    },
};