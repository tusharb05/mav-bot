'use strict';

require('dotenv').config();

const https = require('https')

// console.log(process.env.BOT_TOKEN);

const {Client, MessageAttachment, MessageEmbed} = require('discord.js'); //importing from this lib. also {} means object destructuring meaning we can directly import certain functions from the whole main class

const client = new Client(); //this is an instance of the Client class

const PREFIX = '!';

client.on('ready', ()=>console.log('logged in')); //ready is the event we want to handle
//also can log: client.user.tag or client.user.username for bot

client.on('message', (message)=>{
    // console.log(message.content);
    // console.log(message.author.username);
    // console.log(message.author.tag);
    // if(message.content === "h" && message.author.bot == false){ //or && message.author.username != 'Bot1'
    //     message.channel.send('h');
    // }
    if(message.author.bot == true) return;
    if(message.content.startsWith(PREFIX)){
        const [cmd, ...args] = message.content //... is the spreader operator which means it takes as many as there are and this whole does that stores the first part in cmd then all whitespaces separate chars and save them to arrays
        .trim() 
        .substring(PREFIX.length) //trim removes all white spaces
        .split(/\s+/);//this expression basically captures all the white spaces
        console.log(cmd);
        console.log(args);

        let user = message.mentions.members.first() || args[0];

        if(cmd === 'kick'){
            if(!message.member.hasPermission('KICK_MEMBERS'))
                return message.channel.send('You do not have permissions to kick that user');
            if(args.length===0) return message.reply('Please provide an ID');
            // const member = message.guild.members.cache.get(args[0]) //guild means server
            // console.log(member);
            // const member = message.guild.members.cache.find(x=>x.user.username == user)
            const member = message.mentions.members.first() || 
            message.guild.members.cache.get(args[0]) || 
            message.guild.members.cache.find(x=>x.user.username == args[0]);

            // console.log('----------------------');
            // console.log(user);
            // console.log('----------------------')
            if(member){
                member
                .kick()
                .then((member)=>{
                    message.reply(`${member} was kicked`);
                })
                .catch((err)=> {
                    message.reply('I do not have permissions to kick that user');
                })
                
            }
            else {
                message.channel.send("That member was not found");
            }
            
        } else if(cmd === 'ban'){
            if(!message.member.hasPermission('BAN_MEMBERS'))
                return message.channel.send('You do not have permissions to kick that user');
            
            if(args.length===0) return message.reply('Please provide an ID');
            
            console.log(message.mentions);
            message.guild.members.ban(user)
            .then((member)=>message.reply(`${member} was banned`))
            .catch((err)=> console.log(err))
        } else if(cmd === 'happy'){
            const attachment = new MessageAttachment('https://cms.qz.com/wp-content/uploads/2019/12/RTR33B7W-1-e1575456543742.jpg?quality=75&strip=all&w=1600&h=900&crop=1');
            message.channel.send(attachment);
        } else if(cmd === 'toss'){
            const number = Math.ceil((Math.random()*10))
            console.log(number);
            if(number % 2 == 0){
                message.channel.send("It's a HEADS!");
            } else {
                message.channel.send("It's a TAILS!");
            }
        } else if(cmd === 'avatar'){
            if(args.length == 0){
                message.channel.send(message.author.displayAvatarURL());
            } else {
                let avtrMention = message.mentions.users.first();
                if(avtrMention){
                    message.channel.send(avtrMention.avatarURL())
                } else {
                    message.channel.send('Mentioned user not found')
                }
                // console.log(avtrMention.avatarURL)
                
            }
            
        }else if(cmd === 'joke'){
            // fetch('https://official-joke-api.appspot.com/random_joke')
            //     .then((res)=> res.json())
            //     .then((data) => {
            //         console.log(data)
            //         // message.channel.send(data.setup);
            //         // message.channel.send('||' + data.punchline + '||');
            //     })
            https.get('https://official-joke-api.appspot.com/random_joke', (res)=>{
                // console.log(res.statusCode);
                res.on('data', (data)=>{
                    const joke = JSON.parse(data);
                    message.channel.send(`${joke.setup}`);
                    message.channel.send(`||${joke.punchline}||`);
                })
            });
        } else if(cmd === 'meme'){
            https.get('https://meme-api.herokuapp.com/gimme', (res)=>{
                res.on('data', (data)=>{
                    const meme = JSON.parse(data);
                    message.channel.send(meme.url);
                })
            })
        } else if(cmd === 'addRole'){
            // let roleToBeAddedTo = args[0];
            // let roleTarget = args[1];
            // console.log('member: '+roleToBeAddedTo.substring(3, 21))
            // console.log("role: " + roleTarget.substring(3, 21));
            // let isMember = message.guild.members.cache.get(roleToBeAddedTo.substring(3, 21));
            // if(isMember){
            //     // console.log('found');
            //     message.mentions.members.first().roles.add(message.mentions.roles.first()).catch(console.log(err))
            // } else {
            //     console.log('not found')
            // }
            if(args.length == 0){
                message.channel.send('Please mention the user, followed by the role you want him to give');
            }
            else if(args.length == 1){
                message.channel.send('You have either not mentioned the user or the role.')
            }
            else if(args.length == 2){
                if(!message.member.hasPermission('MANAGE_ROLES')){
                    return message.reply('Whoops! You don\'t have permissions for that.')
                }else {
                    if(message.guild.members.cache.get(args[0].substring(3,21)) && message.guild.roles.cache.get(args[1].substring(3,21))){
                        let mentionedUser = message.mentions.members.first();
                        let roleTarget = args[1];
                        let role = message.guild.roles.cache.get(roleTarget.substring(3,21))
                        mentionedUser.roles.add(role);
                        message.channel.send(`${message.mentions.roles.first()} role was added to ${mentionedUser}.`)
                    } else if(!message.guild.members.cache.get(args[0].substring(3,21)) && !message.guild.roles.cache.get(args[1].substring(3,21))){
                        message.channel.send('Both, the user mentioned and the role mentioned are incorrect.')
                    } else if(!message.guild.members.cache.get(args[0].substring(3,21)) || !message.guild.roles.cache.get(args[1].substring(3,21))){
                        message.channel.send('Either the user mentioned or the role mentioned is incorrect.')
                    }
                    
                }
            }
            ///////////////////////////////////////////////////////////////////
            // let roleTarget = args[1];
            // let role = message.guild.roles.cache.find(r => r.name === roleTarget);
            // let a = message.mentions.members.first()
            // a.roles.add(role).catch(console.log('error'));
        }else if(cmd === 'removeRole'){
            // console.log('role removed')
            if(args.length === 0){
                message.channel.send('Please mention the user followed by the role you want to remove');
            } else if(args.length === 1){
                message.channel.send('You have either not mentioned the user of the role you want to be removed.');
            }else if(args.length === 2){
                if(!message.member.hasPermission('MANAGE_ROLES')){
                    return message.reply('Whoops! You don\'t have permissions for that.')
                }else {
                    let userMention = message.mentions.members.first();
                    if(message.guild.members.cache.get(args[0].substring(3,21)) && message.guild.roles.cache.get(args[1].substring(3,21))){
                        // message.channel.send('found')
                        let roleDel = args[1];
                        userMention.roles.remove(message.guild.roles.cache.get(roleDel.substring(3,21)));
                        message.channel.send(`${userMention}'s role of ${message.mentions.roles.first()} was removed.`)
                    }else if(!message.guild.members.cache.get(args[0].substring(3,21)) && !message.guild.roles.cache.get(args[1].substring(3,21))){
                        message.channel.send('Both, the user mentioned and the role mentioned are incorrect.')
                    } else if(!message.guild.members.cache.get(args[0].substring(3,21)) || !message.guild.roles.cache.get(args[1].substring(3,21))){
                        message.channel.send('Either the user mentioned or the role mentioned is incorrect.');
                    }
                    
                }  
            }
            
        }else if(cmd === 'help'){
            console.log(message.guild.members.cache.find(x=>x.user.username === 'Ad Astra!'))

            let embed = new MessageEmbed()
                .setColor('#393e46')
                .setTitle('Commands')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/274/rocket_1f680.png')
                .addFields(
                    {name: 'General[12]', value: '``!kick``, ``!ban``, ``!addRole``, ``!removeRole``, ``!toss``, ``!type``, ``!meme``, ``!joke``, ``!avatar``, ``!mav``, ``!help``, ``!find``', inline: false},
                    {name: 'Prefix', value: '``!``', inline: false},
                    {name: 'Moderation Commands[4]', value: '``!kick``, ``!ban``, ``!addRole``, ``!removeRole``', inline: false},
                    {name: 'Fun Commands[6]', value: '``!toss``, ``!type``, ``!meme``, ``!joke``, ``!avatar``, ``!mav``', inline: false},
                    {name: 'Help Command[2]', value: '``!help``, ``!find``', inline: false}
                )
                
                .setFooter('Get things done faster, with Mav')
            message.channel.send(embed);
            console.log(message.author.displayAvatarURL())
        }else if(cmd === 'mav'){
            let embed2 = new MessageEmbed()
                .setColor('#393e46')
                .setTitle('Mav')
                .setDescription('Get things done faster, with Mav')
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/274/rocket_1f680.png')
            message.channel.send(embed2);
        } else if(cmd === 'type'){
            message.channel.send(args.join(' '));
        } else if(cmd === 'find'){
            if(args.length === 0){
                let user = message.guild.members.cache.get(message.author.id);
                // console.log(user)
                let totalRoles = []
                user._roles.forEach((a)=>{
                    let foundRoles = message.guild.roles.cache.get(a);
                    totalRoles.push(foundRoles);
                })
                console.log(message.author)
                let newEmbed = new MessageEmbed()
                .setAuthor(message.author.username + '#' + message.author.discriminator)
                .setThumbnail(message.author.displayAvatarURL())
                .setColor('#393e46')
                .addFields(
                    {name: 'Username', value: message.author.username, inline: false},
                    {name: 'Discriminator', value: message.author.discriminator, inline: false},
                    {name: 'Roles', value: totalRoles.length==0 ? 'none':totalRoles, inline: false},
                    {name: 'ID', value: message.author.id, inline: false},
                    {name: 'BOT', value: message.author.bot, inline: false},
                )
                message.channel.send(newEmbed)
            } else {
                let mentionedUser2 = message.mentions.users.first();
                if(mentionedUser2){
                    // console.log('asdf')
                    let mentionedUser3 = message.mentions.members.first();
                    console.log(mentionedUser3)
                    let roles = mentionedUser3._roles;
                    let rolesMention = []
                    roles.forEach((single)=>{
                        let asdf = message.guild.roles.cache.find(r => r.id === single);
                        rolesMention.push(asdf);
                    })
                    // console.log(message.guild.roles.cache.find(r => r.id == mentionedUser2.roles))
                    let newEmbed = new MessageEmbed()
                        .setAuthor(mentionedUser2.username + '#' + mentionedUser2.discriminator)
                        .setThumbnail(message.mentions.users.first().avatarURL())
                        .setColor('#393e46')
                        .addFields(
                            {name: 'Username', value: mentionedUser2.username, inline: false},
                            {name: 'Discriminator', value: mentionedUser2.discriminator, inline: false},
                            {name: 'Roles', value: rolesMention.length==0 ? 'none':rolesMention, inline: false},
                            {name: 'ID', value: mentionedUser2.id, inline: false},
                            {name: 'BOT', value: mentionedUser2.bot, inline: false},
                        )
                    message.channel.send(newEmbed)
                } else {
                    message.channel.send('Mentioned user not found!')
                }
                
            }
        }
    }
});

client.on('guildMemberAdd', newMember => {
    console.log('NEW MEMBER!')
    const channel = newMember.guild.channels.cache.find(ch => ch.name === 'general');
    if(!channel) return;
    channel.send(`Welcome to the server, ${newMember}!`);
});

client.login(process.env.BOT_TOKEN)//to login the bot
