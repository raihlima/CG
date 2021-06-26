import * as THREE from  '../build/three.module.js';
import {TrackballControls} from '../build/jsm/controls/TrackballControls.js';
import Stats from               '../build/jsm/libs/stats.module.js';
import KeyboardState from       '../libs/util/KeyboardState.js';
import {initRenderer, 
        createGroundPlaneWired,
        onWindowResize, 
        degreesToRadians,
        initDefaultBasicLight,
        InfoBox} from "../libs/util/util.js";

var stats = new Stats();        // To show FPS information
var scene = new THREE.Scene();  // create scene
var renderer = initRenderer();  // View function in util/utils
initDefaultBasicLight(scene, 1, new THREE.Vector3(0, 0, 25)); // Adds some light to the scene

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

//-----------------------------------//
// AIRPLANE CONFIGURATION BEGIN      //
//-----------------------------------//

// airplane config
var planePositionX = 0.0;
var planePositionY = -370.0; // previous value was +20.0
var planePositionZ = 45.0; // previous value was +5.0

var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var mockPlaneGeometry = new THREE.BoxGeometry(0, 0, 0, 32);
var mockPlane = new THREE.Mesh(mockPlaneGeometry, fuselageMaterial);
mockPlane.position.set(planePositionX, planePositionY, planePositionZ); // initial position
scene.add(mockPlane);

// Base mock sphere
var mockBaseSphereGeometry = new THREE.SphereGeometry(0, 0, 2);
var mockBaseSphere = new THREE.Mesh( mockBaseSphereGeometry, fuselageMaterial );
// Set initial position of the sphere
mockBaseSphere.translateX(0.0).translateY(-25.0).translateZ(0.0); // distance between airplane and camera

// Camera configs
// Camera do modo simulacao
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
var cameraPosition = [0,10,20]; // relative position between airplane and camera
camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]); // Initial camera position
// Camera do modo inspecao
var cameraInspection = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
cameraInspection.position.set (0,-30,15); // configura a posicao inicial da camera do modo inspecao
cameraInspection.lookAt(0, 0, 0);

// Config camera holder
var cameraHolder = new THREE.Object3D();
cameraHolder.position.set(0.0, 2.0, 0.0);
cameraHolder.up.set(0, 1, 0);
cameraHolder.lookAt(0, 0, 0);
// Adiciona cameras no aviao
mockBaseSphere.add(cameraHolder);
mockPlane.add(mockBaseSphere);
cameraHolder.add(camera);
mockPlane.add(cameraInspection);

// Enable mouse rotation, pan, zoom etc.
var renderCamera = camera; // Faz o papel de troca das cameras das cenas
var trackballControls = new TrackballControls( cameraInspection, renderer.domElement );

// define objects material
var material = new THREE.MeshNormalMaterial();
var fuselageMaterial = new THREE.MeshPhongMaterial({color:"grey"});
var cockpitMaterial = new THREE.MeshPhongMaterial({color:"white"});
var tailMaterial = new THREE.MeshPhongMaterial({color:"orange", emissive:"rgb(255, 100, 0)", emissiveIntensity:"0.75"}); // bright orange
var tiresMaterial = new THREE.MeshPhongMaterial({color:"black"}); 
var hubMaterial = new THREE.MeshPhongMaterial({color:"red"});
var stabilizersMaterial = new THREE.MeshPhongMaterial({color:"green"});
var flapsMaterial = new THREE.MeshPhongMaterial({color:"yellow"});
var lifesaverMaterial = new THREE.MeshPhongMaterial({color:"red", emissiveIntensity:"0.95"}); // bright red

// Reference URL to all ariplane parts names
// https://www.flyaeroguard.com/learning-center/parts-of-an-airplane/

//-----------------------------------//
// FUSELAGE                          //
//-----------------------------------//
// define airplane wings geometry
var wingsGeometry = new THREE.BoxGeometry(10.0, 3.0, 0.2);
// create the right wing
var rightWing = new THREE.Mesh(wingsGeometry, fuselageMaterial);
rightWing.position.set(6.5, -1.0, 0.0);
// create the left wing
var leftWing = new THREE.Mesh(wingsGeometry, fuselageMaterial);
leftWing.position.set(-6.5, -1.0, 0.0);
// wing engines
var enginesCylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 4.0, 32);
// left engine
var leftEngineCylinder = new THREE.Mesh(enginesCylinderGeometry, fuselageMaterial);
leftEngineCylinder.position.set(0.0, 0.0, -0.5);
// right engine
var rightEngineCylinder = new THREE.Mesh(enginesCylinderGeometry, fuselageMaterial);
rightEngineCylinder.position.set(0.0, 0.0, -0.5);

// define airplane flaps geometry
var flapsGeometry = new THREE.BoxGeometry(10.0, 0.4, 0.2);
var leftFlap = new THREE.Mesh(flapsGeometry, flapsMaterial);
var rightFlap = new THREE.Mesh(flapsGeometry, flapsMaterial);
leftFlap.position.set(0.0, -1.72, 0.0);
rightFlap.position.set(0.0, -1.72, 0.0);

// create the base cylinder
var baseCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 9.0, 32);
var baseCylinder = new THREE.Mesh(baseCylinderGeometry, fuselageMaterial);
baseCylinderGeometry = new THREE.CylinderGeometry(0, 0, 0, 32);
var baseCylinderX = new THREE.Mesh(baseCylinderGeometry, fuselageMaterial);
baseCylinder.position.set(0.0, 0.0, 2.5); // ajuste de altura do avião em relação a câmera

// create the rear cylinder
var backCylinderGeometry = new THREE.CylinderGeometry(1.5, 0.5, 5, 32);
var backCylinder = new THREE.Mesh(backCylinderGeometry, fuselageMaterial);
backCylinder.position.set(0.0, -7.0, 0.0);

// create tail cylinder
var tailCylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
var tailCylinder = new THREE.Mesh(tailCylinderGeometry, fuselageMaterial);
tailCylinder.position.set(0.0, -3.0, 0.0);

// define airplane stabilizers geometry
var horizontalStabilizerGeometry = new THREE.BoxGeometry(3, 1, 0.2);
var verticalStabilizerGeometry = new THREE.BoxGeometry(0.2, 0.5, 2);
// create the right stabilizer
var rightStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, stabilizersMaterial);
rightStabilizer.position.set(2.0, 0.0, 0.0);
// create the left stabilizer
var leftStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, stabilizersMaterial);
leftStabilizer.position.set(-2.0, 0.0, 0.0);
// create vertical stabilizer
var verticalStabilizer = new THREE.Mesh(verticalStabilizerGeometry, tailMaterial);
verticalStabilizer.position.set(0.0, -0.25, 1.5);
// define airplane back flaps geometry
var backFlapsGeometry = new THREE.BoxGeometry(3.0, 0.4, 0.2);
var backRudderGeometry = new THREE.BoxGeometry(0.2, 0.4, 2.0);
var backLeftFlap = new THREE.Mesh(backFlapsGeometry, flapsMaterial);
var backRightFlap = new THREE.Mesh(backFlapsGeometry, flapsMaterial);
var backRudder = new THREE.Mesh(backRudderGeometry, flapsMaterial);
backLeftFlap.position.set(0.0, -0.72, 0.0);
backRightFlap.position.set(0.0, -0.72, 0.0);
backRudder.position.set(0.0, -0.47, 0.0);

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
var crossGeometry = new THREE.BoxGeometry(1.0, 0.4, 0.4);
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
var frontCylinder = new THREE.Mesh(frontCylinderGeometry, fuselageMaterial);
frontCylinder.position.set(0.0, 4.75, 0.0);

//-----------------------------------//
// PROPELLER                         //
//-----------------------------------//
// create blades hub
var hubGeometry = new THREE.ConeGeometry(0.5, 1.0, 32);
var hub = new THREE.Mesh(hubGeometry, hubMaterial);
// define blades geometry
var bladeGeometry = new THREE.BoxGeometry(0.4, 0.05, 5.0);
var wingsBladeGeometry = new THREE.BoxGeometry(0.2, 0.05, 4.0);
// create blades
var blade = new THREE.Mesh(bladeGeometry, cockpitMaterial);
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
var leftHub = new THREE.Mesh(hubGeometry, hubMaterial);
var leftBlade = new THREE.Mesh(wingsBladeGeometry, cockpitMaterial);
var rightHub = new THREE.Mesh(hubGeometry, hubMaterial);
var rightBlade = new THREE.Mesh(wingsBladeGeometry, cockpitMaterial);
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
var shockStrut = new THREE.Mesh(shockStrutGeometry, fuselageMaterial);
shockStrut.position.set(0.2, 3.0, -1.9);
// create 2nd front shock strut
var shockStrut2 = new THREE.Mesh(shockStrutGeometry, fuselageMaterial);
shockStrut2.position.set(-0.2, 3.0, -1.9);
// create front tire cylinder axis
var frontTireCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 32);
var frontTireCylinder = new THREE.Mesh(frontTireCylinderGeometry, fuselageMaterial);
frontTireCylinder.rotateZ(degreesToRadians(90));
frontTireCylinder.position.set(0.0, 3.0, -2.2);
// create back left shock strut
var backLeftShockStrut = new THREE.Mesh(backShockStrutsGeometry, fuselageMaterial);
backLeftShockStrut.position.set(-0.9, -3.0, -1.75);
// rotate to 90° angle
backLeftShockStrut.rotateY(degreesToRadians(45));
// create back right shock strut
var backRightShockStrut = new THREE.Mesh(backShockStrutsGeometry, fuselageMaterial);
backRightShockStrut.position.set(0.9, -3.0, -1.75);
// rotate to 90° angle
backRightShockStrut.rotateY(degreesToRadians(-45));
// create back tire cylinder axis
var backTiresCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3.0, 32);
var backTiresCylinder = new THREE.Mesh(backTiresCylinderGeometry, fuselageMaterial);
backTiresCylinder.rotateZ(degreesToRadians(90));
backTiresCylinder.position.set(0.0, -3.0, -2.2);

// create the pilot's cockpit
var cockpitGeometry = new THREE.SphereGeometry(1, 32, 32);
var cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.position.set(0.0, -2.5, 1.25);

// Joins every airplane part togheter
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
leftWing.add(leftEngineCylinder);
rightWing.add(rightEngineCylinder);
leftEngineCylinder.add(leftHubBaseSphere);
rightEngineCylinder.add(rightHubBaseSphere);
leftWing.add(leftFlap);
rightWing.add(rightFlap);
// cockpit
baseCylinder.add(cockpit);
// TAIL
tailCylinder.add(leftStabilizer);
tailCylinder.add(rightStabilizer);
tailCylinder.add(verticalStabilizer);
leftStabilizer.add(backLeftFlap);
leftStabilizer.add(leftCrossp1);
leftStabilizer.add(leftCrossp2);
rightStabilizer.add(backRightFlap);
rightStabilizer.add(rightCrossp1);
rightStabilizer.add(rightCrossp2);
verticalStabilizer.add(backRudder);
// LANDING GEAR
// front
baseCylinder.add(shockStrut);
baseCylinder.add(shockStrut2);
baseCylinder.add(frontTireCylinder);
baseCylinder.add(frontTire);
// back
baseCylinder.add(backLeftShockStrut);
baseCylinder.add(backRightShockStrut);
baseCylinder.add(backTiresCylinder);
baseCylinder.add(backLeftTire);
baseCylinder.add(backRightTire);

// add all airplane objects to the scene
baseCylinderX.add(baseCylinder);
mockPlane.add(baseCylinderX);

//-----------------------------------//
// AIRPLANE CONFIGURATION END        //
//-----------------------------------//

// To use the keyboard
var keyboard = new KeyboardState();

// Show axes (parameter is size of each axis)
var axesHelper = new THREE.AxesHelper( 25 );
// Reposition of helper to better visualization of it
axesHelper.translateY(20); // TODO remove translation from axes helper
axesHelper.translateX(20);

// Plano base que simula agua
var groundPlaneWired = createGroundPlaneWired(1000, 1000, 20, 20, "blue");
groundPlaneWired.rotateX(degreesToRadians(90)); // rotacionado por conta da pespectiva da camera "arrasto no chao"
// Adiciona ambos os objetos na cena
scene.add(groundPlaneWired);
groundPlaneWired.add(axesHelper);

// Listen window size changes
window.addEventListener( 'resize', function(){onWindowResize(camera, renderer)}, false ); // no modo simulacao
window.addEventListener( 'resize', function(){onWindowResize(cameraInspection, renderer)}, false ); // no modo inspecao

// Show text information onscreen
showInformation(); // displays information about the controls

// Variaveis de movimento do aviao
var speed = 0.2; // velocidade base dos movimentos
var savedSpeed = speed; // salva a velocidade do aviao na simulacao
var isPressed = [false,false]; // x,y controla se os botoes de controle de rotacao estao sendo pressionados
var anglesVet = [0,0,0]; // salva qual o angulo atual do aviao para depois retornar a origem
var speedVet = [0,0,0]; // salva a velocidade dos movimentos laterais e verticais atual do aviao para depois retornar a origem
var isInInspectionMode = false; // verifica se o modo inspecao esta ativo e trava os controles do teclado se verdadeiro

// Obtem as coordenadas globais atuais do aviao
var airplaneWorldPosition = new THREE.Vector3(); // creates a vector to get plane global position (x, y, z)
function airplaneHeightPosition(){ // retorna a altura do avião em relação ao plano
    mockPlane.getWorldPosition(airplaneWorldPosition); // updates the position from the airplane
    var airplaneZ = airplaneWorldPosition.getComponent(2); // airplane height    
    return airplaneZ;
}
function airplanePositionX(){ // retorna a altura do avião em relação ao plano
    mockPlane.getWorldPosition(airplaneWorldPosition); // updates the position from the airplane
    var airplaneX = airplaneWorldPosition.getComponent(0); // airplane height    
    return airplaneX;
}
function airplanePositionY(){ // retorna a altura do avião em relação ao plano
    mockPlane.getWorldPosition(airplaneWorldPosition); // updates the position from the airplane
    var airplaneY = airplaneWorldPosition.getComponent(1); // airplane height    
    return airplaneY;
}

mockPlane.matrix.identity(); // afeta a perspectiva das cameras

// Keyboard controls for the simulator
function keyboardUpdateHolder() {
    keyboard.update(); // verifica qual tecla esta sendo pressionada
    var angle = degreesToRadians(1); // determina o angulo dos movimentos de rotacao

    var camX = new THREE.Vector3(1, 0, 0); // Set X axis
    var camY = new THREE.Vector3(0, 1, 0); // Set Y axis
    var camZ = new THREE.Vector3(0, 0, 1); // Set Z axis

    if (!isInInspectionMode){ // Only enables the airplane controls if not in inspection mode
        if (keyboard.pressed("left")){
            isPressed[1] = true;
            // limita o movimento de rotacao lateral
            if(anglesVet[1] < degreesToRadians(45)){
                speedVet[1] = speedVet[1] + angle*0.02;
                baseCylinder.rotateOnAxis(camY, -angle);
                anglesVet[1] = anglesVet[1] + angle;
            }
            mockPlane.rotateOnAxis(camZ, speedVet[1]); // realiza a rotacao no plano
        }

        if (keyboard.pressed("right")){
            isPressed[1] = true;
            // limita o movimento de rotacao lateral
            if(anglesVet[1]> degreesToRadians(-45)){
                speedVet[1] = speedVet[1] - angle*0.02;
                baseCylinder.rotateOnAxis(camY, angle);
                anglesVet[1] = anglesVet[1] - angle;
            }
            mockPlane.rotateOnAxis(camZ, speedVet[1]); // realiza a rotacao no plano
        }
        if (keyboard.pressed("up")){
            if (airplaneHeightPosition() >= 0.0){ // prevents the airplane to get inside the water
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
        if (keyboard.pressed("down")){
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
    } // end of only enables the airplane controls if not in inspection mode
    
    // inspection mode switch
    if (keyboard.down("space")){
        if(groundPlaneWired.visible == false){
            isInInspectionMode = false; // inspection mode off
            groundPlaneWired.visible = true; // ground plane appears again
            speed = savedSpeed; // restore the preious speed
            mockPlane.position.set(planePositionX, planePositionY, planePositionZ); // makes airplane return at its original position
            renderCamera = camera;
        } else { 
            groundPlaneWired.visible = false;
            savedSpeed = speed;
            speed = 0.0; // para o aviao
            mockPlane.position.set(0.0, 0.0, 0.0); // moves the airplane to the origin ground plane position for the trackBallControls to work correctly
            isInInspectionMode = true; // inspection mode on
            renderCamera = cameraInspection;
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
}

// Makes airplane go down if speed is too slow
function slowSpeed(){
    var gravity = 0.3; // sets the strength of (simulated) gravity
    if(speed > 0.05 && speed < 0.2){
        if(airplaneHeightPosition() >= 0.0){ // stops at ground plane
            mockPlane.translateZ(-gravity);
        }
    }
    if(speed >= 0.0 && speed <= 0.05 && !isInInspectionMode){ // verifies the inspection mode too
        if(airplaneHeightPosition() >= 0.0){ // stops at ground plane
            mockPlane.translateZ(-gravity*3);
        }
    }
}

var animationOn = true; // control if the bades' animation is on or of

function rotateBlades(){
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

function render() {
    requestAnimationFrame( render );
	renderer.render( scene, renderCamera );
    stats.update(); // Update FPS
    keyboardUpdateHolder(); // listens to keyboard inputs and controls cameraHolder
    mockPlane.translateY(speed); // moves the plane automatically
    trackballControls.update(); // Enable mouse movements
    rotateBlades(); // Enable airplane blades rotation
    slowSpeed(); // Checks if airplane is too slow
    airplaneHeightPosition(); // Updates the airplane position data
}
render();
