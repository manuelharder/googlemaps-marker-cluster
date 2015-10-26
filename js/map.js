
var data = [ { lat: -41.295847, lng: 174.789309},  { lat:-41.29414310032885, lng:174.77252631210578},  { lat:-41.29384552004231, lng:174.76944810788936},  { lat:-41.29643896278497, lng:174.7752317945309},  { lat:-41.29186292589351, lng:174.7807622202924},  { lat:-41.296693972534435, lng:174.7760716779658},  { lat:-41.29916974676637, lng:174.77898986295395},  { lat:-41.29705608443039, lng:174.77141826480636},  { lat:-41.28962918838811, lng:174.77723046081545},  { lat:-41.30012296957695, lng:174.77947164857568},  { lat:-41.29256977463054, lng:174.7757026345903},  { lat:-41.29704084638604, lng:174.76900536631993},  { lat:-41.28987099457543, lng:174.77833897502535},  { lat:-41.29053006847101, lng:174.7756071672897},  { lat:-41.294381958477175, lng:174.77796968105227},  { lat:-41.29064997282737, lng:174.77260239691486},  { lat:-41.297485560857965, lng:174.77728256634975},  { lat:-41.291115483853915, lng:174.7738475013399},  { lat:-41.2936206513546, lng:174.78274693466645},  { lat:-41.293977975621374, lng:174.77558114660997},  { lat:-41.29957471334038, lng:174.76868881874032},  { lat:-41.29048289285917, lng:174.7745204558379},  { lat:-41.29635955109036, lng:174.76870509106084},  { lat:-41.29591662725607, lng:174.77938986380633},  { lat:-41.29148248387414, lng:174.7716039371381},  { lat:-41.29625515580377, lng:174.77307008890833},  { lat:-41.29942554848955, lng:174.76905919967442},  { lat:-41.2944269324148, lng:174.77255472053952},  { lat:-41.29814520891947, lng:174.77216608758005},  { lat:-41.29400254058678, lng:174.77390192631486},  { lat:-41.299405074774135, lng:174.77408575361002},  { lat:-41.28812360221885, lng:174.77936877484004},  { lat:-41.29075412690314, lng:174.77596623709624},  { lat:-41.29148344424273, lng:174.77391567632333},  { lat:-41.29696295005136, lng:174.77332727808556},  { lat:-41.29317202517782, lng:174.77826843884463},  { lat:-41.28873047541333, lng:174.7800964929503},  { lat:-41.28819761597118, lng:174.77572544480276},  { lat:-41.286473729384056, lng:174.77748442210302},  { lat:-41.28549774155325, lng:174.76989744133377},  { lat:-41.29701308987064, lng:174.7748859430116},  { lat:-41.29025187940719, lng:174.7705674496695},  { lat:-41.30096555197616, lng:174.77999554811964},  { lat:-41.28830841472813, lng:174.77485829259248},  { lat:-41.288658499949875, lng:174.77532399502374},  { lat:-41.29053835577197, lng:174.78089523646318},  { lat:-41.302376488109125, lng:174.77830381972163},  { lat:-41.2849283044995, lng:174.77115125174424},  { lat:-41.29275352822317, lng:174.77217121774947},  { lat:-41.294225186413506, lng:174.7826623919247},  { lat:-41.2971233866604, lng:174.7748117943035},  { lat:-41.29694523871804, lng:174.7713007877655},  { lat:-41.29764038729892, lng:174.78275767907527},  { lat:-41.289559755184094, lng:174.7772927600472},  { lat:-41.29698322335302, lng:174.7675235109187},  { lat:-41.287670088489854, lng:174.7791695480396},  { lat:-41.29945427724479, lng:174.77146878703516},  { lat:-41.293984411698126, lng:174.783338156725},  { lat:-41.285286947799065, lng:174.7803740816458},  { lat:-41.29090873740395, lng:174.7664598205911},  { lat:-41.2859734843379, lng:174.7799186294332},  { lat:-41.2855646930857, lng:174.77782358389535},  { lat:-41.28842583127429, lng:174.773246779467},  { lat:-41.29504655655713, lng:174.76890249998573},  { lat:-41.295781977565795, lng:174.76681081340524},  { lat:-41.289730047520436, lng:174.77727994510954},  { lat:-41.2926703152238, lng:174.77167763100357},  { lat:-41.29244537688269, lng:174.78213355197684},  { lat:-41.29274450630562, lng:174.77748680536737},  { lat:-41.301327056243146, lng:174.77846425955343},  { lat:-41.29630135736958, lng:174.77624750293194}]

var map, marker;
var cm_openInfowindow;
var mapMarkers = [];
var mapHTMLS = [];
var directionsDisplay;
var directionsService;
var myOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
}


var distBetween = 0.5;
var overlay = [];
var marker = [];

var cluster, cluster2, cluster3;

ClusterCenter.prototype = new google.maps.OverlayView();


$(function() {


  calcCluster(distBetween);   

  map = new google.maps.Map(document.getElementById("map"), myOptions);

  
  var address = $.get("http://maps.googleapis.com/maps/api/geocode/json?address=Wellington+new+zealand&sensor=false",
        
    function(response) {
          
            map.setCenter(new google.maps.LatLng(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng));
            map.setZoom(14);

            setMarkersAndCluster(cluster3);

            google.maps.event.addListener(map, 'zoom_changed', function() {
    
              distBetween = getDistBetween();
                
              // clearing the map  
              $.each(overlay, function() { this.setMap(null); });
              $.each(marker, function() {  this.setMap(null); });

              var clusterNew = calcCluster(distBetween); 

              setMarkersAndCluster(clusterNew);

            });      
        }
      );
 
});



function setMarkersAndCluster(cluster3) {

  $.each(cluster3.cluster, function(index, arr) { 

    // if there are more than 1 item it's a cluster
    if (arr.length > 1) {

      addOverlay(map, arr.length, cluster3.center[index], index, cluster3);
    }
    else {

      // only one item it's a marker, no need for a cluster

      loc = new google.maps.LatLng(data[arr[0]].lat, data[arr[0]].lng);

      m = new google.maps.Marker({
        map: map,
        position: loc,
        icon: 'http://www.manusplace.de/test/marker-8.png'
           
      });

      marker.push(m)

      google.maps.event.addListener(m, 'click', function () {

        //$.markerIsClicked(this, map, response.results[0].geometry.location, arr[0]);
      }); 
    }

  });
}


function calcCenter(cluster, cId, id) {

  if (typeof cluster.center[cId] === "undefined") {
    cluster.center[cId] = data[id];
  }
  else {

    // new one is already in there
    var len = cluster.cluster[cId].length;

    if (len > 1) {
      var lat = Number(cluster.center[cId].lat) * (len-1);
      var lng = Number(cluster.center[cId].lng) * (len-1);
    }
    else {
      return;
    }

    if (lat > 0 && Number(data[id].lat) > 0) { lat = (lat + Number(data[id].lat)) / len; }
    else if (lat < 0 && Number(data[id].lat) < 0) { lat = (lat + Number(data[id].lat)) / len; }
    else { lat = (lat - Number(data[id].lat)) / len; }


    if (lng > 0 && Number(data[id].lng) > 0) { lng = Number(lng + Number(data[id].lng)) / len; }
    else if (lng < 0 && Number(data[id].lng) < 0) { lng = Number(lng + Number(data[id].lng)) / len; }
    else { lng =Number(lng - Number(data[id].lng)) / len; }

    cluster.center[cId] = {lat : lat , lng : lng };

  }



}






$.extend({

  markerIsClicked : function(el, map, l, index) {

      var boxText = document.createElement("div");
      boxText.innerHTML = "<br/><h3>Infobox " + index +"</h3><p>yeah</p>";
      var myOptions = {
          content: boxText
          , disableAutoPan: false
          , maxWidth: 0
          , boxClass: "infoWindowStyle"
          , pixelOffset: new google.maps.Size(-178, -128)
          , zIndex: null
          , boxStyle: {
              background: "#CCC"
            , opacity: 1
            , width: "354px"
            , height: "120px"
          }
          , isHidden: false
          , pane: "floatPane"
          , enableEventPropagation: false
          , infoBoxClearance: new google.maps.Size(1, 1)
      };

      var ib = new InfoBox(myOptions);
      ib.open(map, el);
      $.cm_setInfowindow(ib);
      setTimeout(function() { map.panTo(new google.maps.LatLng(l.lat, l.lng)); map.setZoom(14); }, 50);

      google.maps.event.addDomListener($(boxText).find("h3")[0], 'click', function (e) { 
          alert("clicked");
      });
  },

  cm_setInfowindow: function (newInfowindow) {

      if (cm_openInfowindow != undefined) {
          cm_openInfowindow.close();
      }

      cm_openInfowindow = newInfowindow;
  }


});



// TEST for getting the 5 clostest ones to a location
var helper = [];

for (var i = 1; i <= 200; i++) {
  var d = calcCrow(4.419414+i/2,1.189804+i/1.5,48.400000,60.200000).toFixed(1);
  //console.log(d);

  if (helper.length < 5 ) helper.push(d);
  else {

    helper.sort(function(a, b){return a-b});

    if (Number(d) < helper[4]) {
      helper[4] = d;
    }
  }
};
// end TEST


// check if the marker is close enough to a existing cluster center
function getInCluster(cluster, id, distBetween) {

  var finalD = { dist: 1000, cId : false }, d;

  $.each(cluster.center, function(c_Id, latLngObj) {

    d = calcCrow(data[id].lat, data[id].lng, latLngObj.lat, latLngObj.lng).toFixed(2);

    if (d < distBetween && d < finalD.dist) { finalD = { dist : d, cId : c_Id }; };
  });

  return finalD;
}


// check to which cluster center the item is closest
function getClusterID(cluster, id) {

  var finalD = { dist: 10000, cId : false }, d;

  $.each(cluster.center, function(c_Id, latLngObj) {

    d = calcCrow(data[id].lat, data[id].lng, latLngObj.lat, latLngObj.lng).toFixed(2);

    if (d < finalD.dist) { finalD = { dist : d, cId : c_Id }; };
  });

  return finalD.cId;
}



// cluster with the arrays of the item ids
// item with mapping item id and cluster id
// center with the center point lat/lng of each cluster

function calcCluster(distBetween) {

  cluster = { cluster: [], item : [], center : [] };
  cluster2 = { cluster: [], item : [], center : [] };
  cluster3 = { cluster: [], item : [], center : [] };

  cluster.cluster[0] = [];
  cluster.cluster[0].push(0);
  cluster.item[0] = 0;
  cId = 0;
  calcCenter(cluster, cId, 0);

  $.each(data, function(index, value) { 

    if (index == 0 ) { return; }

      var result = getInCluster(cluster, index, distBetween);

      // if the item is within a cluster add it and recalculate the center
      if (result.cId !== false) {

        cluster.cluster[result.cId].push(index);
        cluster.item[index] = result.cId;
        calcCenter(cluster, result.cId, index);
      }
      else {
 
        // if not inside create new cluster center == item itself
        cId++;
        cluster.cluster[cId] = [];
        cluster.cluster[cId].push(index);
        cluster.item[index] = cId;
        calcCenter(cluster, cId, index);
      }
  });


  cluster2.cluster[0] = [];
  cluster2.cluster[0].push(0);
  cluster2.item[0] = 0;

  $.each(data, function(index, value) { 

    // check if the item might be closer to another cluster center (optimizing precision)
    cId = getClusterID(cluster, index);

    if (typeof cluster2.cluster[cId] === "undefined") {
      cluster2.cluster[cId] = [];
    }

    cluster2.cluster[cId].push(index);
    cluster2.item[index] = cId;
  });

  // recalculate the cluster center for the optimized clusters
  $.each(cluster2.item, function(index, value) { 

    calcCenter(cluster2, value, index);
  });


  // do the same thing again to get a precise cluster
  cluster3.cluster[0] = [];
  cluster3.item[0] = 0;

  $.each(data, function(index, value) { 

    cId = getClusterID(cluster2, index);

    if (typeof cluster3.cluster[cId] === "undefined") {
      cluster3.cluster[cId] = [];
    }

    cluster3.cluster[cId].push(index);
    cluster3.item[index] = cId;
  });

  cluster3.center = cluster2.center;

  return cluster3;
}



// caluclate distance between 2 points
function calcCrow(lat1, lon1, lat2, lon2)  {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
}

// Converts numeric degrees to radians
function toRad(Value) {
  return Value * Math.PI / 180;
}
  

function ClusterCenter(bounds, image, map, content, cId, cluster3) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.map_ = map;
    this.div_ = null;
    this.cId_ = cId;
    this.cluster3_ = cluster3;
    this.content_ = content;
    this.setMap(map);
}



function addOverlay(map, content, latLng, cId, cluster3) {


  var swBound = new google.maps.LatLng(latLng.lat, latLng.lng);
  var neBound = new google.maps.LatLng(latLng.lat, latLng.lng);
  var bounds = new google.maps.LatLngBounds(swBound, neBound);

  var srcImage = 'http://manusplace.de/test/marker-0.png';

  overlay.push(new ClusterCenter(bounds, srcImage, map, content, cId, cluster3));

  ClusterCenter.prototype.onAdd = function() {

    // add the div with the number of markers within the cluster
    var div = document.createElement('div');
    div.setAttribute("class", "cluster-overlay");
    
    var para = document.createElement("p");
    var node = document.createTextNode(this.content_);
    para.appendChild(node);
    div.appendChild(para);

    this.div_ = div;
   
    //add element to clickable layer 
    this.getPanes().overlayMouseTarget.appendChild(div);

    // set this as locally scoped var so event does not get confused
    var me = this;

    // if you click on the cluster overlay it will zoom in 1 level
    google.maps.event.addDomListener(div, 'click', function() {
        //google.maps.event.trigger(me, 'click');

      map.panTo(new google.maps.LatLng(me.cluster3_.center[me.cId_].lat, me.cluster3_.center[me.cId_].lng)); 
      map.setZoom(map.getZoom()+1);
      
      $.each(overlay, function() {

        this.setMap(null);
      });

      distBetween = getDistBetween();

      var clusterNew = calcCluster(distBetween); 

      setMarkersAndCluster(clusterNew);

/*
      $.each(me.cluster3_.cluster[me.cId_], function(index, value) {

        loc = new google.maps.LatLng(data[value].lat, data[value].lng);

        marker = new google.maps.Marker({
          map: me.map,
          position: loc,
          icon: 'http://www.manusplace.de/test/marker-7.png'
             
        });
      }); 
*/



    });
  };


  // draw the overlays
  ClusterCenter.prototype.draw = function() {

    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var div = this.div_;
    div.style.left = sw.x - 16 + 'px';
    div.style.top = ne.y - 16 + 'px';
  };

  // The onRemove() method will be called automatically from the API
  ClusterCenter.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };

}


function getDistBetween() {

  distBetween = 0.5;
  if (map.getZoom() <= 12) { distBetween = 2; }
  if (map.getZoom() == 13) { distBetween = 1; }
  if (map.getZoom() == 15) { distBetween = 0.15; }
  if (map.getZoom() == 16) { distBetween = 0.1; }
  if (map.getZoom() == 17) { distBetween = 0.04; }
  // for later show all
  if (map.getZoom() >= 18) { distBetween = 0.0001; }

  return distBetween;
}



 /*
              $.each(data, function(index, value) {


                  loc = new google.maps.LatLng(this.lat, this.lng);

                  marker = new google.maps.Marker({
                     map: map,
                      position: loc,
                     icon: 'http://www.manusplace.de/test/marker-'+cluster3.item[index]+'.png'
                     
                  });

                  google.maps.event.addListener(marker, 'click', function () {
                      $.markerIsClicked(this, map, response.results[0].geometry.location, index);
                  });
                
            });*/