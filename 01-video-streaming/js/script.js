// a basic three.js scene

var container, renderer, scene, camera, controls;

// custom global variables
var video, videoImage, videoImageContext, videoTexture;
var hasVideoLoaded = false

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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(-20*3.14/180,-3.14/2,0);
    camera.position.set(-430, 250, 120);

    // (camera) controls
    // mouse controls: left button to rotate, 
    //    mouse wheel to zoom, right button to pan
    //controls = new THREE.OrbitControls(camera, renderer.domElement);

    // light    
    var light = new THREE.PointLight(0xffffff);
    light.position.set(100, 250, 250);
    scene.add(light);

    loadCinema();

    document.addEventListener( 'mousedown', () => {
        document.body.requestPointerLock();
        //mouseTime = performance.now();
    });

    document.body.addEventListener( 'mousemove', ( event ) => {
        if ( document.pointerLockElement === document.body ) {
            camera.rotation.y -= event.movementX / 5000;
            camera.rotation.x -= event.movementY / 5000;
        }
    } );

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

            streamVideo();
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

    //https://withered-art-6159.on.fleek.co/01-video-streaming/assets/return_of_the_doge.mp4
    const urlParams = new URLSearchParams(window.location.search);
    
    if(urlParams === undefined) return

	video.src = urlParams.get("video_src")    //"assets/return_of_the_doge.mp4";
    video.crossOrigin = "anonymous";
	video.load(); // must call after setting/changing source
	
	videoImage = document.createElement( 'canvas' );
	videoImage.width = 0.25*920;
	videoImage.height = 0.5*260;

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
	movieScreen.position.set(594,216,0);
    movieScreen.rotation.set(0, -3.14/2, 0)
	scene.add(movieScreen);

    video.play();
	
    hasVideoLoaded = true
}

function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    //controls.update();
    if(hasVideoLoaded) {
        if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
        {
            videoImageContext.drawImage( video, 0, 0 );
            if ( videoTexture ) videoTexture.needsUpdate = true;
        }
    }
    

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}