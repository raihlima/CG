import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        degreesToRadians, 
        initDefaultBasicLight,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -50, 25)); // Init camera in this position
initDefaultBasicLight(scene, 1, new THREE.Vector3(10, -10, 25)); 
// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(20, 20);
planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

// create a cube
var cubeGeometry = new THREE.BoxGeometry(4, 1, 0.5);
var cubeMaterial = new THREE.MeshPhongMaterial({color:"gray"});

var cube =[];
cube [0]= new THREE.Mesh(cubeGeometry, cubeMaterial);
cube [1]= new THREE.Mesh(cubeGeometry, cubeMaterial);

cube [1].rotation.z = Math.PI / 2;

//cilindro base
var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 15, 32 );
var material = new THREE.MeshPhongMaterial({color:"white"});
var cylinder = new THREE.Mesh( geometry, material );

//motor
var motorGeometry = new THREE.BoxGeometry(1.2, 1.2, 3);
var motorMaterial = new THREE.MeshPhongMaterial({color:"blue"});
var motor = new THREE.Mesh(motorGeometry, motorMaterial);

//ponta motor
var geometryPontaMotor = new THREE.CylinderGeometry( 0.3, 0.6, 1, 32 );
var pontaMotor = new THREE.Mesh( geometryPontaMotor, motorMaterial );

//helices
var helicesGeometry = new THREE.BoxGeometry(5, 0.1, 0.5);
var helicesMaterial = new THREE.MeshPhongMaterial({color:"cyan"});
var helices = []
for(var i=0;i<3;i++){
  helices[i] = new THREE.Mesh(helicesGeometry, helicesMaterial);
  pontaMotor.add(helices[i]);
}

// position the cube
cube[0].position.set(0.0, 0.0, 0.25);
cube[1].position.set(0.0, 0.0, 0.25);
cylinder.position.set(0.0, 0.0, 7.25);
cylinder.rotation.x = Math.PI / 2;

motor.position.set(0.0, 8.0, 0.0);

pontaMotor.rotation.x = Math.PI / 2;
pontaMotor.position.set(0.0, 0.0, 2.0);

helices[0].position.set(2.5, 0.0, 0.0);
helices[0].rotation.y = degreesToRadians(0);

helices[1].position.set(-1.4, 0.0, -2.5);
helices[1].rotation.y = degreesToRadians(120);

helices[2].position.set(-1.4, 0.0, 2.5);
helices[2].rotation.y = degreesToRadians(240);


// add the cube to the scene
scene.add(cube[0]);
scene.add(cube[1]);
cube[0].add( cylinder );
cylinder.add(motor);
motor.add(pontaMotor);

// Use this to show information onscreen
var controls = new InfoBox();
  controls.add("Basic Scene");
  controls.addParagraph();
  controls.add("Use mouse to interact:");
  controls.add("* Left button to rotate");
  controls.add("* Right button to translate (pan)");
  controls.add("* Scroll to zoom in/out.");
  controls.show();

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}