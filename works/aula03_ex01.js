import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {initRenderer, 
        InfoBox, degreesToRadians, createGroundPlaneWired,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
//Debug
const xElem = document.querySelector('#x');
const yElem = document.querySelector('#y');
const zElem = document.querySelector('#z');

//Add light
scene.add (new THREE.HemisphereLight());

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

// create the ground plane
var groundPlaneWired = createGroundPlaneWired(50,50,50,50);
scene.add(groundPlaneWired);

//create camera
var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
cameraHolder.lookAt(0, 0, 0);
cameraHolder.position.set(0, 2, 0);
cameraHolder.up.set( 0, 1, 0 );
scene.add(cameraHolder);

const direction = new THREE.Vector3;

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Free Camera");
  controls.addParagraph();
  controls.add("* Space ");
  controls.add("* Up, Down, Right and Left arrow");
  controls.add("* < and >");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

//Moviment
var movX = false;
var movX1 = false;
var movY = false;
var movY1 = false;
var movZ = false;
var movZ1 = false;
var moveForward = false;

window.addEventListener('keydown', (event) => movementControls(event.keyCode, true));
window.addEventListener('keyup', (event) => movementControls(event.keyCode, false));


var rotX = new THREE.Vector3(1, 0, 0); // Set X axis
var rotY = new THREE.Vector3(0, 1, 0); // Set Y axis
var rotZ = new THREE.Vector3(0, 0, 1); // Set Z axis

function movementControls(key, val) {
  
  switch (key) {
    case 38: // up arrow
      movX1 = val;
      break;
    case 40: // down arrow
      movX = val;
      break;
    case 37: // left arrow
      movY = val;
      break;
    case 39: // right arrow
      movY1 = val;
      break;
    case 188: // <
      movZ = val;
      break;
    case 190: // >
      movZ1 = val;
      break;
    case 32: // Space
      moveForward = val;
      break;
  }
}

function moveCamera(){
  let speed = -0.2;
  let angle = degreesToRadians(1);
  if (moveForward) {
    cameraHolder.translateZ(speed);
  }
  if(movX){
    cameraHolder.rotateOnAxis(rotX, angle);
  } else if(movX1){
    cameraHolder.rotateOnAxis(rotX, -angle);
  }
  if(movY){
    cameraHolder.rotateOnAxis(rotY, angle);
  } else if(movY1){
    cameraHolder.rotateOnAxis(rotY, -angle);
  }
  if(movZ){
    cameraHolder.rotateOnAxis(rotZ, angle);
  } else if(movZ1){
    cameraHolder.rotateOnAxis(rotZ, -angle);
  }
}
render();
function render()
{
  // at render or update time
  movementControls();
  moveCamera();
  stats.update(); // Update FPS
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}