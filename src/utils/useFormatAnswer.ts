export default (text: string) => {
    //ChatGPT的回答使用多个是markdown格式，所以需要format，不然一些*之类的也会读出来
    //到底format哪些东西随着使用的深入逐渐添加
    
    return text.replace(/\*/g, '')
}