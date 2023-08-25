import CryptoJS from 'crypto-js'
import keyConfig from '@/config/encrypt/keyexport.js'
const key = CryptoJS.enc.Utf8.parse(keyConfig.key)
const iv = CryptoJS.enc.Utf8.parse(keyConfig.iv)

/**AES解密数据 */
function dataDecrypt(word: any) {
    let decrypt = CryptoJS.AES.decrypt(word, key, { iv , mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

/**AES加密数据（注：无需提前将其转为string，如果类型传入object的对象可以自动将其stringify再加密） */
function dataEncrypt(word: any | object) {
    let data = typeof word == 'object' ? JSON.stringify(word) : word
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv , mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString().replace(/=/g,'');
}

export {dataDecrypt, dataEncrypt}