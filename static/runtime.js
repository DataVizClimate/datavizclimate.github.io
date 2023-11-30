let scrollSteps = 0;
let offsets = [0,0];

let epanel = [document.getElementById("panel1"), 
                document.getElementById("panel2"), 
                document.getElementById("panel3"), 
                document.getElementById("panel4"), 
                document.getElementById("panel5")
            ]

let iPanel = [[document.getElementById("info-panel1")], 
                [document.getElementById("info-panel2")], 
                [document.getElementById("info-panel3"), document.getElementById("info-panel3-slider")], 
                [document.getElementById("info-panel4")],
                [document.getElementById("info-panel5")]]

console.log(epanel)
console.log(iPanel)
let currentEpanelScale = Array.from(Array(epanel.length), () => 0);
let currentScale = 0;
let currentOffsets = [0,0];
let currentOpacity = 0;
let currentScrollStep = 0;
let backgroundColor = 0x000000;

let scene, camera, renderer, mesh, water, controls, stars;

addEventListener("wheel", (event) => {zoom(event)});
addEventListener('mousemove', (event) => {move(event)});
// addEventListener('touchmove', onScroll());
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // updateWaveGraph();
    // resizeGlobe();
});

// FOR TESTING ONLY (INTERFERES W/ INTERACTIVE VISUALIZATIONS)
// // Mobile Touch Scroll to Wheel

// let initialTouchY = null;

// window.addEventListener("touchstart", (event) => {
//   initialTouchY = event.touches[0].clientY;
// });

// window.addEventListener("touchmove", (event) => {
//   if (initialTouchY === null) {
//     return;
//   }

//   const currentTouchY = event.touches[0].clientY;
//   const deltaY = currentTouchY - initialTouchY;
//   initialTouchY = currentTouchY;

//   // You can adjust the sensitivity here
//   const sensitivity = -3; // Adjust as needed

//   // Trigger zoom with deltaY and sensitivity
//   const fakeWheelEvent = new WheelEvent("wheel", { deltaY: deltaY * sensitivity });
//   zoom(fakeWheelEvent);
// });

// window.addEventListener("touchend", () => {
//   initialTouchY = null;
// });


// //

function calcOpacity(scrollSteps) {
    //return Math.sin((scrollSteps * 0.2) + 0.1) * 2;
    let x = (scrollSteps*0.1);
    const a = -2.7; //-5
    const h = 0.7;
    const k = 1.3;
    return (a * Math.pow((x-h), 2)) + k;
}

function move(event) {
    const documentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;
    const x = event.clientX/documentWidth;
    const y = event.clientY/documentHeight;
    offsets[0] = clamp(-(x-0.5), -1, 1) * 25;
    offsets[1] = clamp(-(y-0.5), -1, 1) * 25;
    //console.log('Mouse Position:', offsets[0], offsets[1]);
}

function zoom(event) {
    /*if (event.deltaY < 0) {
        scrollSteps += 0.1;
    }
    else {
        scrollSteps -= 0.1;
    }*/
    scrollSteps += event.deltaY * 0.0025;
    // every panel is spaced by 20
    const panelSpacing = 12;
    scrollSteps = clamp(scrollSteps, 0, (panelSpacing * epanel.length) - 1.5);
    // console.log(scrollSteps);
    // 9.5 to 11
    // 21.75 to 23
    // 33.75 to 35
    document.getElementById("overall-progress-bar").style = `width: ${mapRange(scrollSteps, 0, 46.5, 0, 100)}%;`;
}

function openingPanel(translateY) {
    opanel = document.getElementById("opening-panel");
    opanel.style.transform = `translateY(-${translateY * 75}%)`;
    //console.log(mapRange(translateY,1,0,0,1));
    opanel.style.opacity = `${mapRange(translateY,1,0,0,1)}`; 
}

function panel(index, cScaleRaw, cScale, cOffset, cOpacity, dt) {
    const offset = 0.2
    const offsetScalar = -1.2 //-2
    
    
    const transitionPoint = cScale - (index + (index * offset))

    panelOffset = index * 1 * offsetScalar;
    cScale += panelOffset;
    cScale = clamp((((cScale * -0.85) + 1) * 10), 0, 10);

    if (cScale != 0 && cScale != 10){
        // if (transitionPoint < 1.05 && transitionPoint > 1.0){
        if (transitionPoint < 1.1 && transitionPoint > 0.95){
            cScale = 1;
            // if (epanelFocus == 0) {
            //     epanelFocus = 1;
            //     currentEpanelFocus = cScale;
            // }
            // cScale = currentEpanelFocus;
            // console.log(currentEpanelFocus)
            cOffset[0] = 0;
            cOffset[1] = 0;
            // epanel[index].style = "pointer-events: auto;";

            for (let i=0; i<iPanel[index].length; i++){
                iPanel[index][i].style = "opacity: 1; pointer-events: auto;";
            }
        }
        else {
            // epanel[index].style = "pointer-events: none;";
            for (let i=0; i<iPanel[index].length; i++){
                iPanel[index][i].style = "opacity: 0; pointer-events: none;";
            }
        }
    }
    
    //cOpacity += panelOffset;
    cOpacity = calcOpacity(cOpacity + (index * 10 * offsetScalar));

    currentEpanelScale[index] = lerp(currentEpanelScale[index], cScale, dt * 20);

    epanel[index].style.transform = `matrix3d(1, 0, 0, 0,
                                              0, 1, 0, 0,
                                              0, 0, 1, 0,
                                              0, 0, 0, ${currentEpanelScale[index]})
                                     translate(${cOffset[0]}%, ${cOffset[1]}%)`;
                                     //scale(${clamp(cScale,0,2)})
    epanel[index].style.opacity = `${cOpacity}`;
}

// ThreeJS
function init() {
    renderer = components.rendererInit();
    scene    = new THREE.Scene();
    camera   = components.camera();
    //mesh     = components.cube(5,1,70, 0x0000FF);
    space    = components.cube(200,20,2, 0x000000);
    // mesh3    = components.cube(200,1,70, 0x0000FF);
    beachext = components.cube(200,1,70, 0x504F16);
    endExt   = components.cube(200,1,70, 0xa6f0ff);
    
    light    = components.light(-600, 300, 600);
    // water    = components.water(renderer, camera, scene, null, 0, -2, -140);
    water    = waterComponent(renderer, camera, scene, null, 0, -2, -140);
    stars    = components.stars(scene, 200, [0, -5, -15]);
    
    //loadStlComponent('static/models/oahu.stl', scene, [-0.75, -2.35, -67], [-1.57079, 0, 3.14], [5,5,5]);
    // loadObjComponent('static/models/beach.obj', 'static/textures/beach2.mtl', scene, [5, -2.35, -60], [-3.14, 0, 3.14], [1,1,1]);
    loadFbxComponent('static/models/beach2.fbx', scene, [5, -2.35, -63 -29], [-Math.PI, 0, Math.PI], [1,1,1], 
    (object) => {
        const leftBeach  = object.clone();
        const rightBeach = object.clone();

        leftBeach.position.set(-38, -2.35, -63 -29);
        scene.add(leftBeach)

        rightBeach.position.set(43, -2.35, -63 -29);
        scene.add(rightBeach)
    });
    camera.position.z = 5;
    //mesh.position.y = -2;

    // mesh3.position.set(0, -2, -170);
    beachext.position.set(0, -1.75, -105 -29);
    endExt.position.set(0, -1, -110 -29);
    space.position.set(0, -11, -40);

    //scene.fog = new THREE.Fog(0xFFFFFF, 0.005, 10)
    //scene.background = new THREE.Color(0xFFFFFF);
    scene.fog = new THREE.FogExp2(0x000000, 0.04);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.5;
    renderer.setClearColor(0x000000);
    scene.add(components.sky());

    scene.add(beachext);
    scene.add(endExt);
    // scene.add(mesh3);
    scene.add(space);
    scene.add(light);
}

function update(dt, now) {
    scaledScrollSteps = scrollSteps * 0.1;

    currentScale = lerp(currentScale, scaledScrollSteps, dt * 10);
    currentOffsets[0] = lerp(currentOffsets[0], offsets[0], dt * 5);
    currentOffsets[1] = lerp(currentOffsets[1], offsets[1], dt * 5);

    currentOpacity = currentScale * 10;
    
    for (let i = 0; i < epanel.length; i++){
        panel(i, scaledScrollSteps, currentScale, currentOffsets, currentOpacity, dt);
    }
    // panel(0, currentScale, currentOffsets, currentOpacity);
    // panel(1, currentScale, currentOffsets, currentOpacity);
    // panel(2, currentScale, currentOffsets, currentOpacity);
    // panel(3, currentScale, [0, 0], currentOpacity);

    camera.position.set(currentOffsets[0] * -0.01, currentOffsets[1] * 0.01, currentScale * -25);

    backgroundColor = lerpColor((scaledScrollSteps * 1.5) - 2, "#000000", "#a6f0ff");

    // Issue if user scrolls too quickly
    //if (scrollSteps < 1.5) {
    openingPanel(scrollSteps);
    //}
    for (let i=0; i<stars.length; i++) {
        stars[i].material.color.setHex(parseInt(lerpColor(Math.sin((now * i * 0.01)), "#444444", "#FFFFFF").slice(1), 16)); 
    }
}

let lastUpdate = 0;

function animate() {
    requestAnimationFrame(animate);
    
    const now = performance.now() * 0.001;
    // var now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;

    //water.material.uniforms.time.value += 0.075 / 60.0;
    water.material.uniforms[ 'time' ].value += 0.1 / 60.0;
    water.position.y = -2 + (seaLevel * 0.005);

    scene.fog = new THREE.FogExp2(backgroundColor, 0.07);
    renderer.setClearColor(backgroundColor);

    //water.render()
    renderer.render(scene, camera);
    update(dt, now);
}

init();
animate();

// var lastUpdate = Date.now();
// var myInterval = setInterval(tick, 0);

// function tick() {
//     var now = Date.now();
//     var dt = now - lastUpdate;
//     lastUpdate = now;

//     update(dt, now);
// }

