import * as THREE from  '../build/three.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import KeyboardState from       '../libs/util/KeyboardState.js';
import {ConvexGeometry} from '../build/jsm/geometries/ConvexGeometry.js';
import {OBJLoader} from '../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../build/jsm/loaders/MTLLoader.js';
import {initRenderer, 
        onWindowResize, 
        degreesToRadians,
        SecondaryBox,
        InfoBox,
        lightFollowingCamera} from '../libs/util/util.js';

import { gerarArvores } from './classes/arvore.js';
import {Aviao} from './classes/aviao.js';
import { gerarCidade } from './classes/cidade.js';

var stats = new Stats();        // To show FPS information
var scene = new THREE.Scene();  // create scene
var renderer = initRenderer();  // View function in util/utils
//initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene
var information = new SecondaryBox(""); // to display the secondary information later
var objectsCompletion = 0;
//-----------------------------------//
// SCENE LIGHTS CONFIGURATION BEGIN  //
//-----------------------------------//
// Adds some lights to the scene
// Spot light
var spotLight = new THREE.SpotLight( "white", 0.0); // 0.0 because it starts turned off
scene.add(spotLight);
spotLight.position.set(0, 0, 10); // sets the initial position of the spotlight
// Hemisphere light
var hemisphereLight = new THREE.HemisphereLight( "white", "white", 0.75 );
scene.add( hemisphereLight );
// White directional light shining from the top.
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.75 );
// Directional light configs
// shadow resolution
directionalLight.shadow.mapSize.width = 2048; // was 8192
directionalLight.shadow.mapSize.height = 2048; // was 8192
//directionalLight.penunbra = 0.7; TODO config this
// area where shadows appear // 500 x 500 = size of ground plane
directionalLight.shadow.camera.left = -500;
directionalLight.shadow.camera.right = 500;
directionalLight.shadow.camera.top = 500;
directionalLight.shadow.camera.bottom = -500;
// near and far
directionalLight.shadow.camera.near = 20; // default 0.5
directionalLight.shadow.camera.far = 151; // default 500 // 151 because 150 didn't reach the ground plane
// enable shadows
directionalLight.castShadow = true;
// directional light position
directionalLight.position.set(0, 0, 150); // 120 is the big mountain height, so higher than that
var directionalLightHelper = new THREE.CameraHelper( directionalLight.shadow.camera ); // creates a helper to better visualize the light
// add to the scene
scene.add( directionalLightHelper );
scene.add( directionalLight );
directionalLightHelper.visible = false; // comment to display the helper
//-----------------------------------//
// SCENE LIGHTS CONFIGURATION END    //
//-----------------------------------//

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
var axesHelper = new THREE.AxesHelper( 100 );
// Replace the helper to better visualize it
axesHelper.translateY(-250);
axesHelper.translateX(-450);

// create the ground plane
var groundPlaneGeometry = new THREE.PlaneGeometry(1000, 1000);
var groundPlaneMaterial = new THREE.MeshLambertMaterial({
    //color: "rgba(150, 150, 150)", // light grey
    color: "green",
});
var groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial);
groundPlane.position.set(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
// add the ground plane to the scene
groundPlane.receiveShadow = true; // enables shadows
scene.add(groundPlane);
groundPlane.add(axesHelper);

// create the auxiliary ground plane
var auxiliaryGroundPlaneGeometry = new THREE.PlaneGeometry(9000, 9000);
var auxiliaryPlaneMaterial = new THREE.MeshLambertMaterial({
    //color: "rgb(160, 140, 90)", // to mimic sand
    color: "rgb(0, 80, 0)", // to mimic grass
});
var auxiliaryPlane = new THREE.Mesh(auxiliaryGroundPlaneGeometry, auxiliaryPlaneMaterial);
auxiliaryPlane.position.set(0.0, 0.0, -1.0); // To avoid conflict with ground plane
groundPlane.add(auxiliaryPlane);

//-----------------------------------//
// SKYBOX CONFIGURATION BEGIN        //
//-----------------------------------//

const skyboxLoader = new THREE.CubeTextureLoader();
const skybox = skyboxLoader.load([
  'textures/skybox/left.bmp',
  'textures/skybox/right.bmp',
  'textures/skybox/front.bmp',
  'textures/skybox/back.bmp',
  'textures/skybox/top.bmp',
  'textures/skybox/bottom.bmp',
]);
scene.background = skybox;

//-----------------------------------//
// SKYBOX CONFIGURATION END          //
//-----------------------------------//

//-----------------------------------//
// MOUNTAINS CONFIGURATION BEGIN     //
//-----------------------------------//
var mountainScaleSmall = 3;
// var mountainScaleMedium = 5;
// var mountainScaleHigh = 10;
// Small mountain
var points1 = [// cume
              new THREE.Vector3( 0.0 * mountainScaleSmall, 1.0 * mountainScaleSmall, 6.0 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 2.0 * mountainScaleSmall, 8.5 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 4.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 6.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 8.0 * mountainScaleSmall, 4.0 * mountainScaleSmall ),
              new THREE.Vector3( 5.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 6.0*mountainScaleSmall ),
              new THREE.Vector3( -4.0*mountainScaleSmall, 2.0*mountainScaleSmall, 3.0*mountainScaleSmall ),
              // base
              new THREE.Vector3( 0.0, 0.0, 0.0 ),
              new THREE.Vector3( 0.0 * mountainScaleSmall, 10.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 10.0 * mountainScaleSmall, 10.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( -5.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 6.0 * mountainScaleSmall, 2.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 5.0 * mountainScaleSmall, 12.0 * mountainScaleSmall, 0.0 ),
              new THREE.Vector3( 7.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 0.0 )
            ];

var points2 = [// cume
                new THREE.Vector3( 0.0 * mountainScaleSmall, -1.0 * mountainScaleSmall, 6.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -2.0 * mountainScaleSmall, 10.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -4.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -6.0 * mountainScaleSmall, 8.0 * mountainScaleSmall ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, -8.0 * mountainScaleSmall, 4.0 * mountainScaleSmall ),
                new THREE.Vector3( 5.0 * mountainScaleSmall, -5.0 * mountainScaleSmall, 6.0 * mountainScaleSmall ),
                new THREE.Vector3( -4.0 * mountainScaleSmall, -2.0 * mountainScaleSmall, 3.0 * mountainScaleSmall ),
                // base
                new THREE.Vector3( 0.0, 0.0, 0.0 ),
                new THREE.Vector3( 0.0 * mountainScaleSmall, 10.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 10.0 * mountainScaleSmall, 8.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( -5.0 * mountainScaleSmall, -5.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 6.0 * mountainScaleSmall, 2.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 5.0 * mountainScaleSmall, -12.0 * mountainScaleSmall, 0.0 * mountainScaleSmall ),
                new THREE.Vector3( 7.0 * mountainScaleSmall, 5.0 * mountainScaleSmall, 0.0 * mountainScaleSmall )
            ];
    
var geometry1 = new ConvexGeometry( points1 );
var geometry2 = new ConvexGeometry( points2 );

// mountain materials
var materialLand = new THREE.MeshLambertMaterial( { color:"rgb(80, 75, 0)" } ); // brown
// Small mountain
var mesh1 = new THREE.Mesh( geometry1, materialLand );
var mesh2 = new THREE.Mesh( geometry2, materialLand );
//mesh1.position.set(-350,300,0);
//groundPlane.add( mesh1 );
mesh1.add( mesh2 );

// create the mountain ground plane
var mountainPlaneGeometry = new THREE.PlaneGeometry(100, 100);
//mountainPlaneGeometry.translate(0.0, 0.0, -0.01); // To avoid conflict with the axeshelper
var mountainPlaneMaterial = new THREE.MeshLambertMaterial({
    color: "rgb(80, 75, 0)", // brown
});
var mountainPlane = new THREE.Mesh(mountainPlaneGeometry, mountainPlaneMaterial);
// add the ground plane to the scene
mountainPlane.receiveShadow = true; // enables shadows
mountainPlane.position.set(-350,300,0.1);
//mountainPlane.position.set(0,-300,0);
groundPlane.add(mountainPlane);
mountainPlane.add(mesh1);

// create the ice ground plane
var iceCircleGeometry = new THREE.CircleGeometry(40, 64);
//icePlaneGeometry.translate(0.0, 0.0, -0.01); // To avoid conflict with the axeshelper
var iceCircleMaterial = new THREE.MeshPhongMaterial({
    color: "white", // brown
    reflectivity:"0.25",
    specular:"white",
    transparent:"true",
    opacity:"0.8",
    //shininess:"100",
});
var iceCircle = new THREE.Mesh(iceCircleGeometry, iceCircleMaterial);
// add the ground plane to the scene
iceCircle.receiveShadow = true; // enables shadows
iceCircle.position.set(450,50,0.1);
//iceCircle.position.set(50,-350,0.1);
//mountainPlane.position.set(0,-300,0);
groundPlane.add(iceCircle);
//mountainPlane.add(mesh1); // TODO add external object later

// mountains shadows
mesh1.receiveShadow = true;
mesh2.receiveShadow = true;

mesh1.castShadow = true;
mesh2.castShadow = true;
//-----------------------------------//
// MOUNTAINS CONFIGURATION END       //
//-----------------------------------//

gerarCidade(groundPlane);


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
landingTrack.position.set(200.0, -370.0, 0.0);
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
// Path points configuration // TODO update the path to the new map
var vetPathPoints = [];
vetPathPoints[0] = new THREE.Vector3( 200, -280, 20 ); // saida da pista
vetPathPoints[1] = new THREE.Vector3( 250, -180, 25 ); // perto da cidade sudeste
vetPathPoints[2] = new THREE.Vector3( 350, -130, 30 ); // ida para area de gelo
vetPathPoints[3] = new THREE.Vector3( 440, 50, 12 ); // area de gelo
vetPathPoints[4] = new THREE.Vector3( 370, 120, 40 ); // saida da area de gelo
vetPathPoints[5] = new THREE.Vector3( 200, 80, 25 ); // entrada na cidade leste
vetPathPoints[6] = new THREE.Vector3( 100, 70, 15 ); // ida pra praca da cidade centro
vetPathPoints[7] = new THREE.Vector3( 0, 40, 12 ); // perto da coruja
vetPathPoints[8] = new THREE.Vector3( -70, 100, 50 ); // saida da praca da cidade centro
vetPathPoints[9] = new THREE.Vector3( -80, 200, 80 ); // saida da cidade norte, topo do predio
vetPathPoints[10] = new THREE.Vector3( -200, 300, 50 ); // floresta
vetPathPoints[11] = new THREE.Vector3( -350, 300, 40 ); // topo da montanha
vetPathPoints[12] = new THREE.Vector3( -370, 200, 30 ); // saida da montanha
vetPathPoints[13] = new THREE.Vector3( -350, 100, 20 ); // planicie
vetPathPoints[14] = new THREE.Vector3( -350, 0, 15 ); // planicie

//Create the path
var path = new THREE.CatmullRomCurve3( [
    vetPathPoints[0],
    vetPathPoints[1],
    vetPathPoints[2],
    vetPathPoints[3],
    vetPathPoints[4],
    vetPathPoints[5],
    vetPathPoints[6],
    vetPathPoints[7],
    vetPathPoints[8],
    vetPathPoints[9],
    vetPathPoints[10],
    vetPathPoints[11],
    vetPathPoints[12],
    vetPathPoints[13],
    vetPathPoints[14]
]
);

var pathPoints = path.getPoints( 500 ); // 500 is the number of curve points
var pathGeometry = new THREE.BufferGeometry().setFromPoints( pathPoints );
var pathMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } ); // red
// Create the final path object and add it to the scene
var pathObject = new THREE.Line( pathGeometry, pathMaterial );
groundPlane.add(pathObject);

// Vars to save the objects for later usage
var vetCheckPoints = [];
var vetCheckPointsPositions = [];
var vetCheckPointsColors = []
var checkPointAtual = 0;
var checkPointRadius = 10.0;

var checkPointMaterialGrey = new THREE.MeshPhongMaterial({color:"lightgrey", transparent:"true", opacity:"0.7"}); 
var checkPointMaterialOrange = new THREE.MeshPhongMaterial({color:"orange", transparent:"true", opacity:"0.7"}); 

//Checkpoint colors
for(let i=0;i<vetPathPoints.length;i++){
    vetCheckPointsColors[i] = checkPointMaterialGrey;
}
vetCheckPointsColors[0] = checkPointMaterialOrange;

// Configure and create one check point object
function generateOneCheckPoint(index){ // auxiliary function
    var checkPointGeometry = new THREE.TorusGeometry(checkPointRadius, 0.5, 32, 24);
    
    var checkPoint = new THREE.Mesh(checkPointGeometry, vetCheckPointsColors[index]);

    return checkPoint;
}
// Instantiate the check points on screen
function createCheckPoints(){
    for (let i = 0; i < vetPathPoints.length; i++) {
        vetCheckPoints[i] = generateOneCheckPoint(i);
        vetCheckPoints[i].position.copy(vetPathPoints[i]);
        vetCheckPointsPositions[i] = vetPathPoints[i];
        vetCheckPoints[i].visible = false; // check points start hidden, they will be shown later
        
        if(i == 0 || i == 3 || i == (vetPathPoints.length - 1)){ // the three checkpoints that have fixed angles
            vetCheckPoints[i].rotateX(degreesToRadians(90));
        } else {
            vetCheckPoints[i].lookAt(vetPathPoints[i+1]);
        }
        groundPlane.add(vetCheckPoints[i]);
    }
    vetCheckPoints[0].visible = true; // Displays the first check point
}
createCheckPoints();
//-----------------------------------//
// FLIGHT PATH CONFIGURATION END     //
//-----------------------------------//

//-----------------------------------//
// START SCREEN CONFIGURATION BEGIN  //
//-----------------------------------//
var loadingScreen; // create to use later
const loadingManager = new THREE.LoadingManager( () => {
	
    //var loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen = document.getElementById( 'loading-screen' );
    //loadingScreen.classList.add( 'fade-out' );
    
    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    
} );
function onTransitionEnd( event ) {

	event.target.remove();
	
}
//-----------------------------------//
// START SCREEN CONFIGURATION END    //
//-----------------------------------//

// Controls info boxes visibility
function togglesInfoBoxVisibility(boxId){
    if (document.getElementById(boxId).style.display == "") { // if infobox is visible, hide it
        document.getElementById(boxId).style.display = "none"; // hides the infobox
    } else {
        document.getElementById(boxId).style.display = ""; // if not, show it again
    }
}

// Function to control which light will be used on each scene
function togglesSceneLights(){
    // directional light used when on simulator mode
    if (directionalLight.intensity != 0.0) { // if light is on
        directionalLight.intensity = 0.0; // turns it off
    } else {
        directionalLight.intensity = 0.75; // or turns it back on
    }
    
    // hemisphere light used when on simulator mode
    if (hemisphereLight.intensity != 0.0) { // if light is on
        hemisphereLight.intensity = 0.0; // turns it off
    } else {
        hemisphereLight.intensity = 0.75; // or turns it back on
    }

    // spot light used inside the inspection mode
    if (spotLight.intensity != 0.0) { // if light is on
        spotLight.intensity = 0.0; // turns it off
    } else {
        spotLight.intensity = 1.5; // or turns it back on
    }
}

function updateSkybox(){
    if (scene.background == null) {
        scene.background = skybox;
    } else {
        scene.background = null;
    }
}

function keyboardUpdate() {
    //keyboard.update(); // desabilitado porque a funcao keyboardUpdateHolder ja realiza o update // verifica qual tecla esta sendo pressionada
    if (keyboard.down("G")){ // Toggles the directional light helper
        directionalLightHelper.visible = !directionalLightHelper.visible;
    }
    if (keyboard.down("F")){ // Toggles the axes helper
        axesHelper.visible = !axesHelper.visible;
    }
    if (keyboard.down("H")){ // Toggles the info box controls text helper
        togglesInfoBoxVisibility("InfoxBox");
    }
    if (keyboard.down("enter")){ // Toggles the path visualization
        pathObject.visible = !pathObject.visible;
    }
    if (keyboard.down("space")){ // Toggles the inspection mode
        togglesInfoBoxVisibility("box"); // hide the secondary text in inspection mode
        // TODO hide controls on inspection mode ?
        togglesSceneLights();
        updateSkybox(); // removes the sunny day from the scene background while inside the inspection mode
    }
    if (keyboard.down("J")){ // Starts the game
        if (objectsCompletion >= 300) {
            loadingScreen.classList.add( 'fade-out' );
        }
    }
    if (keyboard.down("P")){ // Controls ambient music
        if (music.getVolume() != 0.0) {
            music.setVolume(0.0);
        } else {
            music.setVolume(0.15);
        }
    }
    if (keyboard.down("O")){ // Debug key
        mainSquarePlane.visible = !mainSquarePlane.visible;
    }
}
// Check if a integer number is in a given range
function isInRange(x, min, max) {
    min = Math.round(min);
    max = Math.round(max);
    x = Math.round(x);
    
    if (x >= min && x <= max) {
        return true;
    } else {
        return false;
    }
}

// Function to clear the flight school path
function clearPath(){
    for (let i = 0; i < vetCheckPoints.length; i++) {
        groundPlane.remove(vetCheckPoints[i]); // Removes every remnant check point
    }
    vetCheckPointsPositions.length = 0; // Cleaning the array completely
    groundPlane.remove(pathObject); // Disposes the path helper
}
var cont = 0; // keeps track of which one is the next checkpoint
var isPathEnded = false; // verifies if the path is over

function pathUpdate(i){
    if (i < vetCheckPoints.length - 2) { // the last two check points will be removed without updating any other check point objects
        groundPlane.remove(vetCheckPoints[i]); // removes the reached check point from scene
        vetCheckPoints[i+1].visible = true;
        vetCheckPoints[i+2].visible = true;
        cont++; // Updates which is the next check point
    } else {
        groundPlane.remove(vetCheckPoints[i]); // removes the last check point before the final one
        cont++;
    }
    vetCheckPoints[i+1].material = checkPointMaterialOrange; // udates the next check point color
}
var timeStart, timeFinish; // Save time data to use later
// Function to return a total event time in seconds
function calcLapTime(start, finish){
    let begin = start.getTime() / 1000; // display in seconds, not in miliseconds
    let end = finish.getTime() / 1000; // display in seconds, not in miliseconds
    
    let result = end - begin; // calculate the result

    return Math.floor(result);
}

// Checks if a checkpoint was reached
function checkHit(){
    if (
        !isPathEnded &&
        isInRange(aviao.getPosicao()[0], vetCheckPointsPositions[checkPointAtual].getComponent(0) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(0) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[1], vetCheckPointsPositions[checkPointAtual].getComponent(1) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(1) + checkPointRadius) &&
        isInRange(aviao.getPosicao()[2], vetCheckPointsPositions[checkPointAtual].getComponent(2) - checkPointRadius, vetCheckPointsPositions[checkPointAtual].getComponent(2) + checkPointRadius)
        ){
            if(checkPointAtual == 0){ // first
                pathUpdate(cont);
                timeStart = new Date(); // starts counting the time
                showInfoOnScreen("Lap started! Good luck!");
                checkpointSound.play();
                pilotStartMesssage.play();
            } else if(checkPointAtual == (vetCheckPoints.length-1)){ // last
                isPathEnded = true; // now the path is finished
                clearPath();
                timeFinish = new Date(); // ends counting the time
                showInfoOnScreen('Congratulations! Your lap took ' + calcLapTime(timeStart, timeFinish) + ' seconds...');
                levelSound.play();
                //levelSound.onEnded(pilotFinalMesssage.play());
            } else {
                if (checkPointAtual == (vetCheckPoints.length-2)) { // plays the final radio message
                    pilotFinalMesssage.play();
                }
                vetCheckPoints[checkPointAtual].material = checkPointMaterialOrange;
                let completion = Math.floor(((cont + 1) / vetCheckPoints.length) * 100);
                showInfoOnScreen("Task completion: " + (cont + 1) + " / " + vetCheckPoints.length + " checkpoints (" + completion + "%)");
                checkpointSound.play();
                pathUpdate(cont);
            }
            checkPointAtual++;
        }
}

//-----------------------------------//
// EXTERNAL OBJECTS CONFIG BEGIN     //
//-----------------------------------//
// External reference URL: https://threejsfundamentals.org/threejs/lessons/threejs-load-obj.html
var scale = 1.0; // adjust external objects scale

// Penguim statue

// instantiate a object loader
const penguimStatueLoader = new OBJLoader(loadingManager);
// instantiate a texture loader
const penguimStatueMtlLoader = new MTLLoader();
penguimStatueMtlLoader.load('models/architecture/penguin.mtl', (mtl5) => {
  mtl5.preload();
  penguimStatueLoader.setMaterials(mtl5);

// load a resource
penguimStatueLoader.load(
	// resource URL
	'models/architecture/penguin.obj',
	// called when resource is loaded
	function ( penguimStatue ) {
        //statue.position.set(20, 0, 0);
        penguimStatue.rotateZ(degreesToRadians(-90));
        // object scale
        penguimStatue.scale.set(  0.035 * scale,
                                  0.035 * scale,
                                  0.035 * scale);
		iceCircle.add( penguimStatue );

	},
	// called when loading is in progresses
	function ( xhr ) {
        let percentage = xhr.loaded / xhr.total * 100;
		//console.log( 'Penguin statue ' + ( percentage ) + '% loaded' );
        if (percentage == 100.0) {
            objectsCompletion += percentage;
        }

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Penguin statue loading error' );

	}
)
});

// Penguim statue 2

// instantiate a object loader
const penguimStatueLoader2 = new OBJLoader(loadingManager);
// instantiate a texture loader
const penguimStatueMtlLoader2 = new MTLLoader();
penguimStatueMtlLoader2.load('models/architecture/penguin.mtl', (mtl6) => {
  mtl6.preload();
  penguimStatueLoader2.setMaterials(mtl6);

// load a resource
penguimStatueLoader2.load(
	// resource URL
	'models/architecture/penguin.obj',
	// called when resource is loaded
	function ( penguimStatue2 ) {
        penguimStatue2.rotateZ(degreesToRadians(-90));
        penguimStatue2.position.set(0.0, 3.5, 0.0);
        // object scale
        penguimStatue2.scale.set(  0.025 * scale,
                                   0.025 * scale,
                                   0.025 * scale);
		iceCircle.add( penguimStatue2 );

	},
	// called when loading is in progresses
	function ( xhr ) {
        let percentage = xhr.loaded / xhr.total * 100;
		//console.log( 'Penguin statue 2 ' + ( percentage ) + '% loaded' );
        if (percentage == 100.0) {
            objectsCompletion += percentage;
        }
	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Penguin statue 2 loading error' );

	}
)
});

// Cross

// instantiate a object loader
const crossLoader = new OBJLoader(loadingManager);
// instantiate a texture loader
const crossMtlLoader = new MTLLoader();
crossMtlLoader.load('models/cross/cross.mtl', (mtl7) => {
  mtl7.preload();
  crossLoader.setMaterials(mtl7);

// load a resource
crossLoader.load(
	// resource URL
	'models/cross/cross.obj',
	// called when resource is loaded
	function ( cross ) {
        cross.rotateX(degreesToRadians(90));
        cross.rotateY(degreesToRadians(90));
        cross.position.set(40.0, 0.0, 0.0);
        // object scale
        cross.scale.set(  3.0 * scale,
                          3.0 * scale,
                          3.0 * scale);
		mountainPlane.add( cross );

	},
	// called when loading is in progresses
	function ( xhr ) {
        let percentage = xhr.loaded / xhr.total * 100;
		//console.log( 'Cross ' + ( percentage ) + '% loaded' );
        if (percentage == 100.0) {
            objectsCompletion += percentage;
        }
	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Cross loading error' );

	}
)
});
// Function to check if external objects are already loaded
var loadingFinished = false;
function onLoadExternalObjects(){
    if (objectsCompletion >= 300.0) {
        if (!loadingFinished) {
            //console.log("teste!!!! " + objectsCompletion);
        }
        loadingFinished = true;
    }
}
//-----------------------------------//
// EXTERNAL OBJECTS CONFIG END       //
//-----------------------------------//

//-----------------------------------//
// TEXTURES CONFIGURATION BEGIN      //
//-----------------------------------//
// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader(); // Creates the loader
var asphault = textureLoader.load('./textures/asphalt.png'); // TODO check resolution later
var grass = textureLoader.load('./textures/grass-1024.jpg');
var terrain = textureLoader.load('./textures/terrain-1024.jpg');
var ice = textureLoader.load('./textures/ice-128.png');
var squareGround = textureLoader.load('./textures/square-ground.png');

// Asphault texture configuration
asphault.wrapS = THREE.RepeatWrapping;
asphault.wrapT = THREE.RepeatWrapping;
asphault.repeat.set( 1, 8 );
asphault.magFilter = THREE.LinearFilter;

// Grass texture configuration
grass.wrapS = THREE.RepeatWrapping;
grass.wrapT = THREE.RepeatWrapping;
grass.repeat.set( 50, 50 );
grass.magFilter = THREE.LinearFilter;

// Terrain land texture configuration
terrain.wrapS = THREE.RepeatWrapping;
terrain.wrapT = THREE.RepeatWrapping;
terrain.repeat.set( 8, 8 );
terrain.magFilter = THREE.LinearFilter;

// Ice land texture configuration
ice.wrapS = THREE.RepeatWrapping;
ice.wrapT = THREE.RepeatWrapping;
ice.repeat.set( 64, 32 );
ice.magFilter = THREE.LinearFilter;

// Main square ground texture configuration
squareGround.wrapS = THREE.RepeatWrapping;
squareGround.wrapT = THREE.RepeatWrapping;
squareGround.repeat.set( 32, 32 );
squareGround.magFilter = THREE.LinearFilter;

// Apply texture to the 'map' property of the respective materials' objects
landingTrack.material.map = asphault; // apply asphault on landing track
//mainStreet[0].material.map = asphault; // apply asphault on main street
groundPlane.material.map = grass; // apply grass on ground plane
mountainPlane.material.map = terrain; // apply land texture on terrain near mountain
mesh1.material.map = terrain; // apply land texture on mountain TODO verify that later
iceCircle.material.map = ice; // apply ice texture on ice circle
//mainSquarePlane.material.map = squareGround; // apply ground texture on main square

//-----------------------------------//
// TEXTURES CONFIGURATION END        //
//-----------------------------------//

// Show text information onscreen
showInformation(); // displays information about the controls
showInfoOnScreen("TIP: Follow the red path"); // displays the initial secondary message
gerarArvores(groundPlane); // coloca as arvores em cima do plano

// Function to update the secondary infobox
function showInfoOnScreen(text){
    information.changeMessage(text);
}

function showInformation()
{
  // Use this to show information onscreen
    var controls = new InfoBox();
    controls.add("Flight Simulator controls:");
    controls.add("Press arrow keys to change airplane direction");
    controls.add("Press Q to move faster");
    controls.add("Press A to move slower");
    controls.addParagraph();
    controls.add("Camera modes:");
    controls.add("Press C to toggle cockpit camera");
    controls.add("Press SPACE to toggle inspection mode");
    controls.addParagraph();
    controls.add("Ambient controls:");
    controls.add("Press ENTER to toggle the path helper");
    controls.add("Press F to toggle the axes helper");
    controls.add("Press G to toggle the sunlight helper");
    controls.add("Press H to toggle this help box");
    controls.addParagraph();
    controls.add("Music controls:");
    controls.add("Press P to play / pause the sound track");
    controls.show();
}

var aviao = new Aviao(scene);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraNormal(), renderer)}, false ); // no modo simulacao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraInspecao(), renderer)}, false ); // no modo inspecao
window.addEventListener( 'resize', function(){onWindowResize(aviao.getCameraCockpit(), renderer)}, false ); // no modo inspecao

//-----------------------------------//
// AUDIO CONFIGURATION BEGIN         //
//-----------------------------------//
// Create a listener and add it to que camera
var listener = new THREE.AudioListener();
aviao.getCameraNormal().add( listener );

// create the global audio sources
const music = new THREE.Audio( listener );  
const checkpointSound = new THREE.Audio( listener );  
const levelSound = new THREE.Audio( listener );  
const pilotStartMesssage = new THREE.Audio( listener );  
const pilotFinalMesssage = new THREE.Audio( listener );  

// Create ambient sound
var audioLoader = new THREE.AudioLoader();
audioLoader.load( './sounds/CS-GO-Lock&Load.ogg', function( buffer ) {
	music.setBuffer( buffer );
	music.setLoop( true );
	music.setVolume( 0.15 );
	music.play();
});

// Create check point check sound
var audioLoaderCheckPoint = new THREE.AudioLoader();
audioLoaderCheckPoint.load( './sounds/check-point.ogg', function( buffer ) {
	checkpointSound.setBuffer( buffer );
	//music.setLoop( true );
	checkpointSound.setVolume( 1.00 );
	//music.play(); // Will play when a check point is reached
});

// Create last check point check sound
audioLoader.load( './sounds/level-clear.ogg', function ( buffer ) {
    levelSound.setBuffer( buffer );
    //checkpointSound.setLoop( true );
    levelSound.setVolume( 0.75 );
    //checkpointSound.play(); // Will play when the last check point is reached
} );

// Create start pilot radio message
audioLoader.load( './sounds/pilot-fasten-seatbelts.ogg', function ( buffer ) {
    pilotStartMesssage.setBuffer( buffer );
    //checkpointSound.setLoop( true );
    pilotStartMesssage.setVolume( 1.00 );
    //checkpointSound.play(); // Will play when the first check point is reached
} );

// Create final pilot radio message
audioLoader.load( './sounds/pilot-have-a-nice-day.ogg', function ( buffer ) {
    pilotFinalMesssage.setBuffer( buffer );
    //checkpointSound.setLoop( true );
    pilotFinalMesssage.setVolume( 1.00 );
    //checkpointSound.play(); // Will play when the last check point is reached
} );

//-----------------------------------//
// AUDIO CONFIGURATION END           //
//-----------------------------------//
let varTexto = true;
function atualizaTextoLoader(){
    if (varTexto) {
        if (objectsCompletion < 300.0) {
            document.getElementById("loader-text").innerHTML = "Jogo " + Math.round(objectsCompletion / 3) + "% carregado";
        } else {
            document.getElementById("loader-text").innerHTML = "Pronto! Aperte J para começar";
            varTexto = false;
        }
    }
}

var trackballControls = new TrackballControls( aviao.getCameraInspecao(), renderer.domElement );
function render() {
    requestAnimationFrame( render );
	renderer.render( scene, aviao.getCameraAtual() );
    stats.update(); // Update FPS
    aviao.keyboardUpdateHolder(groundPlane); // listens to keyboard inputs and controls cameraHolder
    aviao.moverAviao(); // moves the airplane foward
    trackballControls.update(); // Enable mouse movements
    aviao.rotateBlades(); // Enable airplane blades rotation
    aviao.slowSpeed(); // Checks if airplane is too slow
    aviao.setEngineSound();
    keyboardUpdate(); // listens to keyboard inputs and controls some objects
    checkHit(); // Checks if the airplane hit some check point
    lightFollowingCamera(spotLight, aviao.getCameraInspecao()); // enables the light inside inspection mode to follow the camera
    onLoadExternalObjects(); // Check if external objects are already loaded
    atualizaTextoLoader(); // Mostra texto da tela inicial
}
render();
