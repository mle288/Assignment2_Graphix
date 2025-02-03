// import { Matrix4, Vector3 } from "./libs/cuon-matrix-cse160";
/*
Student Name: Anh Le
Student UCSC email: mle288@ucsc.edu

Notes to Grader:
N/A
*/

// HelloPint2.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size; 
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = u_Size;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  //   gl = getWebGLContext(canvas);
  //   console.log(gl);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  //   console.log(gl);
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  // Get the storage location of Size
  u_Size = gl.getUniformLocation(gl.program, "u_Size");
  if (!u_Size) {
    console.log("Failed to get the storage location of u_Size");
    return;
  }

  // Get the storage location of ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }
}

var g_timeStart = performance.now() / 200.0;
var g_time = performance.now() / 200 - g_timeStart;
function tick() {
  // Update the global time
  g_time = performance.now() / 200 - g_timeStart;
  console.log(g_time);
  // Re-render the scene
  updateAnimationAngles();
  renderScene();

  // Request the next frame
  requestAnimationFrame(tick);
}

function updateAnimationAngles() {
  if (g_firstJointAngleAnimation) {
    g_firstJointAngle = 20 * Math.sin(g_time);
  }
  if (g_secondJointAngleAnimation) {
    g_secondJointAngle = 20 * Math.sin(0.5 * g_time);
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals varibale realted to UI elements
let g_selectedColor = [0.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5.0;
let g_seletectedType = POINT;
let g_globalAngle = 0;
let g_firstJointAngle = 0;
let g_secondJointAngle = 0;
let numSegments = 3;
let g_firstJointAngleAnimation = false;
let g_secondJointAngleAnimation = false;

function addActionForHTML() {
  // // Get red color value
  // document.getElementById("redSlider").addEventListener("input", (event) => {
  //   g_selectedColor[0] = event.target.value / 255;
  // });
  // // Get green color value
  // document.getElementById("greenSlider").addEventListener("input", (event) => {
  //   g_selectedColor[1] = event.target.value / 255;
  // });
  // // Get blue color value
  // document.getElementById("blueSlider").addEventListener("input", (event) => {
  //   g_selectedColor[2] = event.target.value / 255;
  // });

  // // Get Size;
  // document.getElementById("sizeSlider").addEventListener("input", (event) => {
  //   g_selectedSize = event.target.value;
  // });

  // //clear Button event
  // document.getElementById("clearButton").addEventListener("click", () => {
  //   shapeList = [];
  //   renderScene();
  // });

  // // Get Shape
  // // Get Point Shape
  // document.getElementById("pointDrawButton").addEventListener("click", () => {
  //   g_seletectedType = POINT;
  //   console.log(g_seletectedType);
  // });
  // // Get Triangle Shape
  // document
  //   .getElementById("TriangleDrawButton")
  //   .addEventListener("click", () => {
  //     g_seletectedType = TRIANGLE;
  //   });
  // // Get Circle Shape
  // document.getElementById("circleDrawButton").addEventListener("click", () => {
  //   g_seletectedType = CIRCLE;
  //   console.log(g_seletectedType);
  // });
  // document
  //   .getElementById("segmentSlider")
  //   .addEventListener("input", (event) => {
  //     numSegments = parseInt(event.target.value);
  //   });

  document
    .getElementById("angleSlider")
    .addEventListener("mousemove", (event) => {
      g_globalAngle = event.target.value;
      renderScene();
    });

  document
    .getElementById("headSlider")
    .addEventListener("mousemove", (event) => {
      g_firstJointAngle = event.target.value;
      renderScene();
    });

  document
    .getElementById("noselider")
    .addEventListener("mousemove", (event) => {
      g_secondJointAngle = event.target.value;
      renderScene();
    });

  // Drawing picture
  // document.getElementById("drawPicture").addEventListener("click", drawPicture);
  document.getElementById("AnimationUpOffButton").onclick = function () {
    g_firstJointAngleAnimation = false;
  };
  document.getElementById("AnimationUpOnButton").onclick = function () {
    g_firstJointAngleAnimation = true;
  };

  document.getElementById("AnimationLowOffButton").onclick = function () {
    g_secondJointAngleAnimation = false;
  };
  document.getElementById("AnimationLowOnButton").onclick = function () {
    g_secondJointAngleAnimation = true;
  };
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  // Add action for HTMl
  addActionForHTML();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = (event) => {
    if (event.buttons === 1) {
      click(event);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderScene();
  requestAnimationFrame(tick);

  //   // Draw
  //   gl.drawArrays(gl.POINTS, 0, 1);
  //   drawTriangle([0, 0.5, -0.5, -0.5, 0.5, -0.5]);
}

// var g_points = []; // The array for the position of a mouse press
// var g_colors = []; // The array to store the color of a point
// var g_sizes = []; // The array to store the size of a point

var shapeList = [];

function click(ev) {
  [x, y] = convertCoordinateEventToGl(ev);
  // Store the coordinates to g_points array
  //   g_points.push([x, y]);
  //   g_colors.push();
  //   g_sizes.push(g_selectedSize.slice());
  if (g_seletectedType === POINT) {
    point = new Point();
  } else if (g_seletectedType === TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segment = numSegments;
  }
  point.color = g_selectedColor.slice();
  point.position = [x, y];
  point.size = g_selectedSize;
  shapeList.push(point);

  // Store the coordinates to g_points array
  //   if (x >= 0.0 && y >= 0.0) {
  //     // First quadrant
  //     g_colors.push([1.0, 0.0, 0.0, 1.0]); // Red
  //   } else if (x < 0.0 && y < 0.0) {
  //     // Third quadrant
  //     g_colors.push([0.0, 1.0, 0.0, 1.0]); // Green
  //   } else {
  //     // Others
  //     g_colors.push([1.0, 1.0, 1.0, 1.0]); // White
  //   }

  renderScene();
}

function convertCoordinateEventToGl(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function renderScene() {
  // Check the time at the start of this function
  var startTime = performance.now();
  var duration = performance.now - startTime;
  // sendTextToHTML("fps: " + Math.floor(10000 / duration), numdot);

  // var startTime = performance.now();

  // var len = shapeList.length;
  // for (var i = 0; i < len; i++) {
  //   shapeList[i].render();
  // }

  // Draw a test triangle
  // drawTriangle3D([-1.0, 0.0, 0.0, -0.5, -1.0, 0.0, 0.0, 0.0, 0.0]);
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Set an initial value for this matrix to identity
  var identityM = new Matrix4();

  // Clear <canvas>

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //draw a Body
  var body = new Cube();
  body.color = [1.0, 0.75, 0.8, 1.0];
  let bodyMatrix = new Matrix4();
  bodyMatrix.setTranslate(-0.25, -0.5, 0.0);
  bodyMatrix.rotate(5, 1, 0, 0);
  bodyMatrix.scale(0.5, 0.3, 1);
  body.drawCube(bodyMatrix);

  //draw a head
  var head = new Cube();
  head.color = [1.0, 0.75, 0.8, 1.0];
  let headMatrix = new Matrix4();
  headMatrix.setTranslate(-0.2, -0.4, -0.2);
  headMatrix.rotate(5, 1, 0, 0);
  var headCoordinate = new Matrix4(headMatrix);
  headMatrix.scale(0.4, 0.4, 0.4);
  head.drawCube(headMatrix);

  //draw a nose
  var nose = new Cube();
  nose.color = [1.0, 0.5, 0.6, 1.0];
  let NoseMatrix = new Matrix4(headCoordinate);
  NoseMatrix.translate(0.1, 0.05, 0.1);
  NoseMatrix.rotate(90, 0, 1, 0);
  NoseMatrix.rotate(5, 0, 1, 0);
  NoseMatrix.scale(0.2, 0.1, 0.2);
  nose.drawCube(NoseMatrix);

  //left front foot
  var leftFrontFoot = new Cube();
  leftFrontFoot.color = [1.0, 0.75, 0.8, 1.0];
  let leftFrontFootMatrix = new Matrix4();
  leftFrontFootMatrix.setTranslate(-0.25, -0.4, 0.1);
  leftFrontFootMatrix.rotate(90, 1, 0, 0);
  leftFrontFootMatrix.rotate(g_firstJointAngle, 1, 0, 0);
  var CoordinateFirstLeft = new Matrix4(leftFrontFootMatrix);
  leftFrontFootMatrix.scale(0.2, 0.2, 0.2);
  leftFrontFoot.drawCube(leftFrontFootMatrix);

  // right front foot
  var rightFrontFoot = new Cube();
  rightFrontFoot.color = [1.0, 0.75, 0.8, 1.0];
  let rightFrontFootMatrix = new Matrix4();
  rightFrontFootMatrix.setTranslate(0.05, -0.4, 0.1);
  rightFrontFootMatrix.rotate(90, 1, 0, 0);
  rightFrontFootMatrix.rotate(-g_firstJointAngle, 1, 0, 0);
  var CoordinateFirstRight = new Matrix4(rightFrontFootMatrix);
  rightFrontFootMatrix.scale(0.2, 0.2, 0.2);
  rightFrontFoot.drawCube(rightFrontFootMatrix);

  //=====================Lower Front=====================
  var leftFrontLowerFoot = new Cube();
  leftFrontLowerFoot.color = [1.0, 0.75, 0.8, 1.0];
  let leftFrontLowerFootMatrix = new Matrix4(CoordinateFirstLeft);
  leftFrontLowerFootMatrix.translate(-0.0, 0.0, 0.1);
  leftFrontLowerFootMatrix.rotate(g_secondJointAngle, 1, 0, 0);
  leftFrontLowerFootMatrix.scale(0.2, 0.2, 0.3);
  leftFrontLowerFoot.drawCube(leftFrontLowerFootMatrix);

  // //left right foot
  var rightFrontLowerFoot = new Cube();
  rightFrontLowerFoot.color = [1.0, 0.75, 0.8, 1.0];
  let rightFrontLowerFootMatrix = new Matrix4(CoordinateFirstRight);
  rightFrontLowerFootMatrix.translate(-0.0, 0.0, 0.1);
  rightFrontLowerFootMatrix.rotate(g_secondJointAngle, 1, 0, 0);
  rightFrontLowerFootMatrix.scale(0.2, 0.2, 0.3);
  rightFrontLowerFoot.drawCube(rightFrontLowerFootMatrix);

  //======================Back======================
  var leftBackFoot = new Cube();
  leftBackFoot.color = [1.0, 0.75, 0.8, 1.0];
  let leftBackFootMatrix = new Matrix4();
  leftBackFootMatrix.setTranslate(-0.25, -0.45, 0.7);
  leftBackFootMatrix.rotate(90, 1, 0, 0);
  leftBackFootMatrix.rotate(g_firstJointAngle, 1, 0, 0);
  var CoordinateThirdLeft = new Matrix4(leftBackFootMatrix);
  leftBackFootMatrix.scale(0.2, 0.2, 0.2);
  leftBackFoot.drawCube(leftBackFootMatrix);

  // right front foot
  var rightBackFoot = new Cube();
  rightBackFoot.color = [1.0, 0.75, 0.8, 1.0];
  let rightBackFootMatrix = new Matrix4();
  rightBackFootMatrix.setTranslate(0.05, -0.45, 0.7);
  rightBackFootMatrix.rotate(90, 1, 0, 0);
  rightBackFootMatrix.rotate(-g_firstJointAngle, 1, 0, 0);
  var CoordinateFourthRight = new Matrix4(rightBackFootMatrix);
  rightBackFootMatrix.scale(0.2, 0.2, 0.2);
  rightBackFoot.drawCube(rightBackFootMatrix);

  //======================Lower Back====================
  var leftBackLowerFoot = new Cube();
  leftBackLowerFoot.color = [1.0, 0.75, 0.8, 1.0];
  let leftBackLowerFootMatrix = new Matrix4(CoordinateThirdLeft);
  leftBackLowerFootMatrix.translate(-0.0, 0.0, 0.1);
  leftBackLowerFootMatrix.rotate(g_secondJointAngle, 1, 0, 0);
  leftBackLowerFootMatrix.scale(0.2, 0.2, 0.3);
  leftBackLowerFoot.drawCube(leftBackLowerFootMatrix);

  // //left right foot
  var rightBackLowerFoot = new Cube();
  rightBackLowerFoot.color = [1.0, 0.75, 0.8, 1.0];
  let rightBackLowerFootMatrix = new Matrix4(CoordinateFourthRight);
  rightBackLowerFootMatrix.translate(-0.0, 0.0, 0.1);
  rightBackLowerFootMatrix.rotate(g_secondJointAngle, 1, 0, 0);
  rightBackLowerFootMatrix.scale(0.2, 0.2, 0.3);
  rightBackLowerFoot.drawCube(rightBackLowerFootMatrix);
}

function drawPicture() {
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const i = Array.from({ length: 13 }, (_, i) => i * (0.9 / 12));

  // Brown Color
  let brown = new Triangle();
  brown.color = [0.5647, 0.3569, 0.1843, 1.0];
  brown.renderSpecific([i[3], i[5], i[5], i[7], i[6], i[3]]);
  brown.renderSpecific([i[3], i[5], i[5], i[2], i[6], i[3]]);
  brown.renderSpecific([i[5], i[2], i[6], i[3], i[6], i[1]]);
  brown.renderSpecific([i[5], i[2], i[6], i[1], i[2], -i[2]]);
  // Mirror
  brown.renderSpecific([-i[3], i[5], -i[5], i[7], -i[6], i[3]]);
  brown.renderSpecific([-i[3], i[5], -i[5], i[2], -i[6], i[3]]);
  brown.renderSpecific([-i[5], i[2], -i[6], i[3], -i[6], i[1]]);
  brown.renderSpecific([-i[5], i[2], -i[6], i[1], -i[2], -i[2]]);

  // Red Color
  let red = new Triangle();
  red.color = [0.5765, 0.2745, 0.3059, 1.0];
  red.renderSpecific([i[0], i[1], i[5], i[10], i[6], i[8]]);
  red.renderSpecific([i[5], i[10], i[6], i[8], i[7], i[7]]);
  red.renderSpecific([i[5], i[7], i[6], i[8], i[6], i[3]]);
  red.renderSpecific([i[6], i[8], i[7], i[7], i[6], i[3]]);
  red.renderSpecific([-i[0], i[1], -i[5], i[10], -i[6], i[8]]);
  red.renderSpecific([-i[5], i[10], -i[6], i[8], -i[7], i[7]]);
  red.renderSpecific([-i[5], i[7], -i[6], i[8], -i[6], i[3]]);
  red.renderSpecific([-i[6], i[8], -i[7], i[7], -i[6], i[3]]);

  // Gold color
  let gold = new Triangle();
  gold.color = [227 / 255, 188 / 255, 87 / 255, 255 / 255];
  gold.renderSpecific([i[0], i[1], i[2], i[12], i[5], i[10]]);
  gold.color = [0.9373, 0.8078, 0.4275, 1.0];
  gold.renderSpecific([i[0], i[1], i[2], i[12], i[0], i[12]]);
  gold.renderSpecific([i[0], -i[1], i[0], -i[3], i[2], -i[2]]);
  gold.renderSpecific([i[0], -i[1], i[1], i[0], i[2], -i[2]]);
  gold.renderSpecific([i[0], -i[1], i[1], i[0], i[2], -i[2]]);
  gold.renderSpecific([i[1], i[0], i[4], i[1], i[2], -i[2]]);
  gold.renderSpecific([i[1], i[0], i[3], i[2], i[4], i[1]]);
  gold.renderSpecific([i[1], i[0], i[0], i[1], i[3], i[2]]);
  //mirror

  gold.color = [227 / 255, 188 / 255, 87 / 255, 255 / 255];
  gold.renderSpecific([-i[0], i[1], -i[2], i[12], -i[5], i[10]]);
  gold.color = [0.9373, 0.8078, 0.4275, 1.0];
  gold.renderSpecific([-i[0], i[1], -i[2], i[12], -i[0], i[12]]);
  gold.renderSpecific([-i[0], -i[1], -i[0], -i[3], -i[2], -i[2]]);
  gold.renderSpecific([-i[0], -i[1], -i[1], i[0], -i[2], -i[2]]);
  gold.renderSpecific([-i[0], -i[1], -i[1], i[0], -i[2], -i[2]]);
  gold.renderSpecific([-i[1], i[0], -i[4], i[1], -i[2], -i[2]]);
  gold.renderSpecific([-i[1], i[0], -i[3], i[2], -i[4], i[1]]);
  gold.renderSpecific([-i[1], i[0], -i[0], i[1], -i[3], i[2]]);

  let skin = new Triangle();
  skin.color = [165 / 255, 129 / 255, 133 / 255, 1.0];
  skin.renderSpecific([i[0], i[1], i[0], -i[1], i[1], i[0]]);
  skin.renderSpecific([-i[0], i[1], -i[0], -i[1], -i[1], i[0]]);

  let white = new Triangle();
  white.color = [1.0, 1.0, 1.0, 1.0];
  white.renderSpecific([i[3], i[5], i[3], i[2], i[0], i[1]]);
  white.renderSpecific([-i[3], i[5], -i[3], i[2], -i[0], i[1]]);
}

// Set the text of a HTML elemnt
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
