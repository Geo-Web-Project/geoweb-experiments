// a basic three.js scene

var container, renderer, scene, camera, controls;

init();
animate();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x1a1d2b);
    container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 200, 800);

    // (camera) controls
    // mouse controls: left button to rotate, 
    //    mouse wheel to zoom, right button to pan
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // light    
    var light = new THREE.PointLight(0xffffff);
    light.position.set(100, 250, 250);
    scene.add(light);

    loadCinema();

    // events
    window.addEventListener('resize', onWindowResize, false);

}

function loadCinema() {
    // Instantiate a loader
    const loader = new THREE.GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
        // resource URL
        'assets/cinema.glb',
        // called when the resource is loaded
        function ( gltf ) {
            var cinema = gltf.scene;
            cinema.scale.set(10, 10, 10)
            scene.add( cinema );
        },
        // called while loading is progressing
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}