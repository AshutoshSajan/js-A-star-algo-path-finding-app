const rows = 100;
const cols = 100;
const grid = new Array(cols);

const openSet = []; // nodes which haven't visited yet
const closedSet = []; // nodes which are already visited

let start; // starting node
let end; // ending node

let path = [];

// let w,h;
let w; // width
let h; // height

function removeFromArray(arr, elm) {
    for(let i = arr.length - 1; i >= 0; i--){
        if(arr[i] === elm){
            arr.splice(i, 1);
        }
    }
}

function heuristic(a,b) {
    // dist is a p5.js function fot calculating distance
    // let d = dist(a.i, a.j, b.i, b.j);
    // return d;

    // return abs(a.i - b.i) + abs(a.j - b.j);
    // or
    return dist(a.i, a.j, b.i, b.j); // uses the pythagoras theorem to figure out the distance between the two points
}

function Cell(i,j){
    this.i = i;
    this.j = j;

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if(random(1) < 0.3){
        this.wall = true
    }

    this.show = function(clr){
        fill(clr);
        if(this.wall){
            fill(0)
        }
        // stroke(0); 
        noStroke()
        rect(this.i * w, this.j * h, w - 1, h - 1);
    }

    this.addNeighbors = function(grid) {
        let { i , j } = this;
        // console.log(i,j, this);
        
        if( i < cols - 1){
            this.neighbors.push(grid[i + 1][j]);
        }
        if(i > 0){
            this.neighbors.push(grid[i - 1][j]);
        }
        if(j < rows - 1){
            this.neighbors.push(grid[i][j + 1]);
        }
        if(j > 0){
            this.neighbors.push(grid[i][j - 1]);
        }
        if(i > 0 && j > 0){
            this.neighbors.push(grid[i - 1][j - 1]);
        }
        if(i < cols - 1 && j > 0){
            this.neighbors.push(grid[i + 1][j - 1]);
        }
        if(i > 0 && j < rows - 1){
            this.neighbors.push(grid[i - 1][j + 1]);
        }
        if(i < cols - 1 && j < rows - 1){
            this.neighbors.push(grid[i + 1][j + 1]);
        }
    }
}

function setup(params) {
    createCanvas(800,800);
    // createCanvas(window.innerWidth,window.innerHeight);

    w = width / cols;
    h = height / rows;

    // making a 2D array
    for (let i = 0; i < cols; i++){
        grid[i] = new Array(rows)

        // for(let j = 0; j < rows; j++){
        //     grid[i][j] = new Cell(i, j)
        // }
    }

    for(let i = 0; i< cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j] = new Cell(i ,j)
        }
    }

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j].addNeighbors(grid);
        }
    }

    // console.log(grid);
    start = grid[0][0];
    end = grid[cols - 1][rows - 1];

    start.wall = false;
    end.wall = false;

    openSet.push(start);
}

function draw(params) {
    if(openSet.length > 0){
        // we can keep going
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length ; i++){
            if(openSet[i].f < openSet[lowestIndex].f){
                lowestIndex = i;
            }
        }

        var current = openSet[lowestIndex];

        if(current === end){
            noLoop()
            console.log("DONE!");
        }
        
        removeFromArray(openSet, current)
        closedSet.push(current);

        let neighbors = current.neighbors;
        for(let i = 0; i < neighbors.length ; i++){
            let neighbor = neighbors[i];
            
            if(!closedSet.includes(neighbor) && !neighbor.wall){
                let tempG = current.g + 1;
                let newPath = false;

                if(openSet.includes(neighbor)){
                    if(tempG < neighbor.g){
                        neighbor.g = tempG;
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if(newPath){
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }

    } else {
        console.info("No solution!");
        noLoop();
        return;
    }

    background(0)

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            grid[i][j].show(color(255));
        }
    }

    for(let i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255, 0, 0))
    }

    for(let i = 0; i < openSet.length; i++){
        openSet[i].show(color(0, 255, 0))
    }
    
    // find the path
    let temp = current;
    path.push(temp);

    while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }

    for(let i = 0; i < path.length ; i++){
        path[i].show(color(0, 0, 255)); 
    }
}