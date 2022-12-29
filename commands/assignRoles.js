const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assignroles')
        .setDescription('Assigns game roles to all active players.')
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The town square channel')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true))
        .addRoleOption(option => 
            option
                .setName('strole')
                .setDescription('The role to use for the storyteller(s).')
                .setRequired(true))
        .addRoleOption(option =>
            option
                .setName('playerrole')
                .setDescription('The role to use for players.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Assigning player roles...');
        const guild = interaction.guild;
        if (!guild || !guild.available) {
            interaction.followUp('Unable to assign roles - Guild not available');
            return;
        }

        const channel = interaction.options.getChannel('channel');
        const stRole = interaction.options.getRole('strole');
        const playerRole = interaction.options.getRole('playerrole');

        let count = 0;
        const memberManager = guild.members;
        // console.log(memberManager);
        const memberList = await memberManager.list();
        memberList.forEach((member, memberId, map) => {
            if (member.voice.channel == channel) {
                if(member.displayName.startsWith('(ST)')) {
                    memberManager.addRole({
                        user: member,
                        role: stRole
                    });
                    count++;
                }
                else if(!member.displayName.startsWith('!')) {
                    memberManager.addRole({
                        user: member,
                        role: playerRole
                    });
                    count++;
                }
            }
        });
        interaction.followUp(`Successfully assigned roles to ${count} members.`);
    },
};