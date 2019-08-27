const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const GAMESIZE = canvas.width;
const GRIDNUM = 50;
let game;
let difficulty;

function randLoc(){
    return {
        y: Math.floor(Math.random() * GRIDNUM),
        x: Math.floor(Math.random() * GRIDNUM)
    };
}

const dirs = ["n", "e", "s", "w"];

const moveDir = {
    n: {
        y: -1,
        x: 0
    },
    e: {
        y: 0,
        x: 1
    },
    s: {
        y: 1,
        x: 0
    },
    w: {
        y: 0,
        x: -1
    }
};

function randDir(){
    return dirs[Math.floor(Math.random() * 4)];
}

function toggleVisiblity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
        document.getElementById(id).style.visibility = "hidden";
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
}

function acceptEndGame(id){
    toggleVisiblity(id);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function DoublyLinkedList() {
    // pointer to first item
    this._head = null;
    // pointer to the last item
    this._tail = null;
    // length of list
    this._length = 0;
}

// Wraps data in a node object.
DoublyLinkedList.prototype._createNewNode = function (data) {
    var list = this;

    var node = {
        data: data,
        next: null,
        prev: null,

        remove: function() {
            if (this.prev !== null) {
                this.prev.next = this.next;
            }

            if (this.next !== null) {
                this.next.prev = this.prev;
            }

            if (list._head === this) {
                list._head = this.next;
            }

            if (list._tail === this) {
                list._tail = this.prev;
            }

            list._length--;
        },

        prepend: function(data) {
            if (list._head === this) {
                return list.prepend(data);
            }

            var newNode = list._createNewNode(data);
            newNode.prev = this.prev;
            newNode.next = this;
            this.prev.next = newNode;
            this.prev = newNode;

            list._length++;
            return newNode;
        },

        append: function(data) {
            if (list._tail === this) {
                return list.append(data);
            }

            var newNode = list._createNewNode(data);
            newNode.prev = this;
            newNode.next = this.next;
            this.next.prev = newNode;
            this.next = newNode;

            list._length++;
            return newNode;
        }
    };

    return node;
};

/*
 * Appends a node to the end of the list.
*/
DoublyLinkedList.prototype.append = function (data) {
    var node = this._createNewNode(data);

    if (this._length === 0) {

        // first node, so all pointers to this
        this._head = node;
        this._tail = node;
    } else {

        // put on the tail
        this._tail.next = node;
        node.prev = this._tail;
        this._tail = node;
    }

    // update count
    this._length++;

    return node;
};

/*
 * Prepends a node to the end of the list.
*/
DoublyLinkedList.prototype.prepend = function (data) {
    var node = this._createNewNode(data);

    if (this._head === null) {

        // we are empty, so this is the first node
        // use the same logic as append
        return this.append(data);
    } else {

        // place before head
        this._head.prev = node;
        node.next = this._head;
        this._head = node;
    }

    // update count
    this._length++;

    return node;
};

/*
 * Returns the node at the specified index. The index starts at 0.
*/
DoublyLinkedList.prototype.item = function (index) {
    if (index >= 0 && index < this._length) {
        var node = this._head;
        while (index--) {
            node = node.next;
        }
        return node;
    }
};

/*
 * Returns the node at the head of the list.
*/
DoublyLinkedList.prototype.head = function () {
    return this._head;
};

/*
 * Returns the node at the tail of the list.
*/
DoublyLinkedList.prototype.tail = function () {
    return this._tail;
};

/*
 * Returns the size of the list.
*/
DoublyLinkedList.prototype.size = function () {
    return this._length;
};

/*
 * Removes the item at the index.
*/
DoublyLinkedList.prototype.remove = function (index) {
    throw "Not implemented";
};

let Snake = function() {
    DoublyLinkedList.call(this);
    this.append(randLoc());
    this.dir = randDir();
};

Snake.prototype = Object.create(DoublyLinkedList.prototype);
Snake.prototype.constructor = Snake;

function SnakeGame(GameSize, Difficulty) {
    const scoreZone = document.getElementById("scoreZone");
    const unitSize = GameSize / GRIDNUM;
    const height = GameSize, width = GameSize;
    const frames = Difficulty;
    let score = 0;
    let play = true;
    let snake = new Snake();
    let dirInput = snake.dir;
    let numFood = 0;
    //create 2d array to store map
    let map = new Array(height);
    for (let y = 0; y < height; y++) {
        map[y] = new Array(width);
        for (let x = 0; x < width; ++x) {
            map[y][x] = {
                isSnake: false,
                isFood: false
            };
        }
    }
    //initialization of snake image and mapping
    drawSnake();
    while (numFood < 3) {
        addFoodToMap();
    }
    //react to key input
    document.onkeydown = (evt) => {
        evt = evt || window.event;
        switch(evt.key) {
            case "w":    //north
            case "ArrowUp":
                dirInput = dirs[0];
                break;
            case "d":    //east
            case "ArrowRight":
                dirInput = dirs[1];
                break;
            case "s":    //south
            case "ArrowDown":
                dirInput = dirs[2];
                break;
            case "a":    //west
            case "ArrowLeft":
                dirInput = dirs[3];
                break;
            case "q":
                gameOver();
                break;
        }
    };
    //count is the number of loop cycles
    let count = 0;
    setInterval(() => {
            if (play) {
                scoreZone.innerText = "Score: " + score;
                switch(dirInput) {
                    case dirs[0]:
                        if(snake.dir !== dirs[2])
                            snake.dir = dirs[0];
                        break;
                    case dirs[1]:
                        if (snake.dir !== dirs[3])
                            snake.dir = dirs[1];
                        break;
                    case dirs[2]:
                        if (snake.dir !== dirs[0])
                            snake.dir = dirs[2];
                        break;
                    case dirs[3]:
                        if (snake.dir !== dirs[1])
                            snake.dir = dirs[3];
                        break;
                }
                if (numFood < 3) {
                    addFoodToMap();
                }
                //this is used to control framerate.
                if (count >= frames) {
                    step();
                    count = 0;
                }
                count++;
            }
        },
        50);


    function step() {
        let newLoc = {
            x: snake.head().data.x + moveDir[snake.dir].x,
            y: snake.head().data.y + moveDir[snake.dir].y
        };
        if(newLoc.x < 0)
            newLoc.x = GRIDNUM -1;
        if(newLoc.y < 0)
            newLoc.y = GRIDNUM -1;
        if(newLoc.x >= GRIDNUM)
            newLoc.x = 0;
        if(newLoc.y >= GRIDNUM)
            newLoc.y = 0;
        if (map[newLoc.y][newLoc.x].isSnake) {
            gameOver();
        }
        snake.prepend(newLoc);
        renderSnakePart(newLoc);
        //if snake does not eat food, delete and update tail.
        if (!map[newLoc.y][newLoc.x].isFood) {
            ctx.clearRect(snake.tail().data.x * unitSize, snake.tail().data.y * unitSize, unitSize, unitSize);
            map[snake.tail().data.y][snake.tail().data.x].isSnake = false;
            snake.tail().remove();
        }
        else {
            map[newLoc.y][newLoc.x].isFood = false;
            numFood--;
            score++;
        }

    }

    function genFoodLoc(){
        let foodLoc = randLoc();
        if( map[foodLoc.y][foodLoc.x].isSnake || map[foodLoc.y][foodLoc.x].isFood ) {
            genFoodLoc();
        }
        return foodLoc;
    }

    function addFoodToMap(){
        let loc = genFoodLoc();
        map[loc.y][loc.x].isFood = true;
        numFood++;
        drawFood(loc);
    }

    function drawFood(coord){
        ctx.fillStyle = "#170aff";
        ctx.fillRect(coord.x * unitSize, coord.y * unitSize, unitSize, unitSize)
    }

    function drawSnake(){
        let cur = snake.head();
        while(cur != null) {
            renderSnakePart(cur.data);
            cur = cur.next;
        }
    }

    function renderSnakePart(coord){
        ctx.fillStyle = "#a9ff1c";
        ctx.fillRect(coord.x * unitSize, coord.y * unitSize, unitSize, unitSize);
        map[coord.y][coord.x].isSnake = true;
    }

    function gameOver(){
        play = false;
        /*
        let endMsg = document.getElementById("score");
        endMsg.innerText = "You ate " + score + "pieces of food";
        toggleVisiblity("gameOver");
        */
        ctx.textAlign = 'center';
        ctx.font = "bold 40px Lucida Console, Monaco, monospace";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 12;
        ctx.lineWidth = 5;
        ctx.fillText("Game Over", canvas.width /2 , canvas.height * (2/5), canvas.width * .8);
        ctx.fillText("You ate " + score + " pieces of food", canvas.width /2 , canvas.height * (3/5), canvas.width * .9);
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.fillText("Game Over", canvas.width /2 , canvas.height * (2/5), canvas.width * .8);
        ctx.fillText("You ate " + score + " pieces of food", canvas.width /2 , canvas.height * (3/5), canvas.width * .9);
    }
}

function startGame() {
    if(game === undefined) {
        let e = document.getElementById("levelSelector");
        difficulty = e.options[e.selectedIndex].value;
        if (difficulty < 0) return;
        game = new SnakeGame(GAMESIZE, difficulty);
    }
    else{
        game = undefined;
        startGame();
    }
}

