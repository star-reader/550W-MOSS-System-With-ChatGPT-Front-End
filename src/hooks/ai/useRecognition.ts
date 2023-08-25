import pubsub from 'pubsub-js'
import { isSpeeking } from './useSpeech'
let flag = false
export default (text?: string) => {
    //module.d.ts
    //因为typescript不认webkitSpeechRecognition，所以手动用any隐式来取消ts报错
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'zh-CN'
    recognition.continuous = true
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.start()
    recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        if (isSpeeking()) return
        if (!transcript) return pubsub.publish('speeking-finished',0)
        if (text?.includes(transcript)) return pubsub.publish('speeking-finished',0)
        pubsub.publish('recognition-data', transcript)
    }
    // recognition.onerror = (event: any) => {
    //     try {
    //         recognition.start()
    //     } catch (error) {
            
    //     }
        
    // }
}