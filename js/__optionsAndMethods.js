
  var MyModules = {};
  MyModules.MapsCluster = {};


  MyModules.MapsCluster.setOptions = function(options, mapSettings, dataObj, self) {


    var mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    self.mapOptions = $.extend(mapOptions, mapSettings);
    self.mapId = options.mapId;
    self.data = dataObj;
    self.overlay = [];
    self.marker = [];
    self.markerEvents;
    
    
    var defaults = {
      distBetween   :  0.5,
      zoomDistance  : {
        _18 :  0.0001,
        _17 :  0.04,
        _16 :  0.1,
        _15 :  0.15,
        _14 :  0.5,
        _13 :  1,
        _12 :  2,
        _11 :  5
      },
      marker_icon : '...marker.png' // add a default marker
    };

    self.config = $.extend(defaults, options);
  };



  MyModules.MapsCluster.setDistanceBetween = function(self) {

      if (self.map.getZoom() <= 11) { self.config.distBetween = self.config.zoomDistance._11; }
      else if (self.map.getZoom() >= 18) { self.config.distBetween = self.config.zoomDistance._18; }
      else { self.config.distBetween = self.config.zoomDistance['_' + self.map.getZoom()]; }
  };


  MyModules.MapsCluster.resetCluster = function(self) {

    self.config.clusters = {
      // the further down, the better the cluster
      obj  : { cluster: [0], item : [0], center : [] },
      obj2 : { cluster: [], item : [], center : [] },
      obj3 : { cluster: [], item : [], center : [] },
    }

  };


  MyModules.MapsCluster.calcCenter = function(cluster, cId, id, self) {

      if (typeof cluster.center[cId] === "undefined") {
        cluster.center[cId] = self.data[id];
      }
      else {

        // new one is already in there
        var len = cluster.cluster[cId].length;

        var lat = Number(cluster.center[cId].lat) * (len-1);
        var lng = Number(cluster.center[cId].lng) * (len-1);

        if (lat > 0 && Number(self.data[id].lat) > 0) { lat = (lat + Number(self.data[id].lat)) / len; }
        else if (lat < 0 && Number(self.data[id].lat) < 0) { lat = (lat + Number(self.data[id].lat)) / len; }
        else { lat = (lat - Number(self.data[id].lat)) / len; }

        if (lng > 0 && Number(self.data[id].lng) > 0) { lng = (lng + Number(self.data[id].lng)) / len; }
        else if (lng < 0 && Number(self.data[id].lng) < 0) { lng = (lng + Number(self.data[id].lng)) / len; }
        else { lng = (lng - Number(self.data[id].lng)) / len; }

        cluster.center[cId] = {lat : lat , lng : lng };
      }
  };



  // private function used in reshuffleLocations
  // check to which cluster center the item is closest
  MyModules.MapsCluster.getClusterID = function(cluster, id, self) {

    var finalD = { dist: 10000, cId : false }, d;

    $.each(cluster.center, function(c_Id, latLngObj) {

      d = calcDistance(self.data[id].lat, self.data[id].lng, latLngObj.lat, latLngObj.lng).toFixed(2);

      if (d < finalD.dist) { finalD = { dist : d, cId : c_Id }; };
    });
    return finalD.cId;
  };





  // private function used in calcCluster
  // check if the marker is close enough to a existing cluster center
  MyModules.MapsCluster.checkIfInCluster = function(cluster, id, distBetween, self) {

    var finalD = { dist: 1000, cId : false }, d;

    $.each(cluster.center, function(c_Id, latLngObj) {

      d = calcDistance(self.data[id].lat, self.data[id].lng, latLngObj.lat, latLngObj.lng).toFixed(2);

      if (d < distBetween && d < finalD.dist) { finalD = { dist : d, cId : c_Id }; };
    });

    return finalD;
  };



  MyModules.MapsCluster.addItemToCluster = function(cId, self, index) {
  
    self.config.clusters.obj.cluster[cId].push(self.data[index]);
    self.config.clusters.obj.item[index] = cId;
    MyModules.MapsCluster.calcCenter(self.config.clusters.obj, cId, index, self);
  }



  MyModules.MapsCluster.reshuffleLocations = function(clusterPre, cluster, self) {

    cluster.cluster[0] = [];
    cluster.item[0] = 0;

    $.each(self.data, function(index, value) { 

      // check if the item might be closer to another cluster center (optimizing precision)
      cId = MyModules.MapsCluster.getClusterID(clusterPre, index, self);

      if (typeof cluster.cluster[cId] === "undefined") {
        cluster.cluster[cId] = [];
      }

      cluster.cluster[cId].push(self.data[index]);
      cluster.item[index] = cId;
    });

  };
  
  
  MyModules.MapsCluster.setMarker = function(self, index) {

      
      loc = new google.maps.LatLng(self.config.clusters.obj3.cluster[index][0].lat, self.config.clusters.obj3.cluster[index][0].lng);

      // improvement - add retina marker
      var  m = new google.maps.Marker({
        map: self.map,
        position: loc,
        icon: self.config.marker_icon   
      });

      self.marker.push(m);

      google.maps.event.addListener(m, 'click', function () {

        if (self.markerEvents && typeof(self.markerEvents) === "function") {
          
            self.markerEvents(self.config.clusters.obj3.center[index]);
        }
      }); 


  }












//#######################   HELPER FUNCTIONS
// caluclate distance between 2 points
function calcDistance(lat1, lon1, lat2, lon2)  {
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
function toRad(Value) { return Value * Math.PI / 180; }
//#######################   HELPER FUNCTIONS END