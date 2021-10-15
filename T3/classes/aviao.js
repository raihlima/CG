import * as THREE from  '../../build/three.module.js';
import KeyboardState from       '../../libs/util/KeyboardState.js';
import {//initRenderer, 
    degreesToRadians} from "../../libs/util/util.js";

//Varáveis
let planePositionX = 200.0; // TODO fix airplane position restore from inspection mode
let planePositionY = -490.0; // previous value was -470.0
let planePositionZ = 2.5; // airplane starts landed // previous value was +45.0
let mockPlane;
let baseCylinder;
let baseCylinderX;
let cockpit;

//Helices
var animationOn = true;
var hub;
var blade;
var leftHub;
var leftBlade;
var rightHub;
var rightBlade;

//*-----------------------Luz Dinamica ----------------------------
var dynamicLight = new THREE.DirectionalLight(0xffffff);
dynamicLight.intensity = 0.5; // No need to iluminate, just used to drop shadow.
dynamicLight.position.set(0, 0, 30);
dynamicLight.shadow.mapSize.width = 128;
dynamicLight.shadow.mapSize.height = 128;
dynamicLight.castShadow = true;
dynamicLight.shadow.camera.left = -7;
dynamicLight.shadow.camera.right = 7;
dynamicLight.shadow.camera.top = 7;
dynamicLight.shadow.camera.bottom = -7;

// Create helper for the dynamicLight
var dynamicLightHelper = new THREE.CameraHelper(dynamicLight.shadow.camera, 0xFF8C00);
dynamicLightHelper.visible = false;
//dynamicLightHelper.position.set(0,0,20);
//scene.add(dynamicLightHelper); 



//Cameras
// Camera configs
// Camera do modo simulacao
let renderCamera;
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 8000 );
let cameraPosition = [0,10,20]; // relative position between airplane and camera
camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]); // Initial camera position
// Camera do modo inspecao
let cameraInspection = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
cameraInspection.position.set (0,-30,15); // configura a posicao inicial da camera do modo inspecao
cameraInspection.lookAt(0, 0, 0);
//Camera do modo cockpit
let cameraCockpit = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 9000 );
cameraCockpit.position.set(0,1.5,5);
//cameraCockpit.lookAt(0, 10, 0);


// Config camera holder
let cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.up.set(0, 1, 0);
cameraHolder.lookAt(0, 0, 0);

let cameraHolderCockPit = new THREE.Object3D();
cameraHolderCockPit.position.set(0.0, 1.0, 0.0);
cameraHolderCockPit.up.set(0, 1, 0);
cameraHolderCockPit.lookAt(0, 0, 0);

// Variaveis de movimento do aviao
var speed = 0.0; // velocidade base dos movimentos // o aviao agora comeca parado
var savedSpeed = speed; // salva a velocidade do aviao na simulacao
var isPressed = [false,false]; // x,y controla se os botoes de controle de rotacao estao sendo pressionados
var anglesVet = [0,0,0]; // salva qual o angulo atual do aviao para depois retornar a origem
var speedVet = [0,0,0]; // salva a velocidade dos movimentos laterais e verticais atual do aviao para depois retornar a origem
var isInInspectionMode = false; // verifica se o modo inspecao esta ativo e trava os controles do teclado se verdadeiro
// creates vars to save the actual position of the airplane
var savedPlanePositionX = 0.0;
var savedPlanePositionY = 0.0;
var savedPlanePositionZ = 0.0;

//Outras variáveis
let keyboard = new KeyboardState();
let aviaoInsp;
let sceneSalva;

export function Aviao (scene) {
    gerarAviao(scene);
}

function gerarAviao(scene){
    sceneSalva = scene;
//-----------------------------------//
// AIRPLANE CONFIGURATION BEGIN      //
//-----------------------------------//

// airplane config
var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var mockPlaneGeometry = new THREE.BoxGeometry(0, 0, 0, 32);
mockPlane = new THREE.Mesh(mockPlaneGeometry, fuselageMaterial);
mockPlane.position.set(planePositionX, planePositionY, planePositionZ); // initial position

//Altera perspectiva das cameras
mockPlane.matrix.identity(); // afeta a perspectiva das cameras

// Base mock sphere
var mockBaseSphereGeometry = new THREE.SphereGeometry(0, 0, 2);
var mockBaseSphere = new THREE.Mesh( mockBaseSphereGeometry, fuselageMaterial );
// Set initial position of the sphere
mockBaseSphere.translateX(0.0).translateY(-25.0).translateZ(0.0); // distance between airplane and camera

// Adiciona cameras no aviao
mockBaseSphere.add(cameraHolder);
mockPlane.add(mockBaseSphere);
cameraHolder.add(camera);
cameraHolderCockPit.add(cameraCockpit);

// Enable mouse rotation, pan, zoom etc.
renderCamera = camera; // Faz o papel de troca das cameras das cenas
//var trackballControls = new TrackballControls( cameraInspection, renderer.domElement );

// define objects material
var material = new THREE.MeshNormalMaterial();
var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialWings = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialWingsSideSmall = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialWingsFrontSmall = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialSideEngines = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialSideEnginesSmall = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialMainEngine = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialLandingGear = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialShockStrut = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialShockStrutSmall = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialBackCylinder = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var fuselageMaterialTailCylinder = new THREE.MeshPhongMaterial({color:"grey", shininess:"100", reflectivity:"1.0"});
var bladesMaterial = new THREE.MeshPhongMaterial({color:"white", shininess:"100", reflectivity:"1.0"});
var cockpitMaterial = new THREE.MeshPhongMaterial({color:"grey", reflectivity:"0.95", specular:"white", transparent:"true", opacity:"0.6", shininess:"100", side: THREE.FrontSide, blending: THREE.AdditiveBlending, depthWrite:"false"});
var tailMaterial = new THREE.MeshPhongMaterial({color:"orange", emissive:"rgb(255, 100, 0)", emissiveIntensity:"0.75"}); // bright orange
var tiresMaterial = new THREE.MeshLambertMaterial({color:"rgb(40, 40, 40)"}); // to mimic black rubber
var hubMaterial = new THREE.MeshPhongMaterial({color:"red", shininess:"100", reflectivity:"1.0"});
var stabilizersMaterial = new THREE.MeshPhongMaterial({color:"blue", shininess:"100", reflectivity:"1.0"});
var stabilizersMaterialSmall = new THREE.MeshPhongMaterial({color:"blue", shininess:"100", reflectivity:"1.0"});
var flapsWingsMaterial = new THREE.MeshPhongMaterial({color:"yellow", shininess:"100", reflectivity:"1.0"});
var flapsWingsMaterialSmall = new THREE.MeshPhongMaterial({color:"yellow", shininess:"100", reflectivity:"1.0"});
var flapsBackMaterial = new THREE.MeshPhongMaterial({color:"yellow", shininess:"100", reflectivity:"1.0"});
var flapsBackMaterialSmall = new THREE.MeshPhongMaterial({color:"yellow", shininess:"100", reflectivity:"1.0"});
var flapsBackSideMaterialSmall = new THREE.MeshPhongMaterial({color:"yellow", shininess:"100", reflectivity:"1.0"});
var lifesaverMaterial = new THREE.MeshLambertMaterial({color:"red"}); // to mimic red rubber

// Reference URL to all ariplane parts names
// https://www.flyaeroguard.com/learning-center/parts-of-an-airplane/

//-----------------------------------//
// FUSELAGE                          //
//-----------------------------------//
// define airplane wings geometry
var wingsGeometry = new THREE.BoxGeometry(10.0, 3.0, 0.2);
// create the right wing
var rightWing = new THREE.Mesh(wingsGeometry, fuselageMaterialWings);
rightWing.position.set(6.5, -1.0, 0.0);
// create the left wing
var leftWing = new THREE.Mesh(wingsGeometry, fuselageMaterialWings);
leftWing.position.set(-6.5, -1.0, 0.0);
// wing engines
var enginesCylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 4.0, 32);
// left engine
var leftEngineCylinder = new THREE.Mesh(enginesCylinderGeometry, fuselageMaterialSideEngines);
leftEngineCylinder.position.set(0.0, 0.0, -0.5);
// right engine
var rightEngineCylinder = new THREE.Mesh(enginesCylinderGeometry, fuselageMaterialSideEngines);
rightEngineCylinder.position.set(0.0, 0.0, -0.5);

// define airplane flaps geometry
var flapsGeometry = new THREE.BoxGeometry(10.0, 0.4, 0.2);
var leftFlap = new THREE.Mesh(flapsGeometry, flapsWingsMaterial);
var rightFlap = new THREE.Mesh(flapsGeometry, flapsWingsMaterial);
leftFlap.position.set(0.0, -1.72, 0.0);
rightFlap.position.set(0.0, -1.72, 0.0);

// create the base cylinder
var baseCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 9.0, 32);
baseCylinder = new THREE.Mesh(baseCylinderGeometry, fuselageMaterial);
baseCylinderGeometry = new THREE.CylinderGeometry(0, 0, 0, 32);
baseCylinderX = new THREE.Mesh(baseCylinderGeometry, fuselageMaterial);
baseCylinder.position.set(0.0, 0.0, 2.5); // ajuste de altura do avião em relação a câmera

// create the rear cylinder
var backCylinderGeometry = new THREE.CylinderGeometry(1.5, 0.5, 5, 32, 32);
var backCylinder = new THREE.Mesh(backCylinderGeometry, fuselageMaterialBackCylinder);
backCylinder.position.set(0.0, -7.0, 0.0);

// create tail cylinder
var tailCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
var tailCylinder = new THREE.Mesh(tailCylinderGeometry, fuselageMaterialTailCylinder);
tailCylinder.position.set(0.0, -3.0, 0.0);

// define airplane stabilizers geometry
var horizontalStabilizerGeometry = new THREE.BoxGeometry(3, 1, 0.2);
var verticalStabilizerGeometry = new THREE.BoxGeometry(0.2, 0.5, 3.0);
// create the right stabilizer
var rightStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, stabilizersMaterial);
rightStabilizer.position.set(2.0, 0.0, 0.0);
// create the left stabilizer
var leftStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, stabilizersMaterial);
leftStabilizer.position.set(-2.0, 0.0, 0.0);
// create vertical stabilizer
var verticalStabilizer = new THREE.Mesh(verticalStabilizerGeometry, tailMaterial);
verticalStabilizer.position.set(0.0, -0.25, 2.0);
// define airplane back flaps geometry
var backFlapsGeometry = new THREE.BoxGeometry(3.0, 0.4, 0.2);
var backRudderGeometry = new THREE.BoxGeometry(0.2, 0.4, 3.0);
var backLeftFlap = new THREE.Mesh(backFlapsGeometry, flapsBackMaterial);
var backRightFlap = new THREE.Mesh(backFlapsGeometry, flapsBackMaterial);
var backRudder = new THREE.Mesh(backRudderGeometry, flapsBackMaterial);
backLeftFlap.position.set(0.0, -0.72, 0.0);
backRightFlap.position.set(0.0, -0.72, 0.0);
backRudder.position.set(0.0, -0.47, 0.0);

// flaps adhesives


// EASTER EGGs BEGIN //
// life saver easter egg
var rightLifesaverGeometry = new THREE.TorusGeometry(0.4, 0.2, 8, 24);
var rightLifesaver = new THREE.Mesh(rightLifesaverGeometry, lifesaverMaterial);
rightLifesaver.position.set(1.6, -3.5, 0.0);
rightLifesaver.rotateX(degreesToRadians(90));
rightLifesaver.rotateY(degreesToRadians(90));

// fake radar
var radarGeometry = new THREE.OctahedronGeometry(0.8, 3);
var radar = new THREE.Mesh(radarGeometry, fuselageMaterial);
radar.position.set(0.0, 0.0, -1.5);

// define airplane 3D crosses geometry
var crossGeometry = new THREE.BoxGeometry(0.98, 0.4, 0.4); // 0.98 to avoid conflict with stabilizers
// left
var leftCrossp1 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 1
var leftCrossp2 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 2
leftCrossp1.rotateZ(degreesToRadians(90));
// right
var rightCrossp1 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 1
var rightCrossp2 = new THREE.Mesh(crossGeometry, lifesaverMaterial); // cross part 2
rightCrossp1.rotateZ(degreesToRadians(90));
// EASTER EGGs END //

// create the front cylinder
var frontCylinderGeometry = new THREE.CylinderGeometry(0.5, 1.5, 0.5, 32);
var frontCylinder = new THREE.Mesh(frontCylinderGeometry, fuselageMaterialMainEngine);
frontCylinder.position.set(0.0, 4.75, 0.0);

//-----------------------------------//
// PROPELLER                         //
//-----------------------------------//
// create blades hub
var hubGeometry = new THREE.ConeGeometry(0.5, 1.0, 64, 32);
hub = new THREE.Mesh(hubGeometry, hubMaterial);
// define blades geometry
var bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 5.0);
var wingsBladeGeometry = new THREE.BoxGeometry(0.2, 0.05, 4.0);
// create blades
blade = new THREE.Mesh(bladeGeometry, bladesMaterial);
// adds blade to the hub
hub.add(blade);
// Base hub sphere
var hubBaseSphereGeometry = new THREE.SphereGeometry(0.01, 2, 2);
var hubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
// Set initial position of the sphere
hubBaseSphere.translateX(0.0).translateY(0.75).translateZ(0.0);
// adds the hub to the base sphere
hubBaseSphere.add(hub);
// engines on wings
leftHub = new THREE.Mesh(hubGeometry, hubMaterial);
leftBlade = new THREE.Mesh(wingsBladeGeometry, bladesMaterial);
rightHub = new THREE.Mesh(hubGeometry, hubMaterial);
rightBlade = new THREE.Mesh(wingsBladeGeometry, bladesMaterial);
var leftHubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
var rightHubBaseSphere = new THREE.Mesh( hubBaseSphereGeometry, material );
// Set initial position of the sphere
leftHubBaseSphere.translateX(0.0).translateY(2.5).translateZ(0.0);
rightHubBaseSphere.translateX(0.0).translateY(2.5).translateZ(0.0);
// adds the hub to the base sphere
leftHubBaseSphere.add(leftHub);
rightHubBaseSphere.add(rightHub);
// adds blades to the hubs
leftHub.add(leftBlade);
rightHub.add(rightBlade);

//-----------------------------------//
// LANDING GEAR                      //
//-----------------------------------//
// creates tires geometry
var tiresGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 24);
// front
var frontTire = new THREE.Mesh(tiresGeometry, tiresMaterial);
frontTire.position.set(0.0, 3.0, -2.2);
// back left
var backLeftTire = new THREE.Mesh(tiresGeometry, tiresMaterial);
backLeftTire.position.set(-1.5, -3.0, -2.2);
// back right
var backRightTire = new THREE.Mesh(tiresGeometry, tiresMaterial);
backRightTire.position.set(1.5, -3.0, -2.2);
// rotate tires to adjust angles
frontTire.rotateX(degreesToRadians(90));
frontTire.rotateY(degreesToRadians(90));
backLeftTire.rotateX(degreesToRadians(90));
backLeftTire.rotateY(degreesToRadians(90));
backRightTire.rotateX(degreesToRadians(90));
backRightTire.rotateY(degreesToRadians(90));

// create shock strut geometry
var shockStrutGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.85);
var backShockStrutsGeometry = new THREE.BoxGeometry(0.05, 0.2, 1.1);
// create front shock strut
var shockStrut = new THREE.Mesh(shockStrutGeometry, fuselageMaterialLandingGear);
shockStrut.position.set(0.2, 3.0, -1.9);
// create 2nd front shock strut
var shockStrut2 = new THREE.Mesh(shockStrutGeometry, fuselageMaterialLandingGear);
shockStrut2.position.set(-0.2, 3.0, -1.9);
// create front tire cylinder axis
var frontTireCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
var frontTireCylinder = new THREE.Mesh(frontTireCylinderGeometry, fuselageMaterialShockStrut);
frontTireCylinder.rotateZ(degreesToRadians(90));
frontTireCylinder.position.set(0.0, 3.0, -2.2);
// create back left shock strut
var backLeftShockStrut = new THREE.Mesh(backShockStrutsGeometry, fuselageMaterialLandingGear);
backLeftShockStrut.position.set(-0.9, -3.0, -1.75);
// rotate to 90° angle
backLeftShockStrut.rotateY(degreesToRadians(45));
// create back right shock strut
var backRightShockStrut = new THREE.Mesh(backShockStrutsGeometry, fuselageMaterialLandingGear);
backRightShockStrut.position.set(0.9, -3.0, -1.75);
// rotate to 90° angle
backRightShockStrut.rotateY(degreesToRadians(-45));
// create back tire cylinder axis
var backTiresCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 32);
var backTiresCylinder = new THREE.Mesh(backTiresCylinderGeometry, fuselageMaterialShockStrut);
backTiresCylinder.rotateZ(degreesToRadians(90));
backTiresCylinder.position.set(0.0, -3.0, -2.2);

// ADHESIVES
// create adhesives for apply on small parts
var shockStrutAdhesiveGeometry = new THREE.PlaneGeometry(0.05, 0.85);
var backShockStrutAdhesiveGeometry = new THREE.PlaneGeometry(0.05, 1.1);

var wingFrontAdhesiveGeometry = new THREE.PlaneGeometry(23.0, 0.2);
var wingSideAdhesiveGeometry = new THREE.PlaneGeometry(3.0, 0.2);

var sideEnginesAdhesiveGeometry = new THREE.CircleGeometry(1.0, 32);

var horizontalStabilizersFrontAdhesiveGeometry = new THREE.PlaneGeometry(3.0, 0.2);
var horizontalStabilizersSideAdhesiveGeometry = new THREE.PlaneGeometry(1.0, 0.2);

var backFlapsAdhesiveGeometry = new THREE.PlaneGeometry(3.0, 0.2);

var backFlapsSideAdhesiveGeometry = new THREE.PlaneGeometry(0.4, 0.2);

var WingFlapsAdhesiveGeometry = new THREE.PlaneGeometry(10.0, 0.2);

var tempAdhesiveMaterial = new THREE.MeshBasicMaterial({ // temp material
    color: "red", // TODO change the color
    //side: THREE.DoubleSide,
});
// adhesives creation of meshs
var shockStrutAdhesive = new THREE.Mesh(shockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive2 = new THREE.Mesh(shockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive3 = new THREE.Mesh(shockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive4 = new THREE.Mesh(shockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive5 = new THREE.Mesh(backShockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive6 = new THREE.Mesh(backShockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive7 = new THREE.Mesh(backShockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);
var shockStrutAdhesive8 = new THREE.Mesh(backShockStrutAdhesiveGeometry, fuselageMaterialShockStrutSmall);

var wingFrontAdhesive = new THREE.Mesh(wingFrontAdhesiveGeometry, fuselageMaterialWingsFrontSmall);
var wingLeftSideAdhesive = new THREE.Mesh(wingSideAdhesiveGeometry, fuselageMaterialWingsSideSmall);
var wingRightSideAdhesive = new THREE.Mesh(wingSideAdhesiveGeometry, fuselageMaterialWingsSideSmall);

var backLeftEngineAdhesive = new THREE.Mesh(sideEnginesAdhesiveGeometry, fuselageMaterialSideEnginesSmall);
var frontLeftEngineAdhesive = new THREE.Mesh(sideEnginesAdhesiveGeometry, fuselageMaterialSideEnginesSmall);
var backRightEngineAdhesive = new THREE.Mesh(sideEnginesAdhesiveGeometry, fuselageMaterialSideEnginesSmall);
var frontRightEngineAdhesive = new THREE.Mesh(sideEnginesAdhesiveGeometry, fuselageMaterialSideEnginesSmall);

var leftStabilizerSideAdhesive = new THREE.Mesh(horizontalStabilizersSideAdhesiveGeometry, stabilizersMaterialSmall);
var leftStabilizerFrontAdhesive = new THREE.Mesh(horizontalStabilizersFrontAdhesiveGeometry, stabilizersMaterialSmall);
var rightStabilizerSideAdhesive = new THREE.Mesh(horizontalStabilizersSideAdhesiveGeometry, stabilizersMaterialSmall);
var rightStabilizerFrontAdhesive = new THREE.Mesh(horizontalStabilizersFrontAdhesiveGeometry, stabilizersMaterialSmall);

var backLeftFlapsAdhesive = new THREE.Mesh(backFlapsAdhesiveGeometry, flapsBackMaterialSmall);
var backRightFlapsAdhesive = new THREE.Mesh(backFlapsAdhesiveGeometry, flapsBackMaterialSmall);

var backRudderFlapAdhesive = new THREE.Mesh(backFlapsAdhesiveGeometry, flapsBackMaterialSmall);
var backRudderFlapTopAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);

var backLeftSideAFlapsAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);
var backLeftSideBFlapsAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);
var backRightSideAFlapsAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);
var backRightSideBFlapsAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);

var frontLeftFlapSideAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);
var frontRightFlapSideAdhesive = new THREE.Mesh(backFlapsSideAdhesiveGeometry, flapsBackSideMaterialSmall);

var frontLeftFlapAdhesive = new THREE.Mesh(WingFlapsAdhesiveGeometry, flapsWingsMaterialSmall);
var frontRightFlapAdhesive = new THREE.Mesh(WingFlapsAdhesiveGeometry, flapsWingsMaterialSmall);

// adhesives positioning
shockStrutAdhesive.position.set(0.0, -0.1, 0.0);
shockStrutAdhesive.rotateX(degreesToRadians(90));
shockStrutAdhesive2.position.set(0.0, -0.1, 0.0);
shockStrutAdhesive2.rotateX(degreesToRadians(90));
shockStrutAdhesive3.position.set(0.0, 0.1, 0.0);
shockStrutAdhesive3.rotateX(degreesToRadians(-90));
shockStrutAdhesive4.position.set(0.0, 0.1, 0.0);
shockStrutAdhesive4.rotateX(degreesToRadians(-90));
shockStrutAdhesive5.position.set(0.0, -0.101, 0.0);
shockStrutAdhesive5.rotateX(degreesToRadians(90));
shockStrutAdhesive6.position.set(0.0, 0.101, 0.0);
shockStrutAdhesive6.rotateX(degreesToRadians(90));
shockStrutAdhesive7.position.set(0.0, -0.101, 0.0);
shockStrutAdhesive7.rotateX(degreesToRadians(90));
shockStrutAdhesive8.position.set(0.0, 0.101, 0.0);
shockStrutAdhesive8.rotateX(degreesToRadians(90));

wingFrontAdhesive.position.set(0.0, 0.501, 0.0);
wingFrontAdhesive.rotateX(degreesToRadians(-90));
wingLeftSideAdhesive.position.set(-5.01, 0.0, 0.0);
wingLeftSideAdhesive.rotateY(degreesToRadians(-90));
wingLeftSideAdhesive.rotateZ(degreesToRadians(90));
wingRightSideAdhesive.position.set(5.01, 0.0, 0.0);
wingRightSideAdhesive.rotateY(degreesToRadians(90));
wingRightSideAdhesive.rotateZ(degreesToRadians(90));

backLeftEngineAdhesive.position.set(0.0, -2.001, 0.0);
backLeftEngineAdhesive.rotateX(degreesToRadians(90));
frontLeftEngineAdhesive.position.set(0.0, 2.001, 0.0);
frontLeftEngineAdhesive.rotateX(degreesToRadians(-90));
backRightEngineAdhesive.position.set(0.0, -2.001, 0.0);
backRightEngineAdhesive.rotateX(degreesToRadians(90));
frontRightEngineAdhesive.position.set(0.0, 2.001, 0.0);
frontRightEngineAdhesive.rotateX(degreesToRadians(-90));

leftStabilizerSideAdhesive.position.set(-1.501, 0.0, 0.0);
leftStabilizerSideAdhesive.rotateX(degreesToRadians(90));
leftStabilizerSideAdhesive.rotateY(degreesToRadians(-90));
leftStabilizerFrontAdhesive.position.set(0.0, 0.501, 0.0);
leftStabilizerFrontAdhesive.rotateX(degreesToRadians(-90));
rightStabilizerSideAdhesive.position.set(1.501, 0.0, 0.0);
rightStabilizerSideAdhesive.rotateX(degreesToRadians(90));
rightStabilizerSideAdhesive.rotateY(degreesToRadians(90));
rightStabilizerFrontAdhesive.position.set(0.0, 0.501, 0.0);
rightStabilizerFrontAdhesive.rotateX(degreesToRadians(-90));

backLeftFlapsAdhesive.position.set(0.0, -0.201, 0.0);
backLeftFlapsAdhesive.rotateX(degreesToRadians(90));
backRightFlapsAdhesive.position.set(0.0, -0.201, 0.0);
backRightFlapsAdhesive.rotateX(degreesToRadians(90));

backRudderFlapAdhesive.position.set(0.0, -0.201, 0.0);
backRudderFlapAdhesive.rotateX(degreesToRadians(90));
backRudderFlapAdhesive.rotateZ(degreesToRadians(90));
backRudderFlapTopAdhesive.position.set(0.0, 0.0, 1.501);
backRudderFlapTopAdhesive.rotateZ(degreesToRadians(90));

backLeftSideAFlapsAdhesive.position.set(-1.501, 0.0, 0.0);
backLeftSideAFlapsAdhesive.rotateX(degreesToRadians(90));
backLeftSideAFlapsAdhesive.rotateY(degreesToRadians(-90));
backLeftSideBFlapsAdhesive.position.set(1.501, 0.0, 0.0);
backLeftSideBFlapsAdhesive.rotateX(degreesToRadians(90));
backLeftSideBFlapsAdhesive.rotateY(degreesToRadians(90));

backRightSideAFlapsAdhesive.position.set(-1.501, 0.0, 0.0);
backRightSideAFlapsAdhesive.rotateX(degreesToRadians(90));
backRightSideAFlapsAdhesive.rotateY(degreesToRadians(-90));
backRightSideBFlapsAdhesive.position.set(1.501, 0.0, 0.0);
backRightSideBFlapsAdhesive.rotateX(degreesToRadians(90));
backRightSideBFlapsAdhesive.rotateY(degreesToRadians(90));

frontLeftFlapSideAdhesive.position.set(-5.001, 0.0, 0.0);
frontLeftFlapSideAdhesive.rotateX(degreesToRadians(90));
frontLeftFlapSideAdhesive.rotateY(degreesToRadians(-90));
frontRightFlapSideAdhesive.position.set(5.001, 0.0, 0.0);
frontRightFlapSideAdhesive.rotateX(degreesToRadians(90));
frontRightFlapSideAdhesive.rotateY(degreesToRadians(90));

frontLeftFlapAdhesive.position.set(0.0, -0.201, 0.0);
frontLeftFlapAdhesive.rotateX(degreesToRadians(90));
//frontLeftFlapAdhesive.rotateY(degreesToRadians(-90));
frontRightFlapAdhesive.position.set(0.0, -0.201, 0.0);
frontRightFlapAdhesive.rotateX(degreesToRadians(90));
//frontRightFlapAdhesive.rotateY(degreesToRadians(90));

// create the pilot's cockpit
var cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.position.set(0.0, -2.5, 1.25);

// Joins every airplane part together
// PROPELLER
frontCylinder.add(hubBaseSphere);
// FUSELAGE
// main structure
baseCylinder.add(frontCylinder);
baseCylinder.add(backCylinder);
baseCylinder.add(rightLifesaver);
baseCylinder.add(radar);
backCylinder.add(tailCylinder);
// wings
baseCylinder.add(leftWing);
baseCylinder.add(rightWing);
baseCylinder.add(wingFrontAdhesive); // adhesive
leftWing.add(leftEngineCylinder);
leftWing.add(wingLeftSideAdhesive); // adhesive
rightWing.add(rightEngineCylinder);
rightWing.add(wingRightSideAdhesive); // adhesive

leftEngineCylinder.add(leftHubBaseSphere);
leftEngineCylinder.add(backLeftEngineAdhesive); // adhesive
leftEngineCylinder.add(frontLeftEngineAdhesive); // adhesive
rightEngineCylinder.add(rightHubBaseSphere);
rightEngineCylinder.add(backRightEngineAdhesive); // adhesive
rightEngineCylinder.add(frontRightEngineAdhesive); // adhesive
leftWing.add(leftFlap);
leftFlap.add(frontLeftFlapAdhesive); // adhesive
leftFlap.add(frontLeftFlapSideAdhesive); // adhesive
rightWing.add(rightFlap);
rightFlap.add(frontRightFlapAdhesive); // adhesive
rightFlap.add(frontRightFlapSideAdhesive); // adhesive
// cockpit
baseCylinder.add(cockpit);
// TAIL
tailCylinder.add(leftStabilizer);
tailCylinder.add(rightStabilizer);
tailCylinder.add(verticalStabilizer);
leftStabilizer.add(backLeftFlap);
leftStabilizer.add(leftCrossp1);
leftStabilizer.add(leftCrossp2);
leftStabilizer.add(leftStabilizerSideAdhesive); // adhesive
leftStabilizer.add(leftStabilizerFrontAdhesive); // adhesive
backLeftFlap.add(backLeftFlapsAdhesive); // adhesive
backLeftFlap.add(backLeftSideAFlapsAdhesive); // adhesive
backLeftFlap.add(backLeftSideBFlapsAdhesive); // adhesive
rightStabilizer.add(backRightFlap);
rightStabilizer.add(rightCrossp1);
rightStabilizer.add(rightCrossp2);
rightStabilizer.add(rightStabilizerSideAdhesive); // adhesive
rightStabilizer.add(rightStabilizerFrontAdhesive); // adhesive
backRightFlap.add(backRightFlapsAdhesive); // adhesive
backRightFlap.add(backRightSideAFlapsAdhesive); // adhesive
backRightFlap.add(backRightSideBFlapsAdhesive); // adhesive
verticalStabilizer.add(backRudder);
backRudder.add(backRudderFlapAdhesive); // adhesive
backRudder.add(backRudderFlapTopAdhesive); // adhesive
// LANDING GEAR
// front
baseCylinder.add(shockStrut);
shockStrut.add(shockStrutAdhesive); // adhesive
shockStrut.add(shockStrutAdhesive3); // adhesive
baseCylinder.add(shockStrut2);
shockStrut2.add(shockStrutAdhesive2); // adhesive
shockStrut2.add(shockStrutAdhesive4); // adhesive
baseCylinder.add(frontTireCylinder);
baseCylinder.add(frontTire);
// back
baseCylinder.add(backLeftShockStrut);
backLeftShockStrut.add(shockStrutAdhesive5); // adhesive
backLeftShockStrut.add(shockStrutAdhesive6); // adhesive
baseCylinder.add(backRightShockStrut);
backRightShockStrut.add(shockStrutAdhesive7); // adhesive
backRightShockStrut.add(shockStrutAdhesive8); // adhesive
baseCylinder.add(backTiresCylinder);
baseCylinder.add(backLeftTire);
baseCylinder.add(backRightTire);

// add all airplane objects to the scene
baseCylinderX.add(baseCylinder);
mockPlane.add(baseCylinderX);

// enabling shadows
// temporarily disabled for performance
frontCylinder.castShadow = true;
baseCylinder.castShadow = true;
leftWing.castShadow = true;
rightWing.castShadow = true;
backCylinder.castShadow = true;
tailCylinder.castShadow = true;
verticalStabilizer.castShadow = true;
leftStabilizer.castShadow = true;
rightStabilizer.castShadow = true;

//-----------------------------------//
// AIRPLANE CONFIGURATION END        //
//-----------------------------------//

scene.add(cameraInspection);
cockpit.add(cameraHolderCockPit);
scene.add(mockPlane);

//-----------------------------------//
// TEXTURES CONFIGURATION BEGIN      //
//-----------------------------------//
// Use TextureLoader to load texture files
var textureLoader = new THREE.TextureLoader(); // Creates the loader
var airplaneMultiCamo = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoWing = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoMainEngine = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoSideEngines = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoTiresCylinder = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoShockStrut = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoShockStrutSmall = textureLoader.load('./textures/multi_camo.png');
var airplaneBlueCamoBackStabilizers = textureLoader.load('./textures/blue_camo.png');
var airplaneBlueCamoBackStabilizersSmall = textureLoader.load('./textures/blue_camo.png');
var airplaneGlassCockpit = textureLoader.load('./textures/glass.png');
var airplaneMultiCamoSideWings = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoFrontWings = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoWingEngines = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoBackCylinder = textureLoader.load('./textures/multi_camo.png');
var airplaneMultiCamoTailCylinder = textureLoader.load('./textures/multi_camo.png');
var airplaneOxidizedMetal = textureLoader.load('./textures/oxidized-metal.png');
var airplaneHubMetal = textureLoader.load('./textures/metal-hub.png');
var airplaneWingFlapsMetal = textureLoader.load('./textures/metal-flaps.png');
var airplaneWingFlapsMetalSmall = textureLoader.load('./textures/metal-flaps.png');
var airplaneBackFlapsMetal = textureLoader.load('./textures/metal-flaps.png');
var airplaneBackFlapsMetalSmall = textureLoader.load('./textures/metal-flaps.png');
var airplaneBackFlapsMetalSideSmall = textureLoader.load('./textures/metal-flaps.png');
// TODO refactorate the code block above? (Loading too many times the same texture)

// Airplane multi camouflage texture configuration
airplaneMultiCamo.wrapS = THREE.RepeatWrapping;
airplaneMultiCamo.wrapT = THREE.RepeatWrapping;
airplaneMultiCamo.repeat.set( 8, 6 );
//airplaneMultiCamo.magFilter = THREE.LinearFilter;

// Wing
airplaneMultiCamoWing.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoWing.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoWing.repeat.set( 16, 2 );
//airplaneMultiCamoWing.magFilter = THREE.LinearFilter;

// Main engine // TODO fix the camo texture here (round surface)
airplaneMultiCamoMainEngine.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoMainEngine.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoMainEngine.repeat.set( 8, 1 );
//airplaneMultiCamoMainEngine.magFilter = THREE.LinearFilter;

// Side engines
airplaneMultiCamoSideEngines.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoSideEngines.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoSideEngines.repeat.set( 6, 3 );
//airplaneMultiCamoSideEngines.magFilter = THREE.LinearFilter;

// Tires Cylinders
airplaneMultiCamoTiresCylinder.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoTiresCylinder.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoTiresCylinder.repeat.set( 2, 6 );
//airplaneMultiCamoTiresCylinder.magFilter = THREE.LinearFilter;

// Shock struts
airplaneMultiCamoShockStrut.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoShockStrut.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoShockStrut.repeat.set( 3, 1 );
//airplaneMultiCamoShockStrut.magFilter = THREE.LinearFilter;

// Shock strut adhesives
airplaneMultiCamoShockStrutSmall.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoShockStrutSmall.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoShockStrutSmall.repeat.set( 0.5, 5 );
//airplaneMultiCamoShockStrutSmall.magFilter = THREE.LinearFilter;

// Back stabilizers
airplaneBlueCamoBackStabilizers.wrapS = THREE.RepeatWrapping;
airplaneBlueCamoBackStabilizers.wrapT = THREE.RepeatWrapping;
airplaneBlueCamoBackStabilizers.repeat.set( 4, 1 );
//airplaneMultiCamoShockStrut.magFilter = THREE.LinearFilter;

// Back stabilizers adhesives
airplaneBlueCamoBackStabilizersSmall.wrapS = THREE.RepeatWrapping;
airplaneBlueCamoBackStabilizersSmall.wrapT = THREE.RepeatWrapping;
airplaneBlueCamoBackStabilizersSmall.repeat.set( 3, .5 );
//airplaneMultiCamoShockStrut.magFilter = THREE.LinearFilter;

// Cockpit
airplaneGlassCockpit.wrapS = THREE.RepeatWrapping;
airplaneGlassCockpit.wrapT = THREE.RepeatWrapping;
airplaneGlassCockpit.repeat.set( 32, 32 );
//airplaneGlassCockpit.magFilter = THREE.LinearFilter;

// Wings side
airplaneMultiCamoSideWings.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoSideWings.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoSideWings.repeat.set( 4, .25 );
//airplaneGlassCockpit.magFilter = THREE.LinearFilter;

// Wings front
airplaneMultiCamoFrontWings.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoFrontWings.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoFrontWings.repeat.set( 30, .25 );
//airplaneGlassCockpit.magFilter = THREE.LinearFilter;

// Wing's engines
airplaneMultiCamoWingEngines.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoWingEngines.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoWingEngines.repeat.set( 3, 2 );

// Fuselage back cylinder
airplaneMultiCamoBackCylinder.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoBackCylinder.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoBackCylinder.repeat.set( 6, 4 );

// Fuselage tail cylinder
airplaneMultiCamoTailCylinder.wrapS = THREE.RepeatWrapping;
airplaneMultiCamoTailCylinder.wrapT = THREE.RepeatWrapping;
airplaneMultiCamoTailCylinder.repeat.set( 3, 1 );

// Blades
airplaneOxidizedMetal.wrapS = THREE.RepeatWrapping;
airplaneOxidizedMetal.wrapT = THREE.RepeatWrapping;
airplaneOxidizedMetal.repeat.set( 1, 12 );

// Hubs
airplaneHubMetal.wrapS = THREE.RepeatWrapping;
airplaneHubMetal.wrapT = THREE.RepeatWrapping;
airplaneHubMetal.repeat.set( 6, 12 );

// Wing flaps
airplaneWingFlapsMetal.wrapS = THREE.RepeatWrapping;
airplaneWingFlapsMetal.wrapT = THREE.RepeatWrapping;
airplaneWingFlapsMetal.repeat.set( 128, 4 );

// Wing flaps small
airplaneWingFlapsMetalSmall.wrapS = THREE.RepeatWrapping;
airplaneWingFlapsMetalSmall.wrapT = THREE.RepeatWrapping;
airplaneWingFlapsMetalSmall.repeat.set( 128, 2 );

// Back flaps
airplaneBackFlapsMetal.wrapS = THREE.RepeatWrapping;
airplaneBackFlapsMetal.wrapT = THREE.RepeatWrapping;
airplaneBackFlapsMetal.repeat.set( 32, 4 );

// Back flaps small
airplaneBackFlapsMetalSmall.wrapS = THREE.RepeatWrapping;
airplaneBackFlapsMetalSmall.wrapT = THREE.RepeatWrapping;
airplaneBackFlapsMetalSmall.repeat.set( 32, 2 );

// Back flaps side small
airplaneBackFlapsMetalSideSmall.wrapS = THREE.RepeatWrapping;
airplaneBackFlapsMetalSideSmall.wrapT = THREE.RepeatWrapping;
airplaneBackFlapsMetalSideSmall.repeat.set( 4, 2 );

// Set textures on each part
baseCylinder.material.map = airplaneMultiCamo; // apply camo on airplane fuselage
rightWing.material.map = airplaneMultiCamoWing; // apply camo on airplane wings
frontCylinder.material.map = airplaneMultiCamoMainEngine; // apply camo on airplane main engine
leftEngineCylinder.material.map = airplaneMultiCamoSideEngines; // apply camo on airplane side engines
frontTireCylinder.material.map = airplaneMultiCamoTiresCylinder; // apply camo on airplane landing gear
shockStrut.material.map = airplaneMultiCamoShockStrut; // apply camo on airplane landing gear
shockStrutAdhesive.material.map = airplaneMultiCamoShockStrutSmall; // apply camo on airplane shock strut's landing gear

leftStabilizer.material.map = airplaneBlueCamoBackStabilizers; // apply camo on airplane back stabilizers
leftStabilizerFrontAdhesive.material.map = airplaneBlueCamoBackStabilizersSmall;
cockpit.material.map = airplaneGlassCockpit; // apply camo on airplane back stabilizers
wingLeftSideAdhesive.material.map = airplaneMultiCamoSideWings; // apply camo on airplane back stabilizers
wingFrontAdhesive.material.map = airplaneMultiCamoFrontWings; // apply camo on airplane back stabilizers
frontLeftEngineAdhesive.material.map = airplaneMultiCamoWingEngines; // apply camo on airplane wing engines
backCylinder.material.map = airplaneMultiCamoBackCylinder; // apply camo on airplane back cylinder
tailCylinder.material.map = airplaneMultiCamoTailCylinder; // apply camo on airplane tail cylinder
blade.material.map = airplaneOxidizedMetal; // apply oxidized metal on airplane blades
hub.material.map = airplaneHubMetal; // apply metal on airplane hubs
leftFlap.material.map = airplaneWingFlapsMetal; // apply metal on airplane wing's flaps
frontLeftFlapAdhesive.material.map = airplaneWingFlapsMetalSmall; // apply metal on airplane wing's flaps
backLeftFlap.material.map = airplaneBackFlapsMetal; // apply metal on airplane back flaps
backRudderFlapAdhesive.material.map = airplaneBackFlapsMetalSmall; // apply metal on airplane wing's flaps
backRudderFlapTopAdhesive.material.map = airplaneBackFlapsMetalSideSmall; // apply metal on airplane wing's flaps

//-----------------------------------//
// TEXTURES CONFIGURATION END        //
//-----------------------------------//

///Luz
mockPlane.add(dynamicLight);
mockPlane.add(dynamicLightHelper);

}

//-----------------------------------//
// AUDIO CONFIGURATION BEGIN         //
//-----------------------------------//
var listenerAirplane = new THREE.AudioListener();
  camera.add( listenerAirplane );
  //aviao.getCameraNormal().add( listener );

// create a global audio source
const engineSound = new THREE.Audio( listenerAirplane );  

// Create ambient sound
var audioLoader = new THREE.AudioLoader();
audioLoader.load( './sounds/airplane-engine.ogg', function( buffer ) {
	engineSound.setBuffer( buffer );
	engineSound.setLoop( true );
	engineSound.setVolume( 0.0 ); // airplane starts landed, so no need to play engine sound
	engineSound.play();
});

// Controls the engine volume
Aviao.prototype.setEngineSound = function (){
    /*if (speed > 0.0 && speed <= 1.0) {
        engineSound.setVolume(0.75 * speed);
    } else {
        engineSound.setVolume(0.0);
    }*/
    // TODO check this function later
    engineSound.setVolume(0.75 * speed);
}
//-----------------------------------//
// AUDIO CONFIGURATION END           //
//-----------------------------------//

Aviao.prototype.keyboardUpdateHolder = function (groundPlane) {
    keyboard.update(); // verifica qual tecla esta sendo pressionada
    var angle = degreesToRadians(1); // determina o angulo dos movimentos de rotacao

    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis


    if (!isInInspectionMode){ // Only enables the airplane controls if not in inspection mode
        if (keyboard.pressed("left")){
            if (getAirplaneHeightPosition() <= 4){
                if(speed!=0){
                    mockPlane.rotateOnAxis(camZ, (angle*speed));
                } 
            } else {
            isPressed[1] = true;
            // limita o movimento de rotacao lateral
            if(anglesVet[1] < degreesToRadians(45)){
                speedVet[1] = speedVet[1] + angle*0.02;
                baseCylinder.rotateOnAxis(camY, -angle);
                anglesVet[1] = anglesVet[1] + angle;
            }
            mockPlane.rotateOnAxis(camZ, speedVet[1]); // realiza a rotacao no plano
            }
        }

        if (keyboard.pressed("right") && getAirplaneHeightPosition() >= 0.0){
            if (getAirplaneHeightPosition() <= 4){
                if(speed!=0){
                    mockPlane.rotateOnAxis(camZ, (-angle*speed));
                } 
            } else {
            isPressed[1] = true;
            // limita o movimento de rotacao lateral
            if(anglesVet[1]> degreesToRadians(-45)){
                speedVet[1] = speedVet[1] - angle*0.02;
                baseCylinder.rotateOnAxis(camY, angle);
                anglesVet[1] = anglesVet[1] - angle;
            }
            mockPlane.rotateOnAxis(camZ, speedVet[1]); // realiza a rotacao no plano
            }
        }
        if (keyboard.pressed("up")){
            if (getAirplaneHeightPosition() >= 4){ // prevents the airplane to get inside the water
                isPressed[0] = true;
                //Regula o visual da inclinação
                if(anglesVet[0]> degreesToRadians(-45)){
                    baseCylinderX.rotateOnAxis(camX, -angle);
                    anglesVet[0] = anglesVet[0] - angle;
                    speedVet[0] = speedVet[0] -0.01*2;
                }
                mockPlane.translateZ(speedVet[0]);
            }
        }
        if (keyboard.pressed("down") && speed > 0.2){
            isPressed[0] = true;
            //Regula o visual da inclinação
            if(anglesVet[0] <degreesToRadians(45)){
                baseCylinderX.rotateOnAxis(camX, +angle);
                anglesVet[0] = anglesVet[0] + angle;
                speedVet[0] = speedVet[0] +0.01*2;
            }
            mockPlane.translateZ(speedVet[0]);
        } 
        if (keyboard.pressed("Q")){ // speed up
            if (speed >= 1.0){ // set maximum speed
                speed = 1.0;
            } else {
                speed += 0.01;
            }
        } 
        if (keyboard.pressed("A")){ // slow down
            if (speed <= 0.0){ // set minimum speed
                speed = 0.0;
            } else {
                speed -= 0.01;
            }
        }
 
        // Verifica se o botao foi solto
        if (keyboard.up("left")){ // keep camera steady
            isPressed[1] = false;
        }
        if (keyboard.up("right")){
            isPressed[1] = false;
        }
        if (keyboard.up("up")){ // keep camera steady
            isPressed[0] = false;
        }
        if (keyboard.up("down")){
            isPressed[0] = false;
        }

        // Retorna o aviao ao angulo de origem da horizontal
        if(!isPressed[1]){
            angle = angle*2; // retorna a origem mais rapidamente do que no movimento dos controles
            if(anglesVet[1]<0){//Right
                baseCylinder.rotateOnAxis(camY, -angle);
                anglesVet[1] = anglesVet[1] + angle;
                speedVet[1] = speedVet[1] + angle*0.02;
                mockPlane.rotateOnAxis(camZ, speedVet[1]);
                // Verifica se o angulo passou da origem, caso sim, retorna para zero
                if(anglesVet[1]>=0){
                    speedVet[1] = 0;
                    baseCylinder.rotateY(anglesVet[1]);
                    anglesVet[1]=0;
                }

            } else if(anglesVet[1]>0){ //Left
                baseCylinder.rotateOnAxis(camY, +angle);
                anglesVet[1] = anglesVet[1] - angle;
                speedVet[1] = speedVet[1] - angle*0.02;
                mockPlane.rotateOnAxis(camZ, speedVet[1]);
                // Verifica se o angulo passou da origem, caso sim, retorna para zero
                if(anglesVet[1]<=0){
                    baseCylinder.rotateY(anglesVet[1]);
                    anglesVet[1]=0;
                    speedVet[1] = 0;
                }
            }
        }
        
        // Retorna o aviao ao angulo de origem da vertical
        if(!isPressed[0]){ 
            if(anglesVet[0]<0){ // pra cima
                baseCylinderX.rotateOnAxis(camX, +angle);
                anglesVet[0] = anglesVet[0] + angle;
                speedVet[0] = speedVet[0] +(0.01*2);
                mockPlane.translateZ(speedVet[0]);
                // Verifica se o angulo passou da origem, caso sim, retorna para zero
                if(anglesVet[0]>=0){
                    baseCylinderX.rotateX(-anglesVet[0]);
                    anglesVet[0]=0;
                    speedVet[0] = 0;
                }

            } else if(anglesVet[0]>0){ // down
                baseCylinderX.rotateOnAxis(camX, -angle);
                anglesVet[0] = anglesVet[0] - angle;
                speedVet[0] = speedVet[0] -(0.01*2);
                mockPlane.translateZ(speedVet[0]);
                // Verifica se o angulo passou da origem, caso sim, retorna para zero
                if(anglesVet[0]<=0){
                    baseCylinderX.rotateX(-anglesVet[0]);
                    anglesVet[0]=0;
                    speedVet[0] = 0;
                }
            }
        }
        if(getAirplaneHeightPosition() <= 2){
            mockPlane.position.set(getAirplanePositionX (),getAirplanePositionY (),0);
        }
        
        // cockpit mode toggle
        if (keyboard.down("C")){ 
            if(!cockpit.visible){
                cockpit.visible = true;
                renderCamera = camera;
            } else {
                if(groundPlane.visible==false){
                    voltarEstadoAnteriorAviao(groundPlane);
                }
                cockpit.visible = false;
                renderCamera = cameraCockpit;
            }
        }

    } // end of only enables the airplane controls if not in inspection mode

    // inspection mode switch
    if (keyboard.down("space")) {
        if (groundPlane.visible == false) {
            voltarEstadoAnteriorAviao(groundPlane);

        } else {
            // saves the current airplane coordinates for later
            cockpit.visible = true;
            savedPlanePositionX = getAirplanePositionX();
            savedPlanePositionY = getAirplanePositionY();
            savedPlanePositionZ = getAirplaneHeightPosition();
            //groundPlaneWired.visible = false;
            groundPlane.visible = false;
            savedSpeed = speed; // saves the current speed
            speed = 0.0; // para o aviao
            mockPlane.position.set(0.0, 0.0, 0.0); // moves the airplane to the origin ground plane position for the trackBallControls to work correctly
            isInInspectionMode = true; // inspection mode on

            renderCamera = cameraInspection;
        }
    }
}

function voltarEstadoAnteriorAviao(groundPlane){
    isInInspectionMode = false; // inspection mode off
    //groundPlaneWired.visible = true; // ground plane appears again
    groundPlane.visible = true; // ground plane appears again
    speed = savedSpeed; // restore the preious speed
    mockPlane.position.set(savedPlanePositionX, savedPlanePositionY, savedPlanePositionZ); // makes airplane return at its original position
    //renderCamera = camera;
    isPressed[0] = false;
    isPressed[1] = false;
    renderCamera = camera;
}

// Obtem as coordenadas globais atuais do aviao
var airplaneWorldPosition = new THREE.Vector3(); // creates a vector to get plane global position (x, y, z)


function getAirplanePositionX (){ // retorna a posicao X do avião em relação a origem do plano
    baseCylinder.getWorldPosition(airplaneWorldPosition);
    var airplaneX = airplaneWorldPosition.getComponent(0); // airplane coordinate X
    return airplaneX;
}
function getAirplanePositionY (){ // retorna a posicao Y do avião em relação a origem do plano
    baseCylinder.getWorldPosition(airplaneWorldPosition);
    var airplaneY = airplaneWorldPosition.getComponent(1); // airplane coordinate Y
    return airplaneY;
}
function getAirplaneHeightPosition (){ // retorna a altura do avião em relação ao plano
    baseCylinder.getWorldPosition(airplaneWorldPosition);
    var airplaneZ = airplaneWorldPosition.getComponent(2); // airplane height
    return airplaneZ;
}

Aviao.prototype.slowSpeed = function (){
    var gravity = 0.3; // sets the strength of (simulated) gravity
    // minimum height between airplane and ground plane
    let planeMinHeight = planePositionZ + 1.5; // necessario pois a altura agora eh calculada em relacao ao centro do aviao
    if(speed > 0.05 && speed < 0.2){
        if(getAirplaneHeightPosition() >= planeMinHeight){ // stops at ground plane
            mockPlane.translateZ(-gravity);
        }
    }
    if(speed >= 0.0 && speed <= 0.05 && !isInInspectionMode){ // verifies the inspection mode too
        if(getAirplaneHeightPosition() >= planeMinHeight){ // stops at ground plane
            mockPlane.translateZ(-gravity*3);
        }
    }
}

Aviao.prototype.moverAviao = function (){
    mockPlane.translateY(speed);
}

Aviao.prototype.rotateBlades = function (){
    // takes back matrix control
    hub.matrixAutoUpdate = false;
    blade.matrixAutoUpdate = false;
    leftHub.matrixAutoUpdate = false;
    leftBlade.matrixAutoUpdate = false;
    rightHub.matrixAutoUpdate = false;
    rightBlade.matrixAutoUpdate = false;
  
    if(animationOn){
      var mat4 = new THREE.Matrix4();
  
      blade.matrix.identity();  // reset matrix
      leftBlade.matrix.identity();  // reset matrix
      rightBlade.matrix.identity();  // reset matrix
  
      // Will execute rotation
      hub.matrix.multiply(mat4.makeRotationY(speed*2/2)); // R1
      rightHub.matrix.multiply(mat4.makeRotationY(-speed*2)); // R1
      leftHub.matrix.multiply(mat4.makeRotationY(speed*2)); // R1
    }
}

Aviao.prototype.getCameraAtual = function (){
    return renderCamera;
}

Aviao.prototype.getCameraNormal = function (){
    return camera;
}

Aviao.prototype.getCameraInspecao = function (){
    return cameraInspection;
}

Aviao.prototype.getCameraCockpit = function (){
    return cameraCockpit;
}

Aviao.prototype.getPosicao = function (){
    var vetorPosicao = [getAirplanePositionX(), getAirplanePositionY(), getAirplaneHeightPosition()];
    return vetorPosicao;
}
