import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';
import { pass } from 'three/tsl';


//* Initialization

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({alpha: true});

let object;
let objToLoad = 'Floor1'

let controls = new MapControls( camera, renderer.domElement );

const topLight = new THREE.DirectionalLight(0xffffff, 4);
const sideLight = new THREE.DirectionalLight(0xffffff, 2);
const ambientLight = new THREE.AmbientLight(0xffffff, 2);

const gridHelper = new THREE.GridHelper(350, 50);

var zoomIn = document.getElementById( 'zoom-in' );
var zoomOut = document.getElementById( 'zoom-out' );
		
const loader = new GLTFLoader();


//* Components

camera.position.set(0, 250, 200);

topLight.position.set(camera.position.x, camera.position.y, camera.position.z);
topLight.castShadow = true;

sideLight.position.set(0, 250, 0);

gridHelper.position.y = -1;
gridHelper.position.x = 1

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('container3D').appendChild(renderer.domElement);

scene.add(
    ambientLight,
    topLight,
    sideLight,
    gridHelper,
);


//* Controls

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 3.2;

controls.target.set(0,0,0);


//* Event Listeners

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/*
window.addEventListener("mousedown", event =>{
    if(event.button == 2){
        scene.remove(object);
        if (objToLoad == 'teapot'){
            objToLoad = 'snorlax';

            load();
            console.log(objToLoad);

        }else if (objToLoad == 'snorlax'){
            objToLoad = 'Floor1';
            
            controls.target.set(0,0,0);
            camera.position.set(0, 250, 200);

            load();
            console.log(objToLoad);

        }else if (objToLoad == 'Floor1'){
            objToLoad = 'Floor2';

            controls.target.set(0,30,20);
            camera.position.set(0, 250, 200);

            load();
            console.log(objToLoad);

        }else{
            objToLoad = 'teapot';

            load();
            console.log(objToLoad);
        }
    }else{
        scene.remove(object);
    }
})
*/

zoomIn.addEventListener( 'click', onFloor1, false );
zoomOut.addEventListener( 'click', onFloor2, false );


//* Functions

function load() {
    loader.load(
        `./models/${objToLoad}/scene.gltf`, (gltf) => {
    
        object = gltf.scene;
        object.position.set( -5 , 0 , 0)
        object.rotation.y = Math.PI
        scene.add(object);


        const materials = {};
        materials[ 'wireframe' ] = new THREE.MeshBasicMaterial( { wireframe: true } );
    
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    topLight.position.set(camera.position.x, camera.position.y, camera.position.z);

    renderer.render(scene, camera);
}

function onFloor1() {

    if (objToLoad == 'Floor1'){
        console.log('onFloor1');
    } else{
        objToLoad = 'Floor1';

        controls.target.set(0,0,0);
        camera.position.set(0, 250, 200);

        load();

        scene.remove(object);

        console.log(objToLoad);
    }

}

function onFloor2() {

    if (objToLoad == 'Floor2'){
        console.log('onFloor2');
    }else{
        objToLoad = 'Floor2';

        load();
    
        scene.remove(object);
    
        controls.target.set(0,30,20);
        camera.position.set(0, 250, 200);
    
        console.log(objToLoad);
    }
	
}

//* Start

load();

animate();