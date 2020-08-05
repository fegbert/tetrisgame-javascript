class Shape {
    constructor(shapeID, startingPos) {
        this.shapeID = shapeID
        this.startingPos = startingPos
        this.blocks = []
        this.rotationState = 0
        this.spawnedShape = false

        for (var pos of shapeID.blockPositions) {
            this.blocks.push(new Block(createVector(this.startingPos.x + pos.x, this.startingPos.y + pos.y), shapeID.color))
        }
    }

    draw() {
        for (let block of this.blocks) {
            block.draw()
        }
    }

    moveDown() {
        if (!this.outOfBounds(0) && !this.collidesWithShape()) {
            for (let block of this.blocks) {
                block.moveDown()
            }
        } else {
            if (!this.spawnedShape) {
                checkLine()
                spawnShape()
                resetHoldingCooldown()
                this.spawnedShape = true
            }
        }
    }

    moveLeft() {
        if (!this.outOfBounds(1) && !this.collidesWithShape(1)) {
            for (let block of this.blocks) {
                block.moveLeft()
            }
        }
    }

    moveRight() {
        if (!this.outOfBounds(2) && !this.collidesWithShape(2)) {
            for (let block of this.blocks) {
                block.moveRight()
            }
        }
    }

    moveUp() {
        if (!this.collidesWithShape(true)) {
            for (let block of this.blocks) {
                block.moveUp()
            }
        }
    }

    hardDrop() {
        while (!this.outOfBounds(0) && !this.collidesWithShape()) {
            this.moveDown()
        }
    }

    /**
     *
     * @param side 0 = down, 1 = left, 2 = right
     * @returns {boolean} True if Shape will be out of bounds in the next step.
     */
    outOfBounds(side) {
        for (let block of this.blocks) {
            let xPlus = block.currentGridPos.x + 1
            let xMinus = block.currentGridPos.x - 1
            let yPlus = block.currentGridPos.y + 1

            if (side === 0) {
                if (yPlus >= 20) {
                    return true
                }
            }
            else if (side === 1) {
                if (xMinus < 0) {
                    return true
                }
            }
            else if (side === 2) {
                if (xPlus >= 10) {
                    return true
                }
            }
        }
        return false
    }

    /**
     *
     * @param side 0 = bottom, 1 = left, 2 = right
     * @returns {boolean} True if shape will collide with another Shape in the next move
     */
    collidesWithShape(side = 0) {
        for (let block of this.blocks) {
            let yPlus = block.currentGridPos.y + 1
            let xPlus = block.currentGridPos.x + 1
            let xMinus = block.currentGridPos.x - 1
            let yMinus = block.currentGridPos.y - 1
            let shapeList = getShapeList()

            for (let i = 0; i < shapeList.length; i++) {
                if (this === shapeList[i]) continue
                for (let b of shapeList[i].blocks) {
                    if (b.currentGridPos.y === yPlus || b.currentGridPos.y === yMinus || b.currentGridPos.y === block.currentGridPos.y) {
                        if (side === 0) {
                            if (b.currentGridPos.x === block.currentGridPos.x) {
                                return true
                            }
                        } else if (side === 1) {
                            if (b.currentGridPos.x === xMinus) {
                                return true
                            }
                        } else if (side === 2) {
                            if (b.currentGridPos.x === xPlus) {
                                return true
                            }
                        }
                    }
                }
            }
        }
        return false
    }

    isInsideShape() {
        let shapeList = getShapeList()

        for (let block of this.blocks) {
            let x = block.currentGridPos.x
            let y = block.currentGridPos.y

            for (let i = 0; i < shapeList.length; i++) {
                if (this === shapeList[i]) continue
                for (let b of shapeList[i].blocks) {
                    if (b.currentGridPos.x === x && b.currentGridPos.y === y) {
                        return true
                    }
                }
            }
        }
        return false
    }

    /**
     * Rotates the shape in a specific direction.
     * @param direction
     * 1 = right | 0 = left
     */
    rotateShape(direction = 1) {
        for (let i = 0; i < this.blocks.length; i++) {
            let rotation = this.getRotation(direction)[i]
            if (direction === 0) {
                this.blocks[i].currentGridPos.x += rotation.x * -1
                this.blocks[i].currentGridPos.y += rotation.y * -1
            } else {
                this.blocks[i].currentGridPos.x += rotation.x
                this.blocks[i].currentGridPos.y += rotation.y
            }
        }

        //Check if something is out of bounds
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].currentGridPos.x >= 10) {
                do {
                    this.moveLeft()
                } while(this.blocks[i].currentGridPos.x >= 10)
            } else if (this.blocks[i].currentGridPos.x < 0) {
                do {
                    this.moveRight()
                } while(this.blocks[i].currentGridPos.x >= 10)
            }
        }

        if (direction === 0) {

            if (this.isInsideShape()) {
                for (let block of this.blocks) {
                    block.moveLeft()
                }
            }

            if (this.rotationState === 0) {
                this.rotationState = 3
                return
            }

            this.rotationState--
        } else {

            if (this.isInsideShape()) {
                for (let block of this.blocks) {
                    block.moveRight()
                }
            }

            if (this.rotationState === 3) {
                this.rotationState = 0
                return
            }

            this.rotationState++
        }
    }

    getRotation(direction) {
        switch (this.rotationState) {
            case 0:
                if (direction === 0) {
                    return this.shapeID.rotation4
                } else {
                    return this.shapeID.rotation1
                }
            case 1:
                if (direction === 0) {
                    return this.shapeID.rotation1
                } else {
                    return this.shapeID.rotation2
                }
            case 2:
                if (direction === 0) {
                    return this.shapeID.rotation2
                } else {
                    return this.shapeID.rotation3
                }
            case 3:
                if (direction === 0) {
                    return this.shapeID.rotation3
                } else {
                    return this.shapeID.rotation4
                }
        }
    }

}

function checkLine() {
    let shapeList = getShapeList()
    for (let i = 0; i < 20; i++) {
        let blockCount = 0
        for (let y = 0; y < shapeList.length; y++) {
            for (let block of shapeList[y].blocks) {
                if (block.currentGridPos.y === i) blockCount++
            }
        }

        if (blockCount === 10) {
            removeLine(i)
            score()
        }
    }
}

function removeLine(line) {
    let shapeList = getShapeList()

    // Please ignore this, this is just sad

    for (let i = 0; i < shapeList.length; i++) {
        for (let block of shapeList[i].blocks) {
            if (block.currentGridPos.y === line) {
                let index = shapeList[i].blocks.indexOf(block)
                shapeList[i].blocks.splice(index,1)
            }
        }

        // Then loop again to clean up, i hate myself for this sorry.
        for (let block of shapeList[i].blocks) {
            if (block.currentGridPos.y === line) {
                let index = shapeList[i].blocks.indexOf(block)
                shapeList[i].blocks.splice(index,1)
            }
        }
    }

    for (let i = 0; i < shapeList.length; i++) {
        for (let block of shapeList[i].blocks) {
            if (block.currentGridPos.y <= line) {
               block.moveDown()
            }
        }
    }
}


let iShape
let oShape
let tShape
let zShape
let sShape
let lShape
let jShape

function initShapes() { // Block Positions = Starting Positions!
    iShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
        rotation1: [createVector(-1,1), createVector(0,0), createVector(1,-1), createVector(2,-2)],
        rotation2: [createVector(2, -1), createVector(1, 0), createVector(0, 1), createVector(-1, 2)],
        rotation3: [createVector(-2,2), createVector(-1,1), createVector(0,0), createVector(1,-1)],
        rotation4: [createVector(1,-2), createVector(0,-1), createVector(-1,0), createVector(-2,1)],
        color: color(0,255,255),
        name: "iShape"
    }
    oShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(1, 0), createVector(1, 1)],
        rotation1: [createVector(0,0), createVector(0,0), createVector(0,0), createVector(0,0)],
        rotation2: [createVector(0,0), createVector(0,0), createVector(0,0), createVector(0,0)],
        rotation3: [createVector(0,0), createVector(0,0), createVector(0,0), createVector(0,0)],
        rotation4: [createVector(0,0), createVector(0,0), createVector(0,0), createVector(0,0)],
        color: color(255,255,0),
        name: "oShape"
    }
    tShape = {
        blockPositions: [createVector(0, 1), createVector(1, 1), createVector(2, 1), createVector(1, 0)],
        rotation1: [createVector(1,-1), createVector(0,0), createVector(-1,1), createVector(1,1)],
        rotation2: [createVector(-1,1), createVector(0,0), createVector(1,-1), createVector(-1,1)],
        rotation3: [createVector(1,-1), createVector(0,0), createVector(-1,1), createVector(-1,-1)],
        rotation4: [createVector(-1,1), createVector(0,0), createVector(1,-1), createVector(1,-1)],
        color: color(255,0,255),
        name: "tShape"
    }
    zShape = {
        blockPositions: [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
        rotation1: [createVector(2,0), createVector(1,1), createVector(0,0), createVector(-1,1)],
        rotation2: [createVector(0,2), createVector(-1,1), createVector(0,0), createVector(-1,-1)],
        rotation3: [createVector(-2,0), createVector(-1,-1), createVector(0,0), createVector(1,-1)],
        rotation4: [createVector(0,-2), createVector(1,-1), createVector(0,0), createVector(1,1)],
        color: color(255,0,0),
        name: "zShape"
    }
    sShape = {
        blockPositions: [createVector(0, 1), createVector(1, 1), createVector(1, 0), createVector(2, 0)],
        rotation1: [createVector(1,-1), createVector(0,0), createVector(1,1), createVector(0,2)],
        rotation2: [createVector(1,1), createVector(0,0), createVector(-1,1), createVector(-2,0)],
        rotation3: [createVector(-1,1), createVector(0,0), createVector(-1,-1), createVector(0,-2)],
        rotation4: [createVector(-1,-1), createVector(0,0), createVector(1,-1), createVector(2,0)],
        color: color(0,255,0),
        name: "sShape"
    }
    lShape = {
        blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(1, 2)],
        rotation1: [createVector(1,1), createVector(0,0), createVector(-1,-1), createVector(-2,0)],
        rotation2: [createVector(-1,1), createVector(0,0), createVector(1,-1), createVector(0,-2)],
        rotation3: [createVector(-1,-1), createVector(0,0), createVector(1,1), createVector(2,0)],
        rotation4: [createVector(1,-1), createVector(0,0), createVector(-1,1), createVector(0,2)],
        color: color(255,165,0),
        name: "lShape"
    }
    jShape = {
        blockPositions: [createVector(1, 0), createVector(1, 1), createVector(1, 2), createVector(0, 2)],
        rotation1: [createVector(1,1), createVector(0,0), createVector(-1,-1), createVector(0,-2)],
        rotation2: [createVector(-1,1), createVector(0,0), createVector(1,-1), createVector(2,0)],
        rotation3: [createVector(-1,-1), createVector(0,0), createVector(1,1), createVector(0,2)],
        rotation4: [createVector(1,-1), createVector(0,0), createVector(-1,1), createVector(-2,0)],
        color: color(0,0,255),
        name: "jShape"
    }
}




