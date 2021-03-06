var DiscordClient = require('discord.io');
var spawn = require('child_process').spawn;
var bot = new DiscordClient({
	autorun: true,
	email: "",
	password: ""
});

var voiceChannelID = "",
	file = "";

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
	
	bot.joinVoiceChannel(voiceChannelID, function() {
		bot.getAudioContext({channel: voiceChannelID, stereo: true}, function(stream) {
			var ffmpeg = spawn('ffmpeg' , [ //Or 'avconv', if you have it instead
				'-i', file,
				'-f', 's16le',
				'-ar', '48000',
				'-ac', '2',
				'pipe:1'
			], {stdio: ['pipe', 'pipe', 'ignore']});
			
			ffmpeg.stdout.once('readable', function() {
				stream.send(ffmpeg.stdout);
			});
			
			ffmpeg.stdout.once('end', function() {
				//The file's done
			});
		});
	});
});
