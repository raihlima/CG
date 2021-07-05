import * as THREE from  '../build/three.module.js';
import Stats from       '../build/jsm/libs/stats.module.js';
import {GUI} from       '../build/jsm/libs/dat.gui.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import {TeapotGeometry} from '../build/jsm/geometries/TeapotGeometry.js';
import {initRenderer, 
        InfoBox,
        SecondaryBox,
        createGroundPlane,
        onWindowResize, 
        degreesToRadians, 
        createLightSphere} from "../libs/util/util.js";

var scene = new THREE.Scene();    // Create main scene
var stats = new Stats();          // To show FPS information

var renderer = initRenderer();    // View function in util/utils
  renderer.setClearColor("rgb(30, 30, 42)");
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.lookAt(0, 0, 0);
  camera.position.set(0.0, 3.0, 6.0);
  camera.up.set( 0, 1, 0 );

// To use the keyboard
var keyboard = new KeyboardState();

// Enable mouse rotation, pan, zoom etc.
var trackballControls = new TrackballControls( camera, renderer.domElement );

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false );

var groundPlane = createGroundPlane(4.0, 4, 50, 50); // width and height
  groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 1.5 );
  axesHelper.visible = false;
scene.add( axesHelper );

// Show text information onscreen
showInformation();

var infoBox = new SecondaryBox("");

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({color:"white", shininess:"200"});
  material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
  obj.castShadow = true;
  obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);
var animationOn = true; // Controls the teapot animation state
var rotateTeapotClockwise = false; // Controls the teapot animation state

// TRACKS
// Define materials
var frontTrackGeometry = new THREE.BoxGeometry(4.0, 0.01, 0.01);
var verticalTrackGeometry = new THREE.BoxGeometry(1.5, 0.01, 0.01);
var sideTracksGeometry = new THREE.BoxGeometry(0.01, 0.01, 4.0);
var trackMaterial = new THREE.MeshBasicMaterial( {color: "gray"} );
// front
var frontTrack = new THREE.Mesh(frontTrackGeometry, trackMaterial);
frontTrack.position.set(0.0, 1.5, 2);
scene.add(frontTrack);

// right
var rightTrack = new THREE.Mesh(sideTracksGeometry, trackMaterial);
rightTrack.position.set(2.0, 1.5, 0.0);
scene.add(rightTrack);
// left
var leftTrack = new THREE.Mesh(sideTracksGeometry, trackMaterial);
leftTrack.position.set(-2.0, 1.5, 0.0);
scene.add(leftTrack);
//vertical
var verticalTrack1 = new THREE.Mesh(verticalTrackGeometry, trackMaterial);
verticalTrack1.position.set(2.0, 0.75, 2);
verticalTrack1.rotateZ(degreesToRadians(90));
scene.add(verticalTrack1);

var verticalTrack2 = new THREE.Mesh(verticalTrackGeometry, trackMaterial);
verticalTrack2.position.set(2.0, 0.75, -2);
verticalTrack2.rotateZ(degreesToRadians(90));
scene.add(verticalTrack2);

var verticalTrack3 = new THREE.Mesh(verticalTrackGeometry, trackMaterial);
verticalTrack3.position.set(-2.0, 0.75, 2);
verticalTrack3.rotateZ(degreesToRadians(90));
scene.add(verticalTrack3);

var verticalTrack4 = new THREE.Mesh(verticalTrackGeometry, trackMaterial);
verticalTrack4.position.set(-2.0, 0.75, -2);
verticalTrack4.rotateZ(degreesToRadians(90));
scene.add(verticalTrack4);



// LIGHTS
// Red light
var redSpotLight = new THREE.SpotLight("red"); // red spotlight
var redLightPosition = new THREE.Vector3(-2.0, 1.5, 0.0); // red light initial position
//var redLightPosition = new THREE.Vector3(0.0, 1.5, 2); // red light initial position
var redLightId = 0; // unique id
setSpotLights(redLightPosition, redLightId);

// Defines red light sphere
var geometryLightsSphere = new THREE.SphereGeometry(0.05, 10, 10, 0, Math.PI * 2, 0, Math.PI);
var materialRedLightSphere = new THREE.MeshBasicMaterial({color:"red"});
var redLightSphere = new THREE.Mesh(geometryLightsSphere, materialRedLightSphere);
//redLightSphere.visible = true;
redLightSphere.position.copy(redLightPosition);
scene.add(redLightSphere);

// Green light
var greenSpotLight = new THREE.SpotLight("green"); // green spotlight
var greenLightPosition = new THREE.Vector3(0.0, 1.5, 2); // green light initial position
//var greenLightPosition = new THREE.Vector3(-2.0, 1.5, 0.0); // green light initial position
var greenLightId = 1; // unique id
setSpotLights(greenLightPosition, greenLightId);

// Defines green light sphere
var materialGreenLightSphere = new THREE.MeshBasicMaterial({color:"green"});
var greenLightSphere = new THREE.Mesh(geometryLightsSphere, materialGreenLightSphere);
//greenLightSphere.visible = true;
greenLightSphere.position.copy(greenSpotLight);
scene.add(greenLightSphere);

// Blue light
var blueSpotLight = new THREE.SpotLight("blue"); // blue spotlight
var blueLightPosition = new THREE.Vector3(2.0, 1.5, 0.0); // blue light initial position
//var blueLightPosition = new THREE.Vector3(2.0, 1.5, 0.0); // blue light initial position
var blueLightId = 2; // unique id
setSpotLights(blueLightPosition, blueLightId);

// Defines blue light sphere
var materialBlueLightSphere = new THREE.MeshBasicMaterial({color:"blue"});
var blueLightSphere = new THREE.Mesh(geometryLightsSphere, materialBlueLightSphere);
//blueLightSphere.visible = true;
blueLightSphere.position.copy(blueSpotLight);
scene.add(blueLightSphere);


buildInterface();
render();

function setSpotLights(position, id)
{
  if(id == 0){ // red
    redSpotLight.position.copy(position);
    redSpotLight.shadow.mapSize.width = 512;
    redSpotLight.shadow.mapSize.height = 512;
    redSpotLight.angle = degreesToRadians(40);    
    redSpotLight.castShadow = true;
    redSpotLight.decay = 2;
    redSpotLight.penumbra = 0.5;
    redSpotLight.name = "Red Spot Light"

    scene.add(redSpotLight);
  }
  if(id == 1){ // green
    greenSpotLight.position.copy(position);
    greenSpotLight.shadow.mapSize.width = 512;
    greenSpotLight.shadow.mapSize.height = 512;
    greenSpotLight.angle = degreesToRadians(40);    
    greenSpotLight.castShadow = true;
    greenSpotLight.decay = 2;
    greenSpotLight.penumbra = 0.5;
    greenSpotLight.name = "Green Spot Light"

    scene.add(greenSpotLight);
  }
  if(id == 2){ // blue
    blueSpotLight.position.copy(position);
    blueSpotLight.shadow.mapSize.width = 512;
    blueSpotLight.shadow.mapSize.height = 512;
    blueSpotLight.angle = degreesToRadians(40);    
    blueSpotLight.castShadow = true;
    blueSpotLight.decay = 2;
    blueSpotLight.penumbra = 0.5;
    blueSpotLight.name = "Blue Spot Light"

    scene.add(blueSpotLight);
  }

}

function rotateTeapot(){
  var angle = 1; // set speed of rotation
  if(animationOn){
    if(rotateTeapotClockwise){
      obj.rotateY(degreesToRadians(-angle));
    } else {
      obj.rotateY(degreesToRadians(+angle));
    }
  }
}

// Update light position of the spot lights
function updateLightsPosition(id)
{
  //lightArray[activeLight].position.copy(lightPosition);
  if (id == 0){
    redSpotLight.position.copy(redLightPosition);
    redLightSphere.position.copy(redLightPosition);
    infoBox.changeMessage("Red Light Position: " + redLightPosition.x.toFixed(2) + ", " +
                          redLightPosition.y.toFixed(2) + ", " + redLightPosition.z.toFixed(2));
  }
  if (id == 1){
    greenSpotLight.position.copy(greenLightPosition);
    greenLightSphere.position.copy(greenLightPosition);
    infoBox.changeMessage("Green Light Position: " + greenLightPosition.x.toFixed(2) + ", " +
                          greenLightPosition.y.toFixed(2) + ", " + greenLightPosition.z.toFixed(2));
  }
  if (id == 2){
    blueSpotLight.position.copy(blueLightPosition);
    blueLightSphere.position.copy(blueLightPosition);
    infoBox.changeMessage("Blue Light Position: " + blueLightPosition.x.toFixed(2) + ", " +
                          blueLightPosition.y.toFixed(2) + ", " + blueLightPosition.z.toFixed(2));
  }

}

function buildInterface()
{
  //------------------------------------------------------------
  // Interface
  var controls = new function ()
  {
    this.viewAxes = false;
    this.redSpotLight = true; // initial status
    this.blueSpotLight = true; // initial status
    this.greenSpotLight = true; // initial status
    this.rotateTeapot = true; // initial status

    this.onEnableRedLight = function(){ // Red light power toggle
      redSpotLight.visible = this.redSpotLight;
      redLightSphere.visible = !redLightSphere.visible;
    };
    this.onEnableBlueLight = function(){ // Blue light power toggle
      blueSpotLight.visible = this.blueSpotLight;
      blueLightSphere.visible = !blueLightSphere.visible;
    };
    this.onEnableGreenLight = function(){ // Green light power toggle
      greenSpotLight.visible = this.greenSpotLight;
      greenLightSphere.visible = !greenLightSphere.visible;
    };
    this.onChangeAnimation = function(){ // Controls Teapot rotation
      animationOn = !animationOn;
    };
  };

  var gui = new GUI();
  gui.add(controls, 'redSpotLight', true)
    .name("Red Spot Light")
    .onChange(function(e) { controls.onEnableRedLight() });
  gui.add(controls, 'greenSpotLight', true)
    .name("Green Spot Light")
    .onChange(function(e) { controls.onEnableGreenLight() });
  gui.add(controls, 'blueSpotLight', true)
    .name("Blue Spot Light")
    .onChange(function(e) { controls.onEnableBlueLight() });
  gui.add(controls, 'onChangeAnimation',true).name("Teapot Rotation");
}

function keyboardUpdate()
{
  keyboard.update();
  if ( keyboard.pressed("D") ) // move red light to right
  {
    if (redLightPosition.z < 2){ // limit the movement only when on track
      redLightPosition.z += 0.05;
      updateLightsPosition(redLightId);
    }
  }
  if ( keyboard.pressed("A") ) // move red light to left
  {
    if (redLightPosition.z > -2){ // limit the movement only when on track
      redLightPosition.z -= 0.05;
      updateLightsPosition(redLightId);
    }
  }
  if ( keyboard.pressed("Z") )
  {
    if (greenLightPosition.x < 2){ // limit the movement only when on track
      greenLightPosition.x += 0.05;
      updateLightsPosition(greenLightId);
    }
  }
  if ( keyboard.pressed("C") )
  {
    if (greenLightPosition.x > -2){ // limit the movement only when on track
      greenLightPosition.x -= 0.05;
      updateLightsPosition(greenLightId);
    }
  }
  if ( keyboard.pressed("E") ) // move blue light to the front
  {
    if (blueLightPosition.z < 2){ // limit the movement only when on track
      blueLightPosition.z += 0.05;
      updateLightsPosition(blueLightId);
    }
  }
  if ( keyboard.pressed("Q") ) // move blue light backwards
  {
    if (blueLightPosition.z > -2){ // limit the movement only when on track
      blueLightPosition.z -= 0.05;
      updateLightsPosition(blueLightId);
    }
  }
}

function gerarEsferas(){
  updateLightsPosition(redLightId);
  updateLightsPosition(greenLightId);
  updateLightsPosition(blueLightId);
}

gerarEsferas();

function showInformation()
{
  // Use this to show information onscreen
  var controls = new InfoBox();
    controls.add("Commands");
    controls.addParagraph();
    controls.add("Use Q and E to move the blue light");
    controls.add("Use A and D to move the red light");
    controls.add("Use Z and C to move the green light");
    controls.addParagraph();
    controls.add("Use mouse to control camera:");
    controls.add("* Left button to rotate");
    controls.add("* Right button to translate (pan)");
    controls.add("* Scroll to zoom in/out.");
    controls.show();
}

function render()
{
  stats.update();
  trackballControls.update();
  keyboardUpdate();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  rotateTeapot(); // Enables teapot rotation
}
