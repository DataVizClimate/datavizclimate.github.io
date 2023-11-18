import * as THREE from 'three';

import { Water } from 'three/addons/Water.js';

// let container;
// let camera, scene, renderer;
let water;

function waterComponent(ms_Renderer, ms_Camera, ms_Scene, directionalLight, x, y, z)  {
    // renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 0.5;
    // container.appendChild( renderer.domElement );

    // Water

    const waterGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'static/textures/waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x101DD4,
            distortionScale: 3.7,
            fog: true
            // fog: scene.fog !== undefined
        }
    );

    water.position.set(x, y, z);
    water.rotation.x = - Math.PI / 2;
    ms_Scene.add( water );

    return water;
}

window.waterComponent = waterComponent;