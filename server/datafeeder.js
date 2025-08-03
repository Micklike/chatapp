import User from "./models/user.js"
import Message from "./models/message.js"



async function deleteall(){

await User.deleteMany({})
await Message.deleteMany({})

}

deleteall()
