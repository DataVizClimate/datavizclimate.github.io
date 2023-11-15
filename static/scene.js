class components {

  static stars(scene, amount, center) {
    let stars = []
    for (let i=0; i<amount; i++) {
      const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const geometry = new THREE.SphereGeometry(0.1);
      const cube = new THREE.Mesh(geometry, material);
      
      //let center = [0,0, -15]

      cube.position.set(
        center[0] + ((Math.random() -0.5) * 40), 
        center[1] + ((Math.random() -0.5) * 40), 
        center[2] + ((Math.random() -0.5) * 60));
      scene.add(cube);
      stars.push(cube);
    }

    return stars
  }

  static cube2(x, y, z) {
    const material = new THREE.MeshNormalMaterial();
    const geometry = new THREE.BoxGeometry(x, y, z);
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  static cube(x, y, z, color) {
    const material = new THREE.MeshBasicMaterial({ color: color });
    const geometry = new THREE.BoxGeometry(x, y, z);
    const cube = new THREE.Mesh(geometry, material);
    return cube
  }

  static sky() {
    const skyGeo = new THREE.SphereGeometry(100000, 25, 25);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF00FF });
    const sky = new THREE.Mesh(skyGeo, material);
    return sky
  }

  static scene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001b42);
    scene.add(cube);
    return scene;
  }

  static camera() {
    //new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 0)
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    return camera;
  }

  static water(ms_Renderer, ms_Camera, ms_Scene, directionalLight, x, y, z) {
    // Load textures		
		var waterNormals = new THREE.ImageUtils.loadTexture('static/img/waternormals.jpg');
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
		
		// Create the water effect
		let ms_Water = new THREE.Water(ms_Renderer, ms_Camera, ms_Scene, {
			textureWidth: 256,
			textureHeight: 256,
			waterNormals: waterNormals,
			alpha: 	1.0,
			//sunDirection: directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x00bbff,
			betaVersion: 0,
			side: THREE.DoubleSide,
      fog: true
		});
		var aMeshMirror = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(200, 200, 10, 10), 
			ms_Water.material
		);
    aMeshMirror.position.set(x, y, z);
		aMeshMirror.add(ms_Water);
		aMeshMirror.rotation.x = - Math.PI * 0.5;
		
		ms_Scene.add(aMeshMirror);

    return ms_Water;
  }

  /*static water (ms_Renderer, ms_Camera, ms_Scene, directionalLight, x, y, z) {
    // Create a texture loader
    var textureLoader = new THREE.TextureLoader();

    // Load textures
    var waterNormals = textureLoader.load('static/img/waternormals.jpg', function(texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    });
		// Create the water effect
		let ms_Water = new THREE.Water(ms_Renderer, ms_Camera, ms_Scene, {
			textureWidth: 256,
			textureHeight: 256,
			waterNormals: waterNormals,
			alpha: 	1.0,
			//sunDirection: directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x00bbff,
			betaVersion: 0,
			side: THREE.DoubleSide,
      fog: true
		});
		var aMeshMirror = new THREE.Mesh(
			new THREE.PlaneGeometry (200, 200, 10, 10), 
			ms_Water.material
		);
    aMeshMirror.position.set(x, y, z);
		aMeshMirror.add(ms_Water);
		aMeshMirror.rotation.x = - Math.PI * 0.5;
		
		ms_Scene.add(aMeshMirror);

    return ms_Water;
  }*/

  static light(x, y, z) {
    var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
		directionalLight.position.set(x, y, z);
    return directionalLight;
  }
  /*static renderer() {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setPixelRatio(devicePixelRatio);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera));
    invalidation.then(() => (controls.dispose(), renderer.dispose()));
    return renderer;
  }*/

  static rendererInit() {
    //renderer = this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
    let m_renderer = new THREE.WebGLRenderer({antialias: true});
    m_renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas').appendChild(m_renderer.domElement);
    return m_renderer;
  }
}
