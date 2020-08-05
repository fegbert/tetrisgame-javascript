var CURRENT_SHAPE

function setup() {
    window.canvas = createCanvas(200,400)
    window.canvas.parent("canvas")
    this.DROPSPEED = 15
    this.SCORE = 0
    this.HOLDING = undefined
    this.HOLDING_COOLDOWN = false
    this.DROPSPEED_MAX = this.DROPSPEED // For resetting the timer
    this.SHAPE_LIST = []
    this.BAG = []
    initShapes()
    fillBag()
    spawnShape()
}

function draw() {
    background(185)
    frameRate(25)
    drawGrid()
    drawShapes()

    if (this.DROPSPEED === 0) {
        CURRENT_SHAPE.moveDown()
        this.DROPSPEED = this.DROPSPEED_MAX
    }

    this.DROPSPEED--

    document.getElementById("score").innerHTML = "SCORE: " + this.SCORE
    document.getElementById("next").innerHTML = "NEXT: " + this.BAG[0].name
    if (this.HOLDING !== undefined) {
        document.getElementById("holding").innerHTML = "HOLDING: " + this.HOLDING.shapeID.name
    }
}

function getShapeList() {
    return this.SHAPE_LIST
}

function keyPressed() {
    if (keyCode === 38 || keyCode === 88) { // UP ARROW or X | Rotate Right
        this.CURRENT_SHAPE.rotateShape()
    } else if (keyCode === 17 || keyCode === 89) { // CTRL or Y | Rotate Left
        this.CURRENT_SHAPE.rotateShape(0)
    } else if (keyCode === 40) { // DOWN ARROW | Move Down
        this.CURRENT_SHAPE.moveDown()
    } else if (keyCode === 32) { // SPACE | Hard Drop (currently Spawning shape)
        this.CURRENT_SHAPE.hardDrop()
    } else if (keyCode === 67 || keyCode === 16) { // SHIFT or C | Hold Piece
        if (!this.HOLDING_COOLDOWN) {
            if (this.HOLDING === undefined) {
                hold()
            } else {
                releaseHolding()
            }
            this.HOLDING_COOLDOWN = true
        }
    } else if (keyCode === 37) { // LEFT ARROW | Move Left
        this.CURRENT_SHAPE.moveLeft()
    } else if (keyCode === 39) { // RIGHT ARROW | Move Right
        this.CURRENT_SHAPE.moveRight()
    }
}

function hold() {
    this.HOLDING = new Shape(this.CURRENT_SHAPE.shapeID, createVector(5, -2))
    let index = this.SHAPE_LIST.indexOf(this.CURRENT_SHAPE)
    this.SHAPE_LIST.splice(index, 1)
    spawnShape()
}

function drawShapes() {
    for (let shape of this.SHAPE_LIST) {
        shape.draw()
    }
}

function drawGrid() {
    let gridsize = 20
    push()
    stroke(0)
    for (let i = 0; i < window.canvas.width; i++) {
        if (i % gridsize === 0) {
            line(i,0,i,window.canvas.height)
        }
    }

    for (let i = 0; i < window.canvas.height; i++) {
        if (i % gridsize === 0) {
            line(0,i,window.canvas.width,i)
        }
    }
    pop()
}

// Simple Random shape spawn
function spawnShape() {
    let shape = new Shape(this.BAG[0], createVector(5, -2))
    this.SHAPE_LIST.push(shape)
    this.CURRENT_SHAPE = shape
    this.BAG.shift()

    if (this.BAG.length === 0) {
        fillBag()
    }
}

function releaseHolding() {
    let old = this.CURRENT_SHAPE
    this.SHAPE_LIST.push(this.HOLDING)
    this.CURRENT_SHAPE = this.HOLDING
    this.HOLDING = new Shape(old.shapeID, createVector(5, -2))
    let index = this.SHAPE_LIST.indexOf(old)
    this.SHAPE_LIST.splice(index, 1)
}

function fillBag() {
    shapes = [iShape, oShape, tShape, zShape, sShape, lShape, jShape]

    for (let i = 0; i < 7; i++) {
        index = Math.floor(Math.random() * shapes.length)
        this.BAG.push(shapes[index])
        shapes.splice(index,1)
    }
}

function score() {
    this.SCORE++
}

function resetHoldingCooldown() {
    this.HOLDING_COOLDOWN = false
}