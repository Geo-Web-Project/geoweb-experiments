
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

//var glb_cid = 'https://gateway.pinata.cloud/ipfs/QmTxmmG33T1mkEucgzDNQLDEQUxDsymusyRv7UiqESnq9F'
//var scale = 1
//var altitude = 100
//{ name: "Hot Air Balloon", location: { lng: 80.072225, lat: 12.823755 } }

let glb_cid = params.glb_cid.toString();
let scale = parseFloat(params.scale);

let lat = parseFloat(params.lat);
let lon = parseFloat(params.lon);
let altitude = parseFloat(params.alt);

let place = { name: params.name.toString(), location: { lng: lon, lat: lat } }

window.onload = () => {
    const scene = document.querySelector('a-scene');
    const dom = document.querySelector('body');

    const latitude = place.location.lat;
    const longitude = place.location.lng;

    dom.innerHTML += 
        `
        <a-scene
        renderer="logarithmicDepthBuffer: true;"
        loading-screen="enabled: false;"
        arjs="sourceType: webcam; debugUIEnabled: false;"
        embedded>

        <a-entity
            animation-mixer="loop: repeat"
            gltf-model=${glb_cid}
            scale="${scale} ${scale} ${scale}"
            position="0 ${altitude} 0"
            gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
            title=${place.name}
        ></a-entity>
        <a-camera gps-camera rotation-reader></a-camera>
        </a-scene>
        `

        // add place name
        //const model = document.createElement('a-entity');

        /*
        model.setAttribute('animation-mixer', 'loop: repeat');
        model.setAttribute('gltf-model', test_model_src); //'./assets/hot_air_balloon.glb'
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`)
        model.setAttribute('scale', '0.25 0.25 0.25');
        
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        */

        /*
        let gps = document.createAttribute('gps-entity-place');
        gps.value = `latitude: ${latitude}; longitude: ${longitude}`;

        let gltf_model = document.createAttribute('gltf-model');
        gltf_model.value = test_model_src;

        let scale = document.createAttribute('scale');
        scale.value = '0.25 0.25 0.25';
        
        model.setAttributeNode(gps);
        model.setAttributeNode(gltf_model);
        model.setAttributeNode(scale);

        scene.appendChild(model);
        */    

};