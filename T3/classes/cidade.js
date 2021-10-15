import * as THREE from  '../../build/three.module.js';
import {initRenderer, 
    //createGroundPlaneWired,
    onWindowResize, 
    degreesToRadians,
    //initDefaultBasicLight,
    InfoBox} from "./util.js";
import {OBJLoader} from '../../build/jsm/loaders/OBJLoader.js';
import {MTLLoader} from '../../build/jsm/loaders/MTLLoader.js';

    var plane;
    var tamanho = 400;
    var tamanhoRua = 20;
    var calcada = [];
    var loader = new THREE.TextureLoader();

    export function gerarCidade(scene){
        var planeGeometry = new THREE.PlaneGeometry(1, 1);
        planeGeometry.translate(0.0, 0.0, 0.02); // To avoid conflict with the axeshelper
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
        plane.position.set(0.0, 0.0, 0.02);
        //scene.add(cube);

        gerarRuas();
        gerarCalcada();
        //gerarPredios();
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
        var ruaGeometry = new THREE.PlaneGeometry(tamanhoRua, tamanho+20);
        
        var asphaultTexture = loader.load('../../T3/textures/asphalt.png', function ( asphaultTexture ) {

            asphaultTexture.wrapS = asphaultTexture.wrapT = THREE.RepeatWrapping;
            asphaultTexture.offset.set( 0, 0 );
            asphaultTexture.repeat.set( 4, 64 );
        
        } );
        
        var asphaultMaterial = new THREE.MeshLambertMaterial( { map: asphaultTexture, side: THREE.FrontSide } );

        var ruaMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
        // create the landing track
        var rua = [];
        for(let i=0;i<8;i++){
            rua[i] = new THREE.Mesh(ruaGeometry, ruaMaterial);
            
            if(i>=4){
                rua[i].rotateZ(degreesToRadians(-90));
                rua[i].position.set(0,posicaoRua[i%4],0.02);
            } else {
                rua[i].position.set(posicaoRua[i%4],0,0);
            }
            rua[i].receiveShadow = true;
            rua[i].material.map = asphaultTexture;
            plane.add(rua[i]);
            plane.receiveShadow = true;
        }



        //var landingTrack = new THREE.Mesh(landingTrackGeometry, landingTrackMaterial); 
    }

    function gerarCalcada(){
       // var landingTrackGeometry = new THREE.BoxGeometry(20.0, tamanho, 0.0);
        //var landingTrackMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
        let tamanhoQuadrado = (tamanho/3)-tamanhoRua;
        let calcadaGeometry = new THREE.BoxGeometry(tamanhoQuadrado, tamanhoQuadrado,0.3);

        //
        const calcadaTexture = loader.load('../../T3/textures/city/calcada.jpg');

        //var calcadaMaterial = new THREE.MeshPhongMaterial( { map: calcadaTexture, side: THREE.FrontSide } );

        var calcadaMaterial = new THREE.MeshLambertMaterial({color:"rgb(120, 120, 120)"});
        calcadaGeometry.translate(0.0, 0.0, -0.02); // To avoid conflict with the axeshelper
        //let calcadaMaterial = new THREE.MeshLambertMaterial({color:"rgb(200, 200, 200)"}); // light grey
        var posicaoCalcada = [(-tamanho/3),0,(tamanho/3)];

        var index = 0;

        for(let i=0;i<9;i++){
            calcada[i] = new THREE.Mesh(calcadaGeometry, calcadaMaterial);
            
            if(i<3){
                calcada[i].position.set(posicaoCalcada[0],posicaoCalcada[i%3],0);
            } else if (i<6){
                calcada[i].position.set(posicaoCalcada[1],posicaoCalcada[i%3],0);
            } else {
                calcada[i].position.set(posicaoCalcada[2],posicaoCalcada[i%3],0);
            }   
            
            calcada[i].material.map = calcadaTexture;
            calcada[i].receiveShadow = true;

                    // create a cube
            var cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            var cubeMaterial = new THREE.MeshNormalMaterial();
            var cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
            var cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
            var cube3 = new THREE.Mesh(cubeGeometry, cubeMaterial);
            var cube4 = new THREE.Mesh(cubeGeometry, cubeMaterial);
            // position the cube
            cube1.position.set((tamanhoQuadrado/4), (tamanhoQuadrado/4), 2.0);
            cube2.position.set((tamanhoQuadrado/4), -(tamanhoQuadrado/4), 2.0);
            cube3.position.set(-(tamanhoQuadrado/4), (tamanhoQuadrado/4), 2.0);
            cube4.position.set(-(tamanhoQuadrado/4),-(tamanhoQuadrado/4), 2.0);
            calcada[i].add(cube1);
            calcada[i].add(cube2);
            calcada[i].add(cube3);
            calcada[i].add(cube4);

            if(i!=4){
                gerarPredios(cube1,index%6);
                index++;
    
                gerarPredios(cube2,index%6);
                index++;
    
                gerarPredios(cube3,index%6);
                index++;
    
                gerarPredios(cube4,index%6);
                index++;
            } else {
                modeloPraca(calcada[i]);
            }


            plane.add(calcada[i]);

            
        }
    }

    function gerarPredios(cubo,index){
        switch (index){
            case 0:
                modeloPredio1(cubo);
                break;
            case 1:
                modeloPredio2(cubo);
                break;
            case 2:
                modeloPredio3(cubo);
                break;
            case 3:
                modeloPredio4(cubo);
                break;
            case 4:
                modeloPredio5(cubo);
                break;
            case 5:
                modeloPredio6(cubo);
                break;
        }

    }

    function modeloPredio1(cubo){
        
        var paredeGeometry = new THREE.PlaneGeometry(tamanho/9, 100);
        var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        
        const predioTexture = loader.load('../../T3/textures/city/predio1.jpg');
        

        //marbleTexture.repeat.set( 4, 4 ); 

        const predioMaterial = new THREE.MeshLambertMaterial({
        map: predioTexture
        });

        const tetoTexture = loader.load('../../T3/textures/city/cimento.jpg');
        const tetoMaterial = new THREE.MeshLambertMaterial({
            map: tetoTexture
            });

        var frontpredioMaterial = new THREE.MeshPhongMaterial( { map: predioTexture, side: THREE.FrontSide } );
        var backpredioMaterial = new THREE.MeshPhongMaterial( { map: predioTexture, side: THREE.BackSide } );

        var materials = [ frontpredioMaterial, backpredioMaterial ];

        const woodTopMaterial = new THREE.MeshLambertMaterial({
        map: predioTexture
        });

        var parede = [];

        parede[0] = new THREE.Mesh(chaoGeometry, predioMaterial);
        parede[0].side = THREE.DoubleSide;
        parede[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            parede[i] = new THREE.Mesh(paredeGeometry, predioMaterial);
            parede[i].side = THREE.DoubleSide;
            parede[i].material.side = THREE.DoubleSide;
            parede[i].castShadow = true;
        }

        //topo
        parede[5] = new THREE.Mesh(tetoGeometry, tetoMaterial);
        parede[5].side = THREE.DoubleSide;
        parede[5].material.side = THREE.DoubleSide;
        parede[5].receiveShadow = true;

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

        parede[5].position.set(0, 0.0, 94);
        //Posicao do edificio
        parede[0].position.set(0, 0, 0);
        parede[0].add(parede[1]);
        parede[0].add(parede[2]);
        parede[0].add(parede[3]);
        parede[0].add(parede[4]);
        parede[0].add(parede[5]);

        //parede[0].geometry.center();
        cubo.add(parede[0]);
    }

    function modeloPredio2(cubo){
        var altura = 50;
        var paredeGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        
        const marbleTexture = loader.load('../../assets/textures/marble.png');
        const predioTexture = loader.load('../../T3/textures/city/predio2.jpg');
        const predio2Texture = loader.load('../../T3/textures/city/predio2.jpg');
        const tetoTexture = loader.load('../../T3/textures/city/cimento.jpg');

        //marbleTexture.repeat.set( 4, 4 ); 

        const predioMaterial = new THREE.MeshLambertMaterial({
        map: predioTexture
        });

        const predio2Material = new THREE.MeshLambertMaterial({
            map: predio2Texture
            });

        const tetoMaterial = new THREE.MeshLambertMaterial({
            map: tetoTexture
            });

        //marbleTexture.repeat.set( 4, 4 ); 

        const marbleMaterial = new THREE.MeshLambertMaterial({
        map: marbleTexture
        });

        var frontMarbleMaterial = new THREE.MeshPhongMaterial( { map: predioTexture, side: THREE.FrontSide } );
        var backMarbleMaterial = new THREE.MeshPhongMaterial( { map: predioTexture, side: THREE.BackSide } );

        var materials = [ frontMarbleMaterial, backMarbleMaterial ];

        const woodTopMaterial = new THREE.MeshLambertMaterial({
        map: marbleTexture
        });

        var parede = [];

        parede[0] = new THREE.Mesh(chaoGeometry, predioMaterial);
        parede[0].side = THREE.DoubleSide;
        parede[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            parede[i] = new THREE.Mesh(paredeGeometry, predioMaterial);
            parede[i].side = THREE.DoubleSide;
            parede[i].material.side = THREE.DoubleSide;
            parede[i].castShadow = true;
        }

        //topo
        parede[5] = new THREE.Mesh(tetoGeometry, tetoMaterial);
        parede[5].side = THREE.DoubleSide;
        parede[5].material.side = THREE.DoubleSide;
        parede[5].receiveShadow = true;

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
        parede[0].position.set(0, 0, -25);
        parede[0].add(parede[1]);
        parede[0].add(parede[2]);
        parede[0].add(parede[3]);
        parede[0].add(parede[4]);
        parede[0].add(parede[5]);


        //criação da torre
        var paredeTorre = [];
        var paredeTorreGeometry = new THREE.PlaneGeometry(tamanho/18, tamanho/18);
        //var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoTorreGeometry = new THREE.PlaneGeometry(tamanho/18, tamanho/18);
        //
        //c//onst marbleTexture = loader.load('../../assets/textures/marble.png');

        //marbleTexture.repeat.set( 4, 4 ); 

        /*
        const marbleMaterial = new THREE.MeshLambertMaterial({
        map: marbleTexture
        });

        var frontMarbleMaterial = new THREE.MeshPhongMaterial( { map: marbleTexture, side: THREE.FrontSide } );
        var backMarbleMaterial = new THREE.MeshPhongMaterial( { map: marbleTexture, side: THREE.BackSide } );

        var materials = [ frontMarbleMaterial, backMarbleMaterial ];

        const woodTopMaterial = new THREE.MeshLambertMaterial({
        map: marbleTexture
        });
*/
        //var paredeTorre = [];

        paredeTorre[0] = new THREE.Mesh(chaoGeometry, predio2Material);
        paredeTorre[0].side = THREE.DoubleSide;
        paredeTorre[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            paredeTorre[i] = new THREE.Mesh(paredeTorreGeometry, predio2Material);
            paredeTorre[i].side = THREE.DoubleSide;
            paredeTorre[i].material.side = THREE.DoubleSide;
        }

        //topo
        paredeTorre[5] = new THREE.Mesh(tetoTorreGeometry, tetoMaterial);
        paredeTorre[5].side = THREE.DoubleSide;
        paredeTorre[5].material.side = THREE.DoubleSide;
        paredeTorre[5].receiveShadow = true;

        //Formar um cubo
        paredeTorre[1].position.set(0.0, (tamanho/18)/2, (tamanho/18));
        paredeTorre[1].rotation.x = Math.PI / 2;
        paredeTorre[2].position.set(0.0, -(tamanho/18)/2, (tamanho/18));
        paredeTorre[2].rotation.x = Math.PI / 2;
        paredeTorre[3].position.set((tamanho/18)/2, 0.0, (tamanho/18));
        paredeTorre[3].rotation.x = Math.PI / 2;
        paredeTorre[3].rotation.y = Math.PI / 2;
        paredeTorre[4].position.set(-(tamanho/18)/2, 0.0, (tamanho/18));
        paredeTorre[4].rotation.x = Math.PI / 2;
        paredeTorre[4].rotation.y = Math.PI / 2;

        paredeTorre[5].position.set(0, 0.0, 33);
        //Posicao do edificio
        paredeTorre[0].position.set(0, 0, -11);
        paredeTorre[0].add(paredeTorre[1]);
        paredeTorre[0].add(paredeTorre[2]);
        paredeTorre[0].add(paredeTorre[3]);
        paredeTorre[0].add(paredeTorre[4]);
        paredeTorre[0].add(paredeTorre[5]);




        parede[5].add(paredeTorre[0]);
        cubo.add(parede[0]);
    }

    function modeloPredio3(cubo){
        
        var paredeGeometry = new THREE.PlaneGeometry(tamanho/9, 100);
        var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        
        const predioTexture = loader.load('../../T3/textures/city/predio3.jpg');
        const tetoTexture = loader.load('../../T3/textures/city/cimento.jpg');
        const heliportoTexture = loader.load('../../T3/textures/city/heliporto.jpg');
        const tetoMaterial = new THREE.MeshLambertMaterial({
            map: tetoTexture
            });
        //predioTexture.repeat.set( 4, 4 ); 

        const predioMaterial = new THREE.MeshStandardMaterial({
        map: predioTexture
        });

        var frontMarbleMaterial = new THREE.MeshStandardMaterial( { map: predioTexture, side: THREE.FrontSide } );
        var backMarbleMaterial = new THREE.MeshStandardMaterial( { map: predioTexture, side: THREE.BackSide } );

        var materials = [ frontMarbleMaterial, backMarbleMaterial ];

        const woodTopMaterial = new THREE.MeshLambertMaterial({
        map: heliportoTexture
        });

        var parede = [];

        parede[0] = new THREE.Mesh(chaoGeometry, predioMaterial);
        parede[0].side = THREE.DoubleSide;
        parede[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            parede[i] = new THREE.Mesh(paredeGeometry, predioMaterial);
            parede[i].side = THREE.DoubleSide;
            parede[i].material.side = THREE.DoubleSide;
        }

        //topo
        parede[5] = new THREE.Mesh(tetoGeometry, tetoMaterial);
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

        parede[5].position.set(0, 0.0, 94);
        //Posicao do edificio
        parede[0].position.set(0, 0, 0);
        parede[0].add(parede[1]);
        parede[0].add(parede[2]);
        parede[0].add(parede[3]);
        parede[0].add(parede[4]);
        parede[0].add(parede[5]);

        cubo.add(parede[0]);


        //topo
        var altura = 10;
        var raio =18;
        //texture


        // create a cylinder
        var cylinderGeometry = new THREE.CylinderGeometry(18, 18, altura, 32, 32, true);
        var cylinder = new THREE.Mesh(cylinderGeometry, tetoMaterial);
        cylinder.material.side = THREE.DoubleSide;

        // create a circle
        var circleGeometry = new THREE.CircleGeometry(raio,32);
        var circle = new THREE.Mesh(circleGeometry, woodTopMaterial);
        //var circle2 = new THREE.Mesh(circleGeometry, woodTopMaterial);

        // position the cylinder
        cylinder.position.set(0.0, 0.0, altura/2);
        cylinder.rotation.x = Math.PI / 2;
        circle.position.set(0.0, altura/2, 0);
        circle.rotation.x = -Math.PI / 2;
        //circle2.position.set(0.0, -5, 0);
        //circle2.rotation.x = Math.PI / 2;

        cylinder.add(circle);
        circle.receiveShadow = true;
        //cylinder.add(circle2);

        parede[5].add(cylinder);
    }

    //Prédio Cilindro
    function modeloPredio4(cubo){
        
        var altura = 80;
        var raio = 18;

        //texture
        
        const woodTopTexture = loader.load('../../T3/textures/city/cimento.jpg');
        const predioTexture = loader.load('../../T3/textures/city/predio4.jpg');
        

        //marbleTexture.repeat.set( 4, 4 ); 

        const predioMaterial = new THREE.MeshLambertMaterial({
        map: predioTexture
        });

        const woodTopMaterial = new THREE.MeshLambertMaterial({
        map: woodTopTexture
        });


        // create a cylinder
        var cylinderGeometry = new THREE.CylinderGeometry(18, 18, altura, 32, 32, true);
        var cylinder = new THREE.Mesh(cylinderGeometry, predioMaterial);
        cylinder.material.side = THREE.DoubleSide;

        // create a circle
        var circleGeometry = new THREE.CircleGeometry(raio,32);
        var circle = new THREE.Mesh(circleGeometry, woodTopMaterial);
        //var circle2 = new THREE.Mesh(circleGeometry, woodTopMaterial);

        // position the cylinder
        cylinder.position.set(0.0, 0.0, altura/2-2);
        cylinder.rotation.x = Math.PI / 2;
        circle.position.set(0.0, altura/2, 0);
        circle.rotation.x = -Math.PI / 2;
        //circle2.position.set(0.0, -5, 0);
        //circle2.rotation.x = Math.PI / 2;
        circle.receiveShadow = true;
        cylinder.add(circle);
        //cylinder.add(circle2);

        cubo.add(cylinder);
    }

    function modeloPredio5(cubo){
        
        var altura = 50;
        var paredeGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        
        const marbleTexture = loader.load('../../assets/textures/marble.png');
        const predioTexture = loader.load('../../T3/textures/city/predio5.jpg');
        const grafiteTexture = loader.load('../../T3/textures/city/grafite.jpg');
        

        //marbleTexture.repeat.set( 4, 4 ); 

        const predioMaterial = new THREE.MeshLambertMaterial({
        map: predioTexture
        });

        const grafiteMaterial = new THREE.MeshLambertMaterial({
            map: grafiteTexture
        });

        const tetoTexture = loader.load('../../T3/textures/city/cimento.jpg');
        const tetoMaterial = new THREE.MeshLambertMaterial({
            map: tetoTexture
            });
        
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

        parede[0] = new THREE.Mesh(chaoGeometry, predioMaterial);
        parede[0].side = THREE.DoubleSide;
        parede[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            parede[i] = new THREE.Mesh(paredeGeometry, predioMaterial);
            parede[i].side = THREE.DoubleSide;
            parede[i].material.side = THREE.DoubleSide;
            parede[i].castShadow = true;
        }

        //topo
        parede[5] = new THREE.Mesh(tetoGeometry, tetoMaterial);
        parede[5].side = THREE.DoubleSide;
        parede[5].material.side = THREE.DoubleSide;
        parede[5].receiveShadow = true;

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
        parede[0].position.set(0, 0, -25);
        parede[0].add(parede[1]);
        parede[0].add(parede[2]);
        parede[0].add(parede[3]);
        parede[0].add(parede[4]);
        parede[0].add(parede[5]);


        //criação da torre
        var paredeTorre = [];
        var paredeMaiorTorreGeometry = new THREE.PlaneGeometry(tamanho/9, tamanho/9);
        var paredeMenorTorreGeometry = new THREE.PlaneGeometry(tamanho/18, tamanho/9);
        //var chaoGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var tetoTorreGeometry = new THREE.PlaneGeometry(tamanho/18, tamanho/9);
        //
        //c//onst marbleTexture = loader.load('../../assets/textures/marble.png');

        //marbleTexture.repeat.set( 4, 4 ); 

        /*
        const marbleMaterial = new THREE.MeshLambertMaterial({
        map: marbleTexture
        });

        var frontMarbleMaterial = new THREE.MeshPhongMaterial( { map: marbleTexture, side: THREE.FrontSide } );
        var backMarbleMaterial = new THREE.MeshPhongMaterial( { map: marbleTexture, side: THREE.BackSide } );

        var materials = [ frontMarbleMaterial, backMarbleMaterial ];

        const woodTopMaterial = new THREE.MeshLambertMaterial({
        map: marbleTexture
        });
*/
        //var paredeTorre = [];

        paredeTorre[0] = new THREE.Mesh(chaoGeometry, predioMaterial);
        paredeTorre[0].side = THREE.DoubleSide;
        paredeTorre[0].material.side = THREE.DoubleSide;

        for(let i=1;i<5;i++){
            
            if(i%2==0){
                paredeTorre[i] = new THREE.Mesh(paredeMaiorTorreGeometry, predioMaterial);
                paredeTorre[i].side = THREE.DoubleSide;
                paredeTorre[i].material.side = THREE.DoubleSide;
            } else {
                paredeTorre[i] = new THREE.Mesh(paredeMenorTorreGeometry, grafiteMaterial);
                paredeTorre[i].side = THREE.DoubleSide;
                paredeTorre[i].material.side = THREE.DoubleSide;
            }
            paredeTorre[i].castShadow = true;

        }

        //topo
        paredeTorre[5] = new THREE.Mesh(tetoTorreGeometry, tetoMaterial);
        paredeTorre[5].side = THREE.DoubleSide;
        paredeTorre[5].material.side = THREE.DoubleSide;
        paredeTorre[5].receiveShadow = true;

        //Formar um cubo
        paredeTorre[1].position.set(0.0, (tamanho/18), (tamanho/18));
        paredeTorre[1].rotation.x = Math.PI / 2;
        
        paredeTorre[2].position.set((tamanho/18)/2, 0, (tamanho/18));
        paredeTorre[2].rotation.x = Math.PI / 2;
        paredeTorre[2].rotation.y = Math.PI / 2;
        paredeTorre[3].position.set(0, -(tamanho/18), (tamanho/18));
        paredeTorre[3].rotation.x = Math.PI / 2;
        //paredeTorre[3].rotation.y = Math.PI / 2;
        paredeTorre[4].position.set(-(tamanho/18)/2, 0.0, (tamanho/18));
        paredeTorre[4].rotation.x = Math.PI / 2;
        paredeTorre[4].rotation.y = Math.PI / 2;

        paredeTorre[5].position.set(0, 0.0, 44);
        //Posicao do edificio
        paredeTorre[0].position.set((tamanho/18)/2, 0, 0);
        paredeTorre[0].add(paredeTorre[1]);
        paredeTorre[0].add(paredeTorre[2]);
        paredeTorre[0].add(paredeTorre[3]);
        paredeTorre[0].add(paredeTorre[4]);
        paredeTorre[0].add(paredeTorre[5]);

        parede[5].add(paredeTorre[0]);
        cubo.add(parede[0]);
    }

    function modeloPredio6(cubo){
        var altura = 60;
        var raio = 12;

        //texture
        

        const predioTexture = loader.load('../../T3/textures/city/predio6.jpg');
        const predioMaterial = new THREE.MeshLambertMaterial({
            map: predioTexture
        });
        const predio2Texture = loader.load('../../T3/textures/city/predio65.jpg');
        const predio2Material = new THREE.MeshLambertMaterial({
            map: predio2Texture
        });
    
        const tetoTexture = loader.load('../../T3/textures/city/cimento.jpg');
        const tetoMaterial = new THREE.MeshLambertMaterial({
            map: tetoTexture
        });


        // create a cylinder
        var cylinderGeometry = new THREE.CylinderGeometry(raio, raio, altura, 32, 32, true);
        var cylinder = new THREE.Mesh(cylinderGeometry, predioMaterial);
        cylinder.material.side = THREE.DoubleSide;

        // create a circle
        var circleGeometry = new THREE.CircleGeometry(raio,32);
        var circle = new THREE.Mesh(circleGeometry, tetoMaterial);
        //var circle2 = new THREE.Mesh(circleGeometry, woodTopMaterial);

        // position the cylinder
        cylinder.position.set(-raio*1.2, 0.0, altura/2);
        cylinder.rotation.x = Math.PI / 2;
        circle.position.set(0.0, altura/2, 0);
        circle.rotation.x = -Math.PI / 2;
        //circle2.position.set(0.0, -5, 0);
        //circle2.rotation.x = Math.PI / 2;

        circle.receiveShadow = true;
        cylinder.add(circle);
        //cylinder.add(circle2);

        //Predio 2
        var cylinder2 = new THREE.Mesh(cylinderGeometry, predio2Material);
        cylinder2.material.side = THREE.DoubleSide;

        // create a circle
       // var circleGeometry = new THREE.CircleGeometry(raio,32);
        var circle2 = new THREE.Mesh(circleGeometry, tetoMaterial);
        //var circle2 = new THREE.Mesh(circleGeometry, woodTopMaterial);

        // position the cylinder
        cylinder2.position.set(raio*1.2, 0.0, altura/2);
        cylinder2.rotation.x = Math.PI / 2;
        circle2.position.set(0.0, altura/2, 0);
        circle2.rotation.x = -Math.PI / 2;
        //circle2.position.set(0.0, -5, 0);
        //circle2.rotation.x = Math.PI / 2;
        circle2.receiveShadow = true;
        cylinder2.add(circle2);
        var cubeGeometry = new THREE.BoxGeometry(20, 15, 20);
        var cubeMaterial = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(cubeGeometry, tetoMaterial);

        cube.add(cylinder);
        cube.add(cylinder2);
        cube.position.set(0,0,-4);
        cubo.add(cube);
        cube.receiveShadow = true;
    }

    function modeloPraca(cubo){
        //-----------------------------------//
        // CITY CONFIGURATION BEGIN          //
        //-----------------------------------//
        // create the city ground plane
        var cityPlaneGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var cityPlaneMaterial = new THREE.MeshLambertMaterial({
            //color: "rgba(150, 150, 150)", // light grey
            color: "black" // TODO change the color
            //TODO apply texture?
        });
        var cityPlane = new THREE.Mesh(cityPlaneGeometry, cityPlaneMaterial);
        // add the ground plane to the scene
        cityPlane.receiveShadow = true; // enables shadows
        cityPlane.position.set(0.0, 0.0, 0.02);
        cubo.add(cityPlane);
        //cityPlane.add(mesh1);
        //-----------------------------------//
        // CITY CONFIGURATION END            //
        //-----------------------------------//

        //-----------------------------------//
        // STREETS CONFIGURATION BEGIN       //
        //-----------------------------------//
        // Landing track (pista de pouso)
        var streetLenghtX = 20.0; // largura
        var streetLenghtY = 120.0; // comprimento
        var mainStreet = [];

        var streetGeometry = new THREE.BoxGeometry(streetLenghtX, streetLenghtY, 0.01);
        var streetMaterial = new THREE.MeshLambertMaterial({color:"rgb(60, 60, 60)"}); // light grey
        // create streets
        /*var street = new THREE.Mesh(streetGeometry, streetMaterial);
        street.position.set(0.0, -50.0, 0.0);
        street.receiveShadow = true;
        groundPlane.add(street);*/

        // create the main street
        for (let i = 0; i < 4; i++) {
            mainStreet[i] = new THREE.Mesh(streetGeometry, streetMaterial);
            if (i%2 == 0) {
                mainStreet[i].rotateZ(degreesToRadians(90));
            }
            //mainStreet[i].rotateZ(degreesToRadians(90)*i);
            mainStreet[i].receiveShadow = true;
            //cityPlane.add(mainStreet[i]);
        }
        mainStreet[0].position.set(0.0, 50.0, 0.02);
        mainStreet[1].position.set(50.0, 0.0, 0.02);
        mainStreet[2].position.set(0.0, -50.0, 0.02);
        mainStreet[3].position.set(-50.0, 0.0, 0.02);

        // create the main square ground plane
        var mainSquarePlaneGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var mainSquarePlaneMaterial = new THREE.MeshLambertMaterial({
            //color: "rgba(150, 150, 150)", // light grey
            color: "rgb(80, 80, 80)" // TODO change the color
        });
        var mainSquarePlane = new THREE.Mesh(mainSquarePlaneGeometry, mainSquarePlaneMaterial);
        // add the ground plane to the scene
        mainSquarePlane.receiveShadow = true; // enables shadows
        mainSquarePlane.position.set(0.0, 0.0, 0.03);
        cubo.add(mainSquarePlane);

        //-----------------------------------//
        // STREETS CONFIGURATION END         //
        //-----------------------------------//

        var scale = 1.0; // adjust external objects scale
// Police car

// instantiate a object loader
const policeCarLoader = new OBJLoader();
// instantiate a texture loader
const policeCarMtlLoader = new MTLLoader();
policeCarMtlLoader.load('models/cars/police-car.mtl', (mtl2) => {
  mtl2.preload();
  policeCarLoader.setMaterials(mtl2);

// load a resource
policeCarLoader.load(
	// resource URL
	'models/cars/police-car.obj',
	// called when resource is loaded
	function ( car ) {
        car.position.set(20, 30, 0.03);
        car.rotateX(degreesToRadians(90));
        car.rotateY(degreesToRadians(30));
        //let sc = new THREE.Vector3(1.0, 1.0, 1.0);
        // object scale
        car.scale.set(  3.0 * scale,
                        3.0 * scale,
                        3.0 * scale);
        let car2 = car.clone();
        car2.position.set(25, 10, 0.03);
        //car2.rotateX(degreesToRadians(90));
        car2.rotateY(degreesToRadians(-120));
        // object scale
        car2.scale.set(3.0 * scale,
            3.0 * scale,
            3.0 * scale);
		mainSquarePlane.add( car );
        mainSquarePlane.add( car2 );

	},
	// called when loading is in progresses
	function ( xhr ) {

		//console.log( 'Police car ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Police car loading error' );

	}
)
});

// Racing car

// instantiate a object loader
const racingCarLoader = new OBJLoader();
// instantiate a texture loader
const racingCarMtlLoader = new MTLLoader();
racingCarMtlLoader.load('models/cars/racing-car.mtl', (mtl3) => {
  mtl3.preload();
  racingCarLoader.setMaterials(mtl3);

// load a resource
racingCarLoader.load(
	// resource URL
	'models/cars/racing-car.obj',
	// called when resource is loaded
	function ( car ) {
        car.position.set(9, 11, 0.03);
        car.rotateX(degreesToRadians(90));
        car.rotateY(degreesToRadians(60));
        //let sc = new THREE.Vector3(1.0, 1.0, 1.0);
        // object scale
        car.scale.set(  3.0 * scale,
                        3.0 * scale,
                        3.0 * scale);
        mainSquarePlane.add( car );
	},
	// called when loading is in progresses
	function ( xhr ) {

		//console.log( 'Racing car ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Racing car loading error' );

	}
)
});

// Owl statue

// instantiate a object loader
const statueLoader = new OBJLoader();
// instantiate a texture loader
const statueMtlLoader = new MTLLoader();
statueMtlLoader.load('models/architecture/owl-top-hat.mtl', (mtl4) => {
  mtl4.preload();
  statueLoader.setMaterials(mtl4);

// load a resource
statueLoader.load(
	// resource URL
	'models/architecture/owl-top-hat.obj',
	// called when resource is loaded
	function ( statue ) {
        //statue.position.set(20, 0, 0);
        statue.rotateX(degreesToRadians(90));
        // object scale
        statue.scale.set(  0.5 * scale,
                        0.5 * scale,
                        0.5 * scale);
		mainSquarePlane.add( statue );

	},
	// called when loading is in progresses
	function ( xhr ) {

		//console.log( 'Statue ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'Statue loading error' );

	}
    )
    });


    }
