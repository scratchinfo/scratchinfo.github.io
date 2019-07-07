const proxy = "https://cors-anywhere.herokuapp.com/";

const home = "https://scratch.mit.edu";
const api = "https://api.scratch.mit.edu";

var user = "griffpatch";

var response = "";

var agentinfo = "";

var projids = [];

var totalloves = 0;
var totalfavorites = 0;
var totalremixes = 0;
var totalviews = 0;
var totalcomments = 0;
var totalprojects = 0;

/* 
request
*/

function request(url,callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      response = xhttp.responseText;
      callback();
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

/* set info */

// User ID, Location, Joined, Bio, Status
request(proxy+api+"/users/"+user, function() {
  var data = JSON.parse(response);

  try {

  document.getElementById("username").innerHTML = data.username;

  document.getElementById("userid").innerHTML = "User ID: "+data.id;

  document.getElementById("userlocation").innerHTML = "Location: "+data.profile.country;

  document.getElementById("userjoined").innerHTML = "Joined: "+data.history.joined.split("T")[0];

  document.getElementById("userprofilepic").src = data.profile.images["90x90"];
  
  document.getElementById("bio").innerHTML = data.profile.bio;
  
  document.getElementById("status").innerHTML = data.profile.status;
  }catch(err){}
})

// User Messages

request(proxy+api+"/users/"+user+"/messages/count", function() {
  var data = JSON.parse(response);

  document.getElementById("usermessages").innerHTML = "Current Messages: " + data.count;
})

// attempt user os and browser

var idproj = "";

function getOS(m) {
  
  if (m == 3) {
    var reqr = proxy+"https://projects.scratch.mit.edu/" + idproj + "/get";
  }

  if (m == 2) {
    var reqr = proxy+"https://projects.scratch.mit.edu/internalapi/project/" + idproj + "/get";
  }
  
  request(reqr, function() {
    try {
      var projdata = JSON.parse(response);
      if (m == 3) {
        agentinfo = projdata.meta.agent;
      } else {
        agentinfo = projdata.info.userAgent;
      }

      document.getElementById("useros").innerHTML = "OS: " + agentinfo.replace(";","(").split("(")[1];
      document.getElementById("userbrowser").innerHTML = "Browser: " + agentinfo.split("Gecko) ")[1].split("/")[0];

      // test for edge

      if (agentinfo.replace(/ /g,"/").split("/")[agentinfo.replace(/ /g,"/").split("/").length-2] == "Edge") {
        document.getElementById("userbrowser").innerHTML = "Browser: Edge";
      }
    } catch(err) {
      
    }
  })
}

var highestid = 0;

function getAllprojects(off) {
  request(proxy+api+"/users/"+user+"/projects?offset="+off, function() {
    var data = JSON.parse(response);
    projids = [];

    for (var i = 0;i<data.length;i++) {
      if (data[i]["id"] > highestid) {
        highestid = data[i]["id"];
      }

      // update total stats

      totalloves += data[i].stats.loves;
      totalfavorites += data[i].stats.favorites;
      totalviews += data[i].stats.views;
      totalcomments += data[i].stats.comments;
      projids.push(data[i]["id"]);
    }
    
    totalprojects += data.length;
    if (data.length == 20) {
      getAllprojects(off+20);
    } else {
      idproj = highestid;
      getOS(2);
      getOS(3);
      totalstats();
      
    }
  })
}

// get total stats by looking through projects, also get most recent to get OS/BROWSER
getAllprojects(0);

var complete = 0;
function totalstats() {
  // get remixes
  //try{
  //for(var i = 0;i<projids.length;i++){
  //  request("https://cors-anywhere.herokuapp.com/https://scratch.mit.edu/projects/"+projids[i]+"/remixtree/bare/",function(){
  //    complete += 1;
  //    if(response != "no data") {
  //      var remixdata = JSON.parse(response);
  //      totalremixes += Object.keys(remixdata).length;
  //    }
  //
  //    if (complete == projids.length) {
  //      document.getElementById("totalremixes").innerHTML = "Remixes: "+totalremixes;
  //    }
  //
  //})
  //}}catch(err){}
  // put totalstats in
  try{
  document.getElementById("totalloves").innerHTML = "Loves: "+totalloves;
  document.getElementById("totalfavorites").innerHTML = "Favorites: "+totalfavorites;
  
  document.getElementById("totalviews").innerHTML = "Views: "+totalviews;
  document.getElementById("totalcomments").innerHTML = "Comments: "+totalcomments;
  document.getElementById("totalprojects").innerHTML = "Projects created by user: "+totalprojects;}catch(err){alert(err)}
}
