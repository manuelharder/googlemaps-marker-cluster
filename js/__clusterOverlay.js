


//######################  CLUSTER-CENTER code
  MyModules.MapsCluster.ClusterCenter = function(bounds, content, cId, clusterObj) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.map_ = clusterObj.map;
    this.div_ = null;
    this.cId_ = cId;
    this.cluster_ = clusterObj.config.clusters.obj3;
    this.content_ = content;
    this.clusterObj_ = clusterObj;
    this.setMap(clusterObj.map);
  }
  MyModules.MapsCluster.ClusterCenter.prototype = new google.maps.OverlayView();

  MyModules.MapsCluster.ClusterCenter.prototype.onAdd = function() {

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

    // when you click on the cluster overlay it will zoom in 1 level
    google.maps.event.addDomListener(div, 'click', function() {

      me.map_.panTo(new google.maps.LatLng(me.cluster_.center[me.cId_].lat, me.cluster_.center[me.cId_].lng)); 
      me.map_.setZoom(me.map_.getZoom()+1);
    });
  };

  // draw the overlays
  MyModules.MapsCluster.ClusterCenter.prototype.draw = function() {

    var overlayProjection = this.getProjection();

    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    var div = this.div_;
    div.style.left = sw.x - 16 + 'px';
    div.style.top = ne.y - 16 + 'px';
  };

  // The onRemove() method will be called automatically from the API
  MyModules.MapsCluster.ClusterCenter.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  };
  //######################  END CLUSTER-CENTER code


  