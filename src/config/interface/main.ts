interface ClientHello {
    status: string,
    did: number
}

interface ClientQuestion {
    type: 'q',
    q: string,
    did: number, //dialog_id，不出意外应该是同一个
    pid: number, //pid
    cid: string, //conversation_id,
    auth: string
}

interface ClientSetting {
    type: 's',
    setting: 'gpt',
    value: any
}

interface ServerAnswer {
    type: 'a',
    a: string,
    did: number,
    is_f: number,
    pid: number,
    cid: string
}

interface ServerFailed {
    type: 'f',
    msg: string
}

export type {
     ClientHello, ClientQuestion, ServerAnswer, ServerFailed,
     ClientSetting
}