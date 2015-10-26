
var Cluster = function(options, mapSettings, dataObj) {
  
  var self = this;
  
  // setting the map options and adding the data object
  MyModules.MapsCluster.setOptions(options, mapSettings, dataObj, self);
  
  this.map = new google.maps.Map(document.getElementById(self.mapId), self.mapOptions);

  google.maps.event.addListener(this.map, 'zoom_changed', function() { 

      if (self.overlay.length > 0) { $.each(self.overlay, function() { this.setMap(null); }); }
      if (self.marker.length > 0) { $.each(self.marker, function() { this.setMap(null); }); }

      self.calcCluster(); 

      self.setMarkersAndCluster();
  });

  MyModules.MapsCluster.resetCluster(self);

  

  // cluster with the arrays of the item ids
  // item with mapping item id and cluster id
  // center with the center point lat/lng of each cluster

  this.calcCluster = function() {

    // set how wide the marker can be apart to be merged into a cluster
    MyModules.MapsCluster.setDistanceBetween(self);

    // everytime the zoom changes
    MyModules.MapsCluster.resetCluster(self);

    cId = 0;

    self.data.forEach(function(value, index) { 

        if (index == 0 ) { 

            self.config.clusters.obj.cluster[0] = [];
            MyModules.MapsCluster.addItemToCluster(0, self, index);
            return;
        }

        var result = MyModules.MapsCluster.checkIfInCluster(self.config.clusters.obj, index, self.config.distBetween, self);

        // if the item is within a cluster add it and recalculate the center
        if (result.cId !== false) {

          MyModules.MapsCluster.addItemToCluster(result.cId, self, index);
        }
        else {
   
          // if not inside a cluster, create new cluster center == item itself
          cId++;
          self.config.clusters.obj.cluster[cId] = [];

          MyModules.MapsCluster.addItemToCluster(cId, self, index);
        }
    });

    MyModules.MapsCluster.reshuffleLocations(self.config.clusters.obj, self.config.clusters.obj2, self);

    // recalculate the cluster center for the optimized clusters
    self.config.clusters.obj2.item.forEach(function(value, index) {  

        MyModules.MapsCluster.calcCenter(self.config.clusters.obj2, value, index, self);
    });

    // do the same thing again to get a precise cluster
    MyModules.MapsCluster.reshuffleLocations(self.config.clusters.obj2, self.config.clusters.obj3, self);

    self.config.clusters.obj3.center = self.config.clusters.obj2.center;
  };





  this.setMarkersAndCluster = function() {

    self.config.clusters.obj3.cluster.forEach(function(arr, index) {  

      // if there are more than 1 item it's a cluster
      if (arr.length > 1) {

        self.addOverlay(arr.length, self.config.clusters.obj3.center[index], index);
      }    
      else {

        // only one item => it's a marker, no need for a cluster
        MyModules.MapsCluster.setMarker(self, index);
      }

    });
  };



  this.addOverlay = function(content, latLng, cId) {

    var swBound = new google.maps.LatLng(latLng.lat, latLng.lng);
    var neBound = new google.maps.LatLng(latLng.lat, latLng.lng);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);

    self.overlay.push(new MyModules.MapsCluster.ClusterCenter(bounds, content, cId, self));
  };
  



};


