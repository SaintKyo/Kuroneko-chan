const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const sqlite3 = require('sqlite3').verbose();
var cli = new Discord.Client({autoReconnect:true});

Promise.resolve()
  // First, try connect to the database
//  .then(() => db.open('./botData.db', { Promise }))
  .then((db) => {
    console.log('Database has been connected.')
    client.on('ready',() => {
      console.log('I\'m online!')
    })
    // Tells the console that the bot is online and functional
    client.on('guildMemberAdd', member => {add(member);})
    client.on('guildMemberRemove', member => {remove(member);})
    client.on('message', message => {
      if (message.content === settings.prefix + 'Roles') {roleId(message);}
      else if (message.content.startsWith(settings.prefix + 'Purge')) {purge(message);}
      else if (message.content === settings.prefix + 'Ping') {ping(message);}
      else if (message.content.startsWith(settings.prefix + 'Roll')) {roll(message);}
      else if (message.content === settings.prefix + 'Shutdown' && message.author.id === '159448888334352384') {stop(message);}
      else if (message.content.startsWith(settings.prefix +'8Ball')) {fortune(message);}
      else if (message.content === settings.prefix + 'Smug') {smug(message);}
    })
  })
  .catch(err => console.error(err.stack))


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
//Function for deciding if an input is a number or not.
function roleId(message) {
  var rolesString = "";
  var rolesArray = message.member.guild.roles.array();
  for (var r = 0; r < rolesArray.length; r++) {
    rolesString += rolesArray[r].name + ' ' + rolesArray[r].id + '\n';
  }
  message.reply(rolesString);
}
//Function for Showing roles and their respective Id's
function purge(message) {
  let command = message.content.replace(settings.prefix + 'Purge', '');
  if (isNumber(command)) {
    let limit = parseInt(command);
    if (limit >= 2 || limit <= 100) {
      message.channel.fetchMessages({
        limit: limit
      }).then(messages => message.channel.bulkDelete(messages));
    }
  } else {
    message.reply(command + ' is not a valid number, please remember to use a number greater than 2 and less than 100.')
  }
}
//Deletes a specified amount of messages
function ping(message) {
    message.reply('Pong');
}
//Basic Ping/Pong command to test the bot's connection speeds
function add(member) {
  console.log(member);
  member.guild.defaultChannel.sendMessage('Hello ' + member.displayName + ', welcome to the server! Make sure to check the <#327009543466909697>, and make your self at home.');
  member.addRole('310922421614149643');
}
//Automatically alerts everyone that someone new has joined the guild/gives them the basic member roll
function remove(member) {
  console.log(member);
  member.guild.defaultChannel.sendMessage('What a shame! ' + member.displayName + ' has left the chat.');
}
//Automatically alerts everyone that someone has left the guild
function roll(message) {
  let dice = message.content.replace(settings.prefix + 'Roll', ' ');
  if (isNumber(dice)) {
    let max = parseInt(dice);
    let rand = Math.floor(Math.random() * max) + 1;
    message.reply(':game_die:' + rand);
  }
}
//Rolls a random number
function stop(message) {
  client.destroy();
  console.log('Bot has shutdown successfully.');
  process.exit(0);
}
//Shuts down the bot and terminates the process
function fortune(message) {
let db = new sqlite3.Database('./botData.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
let sql = `SELECT * from eightBall`;
let params = [];
db.all(sql,params,(err, rows ) => {
  if (err) {
    throw err;
  }
  let rand = Math.floor(Math.random() * 20) + 1;
  rows.forEach((row) => {
    if (row.Number === rand) {
    message.channel.sendMessage(':8ball: ' + row.Fortune);
  }
})
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
})
}
//Does an 8Ball roll and spits out a random response out of 20
function smug(message) {
  console.log(message);
let db = new sqlite3.Database('./botData.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
let sql = `SELECT * from smugAnimeGirl`;
let params = [];
db.all(sql,params,(err, rows ) => {
  if (err) {
    throw err;
  }
  let rand = Math.floor(Math.random() * rows.length) + 1;
  rows.forEach((row) => {
    if (row.count === rand) {
    message.channel.sendMessage(row.link);
  }
})
// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
})
}

client.login(settings.token);
