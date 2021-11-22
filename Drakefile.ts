import { desc, run, task, sh } from "https://deno.land/x/drake@v1.5.0/mod.ts";

const binOutDir = 'out/'

desc("run script")
task("run", [], async () => {
    await sh(`deno run --allow-net --allow-read src/index.ts "test${new Date()}"`)
})

desc("build")
task("build", [], async () => {
    try {
        await Deno.stat(binOutDir)
    } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) {
            console.error(e)
            return
        }
    }

    try {
        await Deno.mkdir(binOutDir)
    } catch (e) {
        if (!(e instanceof Deno.errors.AlreadyExists)) {
            console.error(e)
            return
        }
    }

    try {
        await sh('deno compile --allow-read --allow-net --output out/discord-alert src/index.ts')
    } catch (e) {
        console.error(e)
    }
})

desc("clean")
task("clean", [], async () => {
    try {
        await Deno.stat(binOutDir)
    } catch (e) {
        if (e instanceof Deno.errors.NotFound) {
            return
        } else {
            console.error(e)
        }
    }

    try {
        await Deno.remove(binOutDir, { recursive: true })
    } catch (e) {
        console.error(e)
    }
})

run()
