export const isAuth = () => {
    return sessionStorage.getItem('auth')
}

export const setAuth = (status: boolean) => {
    sessionStorage.setItem('auth', status + '')
}