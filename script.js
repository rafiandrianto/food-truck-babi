/* import json files 
all .json files are written and designed by Timur Bakhtiyorovich Rakhmanov,
translated by Coga Carlos and Minori Mukai */
import campus_information from "./BKC_info.json" assert {type: 'json'};
import truck_information from "./truck_info.json" assert {type: 'json'};
import November from "./location_info.json" assert {type: 'json'};


var trucks = [];
var truck_names = [];
var trucks_today = [];
var location_today = [];
var buildings = new Map();
var map, dir_service, dir_display;
var markers = [];

function adjustToData(campus_info, truck_information, 
    data_month, trucks, truck_names, 
    trucks_today, location_today, buildings){

    //assign names and location of buildings 
    // with the hashmap and for loop
    for (var bld_idx in campus_info.buildings){
        buildings.set(campus_info.buildings[bld_idx].name,
            campus_info.buildings[bld_idx].coordinates);
    }
    console.log()

    trucks = new Map();
    for (var truck_idx in truck_information.trucks){
        trucks.set(truck_information.trucks[truck_idx].name,
            truck_information.trucks[truck_idx].menu);
        truck_names.push(truck_information.trucks[truck_idx].name);
    }
    const date = new Date();

    let month = date.getMonth();
    let day = date.getDate(); //date.getDate();
    const day_schedule = new Map();
    const months = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December'];
    
    var iterable;
    
    for (const schedule_day in data_month.November){
        if (schedule_day == day){
            iterable = data_month.November[day];
            for (var slot in iterable){
                if (truck_names.includes(iterable[slot]["truck"])){
                   trucks_today.push(iterable[slot]["truck"]);
                   location_today.push(iterable[slot]["location"]);
                };
            };
        };
    };
    AdjustButtonsToDate(trucks_today, day);
}
console.log(buildings);

adjustToData(campus_information, truck_information, November, 
    trucks, truck_names, trucks_today, location_today, buildings);

function AdjustButtonsToDate(trucks_today, date){
    let idx;
    for (idx=0; idx < trucks_today.length; idx++){
        let element = document.getElementById(trucks_today[idx]);
        if (element){
            element.style.display = 'flex';
        }
    }
}


// Define map function
// programmer in charge: Timur Bakhtiyorovich Rakhmanov
function initMap() {

    const BKC_campus = {lat: 34.982154, lng: 135.963673};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      center: BKC_campus
    });
    dir_service = new google.maps.DirectionsService,
    dir_display = new google.maps.DirectionsRenderer({
        map: map
    });

}
  
window.initMap = initMap;

const stall_buttons = document.getElementById('clickable_trucks');
console.log(trucks_today);
stall_buttons.addEventListener('click', (event) => {
    var isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
      return;
    }else{
        var truck = event.target.className.slice(6);
        var coordinates_idx = trucks_today.indexOf(truck);
        var location = location_today[coordinates_idx];
        var coordinates = buildings.get(location);
        console.log(coordinates);
        putMarker(coordinates, truck);
    }
  });


function putMarker(coordinates, label_t){  
    var marker;
    if (markers[0]){
        markers[0].setMap(null);
        markers.pop();
    };
    
    marker = new google.maps.Marker({
        position: coordinates,
        map: map,
        label: label_t
    });
    markers.push(marker);
};
/*-----------------------------------------------------------*/

/* Calendar */

const date = new Date();

const renderCalendar = () => {

    date.setDate(1);

    const monthDays = document.querySelector(".days");
    
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    
    const firstDayIndex = date.getDay();
    
    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    
    const nextDays = 7 - lastDayIndex - 1;
    
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    
    document.querySelector(".date h1").innerHTML
    = months[date.getMonth()];
    
    document.querySelector(".date p").innerHTML
    = new Date().toDateString();
    
    let days = "";
    
    for(let x = firstDayIndex; x > 0; x--){
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }
    
    for(let i = 1; i <= lastDay; i++){
        if(i === new Date().getDate() && date.getMonth() === new Date().getMonth()){
            days += `<div class="today">${i}</div>`;
        } else {
            days += `<div>${i}</div>`;
        }
    }
    
    for(let j = 1; j <= nextDays; j++){
        days += `<div class="next-date">${j}</div>`;
    }
    monthDays.innerHTML = days;
}


document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();