import { dataEncrypt } from "@/utils/crypto"

export default () => {
    return dataEncrypt(new Date().getTime().toString())
}