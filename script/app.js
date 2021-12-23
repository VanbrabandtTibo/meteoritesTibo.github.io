// data
var dataYears = [];
var dataAmount = [];
var dictCenturies = new Object();

var activities = [];
var positionLastMeteorite = [];

// date validation
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

// draw chart
function chartVisualiser(Response) {
	for (var i = 0; i < Response.length; i++) {
		var year = new Date(Response[i].year).getFullYear();
		if (`${year}` in dictCenturies){
			if (year == "NaN"){
				console.log(year);
			}
			else{
				dictCenturies[`${year}`] += 1;
			}
		}
		else {
			dictCenturies.year = `${year}`;
			dictCenturies[`${year}`] = 1;
		}
	}

	console.log(dictCenturies);
	console.log(Object.keys(dictCenturies)[0]);
	console.log(dictCenturies[Object.keys(dictCenturies)[0]])

	let objLength = Object.keys(dictCenturies).length;
	console.log(objLength);

	for (var i = 0; i < objLength; i++){
		var t;
		t = Object.keys(dictCenturies)[i];
		dataYears.push(t);
		dataAmount.push(dictCenturies[t]);
	}

	console.log(dataYears);
	console.log(dataAmount);

	var chart = new Chart("myChart", {
		type: 'bar',
		data: {
			labels: dataYears,
			datasets: [{
				backgroundColor: "white",
				data: dataAmount
			}]
		},
		options: {
			responsive: true,
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Date'
					},
					ticks: {
						min: 2000,
						beginAtZero: false
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Amount'
					},
					ticks: {
						max: 16
					}
				}]
			}
		}
	});
	chart.render();
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
// fill attributes
let showResult = queryResponse => {
	console.log(queryResponse.length);
	
	var arr = JSON.parse(JSON.stringify(queryResponse));
	console.log(arr);
	for (var i = 0; i < arr.length;i++){
		if (arr[i].year == "NaN"){
			console.log(i);
		}
		else{
			activities.push(arr[i]);
		}
	}

	console.log(activities);

	activities.sort(dynamicSort("year"));

	console.log(activities);

	var last;
	var lengte;

	lengte = activities.length;
	last = activities[lengte-1];

	document.querySelector('.js-meoteoriteCount').innerHTML = `Landed meteorites count <big style="color:#FFD700">${queryResponse.length}</big> on planet earth.`;
	console.log(queryResponse[0].name);
	document.querySelector('.js-name').innerHTML = last.name;
	console.log(queryResponse[0].mass);
	document.querySelector('.js-mass').innerHTML = last.mass;
	console.log(queryResponse[0].year);
	document.querySelector('.js-date').innerHTML = formatDate(last.year);
	console.log(queryResponse[0].reclat);
	document.querySelector('.js-lat').innerHTML = last.reclat;
	console.log(queryResponse[0].reclong);
	document.querySelector('.js-long').innerHTML = last.reclong;
	chartVisualiser(queryResponse);
	
	var map = L.map('map').setView([last.reclat, last.reclong], 13);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGlib3ZhbmJyYWJhbmR0IiwiYSI6ImNreGc0dzNkdDBtMHAyb254MHdlaHBvaGoifQ.8mTyWRHIDh8e8d6nMfiIOg'
	}).addTo(map);
};

//Get API 
const getAPI = function(){
	const url = `https://data.nasa.gov/resource/y77d-th95.json`;
	fetch(url)
		.then(req => {
			if (!req.ok){
				console.error('Error with fetch');
			} else {
				return req.json();
			}
		})
		.then(json => {
			console.log('Fetching data worked!');
			console.log(json);
			showResult(json);
		});
}

// domcontenloaded
document.addEventListener('DOMContentLoaded', function() {
	getAPI();
	const accordion = document.getElementsByClassName('contentBx');

	for (i = 0; i < accordion.length; i++){
    	accordion[i].addEventListener('click', function(){
        	this.classList.toggle('active');
        	console.log(i);
    	});
	}

	function progress(){
		var percent = document.querySelector('.percent');
		var progress = document.querySelector('.progress');
		var text = document.querySelector('.text');
		var ld = document.querySelector('.loading')
		var count = 4;
		var per = 16;
		var loading = setInterval(animate, 50);
		function animate(){
		  if(count == 100 && per == 400){
			percent.classList.add("text-blink");
			text.style.display = "block";

			var bg = document.querySelector('#bg');
			bg.classList.remove("background-progress");

			var body = document.body
			body.style.display = "flex";

			ld.remove();
			percent.remove();
			progress.remove();
			text.remove();

			clearInterval(loading);
		  }
		  else{
			per = per + 4;
			count = count + 1;
			progress.style.width = per + 'px';
			percent.textContent = count + '%';
		  }
		}
	}
	progress();
});