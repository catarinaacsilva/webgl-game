
var gl = null; // WebGL context

var shaderProgram = null; 

var triangleVertexPositionBuffer = null;
	
var triangleVertexColorBuffer = null;

// The global transformation parameters

// The translation vector

var tx = 0.0;

var ty = 0.0;

var tz = 0.0;

// The rotation angles in degrees

var angleXX = 0.0;

var angleYY = 0.0;

var angleZZ = 0.0;
 
// NEW - To allow choosing the way of drawing the model triangles

var primitiveType = null;
 
// For storing the vertices defining the triangles

var vertices = [

		// FRONT FACE
		 
		-0.25, -0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		 
		 0.25,  0.25,  0.25,

		 
		 0.25,  0.25,  0.25,
		 
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		
		// TOP FACE
		
		-0.25,  0.25,  0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25,  0.25, -0.25,

		 
		 0.25,  0.25, -0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25,  0.25,  0.25,
		
		// BOTTOM FACE 
		
		-0.25, -0.25, -0.25,
		 
		 0.25, -0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 
		 0.25, -0.25,  0.25,
		 
		-0.25, -0.25,  0.25,
		 
		-0.25, -0.25, -0.25,
		
		// LEFT FACE 
		
		-0.25,  0.25,  0.25,
		 
		-0.25, -0.25, -0.25,

		-0.25, -0.25,  0.25,
		 
		 
		-0.25,  0.25,  0.25,
		 
		-0.25,  0.25, -0.25,
		 
		-0.25, -0.25, -0.25,
		
		// RIGHT FACE 
		
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25,  0.25,

		 0.25, -0.25, -0.25,
		 
		 
		 0.25,  0.25, -0.25,
		 
		 0.25,  0.25,  0.25,
		 
		 0.25, -0.25,  0.25,
		
		// BACK FACE 
		
		-0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,

		-0.25, -0.25, -0.25,
		 
		 
		-0.25,  0.25, -0.25,
		 
		 0.25,  0.25, -0.25,
		 
		 0.25, -0.25, -0.25,			 
];


var tabuleiro = [   
    -2.0, -1.0,  1.0, 1.0, 0.0, 0.0,

    2.0,  1.0,  1.0,  1.0, 0.0, 0.0,

    -2.0,  1.0,  1.0, 1.0, 0.0, 0.0,


    -2.0, -1.0,  1.0, 1.0, 0.0, 1.0,

    2.0, -1.0,  1.0, 1.0, 0.0, 1.0,

    2.0,  1.0,  1.0, 1.0, 0.0, 1.0,


    2.0, -1.0,  1.0, 1.0, 1.0, 0.0,

    2.0, -1.0, -1.0, 1.0, 1.0, 0.0,

    2.0,  1.0, -1.0, 1.0, 1.0, 0.0,


    2.0, -1.0,  1.0, 0.0, 1.0, 0.0,

    2.0,  1.0, -1.0, 0.0, 1.0, 0.0,

    2.0,  1.0,  1.0,, 0.0, 1.0, 0.0,


    -2.0, -1.0, -1.0, 1.0, 1.0, 1.0,

    -2.0, 1.0, -1.0, 1.0, 1.0, 1.0,

    2.0, 1.0, -1.0, 1.0, 1.0, 1.0,


    -2.0, -1.0, -1.0, 0.0, 1.0, 1.0,

    2.0, 1.0, -1.0, 0.0, 1.0, 1.0,

    2.0, -1.0, -1.0, 0.0, 1.0, 1.0,


    -2.0, -1.0, -1.0, 1.0, 0.25, 1.0,

    -2.0, -1.0,  1.0, 1.0, 0.25, 1.0,

    -2.0, 1.0, -1.0, 1.0, 0.25, 1.0,


    -2.0, -1.0, 1.0, 0.0, 0.25, 1.0,

    -2.0, 1.0, 1.0, 0.0, 0.25, 1.0,

    -2.0, 1.0, -1.0, 0.0, 0.25, 1.0,


    -2.0, 1.0, -1.0, 0.0, 0.0, 1.0,

    -2.0, 1.0, 1.0, 0.0, 0.0, 1.0,

    2.0, 1.0, -1.0, 0.0, 0.0, 1.0,


    -2.0, 1.0, 1.0, 0.5, 0.0, 1.0,

    2.0, 1.0, 1.0, 0.5, 0.0, 1.0,

    2.0, 1.0, -1.0, 0.5, 0.0, 1.0,


    -2.0, -1.0, 1.0, 0.25, 0.25, 0.25,

    -2.0, -1.0, -1.0, 0.25, 0.25, 0.25,

    2.0, -1.0, -1.0, 0.25, 0.25, 0.25,


    -2.0, -1.0, 1.0, 0.5, 0.0, 0.25,

    2.0, -1.0, -1.0, 0.5, 0.0, 0.25,

    2.0, -1.0, 1.0, 0.5, 0.0, 0.25 
];

// And their colour

var colors = [

		 // FRONT FACE
		 	
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,
		 
		 1.00,  0.00,  0.00,

		 	
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 
		 1.00,  1.00,  0.00,
		 			 
		 // TOP FACE
		 	
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,
		 
		 0.00,  0.00,  0.00,

		 	
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 
		 0.50,  0.50,  0.50,
		 			 
		 // BOTTOM FACE
		 	
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,
		 
		 0.00,  1.00,  0.00,

		 	
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 
		 0.00,  1.00,  1.00,
		 			 
		 // LEFT FACE
		 	
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,
		 
		 0.00,  0.00,  1.00,

		 	
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 
		 1.00,  0.00,  1.00,
		 			 
		 // RIGHT FACE
		 	
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,
		 
		 0.25,  0.50,  0.50,

		 	
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 
		 0.50,  0.25,  0.00,
		 			 
		 			 
		 // BACK FACE
		 	
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,
		 
		 0.25,  0.00,  0.75,

		 	
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,
		 
		 0.50,  0.35,  0.35,			 			 
];


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
function drawModel( angleXX, angleYY, angleZZ, 
					sx, sy, sz,
					tx, ty, tz,
					mvMatrix,
					primitiveType ) {

    // Pay attention to transformation order !!
    
	mvMatrix = mult( mvMatrix, translationMatrix( tx, ty, tz ) );
						 
	mvMatrix = mult( mvMatrix, rotationZZMatrix( angleZZ ) );
	
	mvMatrix = mult( mvMatrix, rotationYYMatrix( angleYY ) );
	
	mvMatrix = mult( mvMatrix, rotationXXMatrix( angleXX ) );
	
	mvMatrix = mult( mvMatrix, scalingMatrix( sx, sy, sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// Drawing the contents of the vertex buffer
	
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	
	if( primitiveType == gl.LINE_LOOP ) {
		
		// To simulate wireframe drawing!
		
		// No faces are defined! There are no hidden lines!
		
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		
		var i;
		
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
		
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {
				
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
		
	}	
}


function drawScene() {
	
	gl.clear(gl.COLOR_BUFFER_BIT);

	
	var mvMatrix = rotationZZMatrix( angleZZ );
						 
	mvMatrix = mult( rotationYYMatrix( angleYY ), mvMatrix );
						 
	mvMatrix = mult( rotationXXMatrix( angleXX ), mvMatrix );
						 
	mvMatrix = mult( translationMatrix( tx, ty, tz ), mvMatrix );
						 
	
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

		
	gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
 
}


function outputInfos(){
		
}

//----------------------------------------------------------------------------

function setEventListeners(){

	document.addEventListener('keydown', keyDownHandler, false);
	function keyDownHandler(event) {
		if(event.keyCode == 39) {
			//rightPressed = true;
			tx += 0.25;
		}
		else if(event.keyCode == 37) {
			//leftPressed = true;
			tx -= 0.25;
		}
		if(event.keyCode == 40) {
			//downPressed = true;
			ty -= 0.25;
		}
		else if(event.keyCode == 38) {
			//upPressed = true;
			ty += 0.25;
		}
		drawScene(); 
	} 

    
	document.getElementById("XX-rotate-CW-button").onclick = function(){
		
		// Updating
		
		angleXX -= 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("XX-rotate-CCW-button").onclick = function(){
		
		// Updating
		
		angleXX += 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("YY-rotate-CW-button").onclick = function(){
		
		// Updating
		
		angleYY -= 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("YY-rotate-CCW-button").onclick = function(){
		
		// Updating
		
		angleYY += 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("ZZ-rotate-CW-button").onclick = function(){
		
		// Updating
		
		angleZZ -= 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("ZZ-rotate-CCW-button").onclick = function(){
		
		// Updating
		
		angleZZ += 15.0;
		
		// Render the viewport
		
		drawScene();  
	};      

	document.getElementById("reset-button").onclick = function(){
		
		// The initial values

		tx = 0.0;

		ty = 0.0;

		tz = 0.0;

		angleXX = 0.0;

		angleYY = 0.0;

		angleZZ = 0.0;

		// Render the viewport
		
		drawScene();  
	};      

	 
}


function initWebGL( canvas ) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		primitiveType = gl.TRIANGLES;

		gl.enable( gl.CULL_FACE );
		gl.cullFace( gl.BACK );
		
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

//----------------------------------------------------------------------------

function runWebGL() {
	
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );

	shaderProgram = initShaders( gl );
	
	setEventListeners();
	
	initBuffers();
	
	drawScene();    

	outputInfos();
}


