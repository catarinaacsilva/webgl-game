var gl = null;

var shaderProgram = null;

var triangleVertexPositionBuffer = null;

var triangleVertexColorBuffer = null;

var primitiveType = null;

//labirinto mais complexo
var csv_file = "1,1,1,1,1,1,1\n\
1,1,1,1,1,#,1\n\
1,1,1,1,1,0,1\n\
1,1,1,1,1,0,1\n\
1,0,0,0,0,0,1\n\
1,0,1,1,1,1,1\n\
1,0,1,1,1,1,1\n\
1,*,1,1,1,1,1\n\
1,1,1,1,1,1,1";

var csv_file = "1,1,1\n1,1,1\n1,1,1";

let world_rz = 0.0, world_rx = 0.0;
let world_width = 0.0, world_height=0.0;
var timeSpent = 0;



// TODO: é preciso criar um buffer por cada objeto??
// os objetos neste caso tem sido sempre os mesmos --> cubos com transformações
//resposta: diferentes objetos em principio precisam de buffers diferentes --> aula8
function initBuffers() {
	// Coordinates
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model_cube()), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = model_cube().length / 3;

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
		triangleVertexPositionBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

	// Colors

	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors_cube()), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors_cube().length / 3;

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,
		triangleVertexColorBuffer.itemSize,
		gl.FLOAT, false, 0, 0);

}

function drawModel(model, mvMatrix, primitiveType) {

	var angleXX = model["rotation"][0];
	var angleYY = model["rotation"][1];
	var angleZZ = model["rotation"][2];
	var tx = model["translation"][0];
	var ty = model["translation"][1];
	var tz = model["translation"][2];
	var sx = model["scale"][0];
	var sy = model["scale"][1];
	var sz = model["scale"][2];

	mvMatrix = mult(mvMatrix, translationMatrix(tx, ty, tz));

	mvMatrix = mult(mvMatrix, rotationZZMatrix(angleZZ + world_rz));

	mvMatrix = mult(mvMatrix, rotationYYMatrix(angleYY));

	mvMatrix = mult(mvMatrix, rotationXXMatrix(angleXX + world_rx));

	mvMatrix = mult(mvMatrix, scalingMatrix(sx, sy, sz));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));

	gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems);
}

//neste momento preparado para desenhar a cena: chao + paredes (vários cubos)
function drawScene() {
	var pMatrix;

	var mvMatrix = mat4();

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

function initWebGL(canvas) {
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
		primitiveType = gl.TRIANGLES;

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.enable(gl.DEPTH_TEST);

	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}
}

function create_cube(x, y, z, sx, sy, sz, rx, ry, rz) {
	var rv = {
		"vertices": model_cube(),
		"colors": colors_cube(),
		"translation": [x, y, z],
		"rotation": [rx, ry, rz],
		"scale": [sx, sy, sz],
	};

	return rv;
}

// com um cubo (create_cube) desenha o chao: no centro do eixo, com uma escala = ao tamanho do labirinto, e com rotação 60º
function createFloor(csv_file_name) {
	//fetch(csv_file_name).then(response => response.text()).then(text => console.log(text))
	m = csv2array(csv_file);
	
	rows = m.length;
	cols = m[0].length;
	
	return create_cube(0, 0, 0, rows, cols, .1, -60.0, 0.0, 0.0);
}

//basicamente desenha varios cubos (semelhante à anterior): percorre as linhas e colunas do labirinto (matriz) e ajusta nas translações (x e y)
function createWalls(csv_file_name) {
	m = csv2array(csv_file);
	rv = []
	for(var i = 0; i < m.length; i++) {
		for (var j = 0; j < m[i].length; j++) {
			console.log("X "+i+" Y "+j)
			rv.push(create_cube((.5*j)-(m[i].length/4), (-.5*i)+(m.length/4), 0, 1, 1, 1, 0.0, 0.0, 0.0));
		}
	}
	return rv;
}

//mexer com o cursor: normalizar as posições
function getCursorPosition(canvas, event) {
	const rect = canvas.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top
	const s = 16.0;

	// contas a bruta -> eu sei que o mundo tem 640 por 480

	if (x > (world_width / 2)) {
		world_rz = -s * ((x - (world_width / 2)) / (world_width / 2))
	} else {
		world_rz = s * (((world_width / 2) - x) / (world_width / 2))
	}

	if(y > world_height/2) {
		world_rx = s * ((y - (world_height / 2)) / (world_height / 2))
	} else {
		world_rx = -s * (((world_height/2)-y) / (world_height / 2))
	}

	//console.log("world rz: " + world_rz+ " world rx: "+world_rx);
}

//TODO: este ficheiro com o labirinto ainda não esta a ser usado. Como ler um ficheiro? Possivel? ou só arrastar através do html (página)?
// resposta: normalmente nao em js no lemos ficheiros...
var floor = createFloor('lab00.csv');
var list_walls = createWalls('lab00.csv');

//faz o render: em vez de chamar manualmente o código é executado de x em x tempo. fps = 24 (posso por 60 mas PC fica lento...) 
function main_loop() {
	timeSpent += 1.0 / 24.0; // contador de tempo: se o tabuleiro estiver inclinado a bola vai deslizando
	
	var mvMatrix = mat4();
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	drawModel(floor, mvMatrix, primitiveType);
	for(var i = 0; i < list_walls.length; i++) {
		drawModel(list_walls[i], mvMatrix, primitiveType);
	}
	
	window.setTimeout(main_loop, 1000 / 24);
	//console.log("Time: "+timeSpent)
}

function runWebGL() {
	var canvas = document.getElementById("my-canvas");
	world_width = canvas.width;
	world_height = canvas.height;
	initWebGL(canvas);

	//var ball = createBall();
	//var target = createTarget();

	shaderProgram = initShaders(gl);

	initBuffers();

	canvas.addEventListener('mousemove', function (e) {
		getCursorPosition(canvas, e)
	})
	
	main_loop();
}


