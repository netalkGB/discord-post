import { CommandParameterError } from "./CommandParameterError.ts"
import { ServerError } from "./ServerError.ts"

const { args, exit } = Deno

main().catch(e => {
    if (e instanceof CommandParameterError) {
        console.error('usage: discord-alert [message]')
    } else if (e instanceof ServerError) {
        const { statusCode, statusText } = e
        console.error(`ServerError: ${statusCode} ${statusText}`)
    } else {
        console.error(e)
    }
    exit(1)
}).then(() => {
    exit(0)
})

async function main() {
    if (args.length <= 0) {
        throw new CommandParameterError()
    }
    const message = args[0]
    const url = await loadConfig()
    await request(url, message)
}

async function loadConfig() {
    const file = await Deno.open('/usr/local/etc/discord-post/config')
    const decoder = new TextDecoder('utf-8')
    const url = decoder.decode(await Deno.readAll(file))
    const trimmedUrl = url.trim()
    return trimmedUrl
}

async function request(url: string, message: string) {
    const method = 'POST'
    const headers = {
        'User-Agent': 'sugar http(s) client',
        'Content-Type': 'application/json'
    }
    const body = {
        content: message
    }
    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
    })
    if (!response.ok) {
        const { statusText, status } = response
        throw new ServerError(status, statusText)
    }
}
