import type { ClientQuestion } from "@/config/interface/main"
import { isAuth } from "../auth/useAuth"
import { getWebSocket } from "./useWebSocket"
import useAuthorizationCode from "../auth/useAuthorizationCode"

export default (question: string) => {
    if (!question || !isAuth()) return
    const did = localStorage.getItem('did')
    const cid = localStorage.getItem('cid')
    const pid = localStorage.getItem('pid')
    const msg: ClientQuestion = {
        'q' : question,
        //authorization code
        'auth': useAuthorizationCode(),
        'cid': cid ? cid : '',
        'did': did ? parseInt(did) : 0,
        'pid': pid ? parseInt(pid) : 0,
        'type': 'q',
    }
    getWebSocket().send(JSON.stringify(msg))
}