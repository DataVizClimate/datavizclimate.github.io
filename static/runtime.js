let scrollSteps = 0;
let offsets = [0,0];

let epanel = [document.getElementById("panel1"), document.getElementById("panel2"), document.getElementById("panel3"), document.getElementById("panel4")]
let currentEpanelScale = Array.from(Array(epanel.length), () => 0);
let currentScale = 0;
let currentOffsets = [0,0];
let currentOpacity = 0;
let currentScrollStep = 0;
let backgroundColor = 0x000000;

let scene, camera, renderer, mesh, water, controls, stars;

addEventListener("wheel", (event) => {zoom(event)});
addEventListener('mousemove', (event) => {move(event)});
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateWaveGraph();
    resizeGlobe();
});

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
    //console.log(scrollSteps);
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
        if (transitionPoint < 1.1 && transitionPoint > 1.0){
            cScale = 1;
            // if (epanelFocus == 0) {
            //     epanelFocus = 1;
            //     currentEpanelFocus = cScale;
            // }
            // cScale = currentEpanelFocus;
            // console.log(currentEpanelFocus)
            cOffset[0] = 0;
            cOffset[1] = 0;
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
    mesh3    = components.cube(200,1,70, 0x0000FF);
    
    mesh2    = components.cube2(5,1,70);
    light    = components.light(-600, 300, 600);
    // water    = components.water(renderer, camera, scene, null, 0, -2, -140);
    water    = waterComponent(renderer, camera, scene, null, 0, -2, -140);
    stars    = components.stars(scene, 200, [0, -5, -15]);

    camera.position.z = 5;
    //mesh.position.y = -2;

    mesh3.position.set(0, -2, -170);
    space.position.set(0, -11, -40);

    //scene.fog = new THREE.Fog(0xFFFFFF, 0.005, 10)
    //scene.background = new THREE.Color(0xFFFFFF);
    scene.fog = new THREE.FogExp2(0x000000, 0.05);
    renderer.setClearColor(0x000000);
    scene.add(components.sky());

    scene.add(mesh3);
    scene.add(space);
    //scene.add(mesh2);
    scene.add(light);

	//controls = new THREE.OrbitControls(camera, render.domElement);
    // updateWaveGraph();
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
        stars[i].material.color.setHex(parseInt(lerpColor(Math.sin((now * i * 0.00001)), "#444444", "#FFFFFF").slice(1), 16)); 
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
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    scene.fog = new THREE.FogExp2(backgroundColor, 0.05);
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

