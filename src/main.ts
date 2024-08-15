
import { exec } from "child_process"
import { resolve } from "path"

// path 是 . 相对路径，相对于 src
const runProcess = (path: string): Promise<"over"> => {
    return new Promise((res, rej) => {
        console.log(`[${path}]`, "爬取开始")
        const p = exec("ts-node " + resolve(__dirname, path), (err, stdout) => {
            if (err) {
                console.error(`[${path}]`, err)
                p.kill()
                rej(err)
            }
            console.log(`[${path}]`, stdout)
        })
        p.on("close", () => {
            console.log(`[${path}]`, "爬取结束")
            res("over")
        })
    })
}

const main = async () => {
    const movies = () => runProcess("./movies.ts")
    movies()
    setInterval(movies, 1000 * 60 * 60 * 6)
}

main()