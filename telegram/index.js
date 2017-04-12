const { Markup } = Telegraf = require('telegraf');
const enebra = new Telegraf('354215638:AAEmWoBPUf7544u_xGBljYDwGlDHyPnlJ2E');
//enebra

enebra.catch(function(err){
    console.log('Ooops', err);
});
enebra.use(function(ctx, next){
    //ctx.state.role = getUserRole(ctx.message);
    console.log("❤".codePointAt(0), String.fromCodePoint(10084));
    return next();
});




enebra.use(function (ctx, next) {
    /*
     console.log(ctx.update.message.chat);
     console.log(ctx.update.message.from);
     console.log('Тип сообщения - ' + ctx.updateType);
     console.log('Содержимое сообщения - ' + ctx.updateSubType);
     console.log(ctx.update.message.entities);
     console.log(ctx.telegram);             // Telegram instance
     console.log(ctx.updateType);           // Update type (message, inline_query, etc.)
     console.log([ctx.updateSubType]);      // Update subtype (text, sticker, audio, etc.)
     console.log([ctx.me]);                 // Bot username
     console.log([ctx.message]);            // Received message
     console.log([ctx.editedMessage]);      // Edited message
     console.log([ctx.inlineQuery]);        // Received inline query
     console.log([ctx.chosenInlineResult]); // Received inline query result
     console.log([ctx.callbackQuery]);      // Received callback query
     console.log([ctx.channelPost]);        // New incoming channel post of any kind — text, photo, sticker, etc.
     console.log([ctx.editedChannelPost]);  // New version of a channel post that is known to the bot and was edited
     console.log([ctx.chat]);               // Current chat info
     console.log([ctx.from]);               // Sender info
     console.log([ctx.match]);              // Regex match (available only for `hears`, `command`, `action` handlers)
     */
    const start = new Date();
    return next().then(function(){
        const ms = new Date() - start;
        console.log('response time %sms', ms);
    })
});

const sayYoMiddleware = function(ctx, next){
    ctx.reply('yo').then(next);
};
enebra.telegram.getMe().then(function(botInfo){
    app.options.username = botInfo.username;
});

enebra.command('sss', function(ctx, next){
    ctx.reply('---commandss');
    sayYoMiddleware(ctx, next);
    //ctx.reply('Welcome!').then(next);
});

Telegraf.mount('message', function(ctx, next){
    ctx.reply('---mountmessage').then(next);
    //ctx.reply('Welcome!').then(next);
});
enebra.action('sss', function(ctx, next){
    ctx.reply('---action').then(next);
    //ctx.reply('Welcome!').then(next);
});
enebra.on('command', function(ctx, next){
    ctx.reply('---command-command').then(next);
    //ctx.telegram.sendCopy(ctx.from.id, ctx.message, replyOptions).then(next)
});
enebra.on('message', function(ctx, next){
    console.log(ctx.message.text);
    ctx.reply('---message').then(next);
    //ctx.telegram.sendCopy(ctx.from.id, ctx.message, replyOptions).then(next)
});
enebra.on('text', function(ctx, next){
    ctx.reply('---text').then(next);
});

enebra.hears('hi', function(ctx, next){// текстовое сообщение с определённым наборо
    ctx.reply('---hi').then(next);
    //ctx.reply('Hey there!').then(next)
});

enebra.on('sticker', function(ctx, next){
    //console.log(ctx.message.sticker);
    console.log(ctx);
    ctx.reply('---sticker').then(next);
    //ctx.reply('👍').then(next)
});



enebra.on('/quit', function(ctx, next){
    ctx.telegram.leaveChat(ctx.message.chat.id);
    ctx.leaveChat().then(next);
});

enebra.on('callback_query', function(ctx, next){
    ctx.telegram.answerCallbackQuery(ctx.callbackQuery.id);
    ctx.answerCallbackQuery().then(next);
});

enebra.on('inline_query', function(ctx, next){
    const result = [];
    ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
    ctx.answerInlineQuery(result).then(next);
});
const replyOptions = Markup.inlineKeyboard([
    Markup.urlButton('❤', 'http://telegraf.js.org'),
    Markup.urlButton('👍', 'http://telegraf.js.org')
]).extra();
enebra.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, replyOptions))

enebra.startPolling();
//telegraf.stop()