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
var baseYYRot = 0;
var baseZZRot = 0;

// Player acceleartion and velocity...
var ax = 0.0;
var ay = 0.0;
var vx = 0.0;
var vy = 0.0;

var world_rz = 0.0, world_rx = 0.0, world_ry = 0.0;
var world_width = 0.0, world_height = 0.0;

// To allow choosing the projection type
var projectionType = 1;

// It has to be updated according to the projection type
var pos_Viewer = [0.0, 0.0, 0.0, 1.0];

// Textures
var webGLTextures = [];

//----------------------------------------------------------------------------
var elapsedTime = 0;
var frameCount = 0;
var lastfpsTime = null;
var delta_time = 0;

function countFrames(now) {
	if (now) {
		if (!lastfpsTime) {
			lastfpsTime = now;
		}
		frameCount++;
		delta_time = now - lastfpsTime
		elapsedTime += delta_time;
		lastfpsTime = now;
		//console.log('Now = ' + now + ' lastfpsTime = ' + lastfpsTime + ' ET =' + elapsedTime);
		if (elapsedTime >= 1000) {
			fps = frameCount;
			frameCount = 0;
			elapsedTime -= 1000;
			document.getElementById('fps').innerHTML = 'fps:' + fps;
		}
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
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Vertex Normal Vectors
	triangleVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.normals), gl.STATIC_DRAW);
	triangleVertexNormalBuffer.itemSize = 3;
	triangleVertexNormalBuffer.numItems = model.normals.length / 3;

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, triangleVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Texture
	triangleVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
	triangleVertexTextureCoordBuffer.itemSize = 2;
	triangleVertexTextureCoordBuffer.numItems = model.textureCoords.length / 2;

	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, triangleVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Vertex indices
	triangleVertexIndexBuffer = gl.createBuffer();
	//gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexIndexBuffer);
	//gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(model.vertexIndices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.vertexIndices), gl.STATIC_DRAW);
	triangleVertexIndexBuffer.itemSize = 1;
	triangleVertexIndexBuffer.numItems = model.vertexIndices.length;
}

//----------------------------------------------------------------------------

//  Drawing the model
function drawModel(model, mvMatrix) {
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

	//gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	//gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// Textures
	//gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexTextureCoordBuffer);
	//gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, triangleVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	//use texture 0
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, webGLTextures[model.webGLTextureIdx]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	// The vertex indices
	//gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexIndexBuffer);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVertexIndexBuffer);

	// Material properties
	gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_ambient"), flatten(model.kAmbi));
	gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_diffuse"), flatten(model.kDiff));
	gl.uniform3fv(gl.getUniformLocation(shaderProgram, "k_specular"), flatten(model.kSpec));
	gl.uniform1f(gl.getUniformLocation(shaderProgram, "shininess"), model.nPhong);

	// Light Sources
	var numLights = lightSources.length;
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "numLights"), numLights);

	//Light Sources
	for (var i = 0; i < lightSources.length; i++) {
		gl.uniform1i(gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),lightSources[i].isOn);
		gl.uniform4fv(gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),flatten(lightSources[i].getPosition()));
		gl.uniform3fv(gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),flatten(lightSources[i].getIntensity()));
	}

	//gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
	gl.drawElements(gl.TRIANGLES, triangleVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

//----------------------------------------------------------------------------

//  Drawing the 3D scene

function drawScene() {
	var pMatrix;
	var mvMatrix = mat4();
	// Clearing the frame-buffer and the depth-buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//gl.clear(gl.COLOR_BUFFER_BIT);
	
	// Computing the Projection Matrix
	if (projectionType == 0) {
		// For now, the default orthogonal view volume
		pMatrix = ortho(-1.0, 1.0, -1.0, 1.0, -1.0, 1.0);
		// Global transformation !!
		globalTz = 0.0;
		// NEW --- The viewer is on the ZZ axis at an indefinite distance
		pos_Viewer[0] = pos_Viewer[1] = pos_Viewer[3] = 0.0;
		pos_Viewer[2] = 1.0;
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
	}

	// Passing the Projection Matrix to apply the current projection
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));

	// Passing the viewer position to the vertex shader
	gl.uniform4fv(gl.getUniformLocation(shaderProgram, "viewerPosition"), flatten(pos_Viewer));

	// GLOBAL TRANSFORMATION FOR THE WHOLE SCENE
	mvMatrix = translationMatrix(0, 0, globalTz);
	mvMatrix = mult(mvMatrix, rotationZZMatrix(world_rz + baseZZRot));
	mvMatrix = mult(mvMatrix, rotationYYMatrix(world_ry + baseYYRot));
	mvMatrix = mult(mvMatrix, rotationXXMatrix(world_rx + baseXXRot));

	// Updating the position of the light sources, if required
	// FOR EACH LIGHT SOURCE
	/*for (var i = 0; i < lightSources.length; i++) {
		// Animating the light source, if defined
		
		if (!lightSources[i].isOff()) {
			// COMPLETE THE CODE FOR THE OTHER ROTATION AXES
			if (lightSources[i].isRotYYOn()) {
				lightSourceMatrix = mult(lightSourceMatrix, rotationYYMatrix(lightSources[i].getRotAngleYY()));
			}
		}

		// Passing the Light Souree Matrix to apply
		var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].lightSourceMatrix");
		gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));
	}*/


	var lightSourceMatrix = mat4();
	var lsmUniform = gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].lightSourceMatrix");
	gl.uniformMatrix4fv(lsmUniform, false, new Float32Array(flatten(lightSourceMatrix)));

	// Instantianting all scene models
	for (var i = 0; i < sceneModels.length; i++) {
		drawModel(sceneModels[i], mvMatrix);
	}
}

//----------------------------------------------------------------------------
//
// Move player

function radians_to_degrees(radians) {
	var pi = Math.PI;
	return radians * (180 / pi);
}

function move_player(idx = 1) {
	vx += ax;
	vy += ay;

	var px0 = sceneModels[idx].tx;
	var py0 = sceneModels[idx].ty;

	var px = px0 + vx * delta_time;
	var py = py0 + vy * delta_time;

	// check for collisions in YY
	// Check collisions with the world limits
	if (py + player_scale > lab_rows * block_scale) {
		py = py0;
		vy = 0;
	} else if (py - player_scale < lab_rows * -block_scale) {
		py = py0;
		vy = 0;
	} else {
		// check collisions with the world walls (closest wall)
		var candidates = tree.nearest({ x: px0, y: py }, 1, player_scale + Math.sqrt(block_scale * block_scale));
		if (candidates.length > 0) {
			if (collision(px0, py, candidates[0][0].x, candidates[0][0].y)) {
				py = py0;
				vy = 0;
			}
		}
	}

	// check for collisions in XX
	// Check collisions with the world limits
	if (px + player_scale > lab_cols * block_scale) {
		px = px0;
		vx = 0;
	} else if (px - player_scale < lab_cols * -block_scale) {
		px = px0;
		vx = 0;
	} else {
		// check collisions with the world walls (closest wall)
		var candidates = tree.nearest({ x: px, y: py }, 1, player_scale + Math.sqrt(block_scale * block_scale));
		if (candidates.length > 0) {
			if (collision(px, py, candidates[0][0].x, candidates[0][0].y)) {
				px = px0;
				vx = 0;
			}
		}
	}

	sceneModels[idx].tx = px;
	sceneModels[idx].ty = py;

	// animate player
	delta_theta_x = (px - px0) / player_scale;
	delta_theta_y = (py - py0) / player_scale;

	sceneModels[idx].rotAngleYY += radians_to_degrees(delta_theta_x);
	sceneModels[idx].rotAngleXX += radians_to_degrees(-delta_theta_y);
	lightSources[lightSources.length-1].setPosition( px, py, sceneModels[idx].tz, 1.0 );
}

function clamp(value, minimum, maximum) {
	return Math.max(minimum, Math.min(maximum, value))
}

function collision(cx, cy, rx, ry) {
	var difference_x = cx - rx, difference_y = cy - ry;
	var clamped_x = clamp(difference_x, -block_scale, block_scale),
		clamped_y = clamp(difference_y, -block_scale, block_scale);
	var closest_x = rx + clamped_x, closest_y = ry + clamped_y;
	var distance = Math.sqrt(Math.pow(closest_x - cx, 2) + Math.pow(closest_y - cy, 2));
	if (distance < player_scale) {
		return true;
	} else {
		return false;
	}
}


//----------------------------------------------------------------------------
//
// Main Loop

function main_loop(now) {
	countFrames(now);
	move_player();
	drawScene();
	requestAnimFrame(main_loop);
}


//----------------------------------------------------------------------------
//
//  User Interaction
//
//----------------------------------------------------------------------------

function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	const s = 16;

	if (x > (world_width / 2)) {
		var theta = ((x - (world_width / 2)) / (world_width / 2)) * -s;
		world_rz = theta;
	} else {
		var theta = (((world_width / 2) - x) / (world_width / 2)) * s;
		world_rz = theta;
	}
	ax = -9.8 * Math.sin(radians(theta)) * 0.0001;

	if (y > world_height / 2) {
		var theta = ((y - (world_height / 2)) / (world_height / 2)) * s;
		world_rx = theta;
	} else {
		var theta = (((world_height / 2) - y) / (world_height / 2)) * -s;
		world_rx = theta;
	}
	ay = -9.8 * Math.sin(radians(theta)) * 0.0001;
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
	var array = csv2array(csv).reverse();
	console.log(array);
	reset_scene();
	start_game(array);
}

function setEventListeners() {
	// Setup mouse
	var canvas = document.getElementById("my-canvas");
	world_width = canvas.width;
	world_height = canvas.height;
	canvas.addEventListener('mousemove', function (e) {
		getCursorPosition(canvas, e)
	});

	// Setup the dnd listeners...
	var dropZone = document.getElementById('drop_zone');
	dropZone.addEventListener('dragover', dragover_handler, false);
	dropZone.addEventListener('drop', drop_handler, false);


	// Setup keys...
	window.addEventListener('keydown', function(event) {
		event.preventDefault();
		delta = 5;
		
		switch (event.keyCode) {
		  case 37:
			baseYYRot -= delta;
			
			break;
		  case 38:
			baseXXRot -= delta;
			break;
		  case 39:
			baseYYRot += delta;
			break;
		  case 40:
			baseXXRot += delta;
			break;
		}
	}
	);
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
	
	// Load textures...
	webGLTextures.push(load_texture('resources/dirt01.jpg'));
	webGLTextures.push(load_texture('resources/grass01.jpg'));
	webGLTextures.push(load_texture('resources/metal.png'));
	
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
	if (first) {
		first = false;
		main_loop();
	}
}