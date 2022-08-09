const token = "5466728462:AAGOk5yNdovbDZ41Oxn4T66CsdthLLoKtU0"
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, {polling: true})
const {gameOptions, againOptions} = require('./options.js')
const chats = {}

const numGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Угадай цифру от 0 до 9', gameOptions)
  const randomNum = Math.floor(Math.random()*10)
  chats[chatId] = randomNum
}

const start = () => {
  bot.on("message", async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    //await bot.sendMessage(chatId, `Ты мне написал ${text}`)
    if(text === 'game'){
      numGame(chatId)
    }
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === 'again'){
      return numGame(chatId)
    }
    if(data === chats[chatId]){
      return await bot.sendMessage(chatId, 'Угадал!', againOptions)
    }else{
      return bot.sendMessage(chatId, `Не та цифра, загаданное число - ${chats[chatId]}`, againOptions)
    }
  })
}
start()