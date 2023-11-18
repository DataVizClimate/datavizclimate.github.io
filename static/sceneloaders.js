import * as THREE from 'three'
import { STLLoader } from 'three/addons/STLLoader.js'
import { OBJLoader } from 'three/addons/OBJLoader.js'

// const envTexture = new THREE.CubeTextureLoader().load([
//     'img/px_50.png',
//     'img/nx_50.png',
//     'img/py_50.png',
//     'img/ny_50.png',
//     'img/pz_50.png',
//     'img/nz_50.png'
// ])
// envTexture.mapping = THREE.CubeReflectionMapping
function loadStlComponent(stlFile, scene, coords, rotation, scale){
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xb2ffc8,
        // envMap: envTexture,
        metalness: 0.25,
        roughness: 0.1,
        opacity: 1.0,
        transparent: true,
        transmission: 0.99,
        clearcoat: 1.0,
        clearcoatRoughness: 0.25
    })
    
    const loader = new STLLoader()
    loader.load(
        stlFile,
        function (geometry) {
            const mesh = new THREE.Mesh(geometry, material)
            scene.add(mesh)
            mesh.position.set(coords[0], coords[1], coords[2]);
            mesh.rotation.set(rotation[0], rotation[1], rotation[2])
            mesh.scale.set(scale[0], scale[1], scale[2])
            return mesh;
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    return undefined;
}

window.loadStlComponent = loadStlComponent;



function loadObjComponent(objFile, scene, coords, rotation, scale){
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xb2ffc8,
        // envMap: envTexture,
        metalness: 0.25,
        roughness: 0.1,
        opacity: 1.0,
        transparent: true,
        transmission: 0.99,
        clearcoat: 1.0,
        clearcoatRoughness: 0.25
    })
    
    const loader = new OBJLoader()
    loader.load(
        objFile,
        function (geometry) {
            geometry.children[0].material = material
            geometry.traverse(function (child) {
                if (child.isMesh) {
                    child.material = material
                }
            })
            scene.add(geometry)
            geometry.position.set(coords[0], coords[1], coords[2]);
            geometry.rotation.set(rotation[0], rotation[1], rotation[2])
            geometry.scale.set(scale[0], scale[1], scale[2])
            return geometry;
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )
    return undefined;
}

window.loadObjComponent = loadObjComponent;