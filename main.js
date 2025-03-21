import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 10

const renderer = new THREE.WebGLRenderer({alpha: true});

//let mouseX = window.innerWidth / 2;
//let mouseY = window.innerHeight / 2;

let object;

let controls = new MapControls( camera, renderer.domElement );

//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 10;
controls.maxDistance = 500;

controls.maxPolarAngle = Math.PI / 3.2;

const loader = new GLTFLoader();

let objToLoad = 'BSSS'

const gridHelper = new THREE.GridHelper(200, 50);
gridHelper.position.y = -1;
scene.add( gridHelper );

function load() {
    loader.load(
        `models/${objToLoad}/scene.gltf`, (gltf) => {
    
        object = gltf.scene;
        scene.add(object);
    
        const materials = {};
        materials[ 'wireframe' ] = new THREE.MeshBasicMaterial( { wireframe: true } );
    
    });
}

load();

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('container3D').appendChild(renderer.domElement);

camera.position.z = 25;

const topLight = new THREE.DirectionalLight(0xffffff, objToLoad == 'snorlax' ? 0 : 5);
topLight.position.set(200, 700, 200);
topLight.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(
    ambientLight,
    topLight,
);

function animate() {
    requestAnimationFrame(animate);

    //object.rotation.x += 0.003;
    //object.rotation.y += -0.0025;
    
    controls.update();

    renderer.render(scene, camera);
}

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("mousedown", event =>{
    if(event.button == 2){
        scene.remove(object);
        if (objToLoad == 'teapot'){
            objToLoad = 'snorlax';
            load();
        }else if (objToLoad == 'snorlax'){
            objToLoad = 'BSSS';
            load();
        }else{
            objToLoad = 'teapot';
            load();
        }
    }
})

animate();