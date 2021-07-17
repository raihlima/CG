import * as THREE from  '../../build/three.module.js';
import {initRenderer, 
    //createGroundPlaneWired,
    onWindowResize, 
    degreesToRadians,
    //initDefaultBasicLight,
    InfoBox} from "/libs/util/util.js";


// Reference URL to all tree parts names
// https://www.nps.gov/choh/learn/kidsyouth/images/Parts-of-a-tree-Color-image_KellySavannah3.jpg?maxwidth=1200&maxheight=1200&autorotate=false

//-----------------------------------//
// TREES CONFIGURATION BEGIN         //
//-----------------------------------//
// Materials config

var treeBranchCylinderGeometry = new THREE.CylinderGeometry(1.0, 1.0, 4.0, 32);
var treeCylindersMaterial = new THREE.MeshLambertMaterial({color:"rgb(170, 100, 50)"}); // to mimic wood
var treeLeavesSphereMaterial = new THREE.MeshLambertMaterial({color:"rgb(0, 235, 0)"}); // to mimic leaves
var treeTrunkCylinderGeometry = new THREE.CylinderGeometry(1.5, 1.5, 10.0, 32);

//var vetScenarioTrees = []; // To save and create the trees later
// Function to create one tree

// TODO fix tree shadows
// TODO limit tree spawn to avoid conflic with the mountains
//-----------------------------------//
// TREES CONFIGURATION END           //
//-----------------------------------//

export function gerarArvores(scene){
    //Gera entre 60 e 90 arvores
    var quantidadeArvore = Math.random() *30 + 60;
    //var mapa = mapaPlano();
    for (let i = 0; i < quantidadeArvore; i++) {
        //let distance = 10.0; // distance between trees
        let positionX = Math.random() *1000 + -500;//getRandomNumber(-500, 500); // coordinate X
        let positionY = Math.random() *1000 + -500;//getRandomNumber(-500, 500); // coordinate Y
        let tree = gerarModeloArvore(); // Generate a new tree
        tree.position.set(positionX, positionY, 5.0);
        scene.add(tree);
    }
}

//Gera um modelo randômico da árvore
function gerarModeloArvore(){
        // Crown and leaves
        let treeLeavesSphereGeometry = new THREE.SphereGeometry((Math.random()* 2 +1.5), 6, 6);
        let treeCrownSphereGeometry = new THREE.SphereGeometry((Math.random()* 2 +3.5), 8, 8);
        let treeCrownCylinderGeometry1 = new THREE.CylinderGeometry(0, 3.5, 10.0, 32);
        let treeCrownCylinderGeometry2 = new THREE.CylinderGeometry(1, 5.5, 10.0, 32);
        let treeCrownCylinderGeometry3 = new THREE.CylinderGeometry(2, 7.5, 10.0, 32);

        //let treeTrunkCylinderGeometry = new THREE.CylinderGeometry((Math.random()* 2 +1.5), (Math.random()* 2 +1.5), 10.0, 32);
        let treeCrownSphere = new THREE.Mesh( treeCrownSphereGeometry, treeLeavesSphereMaterial );
        let treeLeftLeavesSphere = new THREE.Mesh( treeLeavesSphereGeometry, treeLeavesSphereMaterial );
        let treeRightLeavesSphere = new THREE.Mesh( treeLeavesSphereGeometry, treeLeavesSphereMaterial );
        let treeCrownCylinder1 = new THREE.Mesh( treeCrownCylinderGeometry1, treeLeavesSphereMaterial );
        let treeCrownCylinder2 = new THREE.Mesh( treeCrownCylinderGeometry2, treeLeavesSphereMaterial );
        let treeCrownCylinder3 = new THREE.Mesh( treeCrownCylinderGeometry3, treeLeavesSphereMaterial );

        // Trunk
        let treeCylinder = new THREE.Mesh(treeTrunkCylinderGeometry, treeCylindersMaterial);
        let treeLeftBranchCylinder = new THREE.Mesh(treeBranchCylinderGeometry, treeCylindersMaterial);
        let treeRightBranchCylinder = new THREE.Mesh(treeBranchCylinderGeometry, treeCylindersMaterial);
        // adjust tree parts relative positions
        treeCylinder.rotateX(degreesToRadians(90));
        treeCylinder.rotateY(degreesToRadians(90));
        treeCrownCylinderGeometry1.rotateY(degreesToRadians(90));
        treeCrownCylinderGeometry2.rotateY(degreesToRadians(90));
        treeCrownCylinderGeometry3.rotateY(degreesToRadians(90));

        //treeCylinder.receiveShadow = true; // shadown
        treeLeftBranchCylinder.position.set(0.0, 0.5, 1.75);
        treeLeftBranchCylinder.rotateX(degreesToRadians(45));
        treeRightBranchCylinder.position.set(0.0, 1.5, -1.75);
        treeRightBranchCylinder.rotateX(degreesToRadians(-45));
        treeCrownSphere.position.set(0.0, 7.5, 0.0);
        treeLeftLeavesSphere.position.set(0.0, 3.0, 0.0);
        treeRightLeavesSphere.position.set(0.0, 3.0, 0.0);
        
        //tipo de arvore
        let tipoArvore = Math.floor(Math.random() * 3);
        //Tipo 0
        if(tipoArvore==0){
            treeCylinder.add(treeLeftBranchCylinder);
            //treeCylinder.add(treeRightBranchCylinder);
            treeCylinder.add(treeCrownSphere);
            treeLeftBranchCylinder.add(treeLeftLeavesSphere);
            //treeRightBranchCylinder.add(treeRightLeavesSphere);
        }
        //Tipo 1
        else if(tipoArvore==1) {
            treeCylinder.add(treeLeftBranchCylinder);
            treeCylinder.add(treeRightBranchCylinder);
            treeCylinder.add(treeCrownSphere);
            treeLeftBranchCylinder.add(treeLeftLeavesSphere);
            treeRightBranchCylinder.add(treeRightLeavesSphere);
        } //tipo 2 Conífera
        else if (tipoArvore==2){

            treeCrownCylinder1.position.set(0, 6, 0);
            treeCrownCylinder2.position.set(0, 6, 0);
            treeCrownCylinder3.position.set(0, 6, 0);
            treeCrownCylinder2.add(treeCrownCylinder1);
            treeCrownCylinder3.add(treeCrownCylinder2);

            treeCylinder.add(treeCrownCylinder3);
        }
        // add parts to scene

        // adjust the entire tree position
        //treeCylinder.position.set(0.0, -370.0, 5.0); // TODO adjust position later, this one is only for testing
        // add everything to the scene
        //groundPlane.add(treeCylinder);
        treeCylinder.rotateY(degreesToRadians(Math.random() *360));
        return treeCylinder;
}

/*
function mapaPlano(){
    var mapa = new Array (10);

    for(let i=0;i<10;i++){
        mapa [i] = new Array (10);
        for(let j=0; j<10;j++){
            mapa [i][j]=0;
        }
    }

    return mapa;
}*/
