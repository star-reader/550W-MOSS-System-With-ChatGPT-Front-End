import pubsub from 'pubsub-js'

//因为是分段读，所以哪怕触发end事件但队列有其他语句，依然是true
const sentencesQueue: SpeechSynthesisUtterance[] = []
const tempCacheQuene: number[] = []

export const addToSpeech = (text: string, isFirst?: boolean) => {
    addToQueue(text, isFirst)
}

export const isSpeeking = () => {
    return sentencesQueue.length
}

const addToQueue = (text: string, isFirst?: boolean) => {
    // 创建 SpeechSynthesisUtterance 对象
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = speechSynthesis.getVoices()
    const maleVoice = voices.find(voice => voice.name === 'Microsoft Yunyang Online (Natural) - Chinese (Mainland)')
    //const maleVoice = voices.find(voice => voice.name === 'Microsoft Yaoyao - Chinese (Simplified, PRC)')
    utterance.rate = isFirst ? 0.1 : 0.97
    utterance.voice = maleVoice as SpeechSynthesisVoice
    sentencesQueue.push(utterance)
    if (speechSynthesis.speaking === false) {
        readNextSentence()
    }
}


const readNextSentence = () => {
    const nextSentence = sentencesQueue.shift()
    if (!nextSentence) return
    tempCacheQuene.push(sentencesQueue.length)
    nextSentence.onend = () => {
        tempCacheQuene.pop()
        if (!sentencesQueue.length && !tempCacheQuene.length){
            //第一次进入会误触发onend
            console.log(nextSentence)
            if (nextSentence.rate > 0.8){
                pubsub.publish('speeking-finished',1)
                //console.log('说话结束')
            }
            else{
                //console.log('nextSentence.rate < 0.8')
                pubsub.publish('speeking-finished',0)
            }
        }
        readNextSentence()
    }
    speechSynthesis.speak(nextSentence)
}