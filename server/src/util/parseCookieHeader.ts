type Cookies = {
    [key: string]:string
}

export default function parseCookieHeader(cookieString:string|undefined) {
    if (!cookieString) return {}
    let pairs:string[] = cookieString.split(';')
    let cookies:Cookies = {}
    for (let i = 0; i < pairs.length; i++) {
        let keyValue:string[] = pairs[i].split('=')
        cookies[keyValue[0].trim()] = keyValue[1].trim()
    }
    return cookies
}