
var test_model_src = 'https://gateway.pinata.cloud/ipfs/QmTxmmG33T1mkEucgzDNQLDEQUxDsymusyRv7UiqESnq9F'
var scale = 0.25

window.onload = () => {
    const scene = document.querySelector('a-scene');
    const dom = document.querySelector('body');

    //<a-entity gltf-model="./assets/hot_air_balloon.glb" rotation="0 180 0" scale="0.15 0.15 0.15" gps-entity-place="longitude: 12.823890; latitude: 80.074987;" animation-mixer/>


    let places = [
        { name: "Hot Air Balloon", location: { lat: 80.074987, lng: 12.823890 } },
    ]

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        debugger
        dom.innerHTML += 
              `
              <a-scene
                renderer="logarithmicDepthBuffer: true;"
                loading-screen="enabled: false;"
                arjs="sourceType: webcam; debugUIEnabled: false;"
                embedded>

                <a-entity
                    animation-mixer="loop: repeat"
                    gltf-model=${test_model_src}
                    scale="${scale} ${scale} ${scale}"
                    gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
                    title=${place.name}
                ></a-entity>
                <a-camera gps-camera rotation-reader></a-camera>
                </a-scene>
              `

        // add place name
        const model = document.createElement('a-entity');

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
        
    });
            

};