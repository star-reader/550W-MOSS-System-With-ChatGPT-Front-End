import pubsub from 'pubsub-js'
import { setWebSocket } from '@/hooks/ai/useWebSocket';
import { type ClientSetting } from '../../config/interface/main'
import { getWebSocket } from '../ai/useWebSocket'
export default (data: string): string =>{
    if (data.includes('SET V 3.5')){
        const json: ClientSetting = {type : 's', setting : 'gpt', value: 0}
        try {
            getWebSocket().send(JSON.stringify(json))
            return 'GPT_Version Set Successful'
        } catch (error) {
            return 'GPT Version Set Failed, please establish an active WebSocket first'
        }
        
    }else if (data.includes('SET V 4')){
        const json: ClientSetting = {type : 's', setting : 'gpt', value: 1}
        try {
            getWebSocket().send(JSON.stringify(json))
            return 'GPT_Version Set Successful'
        } catch (error) {
            return 'GPT Version Set Failed, please establish an active WebSocket first'
        }
    }else if (data.includes('START AI SYSTEM')){
        
        pubsub.publish('request-init-ai',1)
        return 'System Start Successful'
    }
    else return 'unknown command'
}