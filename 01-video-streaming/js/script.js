// a basic three.js scene

var container, renderer, scene, camera, controls;

// custom global variables
var video, videoImage, videoImageContext, videoTexture;

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
    streamVideo();

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

function streamVideo() {
    	// create the video element
	video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "assets/introducing_meta.mp4";
	video.load(); // must call after setting/changing source
	video.play();
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 480;
	videoImage.height = 204;

	videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	videoTexture = new THREE.Texture( videoImage );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;
	
	var movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );
    movieMaterial.needsUpdate = true;
	// the geometry on which the movie will be displayed;
	// 		movie image will be scaled to fit these dimensions.
	var movieGeometry = new THREE.PlaneGeometry( 920, 260, 4, 4 );
	var movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
	movieScreen.position.set(596,216,0);
    movieScreen.rotation.set(0, -3.14/2, 0)
	scene.add(movieScreen);
	
	camera.position.set(0,150,300);
	camera.lookAt(movieScreen.position);
}

function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    controls.update();

    if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
	{
		videoImageContext.drawImage( video, 0, 0 );
		if ( videoTexture ) 
			videoTexture.needsUpdate = true;
	}

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}