import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        degreesToRadians, 
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

const light = new THREE.DirectionalLight(0xfefefe);
light.position.set(100, 90, 100);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x442222);
scene.add(ambientLight);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
//scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(10, 10);
planeGeometry.translate(0.0, 0.0, 0); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
//var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
//scene.add(plane);

//texture
const loader = new THREE.TextureLoader();
const marbleTexture = loader.load('../../assets/textures/marble.png');

//marbleTexture.repeat.set( 4, 4 ); 

const marbleMaterial = new THREE.MeshLambertMaterial({
  map: marbleTexture
});

var frontMarbleMaterial = new THREE.MeshPhongMaterial( { map: marbleTexture, side: THREE.FrontSide } );
var backMarbleMaterial = new THREE.MeshPhongMaterial( { map: marbleTexture, side: THREE.BackSide } );

var materials = [ frontMarbleMaterial, backMarbleMaterial ];

const woodTopMaterial = new THREE.MeshLambertMaterial({
  map: marbleTexture
});

var plane = [];

for(let i=0;i<5;i++){
  plane[i] = new THREE.Mesh(planeGeometry, marbleMaterial);
  plane[i].side = THREE.DoubleSide;
  plane[i].material.side = THREE.DoubleSide;
}

plane[1].position.set(0.0, 5.0, 5.0);
plane[1].rotation.x = Math.PI / 2;
plane[2].position.set(0.0, -5.0, 5.0);
plane[2].rotation.x = Math.PI / 2;
plane[3].position.set(5.0, 0.0, 5.0);
plane[3].rotation.x = Math.PI / 2;
plane[3].rotation.y = Math.PI / 2;
plane[4].position.set(-5.0, 0.0, 5.0);
plane[4].rotation.x = Math.PI / 2;
plane[4].rotation.y = Math.PI / 2;

plane[0].add(plane[1]);
plane[0].add(plane[2]);
plane[0].add(plane[3]);
plane[0].add(plane[4]);


scene.add(plane[0]);

/*
// create a cylinder
var cylinderGeometry = new THREE.CylinderGeometry(2, 2, 10, 32, 32, true);
var cylinder = new THREE.Mesh(cylinderGeometry, marbleMaterial);


// create a circle
var circleGeometry = new THREE.CircleGeometry(2,32);
var circle = new THREE.Mesh(circleGeometry, woodTopMaterial);
var circle2 = new THREE.Mesh(circleGeometry, woodTopMaterial);

// position the cylinder
cylinder.position.set(0.0, 0.0, 5.0);
cylinder.rotation.x = Math.PI / 2;
circle.position.set(0.0, 5, 0);
circle.rotation.x = -Math.PI / 2;
circle2.position.set(0.0, -5, 0);
circle2.rotation.x = Math.PI / 2;

cylinder.add(circle);
cylinder.add(circle2);

// add the cylinder to the scene
scene.add(cylinder);

/*
// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();
*/
// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );
buildInterface();

var angle = [-1.57, 0, 0]; // In degreesToRadians

function rotateCylinder()
{
  // More info:
  // https://threejs.org/docs/#manual/en/introduction/Matrix-transformations
  plane[0].matrixAutoUpdate = false;

  var mat4 = new THREE.Matrix4();

  // resetting matrices
  plane[0].matrix.identity();

  // Will execute T1 and then R1
  plane[0].matrix.multiply(mat4.makeRotationX(angle[0])); // R1
  plane[0].matrix.multiply(mat4.makeTranslation(0.0, 1.0, 0.0)); // T1

  plane[0].matrix.multiply(mat4.makeRotationY(angle[1])); // R1

  plane[0].matrix.multiply(mat4.makeRotationZ(angle[2])); // R1
}

function buildInterface()
{
  var controls = new function ()
  {
    this.joint1 = 270;
    this.joint2 = 0;
    this.joint3 = 0;

    this.rotate = function(){
      angle[0] = degreesToRadians(this.joint1);
      angle[1] = degreesToRadians(this.joint2);
      angle[2] = degreesToRadians(this.joint3);
      rotateCylinder();
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'joint1', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("X");
  gui.add(controls, 'joint2', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Y");
  gui.add(controls, 'joint3', 0, 360)
    .onChange(function(e) { controls.rotate() })
    .name("Z");
}

render();
function render()
{
  stats.update(); // Update FPS
  rotateCylinder();
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}