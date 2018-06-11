//$(document).ready(function () {
   
   function googleIsReady(){
         var BASEURL = 'http://api.openweathermap.org/data/2.5/weather';
    var APPID = 'b79a4483908c66cb68bc3343e347b2b5';
    var WEATHER_PIC_BASEURL = "http://openweathermap.org/img/w/"


    function getUrl(place, lat, lon) {
        if (place != null) {
            url = `${BASEURL}?q=${place}&APPID=${APPID} `
        }
        else {
            if ((lat != null) && (lon != null)) {
                url = `${BASEURL}?lat=${lat}&lon=${lon}&APPID=${APPID}`;
            }
        }
        return url;
    }

    function getLocationWeather(place, lat, lon) {
        if (place != null) {
            url = getUrl(place, null, null);
            dUrl = url;
            makeWeatherCall(dUrl);
        } else if (lat != null || lon != null) {
            url = getUrl(null, lat, lon);
            dUrl = url.trim();
            makeWeatherCall(dUrl);
        }
        else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    setTimeout(function () {
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;
                        url = getUrl(null, lat, lon);
                        dUrl = url.trim();
                        makeWeatherCall(dUrl);
                    }, 3000)

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
                console.log(data);
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

        loc.innerText = " "+ data.name + ", " + data.sys.country;
        temp.innerHTML =" "+ (Math.round(Number(data.main.temp)) - 273)+'&deg;C';
        pres.innerText =" "+ data.main.pressure;
        hum.innerText =" "+ data.main.humidity;
        wImg.src = WEATHER_PIC_BASEURL +data.weather[0].icon+".png";
    }

    getMapAndWeather('Lagos')



    function getMapAndWeather(place) {
        var geocoder = new google.maps.Geocoder();
        var address = place;
        geocoder.geocode({ 'address': address }, function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                var myLatLng = { lat: latitude, lng: longitude };
                console.log(results);
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 20,
                    // mapTypeId: '',
                    center: myLatLng
                });
                var marker = new google.maps.Marker({
                    position: myLatLng,
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
                //  getLocationWeather(place, null, null);

                getLocationWeather(null, myLatLng.lat, myLatLng.lng);
            } else alert('couldnt get lat and long of place')
        });
    }

    var placeInput = document.getElementById('placeInput');
    placeInput.addEventListener('click', function () {
        var inp = document.getElementById('enter');

        inpText = inp.value;
        // alert(inpText)
        if (!inpText) {
            alert('Please Enter a city first');
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
    // getLocationWeather(null, null, null)







































   }

//});