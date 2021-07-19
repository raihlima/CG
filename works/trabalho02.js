import * as THREE from  '../build/three.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import KeyboardState from       '../libs/util/KeyboardState.js';
import {initRenderer, 
        //createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians,
        //initDefaultBasicLight,
        initCamera,
        InfoBox} from "../libs/util/util.js";

import { gerarArvores } from './classes/arvore.js';
import {Aviao} from './classes/aviao.js';

var stats = new Stats();        // To show FPS information
var scene = new THREE.Scene();  // create scene
var renderer = initRenderer();  // View function in util/utils
//initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene
// Adds some lights to the scene
//var hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
var hemisphereLight = new THREE.HemisphereLight( "white", "white", 0.75 );
scene.add( hemisphereLight );
// White directional light shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
// directional light configs
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
/*directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;*/
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default
//directionalLight.castShadow = true; // TODO fix airplane shadows
directionalLight.position.set(50, 50, 50); // TODO adjust scene lights // TODO create a fake sunlight in the same position to mimic the sun
scene.add( directionalLight );

//remover camera
//var camera = initCamera(new THREE.Vector3(0, -500, 15)); // Init camera in this position



// FPS panel config
function createStats() {
    stats.setMode(0);
    
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';
  
    return stats;
  }
  // To show FPS
  stats = createStats();
  document.body.appendChild( stats.domElement );



// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 25 );
// Reposition of helper to better visualization of it
axesHelper.translateY(20); // TODO remove translation from axes helper
axesHelper.translateX(20);

// Plano base que simula agua
/*var groundPlaneWired = createGroundPlaneWired(1000, 1000, 20, 20, "green");
groundPlaneWired.rotateX(degreesToRadians(90)); // rotacionado por conta da pespectiva da camera "arrasto no chao"
// Adiciona ambos objetos na cena
scene.add(groundPlaneWired);
groundPlaneWired.add(axesHelper);*/

// create the ground plane
var groundPlaneGeometry = new THREE.PlaneGeometry(1000, 1000);
groundPlaneGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
var groundPlaneMaterial = new THREE.MeshBasicMaterial({ // TODO change the material to mimic grass and for better visualization when moving the airplane
    //color: "rgba(150, 150, 150)", // light grey
    color: "green", // TODO adjust the color
    //side: THREE.DoubleSide,
    //receiveShadow: true,
});
var groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
// add the ground plane to the scene
scene.add(groundPlane);
groundPlane.add(axesHelper);

//-----------------------------------//
// LANDING TRACK CONFIGURATION BEGIN //
//-----------------------------------//
// Landing track (pista de pouso)
var landingTrackLenghtY = 250.0;
var landingTrackLinesLenghtY = 15.0;
var landingTrackGeometry = new THREE.BoxGeometry(30.0, landingTrackLenghtY, 0.2);
var landingTrackMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
// create the landing track
var landingTrack = new THREE.Mesh(landingTrackGeometry, landingTrackMaterial);
landingTrack.position.set(0.0, -350.0, 0.0);
landingTrack.receiveShadow = true;
//groundPlaneWired.add(landingTrack);
groundPlane.add(landingTrack);

var vetLandingLines = [];
var linesPosition = (landingTrackLenghtY / 2) - (landingTrackLinesLenghtY * 1.5); // start positioning the lines within the beginning of the track
var landingTrackLinesGeometry = new THREE.BoxGeometry(1.0, landingTrackLinesLenghtY, 0.2);
var landingTrackLinesMaterial = new THREE.MeshLambertMaterial({color:"rgb(255, 255, 255)"}); // white
// create the landing track
var landingTrackLines = new THREE.Mesh(landingTrackLinesGeometry, landingTrackLinesMaterial);
for(let i = 0; i < 8; i++){ // sets the number of lines on track
    let distance = 30.0; // distance between lines
    var landingTrackLines = new THREE.Mesh(landingTrackLinesGeometry, landingTrackLinesMaterial);
    vetLandingLines[i] = landingTrackLines; // add the newly created object to the array
    vetLandingLines[i].position.set(0.0, linesPosition-(i*distance), 0.02);
    landingTrack.add(vetLandingLines[i]); // add the newly created object to the scene
}
//-----------------------------------//
// LANDING TRACK CONFIGURATION END   //
//-----------------------------------//

//-----------------------------------//
// FLIGHT PATH CONFIGURATION BEGIN   //
//-----------------------------------//
var checkPointGeometry = new THREE.TorusGeometry(10.0, 0.5, 32, 24);
var checkPointMaterial = new THREE.MeshPhongMaterial({color:"orange", transparent:"true", opacity:"0.75"}); 
var checkPoint = new THREE.Mesh(checkPointGeometry, checkPointMaterial);
checkPoint.rotateX(degreesToRadians(90));
checkPoint.position.set(0.0, 30.0, 20.0);
landingTrack.add(checkPoint);
// TODO fazer o resto do caminho depois
//-----------------------------------//
// FLIGHT PATH CONFIGURATION END     //
//-----------------------------------//


// Listen window size changes
//window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false ); // no modo simulacao
//window.addEventListener( 'resize', function(){onWindowResize(cameraInspection, renderer)}, false ); // no modo inspecao

// Show text information onscreen
showInformation(); // displays information about the controls




/*
var planePositionX = 0.0; // TODO fix airplane position restore from inspection mode
var planePositionY = -470.0; // previous value was -370.0
var planePositionZ = 2.5;

var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var mockPlaneGeometry = new THREE.BoxGeometry(100, 100, 100, 320);
var mockPlane = new THREE.Mesh(mockPlaneGeometry, fuselageMaterial);
mockPlane.position.set(0, -470, 0); // initial position
scene.add(mockPlane);
*/

gerarArvores(groundPlane);

function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flight Simulator controls:");
    controls.addParagraph();
    controls.add("Press arrow keys to change airplane direction");
    controls.add("Press SPACE to toggle inspection mode");
    controls.add("Press Q to move faster");
    controls.add("Press A to move slower");
    controls.show();
}

var aviao = new Aviao(scene);

//var trackballControls = new TrackballControls( camera, renderer.domElement );
function render() {
    requestAnimationFrame( render );
	renderer.render( scene, aviao.getCameraAtual() );
    stats.update(); // Update FPS
    aviao.keyboardUpdateHolder(); // listens to keyboard inputs and controls cameraHolder
    aviao.moverAviao(); // moves the airplane foward
    //trackballControls.update(); // Enable mouse movements
    aviao.rotateBlades(); // Enable airplane blades rotation
    aviao.slowSpeed(); // Checks if airplane is too slow
    //getAirplaneHeightPosition(); // Updates the airplane position data
}
render();
