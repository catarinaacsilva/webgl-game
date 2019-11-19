//////////////////////////////////////////////////////////////////////////////
//	Catarina Silva
// 	c.alexandracorreia@ua.pt
//////////////////////////////////////////////////////////////////////////////


//----------------------------------------------------------------------------
//
// Global Variables
//
var gl = null; // WebGL context
var shaderProgram = null;
var triangleVertexPositionBuffer = null;
var triangleVertexNormalBuffer = null;

// World details
var player_scale = 0.05;
var floor_z_scale = 0.01;
var block_scale = 0.1;
var lab_rows = 0;
var lab_cols = 0;
var first = true;

// The GLOBAL transformation parameters
var globalAngleYY = 0.0;
var globalTz = 0.0;

var baseXXRot = -50;
// Player acceleartion and velocity...
var ax = 0.0;
var ay = 0.0;
var vx = 0.0;
var vy = 0.0;

var world_rz = 0.0, world_rx = 0.0, world_ry = 0.0;
var world_width = 0.0, world_height = 0.0;

// GLOBAL Animation controls

var globalRotationYY_ON = 0;

var globalRotationYY_DIR = 1;

var globalRotationYY_SPEED = 1;

// To allow choosing the way of drawing the model triangles

var primitiveType = null;

// To allow choosing the projection type

var projectionType = 0;

// NEW --- The viewer position

// It has to be updated according to the projection type

var pos_Viewer = [0.0, 0.0, 0.0, 1.0];


//----------------------------------------------------------------------------
//
// NEW - To count the number of frames per second (fps)
//

var elapsedTime = 0;

var frameCount = 0;

var lastfpsTime = new Date().getTime();;


function countFrames() {

	var now = new Date().getTime();

	frameCount++;

	elapsedTime += (now - lastfpsTime);

	lastfpsTime = now;

	if (elapsedTime >= 1000) {

		fps = frameCount;

		frameCount = 0;

		elapsedTime -= 1000;

		document.getElementById('fps').innerHTML = 'fps:' + fps;
	}
}


//----------------------------------------------------------------------------
//
// The WebGL code
//

//----------------------------------------------------------------------------
//
//  Rendering
//

// Handling the Vertex Coordinates and the Vertex Normal Vectors

function initBuffers(model) {

	// Vertex Coordinates

	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = model.vertices.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
		triangleVertexPositionBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

	// Vertex Normal Vectors

	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
		triangleVertexNormalBuffer.itemSize,
		gl.FLOAT, false, 0, 0);
}

//----------------------------------------------------------------------------

//  Drawing the model

function drawModel(model,
	mvMatrix,
	primitiveType) {

	// The the global model transformation is an input

	// Concatenate with the particular model transformations

	// Pay attention to transformation order !!

	mvMatrix = mult(mvMatrix, translationMatrix(model.tx, model.ty, model.tz));

	mvMatrix = mult(mvMatrix, rotationZZMatrix(model.rotAngleZZ));

	mvMatrix = mult(mvMatrix, rotationYYMatrix(model.rotAngleYY));

	mvMatrix = mult(mvMatrix, rotationXXMatrix(model.rotAngleXX));

	mvMatrix = mult(mvMatrix, scalingMatrix(model.sx, model.sy, model.sz));

	// Passing the Model View Matrix to apply the current transformation

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	// Associating the data to the vertex shader

	// This can be done in a better way !!

	// Vertex Coordinates and Vertex Normal Vectors

	initBuffers(model);

	// Material properties

	gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_ambient"),
		flatten(model.kAmbi));

	gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_diffuse"),
		flatten(model.kDiff));

	gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_specular"),
		flatten(model.kSpec));

	gl.uniform1f(gl.getUniformLocation(shaderProgram, "shininess"),
		model.nPhong);

	// Light Sources

	var numLights = lightSources.length;

	gl.uniform1i(gl.getUniformLocation(shaderProgram, "numLights"),
		numLights);

	//Light Sources

	for (var i = 0; i < lightSources.length; i++) {
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn);

		gl.uniform4fv(gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()));

		gl.uniform3fv(gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()));
	}

	// Drawing 
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	if (primitiveType == gl.LINE_LOOP) {
		// To simulate wireframe drawing!
		// No faces are defined! There are no hidden lines!
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		for (var i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++) {
			gl.drawArrays(primitiveType, 3 * i, 3);
		}
	}
	else {
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);
	}
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {

	var pMatrix;

	var mvMatrix = mat4();

	// Clearing the frame-buffer and the depth-buffer

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Computing the Projection Matrix

	if (projectionType == 0) {

		// For now, the default orthogonal view volume

		pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);

		// Global transformation !!

		globalTz = 0.0;

		// NEW --- The viewer is on the ZZ axis at an indefinite distance

		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;

		pos_Viewer[2] = 1.0;

		// TO BE DONE !

		// Allow the user to control the size of the view volume
	}
	else {

		// A standard view volume.

		// Viewer is at (0,0,0)

		// Ensure that the model is "inside" the view volume

		pMatrix = perspective(45, 1, 0.05, 15);

		// Global transformation !!

		globalTz = -2.5;

		// NEW --- The viewer is on (0,0,0)

		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[2] = 0.0;

		pos_Viewer[3] = 1.0;

		// TO BE DONE !

		// Allow the user to control the size of the view volume
	}

	// Passing the Projection Matrix to apply the current projection

	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// NEW --- Passing the viewer position to the vertex shader

	gl.uniform4fv(gl.getUniformLocation(shaderProgram, "viewerPosition"),
		flatten(pos_Viewer));

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE

	mvMatrix = translationMatrix(0, 0, globalTz);
	mvMatrix = mult(mvMatrix, rotationZZMatrix(world_rz));
	mvMatrix = mult(mvMatrix, rotationYYMatrix(world_ry));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(world_rx));

	// NEW - Updating the position of the light sources, if required

	// FOR EACH LIGHT SOURCE

	for (var i = 0; i < lightSources.length; i++) {
		// Animating the light source, if defined

		var lightSourceMatrix = mat4();

		if (!lightSources[i].isOff()) {

			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES

			if (lightSources[i].isRotYYOn()) {
				lightSourceMatrix = mult(
					lightSourceMatrix,
					rotationYYMatrix(lightSources[i].getRotAngleYY()));
			}
		}

		// NEW Passing the Light Souree Matrix to apply

		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].lightSourceMatrix");

		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}

	// Instantianting all scene models

	for (var i = 0; i < sceneModels.length; i++) {
		drawModel(sceneModels[i],
			mvMatrix,
			primitiveType);
	}

	// NEW - Counting the frames

	countFrames();
}

//----------------------------------------------------------------------------
//
// Move player

function move_player(idx = 1) {
	vx += ax;
	vy += ay;

	var px0 = sceneModels[idx].tx;
	var py0 = sceneModels[idx].ty;

	var px = px0 + vx;
	var py = py0 + vy;

	if (px + player_scale > lab_cols * .1) {
		px = px0;
		vx = 0;
		console.log('colision...');
	}

	if (px - player_scale < lab_cols * -.1) {
		px = px0;
		vx = 0;
		console.log('colision...');
	}

	sceneModels[idx].tx = px;


	if (py + player_scale > lab_rows * .1) {
		py = py0;
		vy = 0;
		console.log('colision...');
	}

	if (py - player_scale < lab_rows * -.1) {
		py = py0;
		vy = 0;
		console.log('colision...');
	}

	sceneModels[idx].ty = py;
}

/*
function collisions(){
	for(i=2; i<sceneModels.length; i++){
		if (model.tx + 0.1 > model[i]-0.1){
			tx = model[i];
		}
		if (model.tx - 0.1 > model[i]-0.1){
			tx = model[i];
		}
		if (model.ty + 0.1 > model[i]-0.1){
			tx = model[i];
		}
		if (model.ty - 0.1 > model[i]-0.1){
			tx = model[i];
		}
	}
}
*/

//----------------------------------------------------------------------------
//
// Main Loop

function main_loop() {
	move_player();
	drawScene();
	requestAnimFrame(main_loop);
}


//----------------------------------------------------------------------------
//
//  User Interaction
//

//----------------------------------------------------------------------------

function csv2array(data, delimeter) {
	// Retrieve the delimeter
	if (delimeter == undefined)
		delimeter = ',';
	if (delimeter && delimeter.length > 1)
		delimeter = ',';

	// initialize variables
	var newline = '\n';
	var eof = '';
	var i = 0;
	var c = data.charAt(i);
	var row = 0;
	var col = 0;
	var array = new Array();

	while (c != eof) {
		// skip whitespaces
		while (c == ' ' || c == '\t' || c == '\r') {
			c = data.charAt(++i); // read next char
		}

		// get value
		var value = "";
		if (c == '\"') {
			// value enclosed by double-quotes
			c = data.charAt(++i);

			do {
				if (c != '\"') {
					// read a regular character and go to the next character
					value += c;
					c = data.charAt(++i);
				}

				if (c == '\"') {
					// check for escaped double-quote
					var cnext = data.charAt(i + 1);
					if (cnext == '\"') {
						// this is an escaped double-quote. 
						// Add a double-quote to the value, and move two characters ahead.
						value += '\"';
						i += 2;
						c = data.charAt(i);
					}
				}
			}
			while (c != eof && c != '\"');

			if (c == eof) {
				throw "Unexpected end of data, double-quote expected";
			}

			c = data.charAt(++i);
		}
		else {
			// value without quotes
			while (c != eof && c != delimeter && c != newline && c != ' ' && c != '\t' && c != '\r') {
				value += c;
				c = data.charAt(++i);
			}
		}

		// add the value to the array
		if (array.length <= row)
			array.push(new Array());
		array[row].push(value);

		// skip whitespaces
		while (c == ' ' || c == '\t' || c == '\r') {
			c = data.charAt(++i);
		}

		// go to the next row or column
		if (c == delimeter) {
			// to the next column
			col++;
		}
		else if (c == newline) {
			// to the next row
			col = 0;
			row++;
		}
		else if (c != eof) {
			// unexpected character
			throw "Delimiter expected after character " + i;
		}

		// go to the next character
		c = data.charAt(++i);
	}

	return array;
}

//----------------------------------------------------------------------------

function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	const s = 16;

	if (x > (world_width / 2)) {
		world_rz = -s * ((x - (world_width / 2)) / (world_width / 2));
		ax = 0.001;
	} else {
		world_rz = s * (((world_width / 2) - x) / (world_width / 2));
		ax = -0.001;
	}

	if (y > world_height / 2) {
		world_rx = baseXXRot + s * ((y - (world_height / 2)) / (world_height / 2));
		ay = -0.001;
	} else {
		world_rx = baseXXRot + -s * (((world_height / 2) - y) / (world_height / 2));
		ay = 0.001;
	}

	//console.log("world rz: " + world_rz+ " world rx: "+world_rx);
}

function dragover_handler(ev) {
	ev.stopPropagation();
	ev.preventDefault();
	ev.dataTransfer.dropEffect = 'copy';
}

function drop_handler(ev) {
	ev.preventDefault();
	var files = ev.dataTransfer.files;
	var reader = new FileReader();
	reader.readAsText(files[0]);
	reader.onload = loadHandler;
}

function loadHandler(event) {
	var csv = event.target.result;
	console.log(csv);
	var array = csv2array(csv);
	console.log(array);
	reset_scene();
	start_game(array);
}

function setEventListeners() {
	var canvas = document.getElementById("my-canvas");
	world_width = canvas.width;
	world_height = canvas.height;
	canvas.addEventListener('mousemove', function (e) {
		getCursorPosition(canvas, e)
	});

	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', dragover_handler, false);
	dropZone.addEventListener('drop', drop_handler, false);
}

//----------------------------------------------------------------------------
//
// WebGL Initialization
//

function initWebGL(canvas) {
	try {

		// Create the WebGL context

		// Some browsers still need "experimental-webgl"

		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		// DEFAULT: The viewport occupies the whole canvas 

		// DEFAULT: The viewport background color is WHITE

		// NEW - Drawing the triangles defining the model

		primitiveType = gl.TRIANGLES;

		// DEFAULT: Face culling is DISABLED

		// Enable FACE CULLING

		gl.enable(gl.CULL_FACE);

		// DEFAULT: The BACK FACE is culled!!

		// The next instruction is not needed...

		gl.cullFace(gl.BACK);

		// Enable DEPTH-TEST

		gl.enable(gl.DEPTH_TEST);

	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}
}

//----------------------------------------------------------------------------

function runWebGL() {
	var canvas = document.getElementById("my-canvas");
	initWebGL(canvas);
	shaderProgram = initShaders(gl);
	setEventListeners();
}

function reset_scene() {
	// reset variables and scene
	vx = 0;
	vy = 0;
	ax = 0;
	ay = 0;
	sceneModels = [];
}

function start_game(lab) {
	lab_rows = lab.length
	lab_cols = lab[0].length;
	create_floor(lab);
	create_player(lab);
	create_walls(lab);
	if(first){
		first = false;
		main_loop();
	}
}


