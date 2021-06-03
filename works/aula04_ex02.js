import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {initRenderer, 
        initCamera,
        InfoBox,
        onWindowResize} from "../libs/util/util.js";

var stats = new Stats();          // To show FPS information
var scene = new THREE.Scene();    // Create main scene
var renderer = initRenderer();    // View function in util/utils
var camera = initCamera(new THREE.Vector3(0, -30, 15)); // Init camera in this position

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 12 );
scene.add( axesHelper );

// create the ground plane
var planeGeometry = new THREE.PlaneGeometry(25, 25);
planeGeometry.translate(0.0, 0.0, -1); // To avoid conflict with the axeshelper
var planeMaterial = new THREE.MeshBasicMaterial({
    color: "rgba(150, 150, 150)",
    side: THREE.DoubleSide,
});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
// add the plane to the scene
scene.add(plane);

//create a sphere
var sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
var sphereMaterial = new THREE.MeshNormalMaterial();
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// position sphere
var spherePositon = [0,0,0];
var sphereNewPositon = [0,0,0];
var sphereSpeed = [0,0,0];
sphere.position.set(spherePositon[0], spherePositon[1], spherePositon[2]);

// add the sphere to the scene
scene.add(sphere);

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

function buildInterface()
{
  var controls = new function ()
  {
    this.posX = 0;
    this.posY = 0;
    this.posZ = 0;

    this.changeMoviment1 = function(){
        sphereNewPositon[0] = this.posX;
        sphereNewPositon[1] = this.posY;
        sphereNewPositon[2] = this.posZ;
    };

    this.changeMoviment = function(){
      moviment = !moviment;
    };
  };

  // GUI interface
  var gui = new GUI();
  gui.add(controls, 'posX', -12.5, 12.5)
    .onChange(function(e) { controls.changeMoviment1() })
    .name("Move X");
  gui.add(controls, 'posY', -12.5, 12.5)
    .onChange(function(e) { controls.changeMoviment1() })
    .name("Move Y");
  gui.add(controls, 'posZ', -12.5, 12.5)
    .onChange(function(e) { controls.changeMoviment1() })
    .name("Move Z");
  gui.add(controls, 'changeMoviment',true).name("Mover");

}

//make moviment
var moviment = false;
var speed = 0.1;


function makeMoviment(){
  let xy = Math.sqrt(Math.pow(sphereNewPositon[0],2)+ Math.pow(sphereNewPositon[1],2));
  let xyz = Math.sqrt(Math.pow(sphereNewPositon[0],2)+ Math.pow(sphereNewPositon[1],2)+ Math.pow(sphereNewPositon[2],2));

 
  sphereSpeed [0] = speed * (sphereNewPositon[0]/xyz);
  sphereSpeed [1] = speed * (sphereNewPositon[1]/xyz);
  sphereSpeed [2] = speed * (sphereNewPositon[2]/xyz);

  if(sphereNewPositon[0]>0 && spherePositon[0]>sphereNewPositon[0]){
    sphereSpeed [0] = sphereSpeed [0] *(-1);
  }

  if(moviment){

    //X
    spherePositon[0] = spherePositon[0]+sphereSpeed [0];
    spherePositon[1] = spherePositon[1]+sphereSpeed [1];
    spherePositon[2] = spherePositon[2]+sphereSpeed [2];
    
    if(sphereNewPositon[0]<0){
      if(sphereNewPositon[0]>spherePositon[0]){
        spherePositon[0] = sphereNewPositon[0];
      } 
    } else if(sphereNewPositon[0]>=0){
      if(sphereNewPositon[0]<=spherePositon[0]){
        spherePositon[0] = sphereNewPositon[0];
      } 
    }
    //Y
    if(sphereNewPositon[1]<0){
      if(sphereNewPositon[1]>spherePositon[1]){
        spherePositon[1] = sphereNewPositon[1];
      }
    } else if(sphereNewPositon[1]>=0){
      if(sphereNewPositon[1]<spherePositon[1]){
        spherePositon[1] = sphereNewPositon[1];
      }
    }
    //Z
    if(sphereNewPositon[2]<0){
      if(sphereNewPositon[2]>spherePositon[2]){
        spherePositon[2] = sphereNewPositon[2];
      }
    } else if(sphereNewPositon[2]>=0){
      if(sphereNewPositon[2]<spherePositon[2]){
        spherePositon[2] = sphereNewPositon[2];
      }
    }
    sphere.position.set(spherePositon[0], spherePositon[1], spherePositon[2]);
  }
}

buildInterface();
render();
function render()
{
  stats.update(); // Update FPS
  trackballControls.update(); // Enable mouse movements
  requestAnimationFrame(render);
  makeMoviment();
  renderer.render(scene, camera) // Render scene
}