/*
* NOTE: example of usage of the Google Maps Marker Cluster
*/


var data = [ { lat: -41.295847, lng: 174.789309},  { lat:-41.29414310032885, lng:174.77252631210578},  { lat:-41.29384552004231, lng:174.76944810788936},  { lat:-41.29643896278497, lng:174.7752317945309},  { lat:-41.29186292589351, lng:174.7807622202924},  { lat:-41.296693972534435, lng:174.7760716779658},  { lat:-41.29916974676637, lng:174.77898986295395},  { lat:-41.29705608443039, lng:174.77141826480636},  { lat:-41.28962918838811, lng:174.77723046081545},  { lat:-41.30012296957695, lng:174.77947164857568},  { lat:-41.29256977463054, lng:174.7757026345903},  { lat:-41.29704084638604, lng:174.76900536631993},  { lat:-41.28987099457543, lng:174.77833897502535},  { lat:-41.29053006847101, lng:174.7756071672897},  { lat:-41.294381958477175, lng:174.77796968105227},  { lat:-41.29064997282737, lng:174.77260239691486},  { lat:-41.297485560857965, lng:174.77728256634975},  { lat:-41.291115483853915, lng:174.7738475013399},  { lat:-41.2936206513546, lng:174.78274693466645},  { lat:-41.293977975621374, lng:174.77558114660997},  { lat:-41.29957471334038, lng:174.76868881874032},  { lat:-41.29048289285917, lng:174.7745204558379},  { lat:-41.29635955109036, lng:174.76870509106084},  { lat:-41.29591662725607, lng:174.77938986380633},  { lat:-41.29148248387414, lng:174.7716039371381},  { lat:-41.29625515580377, lng:174.77307008890833},  { lat:-41.29942554848955, lng:174.76905919967442},  { lat:-41.2944269324148, lng:174.77255472053952},  { lat:-41.29814520891947, lng:174.77216608758005},  { lat:-41.29400254058678, lng:174.77390192631486},  { lat:-41.299405074774135, lng:174.77408575361002},  { lat:-41.28812360221885, lng:174.77936877484004},  { lat:-41.29075412690314, lng:174.77596623709624},  { lat:-41.29148344424273, lng:174.77391567632333},  { lat:-41.29696295005136, lng:174.77332727808556},  { lat:-41.29317202517782, lng:174.77826843884463},  { lat:-41.28873047541333, lng:174.7800964929503},  { lat:-41.28819761597118, lng:174.77572544480276},  { lat:-41.286473729384056, lng:174.77748442210302},  { lat:-41.28549774155325, lng:174.76989744133377},  { lat:-41.29701308987064, lng:174.7748859430116},  { lat:-41.29025187940719, lng:174.7705674496695},  { lat:-41.30096555197616, lng:174.77999554811964},  { lat:-41.28830841472813, lng:174.77485829259248},  { lat:-41.288658499949875, lng:174.77532399502374},  { lat:-41.29053835577197, lng:174.78089523646318},  { lat:-41.302376488109125, lng:174.77830381972163},  { lat:-41.2849283044995, lng:174.77115125174424},  { lat:-41.29275352822317, lng:174.77217121774947},  { lat:-41.294225186413506, lng:174.7826623919247},  { lat:-41.2971233866604, lng:174.7748117943035},  { lat:-41.29694523871804, lng:174.7713007877655},  { lat:-41.29764038729892, lng:174.78275767907527},  { lat:-41.289559755184094, lng:174.7772927600472},  { lat:-41.29698322335302, lng:174.7675235109187},  { lat:-41.287670088489854, lng:174.7791695480396},  { lat:-41.29945427724479, lng:174.77146878703516},  { lat:-41.293984411698126, lng:174.783338156725},  { lat:-41.285286947799065, lng:174.7803740816458},  { lat:-41.29090873740395, lng:174.7664598205911},  { lat:-41.2859734843379, lng:174.7799186294332},  { lat:-41.2855646930857, lng:174.77782358389535},  { lat:-41.28842583127429, lng:174.773246779467},  { lat:-41.29504655655713, lng:174.76890249998573},  { lat:-41.295781977565795, lng:174.76681081340524},  { lat:-41.289730047520436, lng:174.77727994510954},  { lat:-41.2926703152238, lng:174.77167763100357},  { lat:-41.29244537688269, lng:174.78213355197684},  { lat:-41.29274450630562, lng:174.77748680536737},  { lat:-41.301327056243146, lng:174.77846425955343},  { lat:-41.29630135736958, lng:174.77624750293194}]


$(function() {

 var dataObj = [];

  for (var i = 0; i < data.length; i++) {
    
      var obj = { obj: { id : i }, lat: data[i].lat, lng: data[i].lng };
      dataObj.push(obj);
  };

  // dataObj is the example data

  var cl = new Cluster({mapId: "map", marker_icon : 'http://www.manusplace.de/test/marker-8.png' },
                       {zoom : 14},
                       dataObj);

  // calculate cluster for the zoom level 14
  cl.calcCluster();
  

  var geocoder = new google.maps.Geocoder();

  geocoder.geocode( { 'address': "wellington, NZ" }, function(results, status) {

    if (status === google.maps.GeocoderStatus.OK) {
          
      cl.map.setCenter(results[0].geometry.location);

      // add cluster overlay and markers
      cl.setMarkersAndCluster();   

      cl.markerEvents = function(m) {

          // calback function after the markers are added to add extra functionality
          console.log(m);
      }
    }
  });
});