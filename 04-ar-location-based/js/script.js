
var test_model_src = 'https://gateway.pinata.cloud/ipfs/QmTxmmG33T1mkEucgzDNQLDEQUxDsymusyRv7UiqESnq9F'
var scale = 0.25

window.onload = () => {
    const scene = document.querySelector('a-scene');

    //<a-entity gltf-model="./assets/hot_air_balloon.glb" rotation="0 180 0" scale="0.15 0.15 0.15" gps-entity-place="longitude: 12.823890; latitude: 80.074987;" animation-mixer/>


    let places = [
        { name: "Hot Air Balloon", location: { lat: 80.074987, lng: 12.823890 } },
    ]

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        scene.innerHTML += 
              `<a-entity
                    animation-mixer="loop: repeat"
                    gltf-model=${test_model_src}
                    scale="${scale} ${scale} ${scale}"
                    gps-entity-place="latitude: ${latitude}; longitude: ${longitude};"
                    title=${place.name}
                ></a-entity>
              `

        // add place name
        /*
        const model = document.createElement('a-entity');
        model.setAttribute('animation-mixer', 'loop: repeat');
        model.setAttribute('gltf-model', test_model_src); //'./assets/hot_air_balloon.glb'
        model.setAttribute('scale', '0.25 0.25 0.25');
        
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(model);
        console.log(model);
        */
    });
            

};