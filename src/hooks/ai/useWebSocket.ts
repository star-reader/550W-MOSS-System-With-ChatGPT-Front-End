import axios from 'axios'
import pubsub from 'pubsub-js'
import { isAuth } from "../auth/useAuth"
let socket: WebSocket

const setWebSocket =  () => {
    if (!isAuth()) return
    socket = new WebSocket('wss://localhost:17700/ai/moss')
    socket.onmessage = (e) => {
        const message = JSON.parse(e.data)
        pubsub.publish('ai-data', message)
    }
}

const getWebSocket = () => {
    return socket
}

export {
    setWebSocket,
    getWebSocket
}