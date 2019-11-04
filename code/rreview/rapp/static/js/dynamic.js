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
                    showrestaurants(restaurant_data);
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
                    showrestaurants(restaurant_data);
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
                    let restaurant_data = data["restaurants"];
                    showrestaurants(restaurant_data);
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
function showrestaurants(restaurant_data){
    let current_location = window.location.href
    current_location = current_location.replace(/search\//, '');
    console.log(current_location);
    let inner_data = "<div class='table-responsive'><table class='table' id='rest_results'><tr><th>Thumbnail</th> <th>Rest Name</th><th>Address</th><th> Zomato_URL </th><th>Cuisine</th><th>Rating</th></tr>";
    for(let idx=0; idx < restaurant_data.length; idx+=1){
        inner_data+="<tr>";
        inner_data+="<td>"+ "<img style='width:70px;height:70px;' src=" + restaurant_data[idx]["restaurant"]["thumb"]+">"+"</img>"+"</td>";
        inner_data+="<td>"+ "<a class='zomato_rest_id' target='_blank'  href="+ current_location+ "restaurants/"+ restaurant_data[idx]["restaurant"]["id"] +"/>"+restaurant_data[idx]["restaurant"]["name"]+"</a>" +"</td>";
        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["location"]["address"]+"</td>";
        inner_data+="<td>"+ "<a target='_blank' href="+restaurant_data[idx]["restaurant"]["url"]+">URL</a>"+"</td>";
        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["cuisines"]+"</td>";
        inner_data+="<td>"+ restaurant_data[idx]["restaurant"]["user_rating"]["aggregate_rating"]+"</td>";
        inner_data+="</tr>";
    }
    inner_data += "</table></div>";
    document.getElementById("table_for_data").innerHTML = inner_data;
}
var count;
function starmark(item)
{
    count=item.id[0];
    var subid= item.id.substring(1);
    for(var i=0;i<5;i++)
    {
        if(i<count)
        {
            document.getElementById((i+1)+subid).style.color="orange";
        }
        else
        {
            document.getElementById((i+1)+subid).style.color="black";
        }
    }
}
function result()
{
    if(count==null||count==""){
        alert("Please give star Rating");
        return false;
    }
    else{
        let rating_text = document.getElementById("comment").value
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            method: "POST",
            crossDomain: true,
            url: "",
            dataType: "json",
            async: true,
            data: {
                'rating_value': count,
                'rating_text': rating_text,
                "user_id": 1,
                "csrfmiddlewaretoken" : csrftoken
            },
            headers: {
                "user-key": "2ddaa2d4d751aa03dd3493372fbac29e",
                'Accept': "appication/json"
            },
            success: function(response_data) {
                console.log(response_data);
            },
            complete: function(data){
            },
            error: function() {
                infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
            }
            });
        return false;
    }
    return false;
}

