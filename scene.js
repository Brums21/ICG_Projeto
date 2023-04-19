import * as THREE from 'three';
import {helper} from './helper.js';
import { GLTFLoader } from "addons/GLTFLoader.js";

"use strict";

const sceneElements = {
    sceneGraph: null,
    camera: null,
    control: null,  
    renderer: null, 
    car: null
};

helper.initEmptyScene(sceneElements);
load3DObjects(sceneElements.sceneGraph);
requestAnimationFrame(computeFrame);

window.addEventListener('resize', resizeWindow);

//To keep track of the keyboard - WASD
var keyD = false, keyA = false, keyS = false, keyW = false;
document.addEventListener('keydown', onDocumentKeyDown, false);
document.addEventListener('keyup', onDocumentKeyUp, false);

var cameraType = "ORBIT"; // the camara should follow an object

// Update render image size and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = true;
            break;
        case 83: //s
            keyS = true;
            break;
        case 65: //a
            keyA = true;
            break;
        case 87: //w
            keyW = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 68: //d
            keyD = false;
            break;
        case 83: //s
            keyS = false;
            break;
        case 65: //a
            keyA = false;
            break;
        case 87: //w
            keyW = false;
            break;
    }
}

//////////////////////////////////////////////////////////////////

// start creating a car object:

function createWheel(){
    const geometry = new THREE.CylinderGeometry(2, 2, 1.5, 64);
    const material = new THREE.MeshPhongMaterial({color: 0x77808f});
    const wheel = new THREE.Mesh(geometry, material);
    wheel.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2);
    wheel.position.y = 2;
    
    //shadows
    wheel.castShadow = true;
    wheel.receiveShadow = true;

    return wheel;
}

function createPassadeira(){
    //criar uma passadeira

    //uma faixa

    const passadeira = new THREE.Group();

    const geometry = new THREE.PlaneGeometry(12, 3, 50, 50);
    const texture = new THREE.TextureLoader().load('textures/road-strips.jpg');
   
    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.rotation = -Math.PI/2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(2,5);

    const material = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture}); //branco

    const faixa = new THREE.Mesh(geometry, material);

    faixa.rotation.x = -Math.PI/2;

    //supondo que isto esta em coordenadas (0,0,0)

    faixa.position.set(0, 0.1, -12);

    const faixa2 = faixa.clone();
    faixa2.position.set(0, 0.1, -6);

    const faixa3 = faixa.clone();
    faixa3.position.set(0, 0.1, 0);

    const faixa4 = faixa.clone();
    faixa4.position.set(0, 0.1, 6);

    const faixa5 = faixa.clone();
    faixa5.position.set(0, 0.1, 12);

    passadeira.add(faixa);
    passadeira.add(faixa2);
    passadeira.add(faixa3);
    passadeira.add(faixa4);
    passadeira.add(faixa5);
    
    return passadeira;

}

function createEntrocamento(){

    //criar um entrocamento -> uma cruz

    const entrocamento = new THREE.Group();

    //quadrado inicial
    let geometry = new THREE.PlaneGeometry(30, 30, 50, 50);

    const texture = new THREE.TextureLoader().load('textures/road-texture_n.jpg');
   
    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.rotation = -Math.PI/2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(3,3);

    const material = new THREE.MeshPhongMaterial({ map: texture });

    const plano1 = new THREE.Mesh(geometry, material);
    plano1.rotation.x = -Math.PI / 2;

    plano1.castShadow = true;
    plano1.receiveShadow = true;

    entrocamento.add(plano1);

    //partes dos lados do retangulo, para formar uma cruz, e adicionar passadeira em cada uma delas

    //cima
    geometry = new THREE.PlaneGeometry(30, 20, 50, 50);

    const texture1 = new THREE.TextureLoader().load('textures/road-texture_n.jpg');
   
    texture1.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture1.rotation = -Math.PI/2;
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    texture1.repeat.set(2,2); //texture ja estava definida

    const material1 = new THREE.MeshPhongMaterial({ map: texture1 });

    const plano2 = new THREE.Mesh(geometry, material1);
    plano2.rotation.x = -Math.PI / 2;

    plano2.position.set(0, 0, -25);

    const passadeira2 = createPassadeira();
    passadeira2.position.set(0, 0.2, -25);
    passadeira2.rotation.y = Math.PI/2;

    plano2.castShadow = true;
    plano2.receiveShadow = true;

    passadeira2.castShadow = true;
    passadeira2.receiveShadow = true;
    
    entrocamento.add(passadeira2);
    entrocamento.add(plano2);

    //baixo
    const plano3 = new THREE.Mesh(geometry, material1);
    plano3.rotation.x = -Math.PI / 2;

    plano3.position.set(0, 0, 25);

    const passadeira3 = createPassadeira();
    passadeira3.position.set(0, 0.2, 25);
    passadeira3.rotation.y = Math.PI/2;

    plano3.castShadow = true;
    plano3.receiveShadow = true;

    passadeira3.castShadow = true;
    passadeira3.receiveShadow = true;
    
    entrocamento.add(passadeira3);
    entrocamento.add(plano3);

    //esquerda
    geometry = new THREE.PlaneGeometry(30, 20, 50, 50);

    const plano4 = new THREE.Mesh(geometry, material1);
    plano4.rotation.x = -Math.PI / 2;
    plano4.rotation.z = Math.PI/2;

    plano4.position.set(-25, 0, 0);

    const passadeira4 = createPassadeira();
    passadeira4.position.set(-25, 0.2, 0);

    plano4.castShadow = true;
    plano4.receiveShadow = true;

    passadeira4.castShadow = true;
    passadeira4.receiveShadow = true;
    
    entrocamento.add(passadeira4);
    entrocamento.add(plano4);

    //direita
    const plano5 = new THREE.Mesh(geometry, material1);
    plano5.rotation.x = -Math.PI / 2;
    plano5.rotation.z = Math.PI/2;

    plano5.position.set(25, 0, 0);

    const passadeira5 = createPassadeira();
    passadeira5.position.set(25, 0.2, 0);

    plano5.castShadow = true;
    plano5.receiveShadow = true;

    passadeira5.castShadow = true;
    passadeira5.receiveShadow = true;
    
    entrocamento.add(passadeira5);
    entrocamento.add(plano5);

    return entrocamento;
}

function createCruzamento(){

    const cruz = new THREE.Group();

    const geometry = new THREE.PlaneGeometry(30, 26, 50, 50);

    const texture1 = new THREE.TextureLoader().load('textures/road-texture_n.jpg');
   
    texture1.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture1.rotation = -Math.PI/2;
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    texture1.repeat.set(2,2); //texture ja estava definida

    const material1 = new THREE.MeshPhongMaterial({ map: texture1 });

    const plano2 = new THREE.Mesh(geometry, material1);
    plano2.rotation.x = -Math.PI / 2;

    plano2.position.set(0, 0, -25);

    plano2.castShadow = true;
    plano2.receiveShadow = true;

    const passadeira2 = createPassadeira();
    passadeira2.position.set(0, 0, -25);
    passadeira2.rotation.y = Math.PI/2;

    passadeira2.receiveShadow = true;
    passadeira2.receiveShadow = true;
    
    cruz.add(passadeira2);
    cruz.add(plano2);


    return cruz;
}

function createGround(){

    const ground = new THREE.Group();

    //seccao1
    const texture1 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    texture1.repeat.set(5,2);

    const geometry1 = new THREE.PlaneGeometry(400-15, 160-15, 50, 50);
    const material1 = new THREE.MeshPhongMaterial({map: texture1});
    const chao1 = new THREE.Mesh(geometry1, material1);
    chao1.rotation.x = -Math.PI/2;
    chao1.position.set(200+7.5,0,-320-7.5);

    //seccao2
    const texture2 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.set(1,3);
    

    const geometry2 = new THREE.PlaneGeometry(100-15, 240-30, 50, 50);
    const material2 = new THREE.MeshPhongMaterial({map: texture2});
    const chao2 = new THREE.Mesh(geometry2, material2);
    chao2.rotation.x = -Math.PI/2;
    chao2.position.set(350+7.5,0,-120);

    //seccao3
    const texture3 = new THREE.TextureLoader().load('textures/ground.jpg');
    
    texture3.wrapS = THREE.RepeatWrapping;
    texture3.wrapT = THREE.RepeatWrapping;
    texture3.repeat.set(10, 10);

    const geometry3 = new THREE.PlaneGeometry(270, 210, 50, 50);
    const material3 = new THREE.MeshPhongMaterial({map: texture3});
    material3.color = new THREE.Color(0.8, 0.8, 0.8);
    const chao3 = new THREE.Mesh(geometry3, material3);
    chao3.rotation.x = -Math.PI/2;
    chao3.position.set(150,0,-120);

    //seccao4

    const texture4 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture4.wrapS = THREE.RepeatWrapping;
    texture4.wrapT = THREE.RepeatWrapping;
    texture4.repeat.set(1,4);

    const geometry4 = new THREE.PlaneGeometry(100-15, 400-15, 50, 50);
    const material4 = new THREE.MeshPhongMaterial({map: texture4});
    const chao4 = new THREE.Mesh(geometry4, material4);
    chao4.rotation.x = -Math.PI/2;
    chao4.position.set(350+7.5,0,200+7.5);

    //seccao5

    const texture5 = new THREE.TextureLoader().load('textures/ground.jpg');

    texture5.wrapS = THREE.RepeatWrapping;
    texture5.wrapT = THREE.RepeatWrapping;
    texture5.repeat.set(10, 10);

    const geometry5 = new THREE.PlaneGeometry(270, 210, 50, 50);
    const material5 = new THREE.MeshPhongMaterial({map: texture5});
    material5.color = new THREE.Color(0.8, 0.8, 0.8);
    const chao5 = new THREE.Mesh(geometry5, material5);
    chao5.rotation.x = -Math.PI/2;
    chao5.position.set(150,0,120);

    //seccao6

    const texture6 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture6.wrapS = THREE.RepeatWrapping;
    texture6.wrapT = THREE.RepeatWrapping;
    texture6.repeat.set(3,2);

    const geometry6 = new THREE.PlaneGeometry(300-30, 160-15, 50, 50);
    const material6 = new THREE.MeshPhongMaterial({map: texture6});
    const chao6 = new THREE.Mesh(geometry6, material6);
    chao6.rotation.x = -Math.PI/2;
    chao6.position.set(150,0,320+7.5);

    //seccao7

    const texture7 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture7.wrapS = THREE.RepeatWrapping;
    texture7.wrapT = THREE.RepeatWrapping;
    texture7.repeat.set(3,2);

    const geometry7 = new THREE.PlaneGeometry(300-30, 160-15, 50, 50);
    const material7 = new THREE.MeshPhongMaterial({map: texture7});
    const chao7 = new THREE.Mesh(geometry7, material7);
    chao7.rotation.x = -Math.PI/2;
    chao7.position.set(-150,0,-320-7.5);

    //seccao8

    const texture8 = new THREE.TextureLoader().load('textures/ground.jpg');

    texture8.wrapS = THREE.RepeatWrapping;
    texture8.wrapT = THREE.RepeatWrapping;
    texture8.repeat.set(10, 10);

    const geometry8 = new THREE.PlaneGeometry(300-30, 240-30, 50, 50);
    const material8 = new THREE.MeshPhongMaterial({map: texture8});
    material8.color = new THREE.Color(0.8, 0.8, 0.8);
    const chao8 = new THREE.Mesh(geometry8, material8);
    chao8.rotation.x = -Math.PI/2;
    chao8.position.set(-150,0,-120);

    //seccao9

    const texture9 = new THREE.TextureLoader().load('textures/ground.jpg');

    texture9.wrapS = THREE.RepeatWrapping;
    texture9.wrapT = THREE.RepeatWrapping;
    texture9.repeat.set(10, 10);

    const geometry9 = new THREE.PlaneGeometry(300-30, 240-30, 50, 50);
    const material9 = new THREE.MeshPhongMaterial({map: texture9});
    material9.color = new THREE.Color(0.8, 0.8, 0.8);
    const chao9 = new THREE.Mesh(geometry9, material9);
    chao9.rotation.x = -Math.PI/2;
    chao9.position.set(-150,0,120);

    //seccao10

    const texture10 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture10.wrapS = THREE.RepeatWrapping;
    texture10.wrapT = THREE.RepeatWrapping;
    texture10.repeat.set(3,2);

    const geometry10 = new THREE.PlaneGeometry(300-30, 160-15, 50, 50);
    const material10 = new THREE.MeshPhongMaterial({map: texture10});
    const chao10 = new THREE.Mesh(geometry10, material10);
    chao10.rotation.x = -Math.PI/2;
    chao10.position.set(-150,0,320+7.5);

    //seccao11

    const texture11 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture11.wrapS = THREE.RepeatWrapping;
    texture11.wrapT = THREE.RepeatWrapping;
    texture11.repeat.set(1,2);

    const geometry11 = new THREE.PlaneGeometry(100-15, 160-15, 50, 50);
    const material11 = new THREE.MeshPhongMaterial({map: texture11});
    const chao11 = new THREE.Mesh(geometry11, material11);
    chao11.rotation.x = -Math.PI/2;
    chao11.position.set(-350-7.5,0,-320-7.5);

    //seccao12

    const texture12 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture12.wrapS = THREE.RepeatWrapping;
    texture12.wrapT = THREE.RepeatWrapping;
    texture12.repeat.set(1,5);

    const geometry12 = new THREE.PlaneGeometry(100-15, 480-30, 50, 50);
    const material12 = new THREE.MeshPhongMaterial({map: texture12});
    const chao12 = new THREE.Mesh(geometry12, material12);
    chao12.rotation.x = -Math.PI/2;
    chao12.position.set(-350-7.5,0,0);

    //seccao13
    const texture13 = new THREE.TextureLoader().load('textures/grass.jpg');

    texture13.wrapS = THREE.RepeatWrapping;
    texture13.wrapT = THREE.RepeatWrapping;
    texture13.repeat.set(1,2);

    const geometry13 = new THREE.PlaneGeometry(100-15, 160-15, 50, 50);
    const material13 = new THREE.MeshPhongMaterial({map: texture13});
    const chao13 = new THREE.Mesh(geometry13, material13);
    chao13.rotation.x = -Math.PI/2;
    chao13.position.set(-350-7.5,0,320+7.5);

    ground.add(chao1);
    ground.add(chao2);
    ground.add(chao3);
    ground.add(chao4);
    ground.add(chao5);
    ground.add(chao6);
    ground.add(chao7);
    ground.add(chao8);
    ground.add(chao9);
    ground.add(chao10);
    ground.add(chao11);
    ground.add(chao12);
    ground.add(chao13);


    return ground;
}

function createRoad(){

    const road = new THREE.Group();

    let geometry = new THREE.PlaneGeometry(800,30,500,500); 
    const texture = new THREE.TextureLoader().load('textures/road-texture.jpg');

    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.rotation = -Math.PI/2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1,20);

    let material = new THREE.MeshPhongMaterial({ map: texture });

    //road1
    const road1 = new THREE.Mesh(geometry, material);
    road1.position.set(0, 0, -240);
    road1.rotation.x = -Math.PI / 2;

    road1.castShadow = true;
    road1.receiveShadow = true;

    road.add(road1);

    //road2
    const road2 = new THREE.Mesh(geometry, material);
    road2.rotation.z = Math.PI/2;
    road2.position.set(-300, 0, 0);
    road2.rotation.x = -Math.PI / 2;

    road2.castShadow = true;
    road2.receiveShadow = true;
    
    road.add(road2);

    const road3 = new THREE.Mesh(geometry, material);
    road3.rotation.z = Math.PI/2;
    road3.position.set(0, 0, 0);
    road3.rotation.x = -Math.PI / 2;

    road3.castShadow = true;
    road3.receiveShadow = true;

    road.add(road3);

    //alter geometry -> small roads

    geometry = new THREE.PlaneGeometry(685,30,500,500); 
    const road4 = new THREE.Mesh(geometry, material);
    road4.position.set(57.5, 0, 0);
    road4.rotation.x = -Math.PI / 2;

    road4.castShadow = true;
    road4.receiveShadow = true;

    road.add(road4);


    //road de cima
    geometry = new THREE.PlaneGeometry(625,30,500,500); 
    const road5 = new THREE.Mesh(geometry, material);
    road5.rotation.z = Math.PI/2;
    road5.position.set(300, 0, 87.5);
    road5.rotation.x = -Math.PI / 2;

    road5.castShadow = true;
    road5.receiveShadow = true;

    road.add(road5);

    geometry = new THREE.PlaneGeometry(685,30,500,500); 
    const road6 = new THREE.Mesh(geometry, material);
    road6.position.set(-57.5, 0, 240);
    road6.rotation.x = -Math.PI / 2;

    road6.castShadow = true;
    road6.receiveShadow = true;

    road.add(road6);

    //cruzamentos

    const cruz1 = createCruzamento();
    cruz1.position.set(250, 0.1, 240);
    cruz1.rotation.y = -Math.PI/2;
    road.add(cruz1);

    const cruz2 = createCruzamento();
    cruz2.position.set(300, 0.1, -190);
    road.add(cruz2);

    const cruz3 = createCruzamento();
    cruz3.position.set(-300, 0.1, 0);
    cruz3.rotation.y = -Math.PI/2;
    road.add(cruz3);


    //entrocamentos: -> pecas pretas com passadeiras

    const entrocamento1 = createEntrocamento();
    entrocamento1.position.set(300, 0.1, 0);

    road.add(entrocamento1);

    const entrocamento2 = createEntrocamento();
    entrocamento2.position.set(0, 0.1, -240);

    road.add(entrocamento2);

    const entrocamento3 = createEntrocamento();
    entrocamento3.position.set(-300, 0.1, -240);

    road.add(entrocamento3);

    const entrocamento4 = createEntrocamento();
    entrocamento4.position.set(-300, 0.1, 240);

    road.add(entrocamento4);

    const entrocamento5 = createEntrocamento();
    entrocamento5.position.set(0, 0.1, 240);

    road.add(entrocamento5);

    //na origem

    const entrocamento6 = createEntrocamento();
    entrocamento6.position.set(0, 0.1, 0);

    road.add(entrocamento6);


    road.castShadow = true;
    road.receiveShadow = true;
    
    return road;
}

function createFrontWheels(){
    const wheels = new THREE.Group();

    const frontWheelr = createWheel();
    const frontWheell = createWheel();

    frontWheelr.position.z = 5;
    frontWheelr.position.x = 2.5;

    wheels.add(frontWheell);

    frontWheell.position.z = 5;
    frontWheell.position.x = -2.5;

    wheels.add(frontWheelr);

    return wheels;
}

function createCar(){
    const car = new THREE.Group();  // if we move the group, we move the whole car!

    //rodas do carro

    const backWheelr = createWheel();
    const backWheell = createWheel();

    backWheelr.position.z = -5;
    backWheelr.position.x = 2.5;

    car.add(backWheelr);

    backWheell.position.z = -5;
    backWheell.position.x = -2.5;

    car.add(backWheell);

    //criar parte baixo do carro

    const cabinbot = new THREE.Mesh(
        new THREE.BoxGeometry(15, 4, 7),
        new THREE.MeshPhongMaterial({color: 0xe06666})
    );
    //adicionar textura a isto

    cabinbot.castShadow = true;
    cabinbot.receiveShadow = true;

    cabinbot.position.x = 0;
    cabinbot.position.y = 4;
    cabinbot.position.z = 0;

    cabinbot.rotateOnAxis(new THREE.Vector3(0,1,0), Math.PI/2);

    car.add(cabinbot);

    car.name = "carro"

    //TODO adicionar luzes ao carro

    const pointLight = new THREE.PointLight('rgb(255, 209, 43)', 0.8);
    pointLight.position.set(0, 8, 0);

    sceneElements.sceneGraph.add(pointLight.target);
    sceneElements.sceneGraph.add(pointLight);

    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;

    pointLight.name = "car_light";

    return car;

}

function createBuilding1(){
    const building = new THREE.Group();

    //get different textures for the building
    const texture1 = new THREE.TextureLoader().load('textures/stone-wall-1.jpg');
    
    texture1.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;
    
    const material = new THREE.MeshPhongMaterial( {map: texture1} );
    const material2 = new THREE.MeshPhysicalMaterial( {color: 0xC0C0C0, roughness: 0.5, transmission : 1});

    let geometry = new THREE.BoxGeometry(35, 70, 35);
    const outside = new THREE.Mesh( geometry, material2 );
    outside.position.y = 35;

    geometry = new THREE.BoxGeometry(6, 50, 6); // same height, different x and z
    const inside1 = new THREE.Mesh( geometry, material );
    inside1.position.y = 45;
    inside1.position.z = 16.25;
    inside1.position.x = 5;

    geometry = new THREE.BoxGeometry(6, 50, 6); // same height, different x and z
    const inside8 = new THREE.Mesh( geometry, material );
    inside8.position.y = 45;
    inside8.position.z = -16.25;
    inside8.position.x = 5;

    geometry = new THREE.BoxGeometry(6, 50, 6); // same height, different x and z
    const inside2 = new THREE.Mesh( geometry, material );
    inside2.position.y = 45;
    inside2.position.x = 20;

    geometry = new THREE.BoxGeometry(6, 70, 40); // same height, different x and z
    const inside3 = new THREE.Mesh( geometry, material );
    inside3.position.y = 35;
    inside3.position.x = -20;

    //retirar buracos
    geometry = new THREE.BoxGeometry(40, 5, 40);
    const inside4 = new THREE.Mesh( geometry, material);
    inside4.position.y = 32.5;

    const inside5 = inside4.clone();
    inside5.position.y = 50;

    //top and under
    const geometryup =  new THREE.BoxGeometry(40, 20, 40);
    const inside6 = new THREE.Mesh( geometryup, material);
    inside6.position.y = 10;

    const geometrydown =  new THREE.BoxGeometry(46, 7.5, 40);
    const inside7 = new THREE.Mesh( geometrydown, material);
    inside7.position.y = 70;

    //dor hole
    const door = new THREE.Group();

    const hole = new THREE.BoxGeometry(5, 15, 16);
    const hole_ = new THREE.Mesh(hole, material2);
    
    let geometry_door = new THREE.BoxGeometry(1, 15, 1);
    const material_door = new THREE.MeshPhongMaterial({color: 0xC0C0C0});
    const aba1 = new THREE.Mesh(geometry_door, material_door);
    aba1.position.x = 2.7;
    aba1.position.z = -7.5;

    const aba2 = aba1.clone();
    aba2.position.z = 7.5;

    const aba3 = aba1.clone();
    aba3.position.z = 0;

    door.add(hole_);
    door.add(aba1);
    door.add(aba2);
    door.add(aba3);

    door.position.y = 7.5;
    door.position.x = 17.55;

    building.add(outside);
    building.add(inside1);
    building.add(inside2);
    building.add(inside3);
    building.add(inside4);
    building.add(inside5);
    building.add(inside6);
    building.add(inside7);
    building.add(inside8);
    building.add(door);

    building.rotation.y = -Math.PI/2;
    return building;
}

function createSingleJanela(){

    const janela = new THREE.Group();

    const texture = new THREE.TextureLoader().load('textures/road-texture.jpg');

    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.rotation = -Math.PI/2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1,20);

    const geometry_jan = new THREE.PlaneGeometry(8,10); // janela retangular
    const material_jan = new THREE.MeshPhysicalMaterial( {color: 0x808080} );
    const janela1 = new THREE.Mesh(geometry_jan, material_jan);
    
    const geometry_outside = new THREE.BoxGeometry(6,8,1); // janela retangular
    const material_outside = new THREE.MeshPhysicalMaterial( {color: 0xC0C0C0, roughness: 0.5, transmission : 1} );
    const janela1_outside = new THREE.Mesh(geometry_outside, material_outside);
    janela1_outside.position.z = -0.3;

    //adicionar pecas dos lados das janelas para parecer mais natural?

    janela.add(janela1);
    janela.add(janela1_outside);

    return janela;
}

function createJanelas(){

    const filaJanelas = new THREE.Group();
    
    const janela1 = createSingleJanela();

    const janela2 = janela1.clone();
    janela2.position.x = 10;
    const janela3 = janela1.clone();
    janela3.position.x = 20;

    filaJanelas.add(janela1);
    filaJanelas.add(janela2);
    filaJanelas.add(janela3);

    return filaJanelas;

}

function createPorta(){
    const porta = new THREE.Group();

    const texture = new THREE.TextureLoader().load('textures/door_.jpg');
   
    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1,1);

    const doorGeometry = new THREE.BoxGeometry(10, 15, 0.3 );
    const doorMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, map: texture}); //branco
    const doorMesh = new THREE.Mesh( doorGeometry, doorMaterial );

    porta.add(doorMesh);

    return doorMesh;

}

function createBuilding2(){
    //L shaped building -> windows are outside
    const building = new THREE.Group();

    //parte de cima
    const texture_roof = new THREE.TextureLoader().load('textures/roof_texture_building.jpg');
    texture_roof.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture_roof.wrapS = THREE.RepeatWrapping;
    texture_roof.wrapT = THREE.RepeatWrapping;

    texture_roof.repeat.set(3, 2);

    const geometry_up = new THREE.BoxGeometry(22, 2, 42); //pouca altura, so para colocar na parte de cima a cobrir as coisas, com um bocado de borda
    const material_up = new THREE.MeshPhongMaterial({map: texture_roof});
    const upside = new THREE.Mesh(geometry_up, material_up);
    upside.position.y = 61;

    const geometry_up1 = new THREE.BoxGeometry(42, 2, 22);
    const upside1 = new THREE.Mesh(geometry_up1, material_up);
    upside1.position.x = 10;
    upside1.position.z = 10;
    upside1.position.y = 61;

    const texture = new THREE.TextureLoader().load('textures/wall_building.jpg');
   
    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(3, 2);

    const geometry = new THREE.BoxGeometry(20, 60, 40);
    const material = new THREE.MeshPhongMaterial( {map:texture} );
    const outside = new THREE.Mesh( geometry, material );
    outside.position.y = 30;

    const geometry1 = new THREE.BoxGeometry(40, 60, 20);
    const material1 = new THREE.MeshPhongMaterial({map:texture});
    const outside1 = new THREE.Mesh( geometry1, material1 );
    outside1.position.x = 10;
    outside1.position.z = 10;
    outside1.position.y = 30;

    //adicionar janelas 

    //parte virada para a estrada
    const filaJanelas1 = createJanelas();
    filaJanelas1.position.z = 20.3;
    filaJanelas1.position.y = 50;

    const filaJanelas2 = filaJanelas1.clone();
    filaJanelas2.position.z = 20.3;
    filaJanelas2.position.y = 35;

    const filaJanelas3 = filaJanelas1.clone();
    filaJanelas3.position.z = 20.3;
    filaJanelas3.position.y = 20;

    //parte virada para o edificio azul

    const filaJanelas4 = filaJanelas1.clone();
    filaJanelas4.rotation.y = -Math.PI/2;
    filaJanelas4.position.x = -10.3;
    filaJanelas4.position.z = -10;

    const filaJanelas5 = filaJanelas4.clone();
    filaJanelas5.position.y = 35;

    const filaJanelas6 = filaJanelas4.clone();
    filaJanelas6.position.y = 20;

    //janelas do topo da cena
    const janelatopo1 = createSingleJanela();
    janelatopo1.rotation.y = Math.PI/2;
    janelatopo1.position.set(30.3,50,10);

    const janelatopo2 = createSingleJanela();
    janelatopo2.rotation.y = -Math.PI;
    janelatopo2.position.set(0,50,-20.3);

    //criar porta por cima de cada janela
    const porta1 = createPorta();
    porta1.rotation.y = Math.PI/2;
    porta1.position.set(30.3,7.5,10);


    building.add(outside);
    building.add(outside1);
    building.add(filaJanelas1);
    building.add(filaJanelas2);
    building.add(filaJanelas3);
    building.add(filaJanelas4);
    building.add(filaJanelas5);
    building.add(filaJanelas6);
    building.add(janelatopo1);
    building.add(janelatopo2);
    building.add(porta1);
    building.add(upside);
    building.add(upside1);


    return building;

}

function createHouse1(){
    const casa = new THREE.Group();

    //casa constituida por duas boxes
    const geometry1 = new THREE.BoxGeometry(20, 30, 30); //pouca altura, so para colocar na parte de cima a cobrir as coisas, com um bocado de borda
    const material1 = new THREE.MeshPhongMaterial({color: 0x000});
    const mainhouse = new THREE.Mesh(geometry1, material1);
    mainhouse.position.y = 15;

    const geometry2 = new THREE.BoxGeometry(10, 15, 20); //pouca altura, so para colocar na parte de cima a cobrir as coisas, com um bocado de borda
    const material2 = new THREE.MeshPhongMaterial({color: 0x000});
    const sidehouse = new THREE.Mesh(geometry2, material2);
    sidehouse.position.set(15,7.5,-5);

    const geometry3 = new THREE.BoxGeometry(10, 2, 30); //pouca altura, so para colocar na parte de cima a cobrir as coisas, com um bocado de borda
    const material3 = new THREE.MeshPhongMaterial({color: 0xffffff});
    const tampamain = new THREE.Mesh(geometry3, material3);
    tampamain.position.set(15,16,0);

    const geometria_pilar = new THREE.BoxGeometry(2,15,2);
    const material_pilar = new THREE.MeshPhongMaterial({color: 0xffffff});
    const pilar = new THREE.Mesh(geometria_pilar, material_pilar);
    pilar.position.set(19,7.5,14);

    casa.add(mainhouse);
    casa.add(sidehouse);
    casa.add(tampamain);
    casa.add(pilar);

    return casa;
}

function createBench(){
    const bench = new THREE.Group();

    const texture = new THREE.TextureLoader().load('textures/bench.jpg');
   
    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1,1);

    const geometry1 = new THREE.BoxGeometry(0.5, 4, 8); 
    const material1 = new THREE.MeshPhongMaterial({map: texture});
    material1.color = new THREE.Color(0.6, 0.6, 0.6);
    const back = new THREE.Mesh(geometry1, material1);
    back.position.y = 2;
    back.castShadow = true;
    back.receiveShadow = true;

    const geometry2 = new THREE.BoxGeometry(0.5, 2.5, 8); 
    const material2 = new THREE.MeshPhongMaterial({map: texture});
    material2.color = new THREE.Color(0.6, 0.6, 0.6);
    const seat = new THREE.Mesh(geometry2, material2);
    seat.rotation.z = Math.PI/2;
    seat.position.y = 2.0;
    seat.position.x = 1.25;
    seat.castShadow = true;
    seat.receiveShadow = true;

    const geometry3 = new THREE.BoxGeometry(0.5, 2.25, 8); 
    const material3 = new THREE.MeshPhongMaterial({map: texture});
    material3.color = new THREE.Color(0.6, 0.6, 0.6);
    const leg = new THREE.Mesh(geometry3, material3);
    leg.position.y = 2.25/2;
    leg.position.x = 2.5;
    leg.castShadow = true;
    leg.receiveShadow = true;

    bench.add(back);
    bench.add(seat);
    bench.add(leg);

    bench.scale.set(2, 2, 2);

    return bench;
}

function roadTree(){

    //adicionar textura ao tronco
    const texture_loadert = new THREE.TextureLoader();
    const texture_trunk = texture_loadert.load( "textures/tree_trunk.jpg" );

    const texture_loader = new THREE.TextureLoader();
    const texture_foliage = texture_loader.load( "textures/folliage.jpg" );

    //trunk of the three

    //trunk
    const cilinder = new THREE.CylinderGeometry( 1.25, 1.5, 6, 20 );
    const material_trunk = new THREE.MeshBasicMaterial( {color: 0x964b00, map: texture_trunk} );
    const tree_trunk = new THREE.InstancedMesh( cilinder, material_trunk, 48 );

    tree_trunk.position.y = 3; // acima do plano

    tree_trunk.castShadow = true;
    tree_trunk.receiveShadow = true;


    //base leafs

    const cylinder_base = new THREE.CylinderGeometry(2, 4, 4, 8);
    const material_leafs_base = new THREE.MeshBasicMaterial( {color: 0x8fce00, side: THREE.DoubleSide, map: texture_foliage } );
    const leaf_base = new THREE.InstancedMesh(cylinder_base, material_leafs_base, 48);

    leaf_base.position.y = 8;

    leaf_base.castShadow = true;
    leaf_base.receiveShadow = true;

    //mid leafs
    const cylinder = new THREE.CylinderGeometry(1.5, 3.5, 4, 8);
    const material_leafs_mid = new THREE.MeshBasicMaterial( {color: 0x8fce00, side: THREE.DoubleSide, map: texture_foliage } );
    const leaf_mid = new THREE.InstancedMesh(cylinder, material_leafs_mid, 48);

    leaf_mid.position.y = 12;

    leaf_mid.castShadow = true;
    leaf_mid.receiveShadow = true;

    //top leafs
    const cone_top = new THREE.ConeGeometry(2.5, 5, 6, 1);
    const material_leafs_top = new THREE.MeshBasicMaterial( {color: 0x8fce00, map: texture_foliage} );
    const leaf_top = new THREE.InstancedMesh(cone_top, material_leafs_top, 48);

    leaf_top.position.y = 16.5;

    leaf_top.castShadow = true;
    leaf_top.receiveShadow = true;

    const positions = createTreeVector();

    const dummy = new THREE.Object3D();
    for (let i = 0; i < positions.length; i++) {
        dummy.position.x= positions[i].x;
        dummy.position.z= positions[i].z;

        dummy.updateMatrix();
        tree_trunk.setMatrixAt(i, dummy.matrix);
        leaf_base.setMatrixAt(i, dummy.matrix);
        leaf_mid.setMatrixAt(i, dummy.matrix);
        leaf_top.setMatrixAt(i, dummy.matrix);
    }

    const group = new THREE.Group().add(tree_trunk, leaf_base, leaf_mid, leaf_top);

    return group;

}

function createTreeVector(){

    const positions = [
        new THREE.Vector3(37.5, 0, -30),
        new THREE.Vector3(-262.5, 0, -30),
        new THREE.Vector3(82.5, 0, -30),
        new THREE.Vector3(-217.5, 0, -30),
        new THREE.Vector3(127.5, 0, -30),
        new THREE.Vector3(-172.5, 0, -30),
        new THREE.Vector3(172.5, 0, -30),
        new THREE.Vector3(-127.5, 0, -30),
        new THREE.Vector3(217.5, 0, -30),
        new THREE.Vector3(-82.5, 0, -30),
        new THREE.Vector3(262.5, 0, -30),
        new THREE.Vector3(-37.5, 0, -30),
        new THREE.Vector3(37.5, 0, 30),
        new THREE.Vector3(-262.5, 0, 30),
        new THREE.Vector3(82.5, 0, 30),
        new THREE.Vector3(-217.5, 0, 30),
        new THREE.Vector3(127.5, 0, 30),
        new THREE.Vector3(-172.5, 0, 30),
        new THREE.Vector3(172.5, 0, 30),
        new THREE.Vector3(-127.5, 0, 30),
        new THREE.Vector3(217.5, 0, 30),
        new THREE.Vector3(-82.5, 0, 30),
        new THREE.Vector3(262.5, 0, 30),
        new THREE.Vector3(-37.5, 0, 30),
        new THREE.Vector3(37.5, 0, -210),
        new THREE.Vector3(-262.5, 0, -210),
        new THREE.Vector3(82.5, 0, -210),
        new THREE.Vector3(-217.5, 0, -210),
        new THREE.Vector3(127.5, 0, -210),
        new THREE.Vector3(-172.5, 0, -210),
        new THREE.Vector3(172.5, 0, -210),
        new THREE.Vector3(-127.5, 0, -210),
        new THREE.Vector3(217.5, 0, -210),
        new THREE.Vector3(-82.5, 0, -210),
        new THREE.Vector3(262.5, 0, -210),
        new THREE.Vector3(-37.5, 0, -210),
        new THREE.Vector3(37.5, 0, 210),
        new THREE.Vector3(-262.5, 0, 210),
        new THREE.Vector3(82.5, 0, 210),
        new THREE.Vector3(-217.5, 0, 210),
        new THREE.Vector3(127.5, 0, 210),
        new THREE.Vector3(-172.5, 0, 210),
        new THREE.Vector3(172.5, 0, 210),
        new THREE.Vector3(-127.5, 0, 210),
        new THREE.Vector3(217.5, 0, 210),
        new THREE.Vector3(-82.5, 0, 210),
        new THREE.Vector3(262.5, 0, 210),
        new THREE.Vector3(-37.5, 0, 210)
    ];

    return positions;
}

function createFilaBancos(){

    const fila = new THREE.Group();

    for (let i=-1; i<=1; i++){
        const banco = createBench();
        banco.position.set(0, 0, 60*i);
        fila.add(banco);
    }

    return fila;
}

function createFilaLampadas(){
    const positions = [
        new THREE.Vector3(25, 0, 30),
        new THREE.Vector3(25, 0, -210),
        new THREE.Vector3(25, 0, 90),
        new THREE.Vector3(25, 0, -150),
        new THREE.Vector3(25, 0, 150),
        new THREE.Vector3(25, 0, -90),
        new THREE.Vector3(25, 0, 210),
        new THREE.Vector3(25, 0, -30),
        new THREE.Vector3(-275, 0, 30),
        new THREE.Vector3(-275, 0, -210),
        new THREE.Vector3(-275, 0, 90),
        new THREE.Vector3(-275, 0, -150),
        new THREE.Vector3(-275, 0, 150),
        new THREE.Vector3(-275, 0, -90),
        new THREE.Vector3(-275, 0, 210),
        new THREE.Vector3(-275, 0, -30),
        new THREE.Vector3(-25, 0, 30),
        new THREE.Vector3(-25, 0, -210),
        new THREE.Vector3(-25, 0, 90),
        new THREE.Vector3(-25, 0, -150),
        new THREE.Vector3(-25, 0, 150),
        new THREE.Vector3(-25, 0, -90),
        new THREE.Vector3(-25, 0, 210),
        new THREE.Vector3(-25, 0, -30),
        new THREE.Vector3(275, 0, 30),
        new THREE.Vector3(275, 0, -210),
        new THREE.Vector3(275, 0, 90),
        new THREE.Vector3(275, 0, -150),
        new THREE.Vector3(275, 0, 150),
        new THREE.Vector3(275, 0, -90),
        new THREE.Vector3(275, 0, 210),
        new THREE.Vector3(275, 0, -30)
    ];

    return positions
}

function createLampadas(){

    const geometrypole = new THREE.CylinderGeometry( 0.5, 0.5, 16, 8 ); // 8 porque nao quero muitos triangulos
    const materialpole = new THREE.MeshPhongMaterial( {color: 0x000} );
    const pole = new THREE.InstancedMesh( geometrypole, materialpole, 32 );

    pole.position.y = 9;

    const geometrybase = new THREE.CylinderGeometry(3, 3, 1, 8 );
    const materialbase = new THREE.MeshPhongMaterial( {color: 0x000} );
    const base = new THREE.InstancedMesh( geometrybase, materialbase, 32 );

    base.position.y = 0.5;

    const geometryup = new THREE.CylinderGeometry(0.1, 0.1, 1, 8 );
    const materialup = new THREE.MeshPhongMaterial( {color: 0x000} );
    const up = new THREE.InstancedMesh( geometryup, materialup, 32 );

    up.position.y = 16.5;
    up.position.x = 1;
    

    const geometrydown = new THREE.CylinderGeometry(0, 1, 1, 8 );
    const materialdown = new THREE.MeshPhongMaterial( {color: 0x000} );
    const down = new THREE.InstancedMesh( geometrydown, materialdown, 32 );

    down.position.y = 16.3;
    down.position.x = 1.75;

    let positions = createFilaLampadas();

    let dummy1 = new THREE.Object3D();
    let dummy2 = new THREE.Object3D();
    let dummy3 = new THREE.Object3D();
    for (let i = positions.length/2; i < positions.length; i++) {

        dummy1.position.x = dummy2.position.x = dummy3.position.x = positions[i].x;
        dummy1.position.z = dummy2.position.z = dummy3.position.z = positions[i].z;

        dummy2.rotation.z = Math.PI/2;
        dummy3.rotation.z = Math.PI/6;

        dummy1.updateMatrix();
        dummy2.updateMatrix();
        dummy3.updateMatrix();

        pole.setMatrixAt(i, dummy1.matrix);
        base.setMatrixAt(i, dummy1.matrix);
        up.setMatrixAt(i, dummy2.matrix);
        down.setMatrixAt(i, dummy3.matrix);
        console.log(pole.position.x + " " + i)
        
    }

    for (let i = 0; i < positions.length/2; i++) {
        
        dummy1.position.x = dummy2.position.x = dummy3.position.x = positions[i].x;
        dummy1.position.z = dummy2.position.z = dummy3.position.z = positions[i].z;

        dummy2.position.x -= 2;
        dummy3.position.x -= 3.5;

        dummy2.rotation.z = Math.PI/2;
        dummy3.rotation.z = -Math.PI/6;

        dummy1.updateMatrix();
        dummy2.updateMatrix();
        dummy3.updateMatrix();

        pole.setMatrixAt(i, dummy1.matrix);
        base.setMatrixAt(i, dummy1.matrix);
        up.setMatrixAt(i, dummy2.matrix);
        down.setMatrixAt(i, dummy3.matrix);
        console.log(pole.position.x + " " + i)

        
    }

    const object = new THREE.Group().add(pole, base, up, down);

    return object;
}

function futebolCamp(){

    const campo = new THREE.Group();

    const texture = new THREE.TextureLoader().load('textures/futebol_camp.jpg');
   
    texture.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture.rotation = -Math.PI/2;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(1,1);

    const geometry = new THREE.BoxGeometry( 90, 1, 140 );
    const material = new THREE.MeshBasicMaterial( {map: texture} );
    material.color = new THREE.Color(0.6, 0.6, 0.6);
    const camp = new THREE.Mesh( geometry, material );

    //fence surouding the camp

/* importFence()
    .then(fence => {
        // Do something with the loaded model
        fence.scale.set(1.5,1.5,1.5); // ver disto
        fence.position.set(45,0,-62);

        const fence_lar = new THREE.Object3D();

        const fence1 = fence.clone();
        fence1.position.set(45, 0, -39.2);
        fence_lar.add(fence1);

        const fence2 = fence.clone();
        fence2.position.set(45, 0, -16.4);
        fence_lar.add(fence2);

        const fence3 = fence.clone();
        fence3.position.set(45, 0, 6.4);
        fence_lar.add(fence3);

        const fence4 = fence.clone();
        fence4.position.set(45, 0, 29.2);
        fence_lar.add(fence4);

        const fence5 = fence.clone();
        fence5.position.set(45, 0, 52);
        fence_lar.add(fence5);

        const fence_lar_ = fence_lar.clone();
        fence_lar_.position.x = -89;

        const fence_com = new THREE.Object3D();

        const fence_ = fence.clone();
        fence_.rotation.y = Math.PI/2;
        fence_.position.set(-38, 0, -70);
        fence_com.add(fence_);

        const fence6 = fence_.clone();
        fence6.position.set(-16, 0, -70);
        fence_com.add(fence6);

        const fence7 = fence_.clone();
        fence7.position.set(6, 0, -70);
        fence_com.add(fence7);

        const fence8 = fence_.clone();
        fence8.position.set(28, 0, -70);
        fence_com.add(fence8);

        const fence_com_ = fence_com.clone();
        fence_com_.position.z = 138;

        const campo_group = new THREE.Group();
        campo_group.add(fence_lar);
        campo_group.add(fence_lar_);
        campo_group.add(fence_com);
        campo_group.add(fence_com_);

        campo.add(campo_group);
    })
    .catch(error => {
        console.error(error);
    }); */

    const texture_ = new THREE.TextureLoader().load('textures/bancada.jpg');
    texture_.anisotropy = sceneElements.renderer.capabilities.getMaxAnisotropy(); // get out the blurryness
    texture_.wrapS = THREE.RepeatWrapping;
    texture_.wrapT = THREE.RepeatWrapping;

    const material1 = new THREE.MeshBasicMaterial( {map : texture_} );

    //add bancadas -> box empilhadas umas nas outras
    const geometry0 = new THREE.BoxGeometry(10,5,120);
    const banc0 = new THREE.Mesh( geometry0, material1);
    banc0.position.y = 2.5;
    banc0.position.x = 60;

    const geometry1 = new THREE.BoxGeometry(10,10,120);
    const banc1 = new THREE.Mesh(geometry1, material1);
    banc1.position.y = 5;
    banc1.position.x = 70;

    const geometry2 = new THREE.BoxGeometry(10,15,120);
    const banc2 = new THREE.Mesh(geometry2, material1);
    banc2.position.y = 7.5;
    banc2.position.x = 80;

    const geometry3 = new THREE.BoxGeometry(10,15,120);
    const banc3 = new THREE.Mesh(geometry3, material1);
    banc3.position.y = 7.5;
    banc3.position.x = 80;
    
    campo.add(camp);
    campo.add(banc0);
    campo.add(banc1);
    campo.add(banc2);
    campo.add(banc3);

    return campo;

}

function queueBenches(){
    const benches = new THREE.Group();

    //teste

    //cima 

    const banco1 = createFilaBancos();
    banco1.position.set(-265,0,-120);
    banco1.rotation.y = Math.PI;
    benches.add(banco1);

    const banco2 = createFilaBancos();
    banco2.position.set(-265,0,120);
    banco2.rotation.y = Math.PI;
    benches.add(banco2);


    //centro
    const banco3 = createFilaBancos();
    banco3.position.set(35,0,-120);
    banco3.rotation.y = Math.PI;
    benches.add(banco3);

    const banco4 = createFilaBancos();
    banco4.position.set(35,0,120);
    banco4.rotation.y = Math.PI;
    benches.add(banco4);

    const banco5 = createFilaBancos();
    banco5.position.set(-35,0,-120);
    benches.add(banco5);

    const banco6 = createFilaBancos();
    banco6.position.set(-35,0,120);
    benches.add(banco6);

    //baixo

    const banco7 = createFilaBancos();
    banco7.position.set(265,0,-120);
    benches.add(banco7);

    const banco8 = createFilaBancos();
    banco8.position.set(265,0,120);;
    benches.add(banco8);


    return benches;

}

function importBuilding1(){
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('./models/building1/scene.gltf', function (gltf) {
          const model = gltf.scene;
          resolve(model);
        }, undefined, function (error) {
          reject(error);
        });
      });
}

function importBuilding2(){
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('./models/building2/scene.gltf', function (gltf) {
          const model = gltf.scene;
          resolve(model);
        }, undefined, function (error) {
          reject(error);
        });
      });
}

function importBuilding3(){
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('./models/building3/scene.gltf', function (gltf) {
          const model = gltf.scene;
          resolve(model);
        }, undefined, function (error) {
          reject(error);
        });
      });
}

function importFence(){
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load('./models/fence/scene.gltf', function (gltf) {
          const model = gltf.scene;
          resolve(model);
        }, undefined, function (error) {
          reject(error);
        });
      });
}


// Create and insert in the scene graph the models of the 3D scene
function load3DObjects(sceneGraph) {

    //ground:
    const ground = createGround();
    sceneGraph.add(ground);

    //road:
    const road = createRoad();
    sceneGraph.add(road);

    //car:
    const car = createCar();  // create a car
    const frontwheels = createFrontWheels();
    car.add(frontwheels);
    sceneElements.car = car;
    car.position.set(150, 0, 120);
    sceneGraph.add(car);

    //building - imported
    const building = createBuilding1();
    building.position.set(170, 0, -70);
    sceneGraph.add(building);

    const building1 = createBuilding1();
    building1.position.set(230, 0, -70);
    sceneGraph.add(building1);

    const building2 = createBuilding2();
    building2.position.set(60, 0, -70);
    sceneGraph.add(building2);

    const building3 = createBuilding2();
    building3.position.set(80, 0, -70);
    sceneGraph.add(building3);

    const building4 = createBuilding2();
    building4.position.set(100, 0, -70);
    sceneGraph.add(building4);

    const casa1 = createHouse1();
    casa1.position.set(0,0,0);
    //sceneGraph.add(casa1);

    const lampadas = createLampadas();
    sceneGraph.add(lampadas);

    //bancos
    const bancos = queueBenches();
    sceneGraph.add(bancos); 

    //fila de arvores em todos os lados da cidade
    const arvores = roadTree();
    sceneGraph.add(arvores);  

    //campo de futebol
    const campo = futebolCamp();
    campo.position.set(150, 0.5, 120);
    sceneGraph.add(campo);


    importBuilding1()
    .then(model => {
        // Do something with the loaded model
        model.scale.set(30,30,30);
        model.position.set(100,12,-130);
        sceneGraph.add(model);
    })
    .catch(error => {
        console.error(error);
    });

    importBuilding3()
    .then(model => {
        // Do something with the loaded model
        model.rotation.y = Math.PI;
        model.position.set(720,15,70); //x is good, falta mudar o z
        model.scale.set(400,400,400);

        sceneGraph.add(model);
    })
    .catch(error => {
        console.error(error);
    }); 

    //axis helper
/*     const axesHelper = new THREE.AxesHelper( 500 );
    sceneGraph.add( axesHelper ); */

}

// Displacement value

var delta = 0.1;

var dispX = 0.4, dispZ = 0.4;

function computeFrame(time) {

    // THE SPOT LIGHT

    // Can extract an object from the scene Graph from its name
    const light = sceneElements.sceneGraph.getObjectByName("car_light");

    // Apply a small displacement

    //if (light.position.x >= 10) {
    //    delta *= -1;
    //} else if (light.position.x <= -10) {
    //    delta *= -1;
    //}
    //light.translateX(delta);

    // CONTROLING THE CUBE WITH THE KEYBOARD


    const car = sceneElements.sceneGraph.getObjectByName("carro");

    if (keyD && car.position.x < 400) {
        car.rotation.y -= 0.01; 
        car.translateX(dispX);
    }
    if (keyW && car.position.z > -400) {
        car.translateZ(-dispZ);
    }
    if (keyA && car.position.x > -400) {
        car.rotation.y += 0.01; 
        car.translateX(-dispX);
    }
    if (keyS && car.position.z < 400) {
        car.translateZ(dispZ);
    }

    // NEW --- Update control of the camera
    sceneElements.camera.lookAt(car.position.x, car.position.y + 5, car.position.z);
    sceneElements.orbitControl.target.copy(car.position);

    // Rendering
    helper.render(sceneElements);



    // Call for the next frame
    requestAnimationFrame(computeFrame);
}