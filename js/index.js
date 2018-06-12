function googleIsReady() {
    var BASEURL = 'http://api.openweathermap.org/data/2.5/weather';
    var APPID = 'b79a4483908c66cb68bc3343e347b2b5';
    var WEATHER_PIC_BASEURL = "http://openweathermap.org/img/w/";

    function getUrl(lat, lon) {

        url = `${BASEURL}?lat=${lat}&lon=${lon}&APPID=${APPID}`;
        return url;

    }

    function getLocationWeather(latitude, longitude) {

        if ((latitude !== null) || (longitude !== null)) {
            url = getUrl(latitude, longitude);
            dUrl = url.trim();
            makeWeatherCall(dUrl);
        }
        else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    lat = Number(position.coords.latitude);
                    lon = Number(position.coords.longitude);
                    var myLatLng = { lat: lat, lng: lon };
                    url = getUrl(lat, lon);
                    dUrl = url.trim();
                    makeWeatherCall(dUrl);
                    mapAndView(myLatLng)
                })
            }
        }
    }

    function makeWeatherCall(url) {
        $.ajax({
            url: url,
            data: {
                format: 'json'
            },
            error: function (err) {
                alert('error ');
            },
            dataType: 'jsonp',
            success: function (data) {
                displayInfo(data)
            },
            type: 'GET'
        });
    }

    function displayInfo(data) {
        var loc = document.getElementById('location');
        var hum = document.getElementById('humidity');
        var pres = document.getElementById('pressure');
        var temp = document.getElementById('temp');
        var wImg = document.getElementById('weatherImg');
        loc.innerText = " " + data.name + ", " + data.sys.country;
        temp.innerHTML = " " + (Math.round(Number(data.main.temp)) - 273) + '&deg;C';
        pres.innerText = " " + data.main.pressure;
        hum.innerText = " " + data.main.humidity;
        wImg.src = WEATHER_PIC_BASEURL + data.weather[0].icon + ".png";
    }

    getLocationWeather(null, null)

    function getMapAndWeather(place) {
        var geocoder = new google.maps.Geocoder();
        var address = place;
        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = Number(results[0].geometry.location.lat());
                var longitude = Number(results[0].geometry.location.lng());
                var myLatLng = { lat: latitude, lng: longitude };
                console.log(results);

                getLocationWeather(myLatLng.lat, myLatLng.lng);
                mapAndView(myLatLng);
            } else alert('couldnt get lat and long of place')
        })
    }

    function mapAndView(myLatLng) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 20,
            // mapTypeId: '',
            center: {
                lat:myLatLng.lat,
                lng:myLatLng.lng
            }
        });
        var marker = new google.maps.Marker({
            // position: myLatLng,
            position:{
                lat:myLatLng.lat,
                lng:myLatLng.lng
            },
            map: map,
            title: 'Hello World!'
        });
        var panorama;
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById('street-view'),
            {
                position: myLatLng,
                streetViewControl: true,
                pov: { heading: 165, pitch: 0 },
                zoom: 1
            });
    }

    var placeInput = document.getElementById('placeInput');
    placeInput.addEventListener('click', function () {
        var inp = document.getElementById('enter');
        inpText = inp.value;
        if (!inpText) {
            alert('Please Enter a city first');
            inp.focus();
            return;
        }
        getMapAndWeather(inpText);
    })
    var buttons = document.getElementsByClassName('places');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function (e) {
            el = e.target;
            place = el.innerText + ",NG";
            getMapAndWeather(place);
        })
    }
}
