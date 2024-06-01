const INSULATOR = 0
const CONDUCTOR = 1
const ELECTRON_HEAD = 2
const ELECTRON_TAIL = 3

class Wireworld {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.cells = []
        for (let y = 0; y < height; y++) {
            let row = []
            for (let x = 0; x < width; x++) {
                row.push(INSULATOR)
            }
            this.cells.push(row)
        }
        this.draw()
    }

    count(x, y) {
        let count = 0
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (this.get(x + j, y + i) == ELECTRON_HEAD) {
                    count++
                }
            }
        }
        return count
    }

    draw() {
        let canvas = document.getElementById("main-canvas")
        let context = canvas.getContext("2d")
        let width = canvas.width / this.width
        let height = canvas.height / this.height
        context.strokeStyle = "#000000"
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                switch (this.get(x, y)) {
                    case INSULATOR:
                        context.fillStyle = "#2A2D2F"
                        break
                    case CONDUCTOR:
                        context.fillStyle = "#F7B500"
                        break
                    case ELECTRON_HEAD:
                        context.fillStyle = "#0E518D"
                        break
                    case ELECTRON_TAIL:
                        context.fillStyle = "#C1121C"
                }
                context.fillRect(x * width, y * height, width, height)
                context.strokeRect(x * width, y * height, width, height)
            }
        }
    }

    get(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return INSULATOR
        } else {
            return this.cells[y][x]
        }
    }

    set(x, y, type) {
        this.cells[y][x] = type
        this.draw()
    }

    step() {
        let cells = []
        for (let y = 0; y < this.height; y++) {
            let row = []
            for (let x = 0; x < this.width; x++) {
                switch (this.get(x, y)) {
                    case INSULATOR:
                        row.push(INSULATOR)
                        break
                    case CONDUCTOR:
                        let count = this.count(x, y)
                        if (count == 1 || count == 2) {
                            row.push(ELECTRON_HEAD)
                        } else {
                            row.push(CONDUCTOR)
                        }
                        break
                    case ELECTRON_HEAD:
                        row.push(ELECTRON_TAIL)
                        break
                    case ELECTRON_TAIL:
                        row.push(CONDUCTOR)
                }
            }
            cells.push(row)
        }
        this.cells = cells
        this.draw()
    }
}

let setActiveType = (type) => {
    activeType = type
    for (let i = 0; i < 4; i++) {
        let button = document.getElementById("button" + i)
        if (i == type) {
            button.classList.add("active")
        } else {
            button.classList.remove("active")
        }
    }
}

document.getElementById("button0").addEventListener(
    "click",
    () => { setActiveType(INSULATOR) }
)

document.getElementById("button1").addEventListener(
    "click",
    () => { setActiveType(CONDUCTOR) }
)

document.getElementById("button2").addEventListener(
    "click",
    () => { setActiveType(ELECTRON_HEAD) }
)

document.getElementById("button3").addEventListener(
    "click",
    () => { setActiveType(ELECTRON_TAIL) }
)

let drawCell = (event) => {
    let width = event.target.width / wireworld.width
    let height = event.target.height / wireworld.height
    let x = Math.floor(event.offsetX / width)
    let y = Math.floor(event.offsetY / height)
    wireworld.set(x, y, activeType)
}

document.getElementById("main-canvas").addEventListener(
    "mousedown",
    (event) => {
        drawCell(event)
    }
)

document.getElementById("main-canvas").addEventListener(
    "mousemove",
    (event) => {
        if (event.buttons == 1) {
            drawCell(event)
        }
    }
)

document.getElementById("button4").addEventListener(
    "click",
    (event) => {
        if (running) {
            running = false
            event.target.classList.remove("active")
        } else {
            running = true
            event.target.classList.add("active")
        }
    }
)

let wireworld = new Wireworld(32, 32)
let activeType
setActiveType(CONDUCTOR)
let running = false

setInterval(
    () => {
        if (running) {
            wireworld.step()
        }
    },
    1000
)