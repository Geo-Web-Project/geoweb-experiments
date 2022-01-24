
function loadPlaces(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: '<YOUR-CLIENT-ID>',
        clientSecret: 'YOUR-CLIENT-SECRET',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };


    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `${corsProxy}https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30 
        &v=${params.version}`;

    
};


window.onload = () => {
    const scene = document.querySelector('a-scene');

    //<a-entity gltf-model="./assets/hot_air_balloon.glb" rotation="0 180 0" scale="0.15 0.15 0.15" gps-entity-place="longitude: 12.823890; latitude: 80.074987;" animation-mixer/>


    let places = [
        { name: "Hot Air Balloon", location: { lat: 80.074987, lng: 12.823890 } },
    ]

    places.forEach((place) => {
        const latitude = place.location.lat;
        const longitude = place.location.lng;

        // add place name
        const model = document.createElement('a-entity');
        model.setAttribute('gltf-model', './assets/hot_air_balloon.glb');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
        model.setAttribute('title', place.name);
        model.setAttribute('scale', '15 15 15');
        
        placeText.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });

        scene.appendChild(model);
    });
            

};