var zomato_endpoint = "https://developers.zomato.com/api/v2.1/"
var categoryMap = new Map();
var cuisineMap = new Map();
var restaurantTypeMap = new Map();
var total_pages = null;

function populate_criteria(value){
    var collection=null;
    switch(value){
        case "cuisine":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"cuisines?city_id=6",  // hardcoded as for banglore city id is 4
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    var cuisine_data = data["cuisines"];
                    let inner = ""
                    for(let idx=0; idx< cuisine_data.length; idx+=1){
                     cuisineMap.set(cuisine_data[idx]["cuisine"]["cuisine_name"], cuisine_data[idx]["cuisine"]["cuisine_id"]);
                     inner +="<option>"+ cuisine_data[idx]["cuisine"]["cuisine_name"] + "</option>";
                    }
                    document.getElementById("to_be_populated").innerHTML = inner;
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
            //collection=["cuisine1", "cuisine2", "cuisine3"];
            break;
        case "category":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"categories",
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    var category_data = data["categories"];
                    let inner = ""
                    for(let idx=0; idx< category_data.length; idx+=1){
                     categoryMap.set(category_data[idx]["categories"]["name"], category_data[idx]["categories"]["id"]);
                     inner +="<option>"+ category_data[idx]["categories"]["name"] + "</option>";
                    }
                    document.getElementById("to_be_populated").innerHTML = inner;

                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
            break;
        case "rest_type":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"establishments?city_id=4",
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    var restaurant_type_data = data["establishments"];
                    let inner = ""
                    for(let idx=0; idx< restaurant_type_data.length; idx+=1){
                     restaurantTypeMap.set(restaurant_type_data[idx]["establishment"]["name"], restaurant_type_data[idx]["establishment"]["id"]);
                     inner +="<option>"+ restaurant_type_data[idx]["establishment"]["name"] + "</option>";
                    }
                    document.getElementById("to_be_populated").innerHTML = inner;
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
            break;
        default:
            alert("in default");
    }

    return false;
}
function city_autocomplete(){
    var data=['Bengaluru', 'Delhi NCR', 'Hyderabad'];
    $("#city").autocomplete({
        source: data
    });
}
function search_restaurant(){
    let search_criteria = document.forms["search_form"]["search_criteria"].value;
    let to_be_populated = document.forms["search_form"]["to_be_populated"].value;
    switch(search_criteria){
        case "cuisine":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"search?lat=12.9716&lon=77.5946&cuisines="+ cuisineMap.get(to_be_populated),
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    let restaurant_data = data["restaurants"];
                    let inner_data = "<div class='table-responsive'><table class='table' id='rest_results'><tr><th>Thumbnail</th> <th>Rest Name</th><th>Address</th><th>Phone</th><th> Zomato_URL </th><th>Cuisine</th><th>Avg Cost For Two(2)</th><th>Rating</th></tr>";
                    for(let idx=0; idx < restaurant_data.length; idx+=1){
                        inner_data+="<tr>"
                        inner_data+="<td>"+ "<img src=" + restaurant_data[idx]["restaurant"]["thumb"]+">"+"</img>"+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["name"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["location"]["address"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["phone_numbers"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["url"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["cuisines"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["average_cost_for_two"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["user_rating"]["aggregate_rating"]+"</td>";
                        inner_data+="</tr>"
                    }
                    inner_data += "</table></div>";
                    document.getElementById("table_for_data").innerHTML = inner_data;﻿

                    /*let restaurant_data = data["restaurants"];
                    let inner_data = "<table id='rest_results'><tr><th>Thumbnail</th> <th>Rest Name</th><th>Address</th><th>Phone</th><th> Zomato_URL </th><th>Cuisine</th><th>Avg Cost For Two(2)</th><th>Rating</th></tr>";
                    for(let idx=0; idx < restaurant_data.length; idx+=1){
                        inner_data+="<tr>"
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["thumb"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["name"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["location"]["address"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["phone_numbers"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["url"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["cuisines"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["average_cost_for_two"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["user_rating"]["aggregate_rating"]+"</td>";
                        inner_data+="</tr>"
                    }
                    inner_data += "</table>";
                    document.getElementById("table_for_data").innerHTML = inner_data;*/
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                    }
            });
        break;
        case "category":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"search?lat=12.9716&lon=77.5946&category="+ categoryMap.get(to_be_populated),
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                let restaurant_data = data["restaurants"];
                let inner_data = "<table id='rest_results'><tr><th>Thumbnail</th> <th>Rest Name</th><th>Address</th><th>Phone</th><th> Zomato_URL </th><th>Cuisine</th><th>Avg Cost For Two(2)</th><th>Rating</th></tr>";
                for(let idx=0; idx < restaurant_data.length; idx+=1){
                    inner_data+="<tr>"
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["thumb"] +"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["name"]+"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["location"]["address"]+"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["phone_numbers"]+"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["url"]+"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["cuisines"]+"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["average_cost_for_two"]+"</td>";
                    inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["user_rating"]["aggregate_rating"]+"</td>";
                    inner_data+="</tr>"
                }
                inner_data += "</table>";
                document.getElementById("table_for_data").innerHTML = inner_data;
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                }
            });
        break;
        case "rest_type":
            $.ajax({
                method: "GET",
                crossDomain: true,
                url: zomato_endpoint+"search?lat=12.9716&lon=77.5946&establishment_type="+ restaurantTypeMap.get(to_be_populated),
                dataType: "json",
                async: true,
                headers: {
                  "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                  'Accept': "appication/json"
                },
                success: function(data) {
                    let restaurant_data = data["restaurants"]
                    let inner_data = "<table id='rest_results'><tr><th>Thumbnail</th> <th>Rest Name</th><th>Address</th><th>Phone</th><th> Zomato_URL </th><th>Cuisine</th><th>Avg Cost For Two(2)</th><th>Rating</th></tr>";
                    for(let idx=0; idx < restaurant_data.length; idx+=1){
                        inner_data+="<tr>"
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["thumb"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["name"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["location"]["address"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["phone_numbers"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["url"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["cuisines"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["average_cost_for_two"]+"</td>";
                        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["user_rating"]["aggregate_rating"]+"</td>";
                        inner_data+="</tr>"
                    }
                    inner_data += "</table>";
                    document.getElementById("table_for_data").innerHTML = inner_data;
                },
                complete: function(data){
                },
                error: function() {
                  infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                }
            });
        break;
    }
    return false;
}
