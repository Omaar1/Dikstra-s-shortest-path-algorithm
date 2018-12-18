var tree = {
    vertices: [],
    edges: []
};
var resetBtn;
var interval;
var img ;
var shorPath=[];
var matrix;
var vretixID = 0;

function preload(){
  img=loadImage('https://image.flaticon.com/icons/png/128/1325/1325529.png')
}
function setup() {
    createCanvas(600, 400);
    background(0);
    fill(255);
    stroke(255);
  //  textSize(32);
    textAlign(CENTER, CENTER);

    createP('');
    resetBtn = createButton('Reset');
    resetBtn.mousePressed(resetBtnPressed);

    flashColBtn = createButton('Find Short Path');
    flashColBtn.style('marginLeft', '10px');
    flashColBtn.mousePressed(shortPathBtnPressed);


}


function resetBtnPressed() {
    background(0);
    tree.vertices.length = 0;
    tree.edges.length = 0;
    shorPath.length=0;
    var _ = Infinity;
    matrix = makeArray( tree.edges.length+1 , _ );
    vretixID=0;
}


function makeArray(length, val) { // sqaure 2d Array
    var arr = [];
    for(i = 0; i < length; i++) {
        arr[i] = [];
        for(j = 0; j < length; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}
function shortPathBtnPressed(){
  var _ = Infinity;
  matrix = makeArray( tree.edges.length+1 , _ );


  for (let edge of tree.edges) {
      matrix[edge.fromID][edge.toID]=edge.weight;
      matrix[edge.toID][edge.fromID]=edge.weight;

  }
  // Compute the shortest paths from vertex number 1 to each other vertex
  // in the graph.
  var shortestPathInfo = shortestPath(matrix, tree.vertices.length , 0);
  // Get the shortest path from vertex 1 to vertex 6.
  shorPath = constructPath(shortestPathInfo, tree.vertices.length-1);
  print("======\n path :  "+shorPath+"\n\n======\n\n");
}

var testto={x:100,y:100};
var testfrom={x:200,y:200};

function mousePressed() {
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        var v = createVector(mouseX, mouseY,vretixID);
        vretixID++;
        tree.vertices.push(v);
        tree.edges = connectVertices(tree.vertices);

    }
}


function draw() {
    background(0);
    drawTree(tree);
    if(shorPath.length>0){
      drawShortPath();
    }
}

function drawShortPath(){
      stroke(237,34,93);
      var fromX = tree.vertices[0].x;
      var fromY = tree.vertices[0].y;
      // line(vertices[0].x,vertices[0].y , shorPath[0].x)
      for (let i = 0; i < shorPath.length; ++i) {
         var index = shorPath[i];
        // var elementPos = tree.vertices.map(function(x) {return x.z; }).indexOf(value);
        // var objectFound = tree.vertices[elementPos];/       var to ;
        var toX = tree.vertices[index].x;
        var toY = tree.vertices[index].y;
        line(fromX,fromY ,toX,toY);
        fromX=toX;
        fromY = toY;

    }
}

function drawTree(argTree) {
    drawEdges(argTree.edges);
    drawVertices(argTree.vertices);

}

function drawVertices(vertices) {
    for (let i = 0; i < vertices.length; ++i) {
        imageMode(CENTER);
        image(img,vertices[i].x, vertices[i].y,40,40);
        textSize(32);
        text((i), vertices[i].x, ((vertices[i].y)-20));
    }
}

function drawEdges(edges) {
    for (let edge of edges) {
        var from = edge.from;   ///!!!!!! here
        var to = edge.to;
        stroke(255);
        line(from.x, from.y, to.x, to.y);



        let d = Math.floor(dist(from.x, from.y, to.x, to.y));
        midointX= (from.x+to.x)/2;
        midointY= (from.y+to.y)/2;
        textSize(15);
        text(d, midointX,midointY);
    }
}

// Connects vertices by Prim's algorithm (Min Spanning Tree)
function connectVertices(vertices) {
    let edges = [];
    let idReached = [];

    idReached.push(Math.floor(random(vertices.length)));

    while (idReached.length < vertices.length) {
        let minDist = Infinity;
        let idFrom = -1;
        let idTo = -1;

        for (let idCurrReached of idReached) {
            for (let i = 0; i < vertices.length; ++i) {
                if (idReached.includes(i)) {
                    continue;
                }
                let from = vertices[idCurrReached];
                let to = vertices[i];
                let d = dist(from.x, from.y, to.x, to.y);
                if (d < minDist) {
                    minDist = d;
                    idFrom = idCurrReached;
                    idTo = i;
                }
            }
        }

        edges.push({
            from: vertices[idFrom],
            to: vertices[idTo],
            fromID:vertices[idFrom].z,
            toID:vertices[idTo].z,
            weight:Math.floor(minDist),

        });

        idReached.push(idTo);
    }

    return edges;
}


function shortestPath(edges, numVertices, startVertex) {
  var done = new Array(numVertices);
  done[startVertex] = true;
  var pathLengths = new Array(numVertices);
  var predecessors = new Array(numVertices);
  for (var i = 0; i < numVertices; i++) {
    pathLengths[i] = edges[startVertex][i];
    if (edges[startVertex][i] != Infinity) {
      predecessors[i] = startVertex;
    }
  }
  pathLengths[startVertex] = 0;
  for (var i = 0; i < numVertices - 1; i++) {
    var closest = -1;
    var closestDistance = Infinity;
    for (var j = 0; j < numVertices; j++) {
      if (!done[j] && pathLengths[j] < closestDistance) {
        closestDistance = pathLengths[j];
        closest = j;
      }
    }
    done[closest] = true;
    for (var j = 0; j < numVertices; j++) {
      if (!done[j]) {
        var possiblyCloserDistance = pathLengths[closest] + edges[closest][j];
        if (possiblyCloserDistance < pathLengths[j]) {
          pathLengths[j] = possiblyCloserDistance;
          predecessors[j] = closest;
        }
      }
    }
  }
  return { "startVertex": startVertex,
           "pathLengths": pathLengths,
           "predecessors": predecessors };
}

function constructPath(shortestPathInfo, endVertex) {
  var path = [];
  while (endVertex != shortestPathInfo.startVertex) {
    path.unshift(endVertex);
    endVertex = shortestPathInfo.predecessors[endVertex];
  }
  return path;
}
