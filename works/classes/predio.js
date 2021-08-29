import * as THREE from  '../../build/three.module.js';
import {initRenderer, 
    //createGroundPlaneWired,
    onWindowResize, 
    degreesToRadians,
    //initDefaultBasicLight,
    InfoBox} from "/libs/util/util.js";

    var plane;
    var tamanho = 400;
    var tamanhoRua = 20;
    var calcada = [];

    export function gerarCidade(scene){
        var planeGeometry = new THREE.PlaneGeometry(1, 1);
        planeGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
        var planeMaterial = new THREE.MeshBasicMaterial({
            color: "rgba(150, 150, 150)",
            side: THREE.DoubleSide,
        });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);
        // add the plane to the scene
        scene.add(plane);

        // create a cube
        var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        var cubeMaterial = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // position the cube
        cube.position.set(0.0, 0.0, 2.0);
        scene.add(cube);

        gerarRuas();
        gerarCalcada();
        gerarPredios();
        //Gera entre 60 e 90 arvores
        /*
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
        */
    }

    function gerarRuas(){
        var posicaoRua = [(-tamanho/2),(-tamanho/6),(tamanho/6),(tamanho/2)];
        var landingTrackGeometry = new THREE.BoxGeometry(tamanhoRua, tamanho, 0.0);
        var landingTrackMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
        // create the landing track
        var landingTrack = [];
        for(let i=0;i<8;i++){
            landingTrack[i] = new THREE.Mesh(landingTrackGeometry, landingTrackMaterial);
            
            if(i>=4){
                landingTrack[i].rotateZ(degreesToRadians(-90));
                landingTrack[i].position.set(0,posicaoRua[i%4],0);
            } else {
                landingTrack[i].position.set(posicaoRua[i%4],0,0);
            }
            plane.add(landingTrack[i]);
        }
        //var landingTrack = new THREE.Mesh(landingTrackGeometry, landingTrackMaterial); 
    }

    function gerarCalcada(){
       // var landingTrackGeometry = new THREE.BoxGeometry(20.0, tamanho, 0.0);
        //var landingTrackMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
        let tamanhoQuadrado = (tamanho/3)-tamanhoRua;
        let calcadaGeometry = new THREE.BoxGeometry(tamanhoQuadrado, tamanhoQuadrado,0.3);
        calcadaGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
        let calcadaMaterial = new THREE.MeshLambertMaterial({color:"rgb(200, 200, 200)"}); // light grey
        var posicaoCalcada = [(-tamanho/3),0,(tamanho/3)];

        for(let i=0;i<9;i++){
            calcada[i] = new THREE.Mesh(calcadaGeometry, calcadaMaterial);
            
            if(i<3){
                calcada[i].position.set(posicaoCalcada[0],posicaoCalcada[i%3],0);
            } else if (i<6){
                calcada[i].position.set(posicaoCalcada[1],posicaoCalcada[i%3],0);
            } else {
                calcada[i].position.set(posicaoCalcada[2],posicaoCalcada[i%3],0);
            }
            plane.add(calcada[i]);
        }
    }

    function gerarPredios(){
        //modeloPredio1();
        modeloPredio2();
        modeloPredio3();
        modeloPredio4();
        modeloPredio5();
        modeloPredio6();
    }

    function modeloPredio1(){
        
        var paredeGeometry = new THREE.PlaneGeometry(tamanho/9, 100);
        var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
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

        var parede = [];

        parede[0] = new THREE.Mesh(chaoGeometry, marbleMaterial);
        parede[0].side = THREE.DoubleSide;
        parede[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            parede[i] = new THREE.Mesh(paredeGeometry, marbleMaterial);
            parede[i].side = THREE.DoubleSide;
            parede[i].material.side = THREE.DoubleSide;
        }

        //topo
        parede[5] = new THREE.Mesh(tetoGeometry, marbleMaterial);
        parede[5].side = THREE.DoubleSide;
        parede[5].material.side = THREE.DoubleSide;

        //Formar um cubo
        parede[1].position.set(0.0, (tamanho/9)/2, (tamanho/9));
        parede[1].rotation.x = Math.PI / 2;
        parede[2].position.set(0.0, -(tamanho/9)/2, (tamanho/9));
        parede[2].rotation.x = Math.PI / 2;
        parede[3].position.set((tamanho/9)/2, 0.0, (tamanho/9));
        parede[3].rotation.x = Math.PI / 2;
        parede[3].rotation.y = Math.PI / 2;
        parede[4].position.set(-(tamanho/9)/2, 0.0, (tamanho/9));
        parede[4].rotation.x = Math.PI / 2;
        parede[4].rotation.y = Math.PI / 2;

        parede[5].position.set(0, 0.0, 95);
        //Posicao do edificio
        parede[0].position.set((tamanho/9)/2, (tamanho/9)/2, 0);
        parede[0].add(parede[1]);
        parede[0].add(parede[2]);
        parede[0].add(parede[3]);
        parede[0].add(parede[4]);
        parede[0].add(parede[5]);
        plane.add(parede[0]);
    }

    function modeloPredio2(){
        var altura = 50;
        var paredeGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
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

        var parede = [];

        parede[0] = new THREE.Mesh(chaoGeometry, marbleMaterial);
        parede[0].side = THREE.DoubleSide;
        parede[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            parede[i] = new THREE.Mesh(paredeGeometry, marbleMaterial);
            parede[i].side = THREE.DoubleSide;
            parede[i].material.side = THREE.DoubleSide;
        }

        //topo
        parede[5] = new THREE.Mesh(tetoGeometry, marbleMaterial);
        parede[5].side = THREE.DoubleSide;
        parede[5].material.side = THREE.DoubleSide;

        //Formar um cubo
        parede[1].position.set(0.0, (tamanho/9)/2, (tamanho/9));
        parede[1].rotation.x = Math.PI / 2;
        parede[2].position.set(0.0, -(tamanho/9)/2, (tamanho/9));
        parede[2].rotation.x = Math.PI / 2;
        parede[3].position.set((tamanho/9)/2, 0.0, (tamanho/9));
        parede[3].rotation.x = Math.PI / 2;
        parede[3].rotation.y = Math.PI / 2;
        parede[4].position.set(-(tamanho/9)/2, 0.0, (tamanho/9));
        parede[4].rotation.x = Math.PI / 2;
        parede[4].rotation.y = Math.PI / 2;

        parede[5].position.set(0, 0.0, 66.5);
        //Posicao do edificio
        parede[0].position.set((tamanho/9)/2, (tamanho/9)/2, -22);
        parede[0].add(parede[1]);
        parede[0].add(parede[2]);
        parede[0].add(parede[3]);
        parede[0].add(parede[4]);
        parede[0].add(parede[5]);


        //criação da torre
        




        plane.add(parede[0]);
    }

    function modeloPredio3(){
        
    }

    function modeloPredio4(){
        
    }

    function modeloPredio5(){
        
    }

    function modeloPredio6(){
        
    }