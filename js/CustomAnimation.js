	var container,stats;
	var bgRender = '0x000000';

	var camera, scene, renderer, objects;
	var particleLight, pointLight;

	var container, interval, camera, scene, renderer;
	var projector, plane, cube, linesMaterial;

	var color = 0,colors = [ 0xDF1F1F, 0xDFAF1F, 0x80DF1F, 0x1FDF50, 0x1FDFDF, 0x1F4FDF, 0x7F1FDF, 0xDF1FAF, 0xEFEFEF, 0x303030 ];
	var brush, objectHovered, mouse3D, isMouseDown = false;
	var radious = 600, theta = 45, onMouseDownTheta = 45, phi = 60, onMouseDownPhi = 60, isShiftDown = false;

	var onMouseDownPosition = new Object;
	var ray = new Object;

	var texture_placeholder,
	isUserInteracting = false,
	onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	lon = 90, onMouseDownLon = 0,
	lat = 0, onMouseDownLat = 0,
	phi = 0, theta = 0,
	target = new THREE.Vector3();

	var windowHalfX = 510; // 
	var windowHalfY = 288; // 

	init();
	//animate();
	
	////////////////////////////////////////////////////////////////////////
	//
	// INIT
	//
	////////////////////////////////////////////////////////////////////////

	function init() {

		// ------------------------------------------------
		// define canvas element in DOM
		// ------------------------------------------------
		container = document.createElement('div');
		document.body.appendChild(container);

		objects = [];

		// ------------------------------------------------
		// define info element in DOM
		// ------------------------------------------------
		var info = document.createElement('div');
		info.style.position = 'absolute';
		info.style.top = '10px';
		info.style.background = '#fff';
		info.style.color = '#333';
		info.style.width = '100%';
		info.style.textAlign = 'center';
		info.setAttribute.id = 'info';
		info.innerHTML = '<a href="http://github.com/mrdoob/three.js" target="_blank">three.js</a> / Pseudo Equalizer in 3D Room  by Emil Maran';
		container.appendChild(info);

		
		// ------------------------------------------------
		// Set Camera View & Scene
		// ------------------------------------------------
		camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 1, 10000 );
		//camera.position.x = 100;
		camera.position.y = 500;
		camera.position.z = 1200;
		
		scene = new THREE.Scene();


		// ------------------------------------------------
		// Define Grid 2 Define Material - Floor surface
		// ------------------------------------------------
		var geometry = new THREE.Geometry();

		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - 1500, 0, 0 ) ) );
		geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 1500, 0, 0 ) ) );

		var material = new THREE.LineBasicMaterial( { color: 0x555555, opacity: 0.1 } ); // 0xffffff

		for ( var i = 0; i <= 40; i ++ ) {

			var line = new THREE.Line( geometry, material );
			line.position.y = - 120;
			line.position.z = ( i * 100 ) - 500;
			scene.add( line );

			var line = new THREE.Line( geometry, material );
			line.position.x = ( i * 100 ) - 500;
			line.position.y = - 120;
			line.rotation.y = 90 * Math.PI / 180;

		scene.add( line );
		//objects.push( line );

		}

		// ------------------------------------------------
		// Add SPHERES
		// ------------------------------------------------
		
		var geometry = new THREE.SphereGeometry( 1500, 19, 19, false ); // Size / number pieces1 /   number pieces2 / 

		var materials = [

		//	{ material: new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true } ), doubleSided: true }
			{ material: new THREE.MeshBasicMaterial( {
			color: 0xffffff,
			blending: THREE.AdditiveBlending,
			overdraw: true,
			wireframe: false,
			opacity: 0.2
			} ), doubleSided: true }
		//	{ material: new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } ), doubleSided: false }
		//	{ material: new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.SmoothShading, overdraw: true } ), doubleSided: false }
		//	{ material: new THREE.MeshDepthMaterial( { overdraw: true } ), doubleSided: false },
		//	{ material: new THREE.MeshNormalMaterial( { overdraw: true } ), doubleSided: false },
		];
		

		// ------------------------------------------------
		//	ADD TEXTURE ON SURFACE 
		// ------------------------------------------------

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {
			var face = geometry.faces[ i ];
			if ( Math.random() > 0.3 ) face.material = [ materials[ Math.floor( Math.random() * materials.length )  ].material ];
		}

		materials.push( { material: new THREE.MeshFaceMaterial(), opacity: 0.5, overdraw: false, doubleSided: true } );
		
		
		for ( var i = 0, l = materials.length; i < l; i ++ ) {

			var sphere = new THREE.Mesh( geometry, materials[ i ].material );
			sphere.doubleSided = materials[ i ].doubleSided;
			sphere.position.x = ( i % 5 ) * 200 - 400;
			sphere.position.z = Math.floor( i / 5 ) * 200 - 200;

			/*sphere.rotation.x = Math.random() * 200 - 100;
			sphere.rotation.y = Math.random() * 200 - 100;
			sphere.rotation.z = Math.random() * 200 - 100;*/
	
			scene.add( sphere );
			objects.push( sphere );

		}

		var PI2 = Math.PI * 2;
		var program = function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 1, 0, PI2, true );
			context.closePath();
			context.fill();
		}

		// ------------------------------------------------
		// Panorama landscape
		// ------------------------------------------------

		mesh = new THREE.Mesh( 
			new THREE.CubeGeometry( 600, 600, 2100, 4, 4, 3, materials ), 
			new THREE.MeshBasicMaterial({  // MeshBasicMaterial // MeshLambertMaterial
			color: 0xff0A04, 
			opacity: 0.5,
			//shading: THREE.FlatShading
			blending: THREE.AdditiveBlending
			}) 
		); /* ff6699 */
			
		mesh.scale.x = -1;
		scene.add( mesh );
		objects.push( mesh );

		// -------------------------------------------------------------------------------------------------
		// RANDOM CUBES
		// -------------------------------------------------------------------------------------------------
		// http://www.elated.com/articles/rotatable-3d-product-boxshot-threejs/

		var arPosition = {
			'0':'140,100,100',
			'1':'170,130,100',
			'2':'190,160,100',
			'3':'100,190,100',
			'4':'100,210,100',
			'5':'100,240,100'
		}

		var geometry = new THREE.CubeGeometry( 55, 55, 55 );
		var material = new THREE.MeshLambertMaterial( { color: 0xFAD232, shading: THREE.FlatShading, overdraw: true } );

		var materials = [];
		
		for ( var i = 0; i < 4; i ++ ) {
			
			var cubeRnd = new THREE.Mesh( geometry, material );
			
			cubeRnd.overdraw = false;
			cubeRnd.transparent = false;
			
			var arPosxyz = arPosition[i].split(",");

			//cubeRnd.position.x = Math.floor( ( Math.random() * 1000 - 700 ) / 50 ) * 50 + 25;
			cubeRnd.position.x = arPosxyz[0];
			cubeRnd.position.y = arPosxyz[1];
			cubeRnd.position.z = arPosxyz[2];
			
			scene.add(cubeRnd);
			objects.push( cubeRnd );

		}

		// -------------------------------------------------------------------------------------------------
		// Lights 
		// -------------------------------------------------------------------------------------------------

		particleLight = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: 0xffffff } ) );
		particleLight.scale.x = particleLight.scale.y = particleLight.scale.z = 6;
		scene.add( particleLight );
		
		//scene.add( new THREE.AmbientLight( Math.random() * 0x202020 ) );

		var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
		directionalLight.position.x = Math.random() - 0.4;
		directionalLight.position.y = Math.random() - 0.3;
		directionalLight.position.z = Math.random() - 0.9;
		directionalLight.position.normalize();
		scene.add( directionalLight );

		pointLight = new THREE.PointLight( 0xffffff, .7 );
		scene.add( pointLight );

		// add subtle ambient lighting
		var lightSecond = new THREE.SpotLight( 0xffffff, 1 );
		lightSecond.position.set( 1290, 530, -160 );
		scene.add(lightSecond);

		// add subtle ambient lighting
		var ambientLight = new THREE.AmbientLight(0xffffff);
		scene.add(ambientLight);

		// add directional light source
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(10, 100, 1000).normalize();
		scene.add(directionalLight);

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);


		// ------------------------------------------------
		// renderer 
		// ------------------------------------------------
		renderer = new THREE.CanvasRenderer();
		// renderer = new THREE.WebGLRenderer();
		renderer.setSize( windowHalfX, windowHalfY  ); // window.innerWidth, window.innerHeight
		container.appendChild( renderer.domElement );
		
	}


	////////////////////////////////////////////////////////////////////////
	//
	// RENDER
	//
	////////////////////////////////////////////////////////////////////////

	function render(currentvalue) {

		var timer = new Date().getTime() * 0.00009;
		var radius = 600;

		camera.position.x = Math.cos( timer ) * 100;
		camera.position.y = Math.cos( timer ) * 400 ;
		camera.position.z = Math.sin( timer ) * 950 ;
		
		camera.lookAt( scene.position );

		var numerator = timer * 1000000;
		var denominator = 47;

		var remainder = numerator % denominator;

		for ( var i = 0, l = objects.length; i < l; i++ ) {

			colorCC = '0xff'+ Math.round(Math.random() * 9) +'f'+  Math.round(Math.random() * 9) +'f'; // 0xff00ff
			colorCB = '0xff'+ Math.round(Math.random() * 9) +'f'+  Math.round(Math.random() * 9) +'f'; // 0xff00ff
			

			var object = objects[ i ];

			//object.rotation.x += Math.random() * 0.00002 + 0.00003;
			//object.rotation.y += Math.random() * 0.00002 + 0.00004;

			if(i > 0  ){
				//object.rotation.z += Math.random() * 0.00002 + 0.00006;
			}

			// FlatShading SmoothShading AdditiveBlending
			// MeshBasicMaterial MeshLambertMaterial MeshDepthMaterial MeshNormalMaterial
		

			object.material = new THREE.MeshBasicMaterial( { 
				color: 0xff0000, // ECDC68
				transparent: false,
				opacity: 0.5,
				overdraw: true,
				wireframe: false,
				blending: THREE.AdditiveBlending
			});


			if(remainder > 26 && remainder < 5 && i < 2  ){

				object.scale.x = Math.random() * currentvalue/2;
				object.scale.y = Math.random() * currentvalue/2;
				object.scale.z = Math.random() * currentvalue/2;

				object.material = new THREE.MeshBasicMaterial( { 
					color: colorCB, 
					transparent: false,
					opacity: 0.9,
					overdraw: true,
					wireframe: false,
					blending: THREE.AdditiveBlending // FlatShading SmoothShading AdditiveBlending
				});

			}
			if(remainder > 26 && i < 12){

				object.scale.x = Math.random() * 0.6 + Math.random() * currentvalue/4;
				object.scale.y = Math.random() * 0.9 + Math.random() * currentvalue/3;
				object.scale.z = Math.random() * 0.9 +  Math.PI / 180 * currentvalue/2;

				object.material = new THREE.MeshBasicMaterial( { 
					color: colorCB, 
					transparent: false,
					opacity: 0.9,
					overdraw: true,
					wireframe: false,
					blending: THREE.AdditiveBlending // FlatShading SmoothShading AdditiveBlending
				});

			}

		}
		
		renderer.render( scene, camera );
		renderer.setClearColorHex( bgRender , 0.9 );
		stats.update();
	}
	
	////////////////////////////////////////////////////////////////////////
	//
	// ANIMATE
	//
	////////////////////////////////////////////////////////////////////////

	function animate(currentvalue) {
		//requestAnimationFrame( animate );
		render(currentvalue);
	}