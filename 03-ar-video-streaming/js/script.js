import * as THREE from '../lib/three.module.js';
import { ARButton } from '../lib/ARButton.js';
import { GLTFLoader } from '../lib/GLTFLoader.js'

let container;
let camera, scene, renderer;
let controller;

let reticle;

let hitTestSource = null;
let hitTestSourceRequested = false;

let glb_model = null;
let hasModelLoaded = false;

let screen = null;
var video, videoImage, videoImageContext, videoTexture;
var hasVideoLoaded = false

init();
animate();

function loadModel() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if(urlParams === undefined) return

	let glb_src = urlParams.get("glb_src")    //"assets/return_of_the_doge.mp4";

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    // loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
        "./assets/scene.glb",
        
        // called when the resource is loaded
        function ( gltf ) {
            glb_model = gltf.scene;
            hasModelLoaded = true;
            screen = glb_model.children[3]
            console.log(screen)
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

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    light.position.set( 0.5, 1, 0.25 );
    scene.add( light );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    //

    document.body.appendChild( ARButton.createButton( renderer, { requiredFeatures: [ 'hit-test' ] } ) );

    //

    const geometry = new THREE.CylinderGeometry( 0.1, 0.1, 0.2, 32 ).translate( 0, 0.1, 0 );
    loadModel();

    function onSelect() {

        if(hasVideoLoaded) return
        if ( reticle.visible ) {
            let model;
            if(hasModelLoaded)
                model = glb_model.clone();
                model.position.setFromMatrixPosition( reticle.matrix );
                //model.scale.set(0.001, 0.001, 0.001);
                scene.add(model);
                playVideo();
                console.log(scene);
        }

    }

    controller = renderer.xr.getController( 0 );
    controller.addEventListener( 'select', onSelect );
    scene.add( controller );

    reticle = new THREE.Mesh(
        new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
        new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add( reticle );

    //

    //window.addEventListener('click', playVideo);
    window.addEventListener( 'resize', onWindowResize );

}

function playVideo() {
    if(!hasVideoLoaded) {
        video.play();
        hasVideoLoaded = true
    }
}

function streamVideo() {
    // create the video element
    video = document.createElement( 'video' );
    // video.id = 'video';
    // video.type = ' video/ogg; codecs="theora, vorbis" ';

    //https://geoweb-experiments.on.fleek.co/01-video-streaming/assets/return_of_the_doge.mp4
    const urlParams = new URLSearchParams(window.location.search);

    if(urlParams === undefined) return

    video.src = urlParams.get("video_src")    //"assets/return_of_the_doge.mp4";
    video.crossOrigin = "anonymous";
    video.load(); // must call after setting/changing source

    videoImage = document.createElement( 'canvas' );
    videoImage.width = 0.259;
    videoImage.height = 0.259;
    video.muted = true

    videoImageContext = videoImage.getContext( '2d' );
    videoImageContext.fillStyle = '#000000';    // background color if no video present
    videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

    videoTexture = new THREE.Texture( videoImage );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    console.log(videoTexture)

    if(screen) {
        screen.material.map = videoTexture;
        screen.material.needsUpdate = true;
    }

    video.muted = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

//
function animate() {
    renderer.setAnimationLoop( render );
}

function render( timestamp, frame ) {

    if ( frame ) {

        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if ( hitTestSourceRequested === false ) {

            session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {
                session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {
                    hitTestSource = source;
                } );
            } );

            session.addEventListener( 'end', function () {
                hitTestSourceRequested = false;
                hitTestSource = null;
            } );
            hitTestSourceRequested = true;
        }

        if ( hitTestSource ) {
            const hitTestResults = frame.getHitTestResults( hitTestSource );

            if ( hitTestResults.length ) {
                const hit = hitTestResults[ 0 ];

                reticle.visible = true;
                reticle.matrix.fromArray( hit.getPose( referenceSpace ).transform.matrix );
            } else {
                reticle.visible = false;
            }
        }
    }

    renderer.render( scene, camera );

}