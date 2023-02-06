"use strict";
import "./style.css"
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';
import * as wNumb from 'wnumb';


var Cesium = require('cesium/Cesium');
require('cesium/Widgets/widgets.css');
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyODI3ZmM2OC02MDQwLTQ1MWMtODI4NS1jYjdlZWQ1MTRjNTIiLCJpZCI6ODY1NDAsImlhdCI6MTY0Nzg2NDIwOX0.e4bRIaaIQFDm07reNAfEtoqTLoe3x51pzrP8F9cW9Rg';

var clock = new Cesium.Clock({
    startTime : Cesium.JulianDate.fromIso8601('2022-08-30T17:56:04+08'),
    currentTime : Cesium.JulianDate.fromIso8601("2022-08-30T17:56:04+08"),
    stopTime : Cesium.JulianDate.fromIso8601("2022-09-30T18:56:04+08"),
    clockRange : Cesium.ClockRange.LOOP_STOP,
    clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
});

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: new Cesium.CesiumTerrainProvider({
    url: Cesium.IonResource.fromAssetId(1036015),
  }),
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url : 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer' // light basemap
  }),
  animation: false,
  timeline: false, 
  scene3DOnly: true,
  baseLayerPicker: false,
  orderIndependentTransluceny: true,
  infoBox : true,
  shadows: true,
  scene3DOnly: true,
  selectionIndicator : false,
  clockViewModel: new Cesium.ClockViewModel(clock),
  homeButton: false,
  sceneModePicker: false,
  navigationHelpButton: false,
  geocoder: false,  
});


const light_basemap = new Cesium.ArcGisMapServerImageryProvider({
  url : 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer'
});

const dark_basemap = new Cesium.ArcGisMapServerImageryProvider({
  url : 'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer'
});

const world_imagery_basemap = new Cesium.ArcGisMapServerImageryProvider({
  url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
});
var layers = viewer.imageryLayers;
var lightMode = document.getElementById('light-button');
var darkMode = document.getElementById('dark-button');
var world_imagery = document.getElementById('world-imagery-button')
// if (lightMode || darkMode){
  lightMode.addEventListener('click', ()=>{
    console.log('light mode')
    var baseLayer = layers.get(0);
    layers.remove(baseLayer,false);
    layers.addImageryProvider(light_basemap,0)
  })
  darkMode.addEventListener('click', ()=>{
    console.log('dark mode')
    var baseLayer = layers.get(0);
    layers.remove(baseLayer,false);
    layers.addImageryProvider(dark_basemap,0)
  })
  world_imagery.addEventListener('click', ()=>{
    console.log('imagery')
    var baseLayer = layers.get(0);
    layers.remove(baseLayer,false);
    layers.addImageryProvider(world_imagery_basemap,0)
  })
// }
// viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);



// ustawienia wizualizacji sceny
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.depthTestAgainstTerrain = true;



// skróty
let scene = viewer.scene;
let camera = scene.camera;


// zdefiniowanie tilesetu budynków oraz wstepna optymalizacja 
let tileset = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(930352),
    maximumMemoryUsage: 2048,
    preloadWhenHidden: true,
    maximumScreenSpaceError: 1,
    enableDebugWireframe: true,
});
tileset.readyPromise
  .then(function (tileset) {
    // let boundingSphere = tileset.boundingSphere;
    // let range = Math.max(100.0 - boundingSphere.radius, 0.0);
    viewer.scene.primitives.add(tileset);

    let heading = Cesium.Math.toRadians(90.0); //or any starting angle in radians
    let rotation = -1; //counter-clockwise; +1 would be clockwise
    let centre = new Cesium.Cartesian3.fromDegrees(22.560785441342116, 51.247055668363,400);
    let pitch = Cesium.Math.toRadians(-20); //looking down at 45 degrees
    const SMOOTHNESS = 5000;
    let animationTitle = viewer.clock.onTick.addEventListener(() => {
      heading += rotation * Math.PI / SMOOTHNESS;
      camera.setView({
        destination: centre,
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: 0.0
        }
    })});
    const showingUp = document.querySelectorAll('.showing');
    var readyBtn = document.getElementById('ready_btn');
    const view = document.getElementById('cesiumContainer');
    const title = document.getElementById('titleRozwoj');
    const legendBtn = document.getElementById('legendBtn');
    let legend = document.getElementById('legend');
    legendBtn.addEventListener('click', ()=>{
      if (legend.style.opacity==1){
        legend.style.opacity=0;
        legend.style.transition='opacity 0.5s';
      }else{
        legend.style.opacity=1;
        legend.style.transition='opacity 0.5s';
      }
    })
    readyBtn.addEventListener('click', () =>{
      console.log('xd');
      
      camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(22.563168262224597, 51.23875558503891, 14000.0),
        duration: 7,
        maxHeight: 5000,
      });
      // camera.setView({destination: Cesium.Cartesian3.fromDegrees(22.563168262224597, 51.23875558503891, 5000.0)});
      animationTitle();
      // clearInterval(moveAnimation);
      readyBtn.style.display = 'none';
      view.style.filter = 'blur(1px)';
      view.style.transition = 'filter 7s';
      title.style.opacity = 0;
      title.style.display = 'none';
      title.style.transition ='opacity display 7s';
      legendBtn.style.opacity = 1;
      legendBtn.style.transition = 'opacity 7s';
      showingUp.forEach(el => {
        el.style.opacity = 1;
        el.style.transition = 'opacity 7s';
      });

    });
    
    // viewer.zoomTo(
    //   tileset,
    //   new Cesium.HeadingPitchRange(
    //     0.0,
    //     -0.5,
    //     tileset.boundingSphere.radius * 2.0
    //   )
    // );
      tileset.style = new Cesium.Cesium3DTileStyle({
        color:
        {
          conditions: [
            ["${rok_budo_1} === 0", "rgba(255,255,255, 0.5)"], // grey
            ["${rok_budo_1} > 0 && ${rok_budo_1} <= 1900", "rgb(245, 88, 240)"],
            ["${rok_budo_1} > 1900 && ${rok_budo_1} <= 1920", "rgb(235, 102, 35)"],
            ["${rok_budo_1} > 1920 && ${rok_budo_1} <= 1940", "rgb(232, 232, 65)"],
            ["${rok_budo_1} > 1940 && ${rok_budo_1} <= 1960", "rgb(107, 232, 65)"],
            ["${rok_budo_1} > 1960 && ${rok_budo_1} <= 1980", "rgb(59, 149, 227)"],
            ["${rok_budo_1} > 1980 && ${rok_budo_1} <= 2000", "rgb(33, 47, 237)"],
            ["${rok_budo_1} > 2000", "rgb(106, 41, 204)"] // orange
          ]
        },
      //   show: {
      //     conditions: [
      //       ["${rok_budo_1} === null", 'false'],
      //       ["${rok_budo_1} === undefined", 'false'],
      //       ['${rok_budo_1} === 0', 'false'],
      //       ['${rok_budo_1} > 0', 'false']
      //     ]
      //   }
      });
      timelineAnimation(1900);
  })
  .catch(function (error) {
    console.log(error);
  });

  let tilesetAnimation = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(930352),
    maximumMemoryUsage: 2048,
    preloadWhenHidden: true,
    maximumScreenSpaceError: 1,
    enableDebugWireframe: true,
});

tilesetAnimation.readyPromise
  .then(function (tilesetAnimation) {
    let boundingSphere = tilesetAnimation.boundingSphere;
    viewer.scene.primitives.add(tilesetAnimation);
    // viewer.zoomTo(
    //   tilesetAnimation,
    //   new Cesium.HeadingPitchRange(
    //     0.0,
    //     -0.5,
    //     tileset.boundingSphere.radius * 2.0
    //   )
    // );
    
    tilesetAnimation.style = new Cesium.Cesium3DTileStyle({
			color: "rgb(255,78,123)",
			show: {
				conditions: [
					["${rok_budo_1} === null", 'false'],
					['${rok_budo_1} >= 0', 'false']
				]
			}
		});
  })
  .catch(function (error) {
    console.log(error);
  });
// // funkcje wykonywanie podczas ładowania tilesetu
// tilesetAnimation.readyPromise
//   .then(function (tileset) {
//     let boundingSphere = tilesetAnimation.boundingSphere;
//     let range = Math.max(100.0 - boundingSphere.radius, 0.0);
//     let properties = tileset.properties;
//     // dodanie tilesetu do sceny
//     scene.primitives.add(tileset);

//     // zbliżenie do tilesetu
//     viewer.zoomTo(
//       tileset,
//       new Cesium.HeadingPitchRange(
//         0.0,
//         -0.5,
//         range
//       )
//     );
    
//     if (Cesium.defined(properties) && Cesium.defined(properties.rok_budowy)) {
//       tilesetAnimation.style = new Cesium.Cesium3DTileStyle({
//         color: "rgb(3,78,123)",
//         show: {
//           conditions: [
//             ["${rok_budowy} === null", 'false'],
//             ['${rok_budowy} >= 1850', 'false']
//           ]
//         }
//       });
//     }
  
//   }).otherwise(function (error) {
//     throw (error);
//   });
// // const inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;
// // // const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

var heightInterval;

function changeAllHeight(currenttileset, height) {
	height = Number(height);
	if (isNaN(height)) {
		return;
	}

	var cartographic = Cesium.Cartographic.fromCartesian(currenttileset.boundingSphere.center); // find cartographic coordinates of tileset (center)
	var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0); // find surface (on height = 0)
	var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height); // find offset to surface (delta h)
	var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3()); // compute translatation from surface to new height
	currenttileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation); // perform translation on the whole tileset
}

var slider = document.getElementById('soft');

noUiSlider.create(slider, {
  start: 1900,
  margin: 30,
  connect: 'lower',
  range: {
      min: 1900,
      max: 2017
  },
  pips: {
      mode: 'values',
      values: [1900,1910,1920,1930,1940,1950,1960, 1970, 1980, 1990,2000, 2010, 2017],
      density: 50
  },
  format: wNumb({
      decimals: 0
  })
});

slider.noUiSlider.on('change', function (values, handle) {
  clearInterval(timelineInterval);
  // if (buttonPlay.style.display == 'none') {
  //   buttonPlay.style.display == "inline-block";
  //   buttonStop.style.display == 'none'
  // }else{
  //   buttonStop.style.display == "inline-block";
  //   buttonPlay.style.display == "none"
  // }
	timelineAnimation(values[0]);
});

// timeline animation
var buttonPlay = document.getElementById("button-play");
var buttonStop = document.getElementById("button-stop");
var currentYear;
var timelineInterval;
// start animation
buttonPlay.addEventListener("click", function () {
	// change UI of button
	buttonPlay.style.display = "none";
	buttonStop.style.display = "inline-block";

	var year = currentYear + 1;

	timelineInterval = setInterval(function () {
		// cancel Interval
		slider.noUiSlider.set(year);
		timelineAnimation(year); // trigger timeline animation
		year += 1; // increase year
		if (year === 2017) { year = 1901; } // make loop
	}.bind(this), 1000);

}.bind(this));

// stop animation
buttonStop.addEventListener("click", function () {
	// change UI of button
	buttonPlay.style.display = "inline-block";
	buttonStop.style.display = "none";

	clearInterval(timelineInterval);

}.bind(this));

function timelineAnimation(year) {
  console.log("timelineAnimation Started!! %d", year);
	// animate buildings (show, color) based on current year on timeline and animate height of buildings
	currentYear = parseInt(year); // convert to int incase it's a string
  

	// adjust the height of animate buildings so they are below ground to start animation
	changeAllHeight(tilesetAnimation, -175);

	// change displayed year in the UI
	document.getElementById("timeline-count").innerHTML = year;

		// built condition for buildings that have not been built yet
		// TODO: replace BAUJAHR everywhere with the respective year attribute in your dataset
		var condition = "${rok_budo_1} > " + (currentYear-1) + "";
    console.log(currentYear);


    tileset.style = new Cesium.Cesium3DTileStyle({
      color:
      {
        conditions: [
          // ["${rok_budo_1} > 0", "rgba(255,255,255)"],
          ["${rok_budo_1} === 0", "rgba(255,255,255, 0.5)"], // grey
          ["${rok_budo_1} > 0 && ${rok_budo_1} <= 1900", "rgb(245, 88, 240)"],
          ["${rok_budo_1} > 1900 && ${rok_budo_1} <= 1920", "rgb(235, 102, 35)"],
          ["${rok_budo_1} > 1920 && ${rok_budo_1} <= 1940", "rgb(232, 232, 65)"],
          ["${rok_budo_1} > 1940 && ${rok_budo_1} <= 1960", "rgb(107, 232, 65)"],
          ["${rok_budo_1} > 1960 && ${rok_budo_1} <= 1980", "rgb(59, 149, 227)"],
          ["${rok_budo_1} > 1980 && ${rok_budo_1} <= 2000", "rgb(33, 47, 237)"],
          ["${rok_budo_1} > 2000", "rgb(106, 41, 204)"] // orange
        ]
      },
      show: {
        conditions: [
          ["${rok_budo_1} === null", 'true'],
          [condition, 'false'], // do not show buildings that have not been built yet
          ["${rok_budo_1} <= " + (currentYear-1) + "", 'true']
        ]
      }
    });
		

		// show the buildings from the current year and animate their height (growing out of the ground)
		if (tilesetAnimation !== undefined) {


			var conditionExact = "${rok_budo_1} <= " + currentYear + " && ${rok_budo_1} > " + (currentYear - 1) + ""; // animate
			var conditionMin = "${rok_budo_1} <= " + (currentYear -1) + ""; // do not show in this tileset for animation
			var conditionMax = "${rok_budo_1} > " + currentYear + ""; // do not show in this tileset for animation

			
      tilesetAnimation.style = new Cesium.Cesium3DTileStyle({
        color: 
        {
          conditions: [
            ["${rok_budo_1} === 0", "rgba(255,255,255, 0.5)"], // grey
            ["${rok_budo_1} > 0 && ${rok_budo_1} <= 1900", "rgb(245, 88, 240)"],
            ["${rok_budo_1} > 1900 && ${rok_budo_1} <= 1920", "rgb(235, 102, 35)"],
            ["${rok_budo_1} > 1920 && ${rok_budo_1} <= 1940", "rgb(232, 232, 65)"],
            ["${rok_budo_1} > 1940 && ${rok_budo_1} <= 1960", "rgb(107, 232, 65)"],
            ["${rok_budo_1} > 1960 && ${rok_budo_1} <= 1980", "rgb(59, 149, 227)"],
            ["${rok_budo_1} > 1980 && ${rok_budo_1} <= 2000", "rgb(33, 47, 237)"],
            ["${rok_budo_1} > 2000", "rgb(106, 41, 204)"] // orange
          ]
        },
        show: {
          conditions: [
            ["${rok_budo_1} === null", 'false'],
            [conditionExact, 'true'],
            [conditionMin, 'false'],
            [conditionMax, 'false'],
          ]
        }
				});
      // trigger height animation
      animateHeight();

			
		}

	
}

function animateHeight() {
  console.log(heightInterval !== undefined)
	if (heightInterval !== undefined){
		clearInterval(heightInterval);
	}

	// animate buildings to grow out of the ground
	var height = -20; // starting point at an average height of 52m

	// start interval
  // heightInterval = viewer.clock.onTick.addEventListener(() => {
  //   // trigger change height function
	// 	changeAllHeight(tilesetAnimation, height);
    
	// 	if (height >= 0) { // building reaches ground
	// 		heightInterval();
	// 		return
	// 	} else {
	// 		height += 2; // increase height by 1m
	// 	}
  // });
	heightInterval = setInterval(function () {
		// trigger change height function
		changeAllHeight(tilesetAnimation, height);
    
		if (height >= 0) { // building reaches ground
			clearInterval(heightInterval);
			return
		} else {
			height += 2; // increase height by 1m
		}
	}.bind(this), 3);

	return heightInterval;

}


// // let val = 5
// // let slider = document.getElementById("myRange").oninput = function() {
// //   val = this.value;
// //   console.log(val);
// //   tileset.style = new Cesium.Cesium3DTileStyle();
// //   if (val>50){
// //     tileset.style.color = 'color("red")';
// //   }
// // };



//   Cesium.knockout
//   .getObservable(viewModel, "height")
//   .subscribe(function (height) {
//     height = Number(height);
//     if (isNaN(height)) {
//       return;
//     }

//     const cartographic = Cesium.Cartographic.fromCartesian(
//       tileset.boundingSphere.center
//     );
//     const surface = Cesium.Cartesian3.fromRadians(
//       cartographic.longitude,
//       cartographic.latitude,
//       0.0
//     );
//     const offset = Cesium.Cartesian3.fromRadians(
//       cartographic.longitude,
//       cartographic.latitude,
//       height
//     );
//     const translation = Cesium.Cartesian3.subtract(
//       offset,
//       surface,
//       new Cesium.Cartesian3()
//     );
//     tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
//   });

// // tileset.readyPromise.then(function(tileset) {
// //     console.log("STARTING!!");

// //     var boundingSphere = tileset.boundingSphere;
// //     viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0, -2.0, 0));
// //     viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
// //     // Position tileset
// //     var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
// //     var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
// //     var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
// //     var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
// //     tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
// //     console.log(tileset.modelMatrix);
// // });
// //viewer.scene.primitives.heightReference = heightReference;


// // tileset.style = new Cesium.Cesium3DTileStyle({
// //     // Set the default color style for this particular 3D Tileset.
// //     // For any building that has a `cesium#color` property, use that color, otherwise make it white.
// //     color: {
// //       conditions: [
// //         ["${feature['Height']} >20 ", "color('red', 0)"],
// //         ["${feature['Height']} > 10 ", "color('yellow', 0)"],
// //         ["${feature['Height']} < 10 ", "color('#14d4ff')"],
// //       ],
// //     }
// //   });
// // }


// viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
//    const pickedFeature = viewer.scene.pick(movement.position);
//    if (!Cesium.defined(pickedFeature)) {
//       console.log("nothing picked")
//       return;
//    }else{
//       const propertyNames = pickedFeature.getPropertyNames();
//       const height = pickedFeature.getProperty('Height');
//       const lat = pickedFeature.getProperty('Latitude');
//       const lon = pickedFeature.getProperty('Longitude');
//       console.log(typeof(pickedFeature.getProperty('citygml_year_of_construction')))
//       viewer.camera.flyTo({
//         destination: Cesium.Cartesian3.fromDegrees( lon,lat, 500.0),
//       });
//       const length = propertyNames.length;
//       console.log(propertyNames);
//       console.log(`wysokosc: ${height}, szerokosc: ${lat}, dlugosc: ${lon}`);
//    }
//    //viewer.scene.primitives.remove(tileset)
//    //viewer.scene.pickPosition(movement.position);
// }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
