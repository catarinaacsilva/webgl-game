var gl = null; // WebGL context

var shaderProgram = null;

var triangleVertexPositionBuffer = null;

var triangleVertexColorBuffer = null;


// NEW - To allow choosing the way of drawing the model triangles

var primitiveType = null;

// For storing the vertices defining the triangles

var vertices = [

	// FRONT FACE

	-0.25, -0.25, 0.25,

	0.25, -0.25, 0.25,

	0.25, 0.25, 0.25,


	0.25, 0.25, 0.25,

	-0.25, 0.25, 0.25,

	-0.25, -0.25, 0.25,

	// TOP FACE

	-0.25, 0.25, 0.25,

	0.25, 0.25, 0.25,

	0.25, 0.25, -0.25,


	0.25, 0.25, -0.25,

	-0.25, 0.25, -0.25,

	-0.25, 0.25, 0.25,

	// BOTTOM FACE 

	-0.25, -0.25, -0.25,

	0.25, -0.25, -0.25,

	0.25, -0.25, 0.25,


	0.25, -0.25, 0.25,

	-0.25, -0.25, 0.25,

	-0.25, -0.25, -0.25,

	// LEFT FACE 

	-0.25, 0.25, 0.25,

	-0.25, -0.25, -0.25,

	-0.25, -0.25, 0.25,


	-0.25, 0.25, 0.25,

	-0.25, 0.25, -0.25,

	-0.25, -0.25, -0.25,

	// RIGHT FACE 

	0.25, 0.25, -0.25,

	0.25, -0.25, 0.25,

	0.25, -0.25, -0.25,


	0.25, 0.25, -0.25,

	0.25, 0.25, 0.25,

	0.25, -0.25, 0.25,

	// BACK FACE 

	-0.25, 0.25, -0.25,

	0.25, -0.25, -0.25,

	-0.25, -0.25, -0.25,


	-0.25, 0.25, -0.25,

	0.25, 0.25, -0.25,

	0.25, -0.25, -0.25,
];


var tabuleiro = [
	// FRONT FACE

	-2, -0.25, 0.25,

	2, -0.25, 0.25,

	2, 0.25, 0.25,


	2, 0.25, 0.25,

	2, 0.25, 0.25,

	2, -0.25, 0.25,

	// TOP FACE

	2, 0.25, 0.25,

	2, 0.25, 0.25,

	2, 0.25, -0.25,


	2, 0.25, -0.25,

	2, 0.25, -0.25,

	2, 0.25, 0.25,

	// BOTTOM FACE 

	2, -0.25, -0.25,

	2, -0.25, -0.25,

	2, -0.25, 0.25,


	2, -0.25, 0.25,

	2, -0.25, 0.25,

	2, -0.25, -0.25,

	// LEFT FACE 

	2, 0.25, 0.25,

	2, -0.25, -0.25,

	2, -0.25, 0.25,


	2, 0.25, 0.25,

	2, 0.25, -0.25,

	2, -0.25, -0.25,

	// RIGHT FACE 

	2, 0.25, -0.25,

	2, -0.25, 0.25,

	2, -0.25, -0.25,


	2, 0.25, -0.25,

	2, 0.25, 0.25,

	2, -0.25, 0.25,

	// BACK FACE 

	2, 0.25, -0.25,

	2, -0.25, -0.25,

	2, -0.25, -0.25,


	2, 0.25, -0.25,

	2, 0.25, -0.25,

	2, -0.25, -0.25,
];

// And their colour

var colors = [

	// FRONT FACE

	1.00, 0.00, 0.00,

	1.00, 0.00, 0.00,

	1.00, 0.00, 0.00,


	1.00, 1.00, 0.00,

	1.00, 1.00, 0.00,

	1.00, 1.00, 0.00,

	// TOP FACE

	0.00, 0.00, 0.00,

	0.00, 0.00, 0.00,

	0.00, 0.00, 0.00,


	0.50, 0.50, 0.50,

	0.50, 0.50, 0.50,

	0.50, 0.50, 0.50,

	// BOTTOM FACE

	0.00, 1.00, 0.00,

	0.00, 1.00, 0.00,

	0.00, 1.00, 0.00,


	0.00, 1.00, 1.00,

	0.00, 1.00, 1.00,

	0.00, 1.00, 1.00,

	// LEFT FACE

	0.00, 0.00, 1.00,

	0.00, 0.00, 1.00,

	0.00, 0.00, 1.00,


	1.00, 0.00, 1.00,

	1.00, 0.00, 1.00,

	1.00, 0.00, 1.00,

	// RIGHT FACE

	0.25, 0.50, 0.50,

	0.25, 0.50, 0.50,

	0.25, 0.50, 0.50,


	0.50, 0.25, 0.00,

	0.50, 0.25, 0.00,

	0.50, 0.25, 0.00,


	// BACK FACE

	0.25, 0.00, 0.75,

	0.25, 0.00, 0.75,

	0.25, 0.00, 0.75,


	0.50, 0.35, 0.35,

	0.50, 0.35, 0.35,

	0.50, 0.35, 0.35,
];

var cube = {
	"vertices": vertices,
	"colors": colors,
	"translation": [0.0, 0.0, 0.0],
	"rotation": [90, 0.0, 0.0],
	"scale": [0.5, 0.5, 0.5],
}



var floor = [

	{
		"vertices": tabuleiro,
		"colors": colors,
		"translation": [0.0, 0.0, 0.0],
		"rotation": [0.0, 0.0, 0.0],
		"scale": [1.0, 1.0, 1.0],
	},

	{
		"vertices": tabuleiro,
		"colors": colors,
		"translation": [.5, 0.0, 0.0],
		"rotation": [0.0, 0.0, 90.0],
		"scale": [1.0, 1.0, 1.0],
	},

	{
		"vertices": tabuleiro,
		"colors": colors,
		"translation": [-.5, 0.0, 0.0],
		"rotation": [0.0, 90.0, 0.0],
		"scale": [1.0, 1.0, 1.0],
	}
]


function initBuffers() {
	// Coordinates

	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
		triangleVertexPositionBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

	// Colors

	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;

	// Associating to the vertex shader

	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
		triangleVertexColorBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

}

function drawModel(angleXX, angleYY, angleZZ,
	tx, ty, tz,
	sx, sy, sz,
	mvMatrix,
	primitiveType) {

	mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ));

	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));

	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX));

	mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));


	gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);
}


function drawScene() {
	var pMatrix;

	var mvMatrix = mat4();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	/*drawModel( -angleXX, angleYY, angleZZ, 
		tx + 0.5, ty, tz,
		mvMatrix,
		primitiveType );
		
	drawModel( angleXX, angleYY, angleZZ, 
		tx - 0.5, ty-0.5, tz,
		mvMatrix,
		primitiveType );*/

	for (i = 0; i < floor.length; i++) {
		var f = floor[i]
		console.log(f)
		drawModel(f["rotation"][0], f["rotation"][1], f["rotation"][2],
			f["translation"][0], f["translation"][1], f["translation"][2],
			f["scale"][0], f["scale"][1], f["scale"][2],
			mvMatrix, primitiveType);
	}

	drawModel(cube["rotation"][0], cube["rotation"][1], cube["rotation"][2],
		cube["translation"][0], cube["translation"][1], cube["translation"][2],
		cube["scale"][0], cube["scale"][1], cube["scale"][2],
		mvMatrix, primitiveType);
}


function outputInfos() {

}

//----------------------------------------------------------------------------

function setEventListeners() {

	document.addEventListener('keydown', keyDownHandler, false);
	function keyDownHandler(event) {
		if (event.keyCode == 39) {
			//rightPressed = true;
			cube["translation"][0] += 0.25;
		}
		else if (event.keyCode == 37) {
			//leftPressed = true;
			cube["translation"][0] -= 0.25;
		}
		if (event.keyCode == 40) {
			//downPressed = true;
			cube["translation"][1] -= 0.25;
		}
		else if (event.keyCode == 38) {
			//upPressed = true;
			cube["translation"][1] += 0.25;
		}
		drawScene();
	}


	document.getElementById("XX-rotate-CW-button").onclick = function () {

		// Updating

		cube["rotation"][0] -= 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("XX-rotate-CCW-button").onclick = function () {

		// Updating

		cube["rotation"][0] += 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("YY-rotate-CW-button").onclick = function () {

		// Updating

		cube["rotation"][1] -= 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("YY-rotate-CCW-button").onclick = function () {

		// Updating

		cube["rotation"][1] += 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("ZZ-rotate-CW-button").onclick = function () {

		// Updating

		cube["rotation"][2] -= 15.0;

		// Render the viewport

		drawScene();
	};

	document.getElementById("ZZ-rotate-CCW-button").onclick = function () {

		// Updating

		cube["rotation"][2] += 15.0;
		//floor["rotation"][2] += 15.0;

		// Render the viewport

		drawScene();
	};

	/*document.getElementById("reset-button").onclick = function () {

		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;

		angleXX = 0.0;

		angleYY = 0.0;

		angleZZ = 0.0;

		// Render the viewport

		drawScene();
	};*/


}


function initWebGL(canvas) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		primitiveType = gl.TRIANGLES;

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

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

	initBuffers();

	drawScene();

	outputInfos();
}


