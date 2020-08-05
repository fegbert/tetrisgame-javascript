var BLOCK_SIZE = 20

class Block {
    constructor(startingGridPos, color) {
        this.startingGridPos = startingGridPos
        this.currentGridPos = startingGridPos
        this.color = color
        this.line = startingGridPos.y
    }

    draw() {
        push()
        let pos = this.currentGridPos;
        fill(this.color)
        stroke(color(0,0,0))
        strokeWeight(2)
        rect(pos.x * BLOCK_SIZE, pos.y * BLOCK_SIZE, BLOCK_SIZE)
        pop()
    }

    moveDown() {
        this.currentGridPos.y += 1
        this.line++
    }

    moveLeft() {
        this.currentGridPos.x -= 1
    }

    moveRight() {
        this.currentGridPos.x += 1
    }

    moveUp() {
        this.currentGridPos.y -= 1
        this.line--
    }

}

function show() {
    draw()
}