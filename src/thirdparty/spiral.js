/////////////////////////////////////////////////////////////
//////////////////////    Vec3     //////////////////////////
/////////////////////////////////////////////////////////////

var Vec3 = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};


/////////////////////////////////////////////////////////////
////////////////////   SpiralMenu     ///////////////////////
/////////////////////////////////////////////////////////////

var SpiralMenu = function (canvas) {
  // visual elements
  this.canvas = canvas;
  var self = this;
  var configuration = new SpiralConfig(canvas, 50);
  var numSpirals = 2;
  var spirals = [];

  // Spiral drag properties
  var isMouseDown = false;
  var pMouseX = 0;
  var mouseX = 0;
  var gravity = 1;
  var spiralRotation = 0;
  var spiralSpeed = 0.012;
  var frameReq = 0;

  // labels
  var labelPool = [];
  var leftLabels = [];
  var rightLabels = [];


  for (var i = 0; i < numSpirals; ++i) {
    spirals.push(new Spiral(i * Math.PI, Math.PI * 0.8))
  }

  window.addEventListener('resize', onSpiralResize);
  this.canvas.addEventListener('mousedown', onSpiralDragMouseDown);
  this.canvas.addEventListener('mouseup', onSpiralDragMouseUp);

  render();


  function onSpiralResize(event) {
    configuration.center();
  }

  function onSpiralDragMouseDown(event) {
    isMouseDown = true;
    self.canvas.style.cursor = 'ew-resize';
    gravity = 0.9;
    pMouseX = event.pageX;
    mouseX = pMouseX;
    self.canvas.addEventListener('mousemove', onSpiralDragMouseMove);
    if (frameReq == 0) {
      frameReq = requestAnimationFrame(render);
    }
  }

  function onSpiralDragMouseMove(event) {
    mouseX = event.pageX;
  }

  function onSpiralDragMouseUp(event) {
    isMouseDown = false;
    self.canvas.style.cursor = 'pointer';
    self.canvas.removeEventListener('mousemove', onSpiralDragMouseMove);
  }

  function render() {
    // console.log("render");
    // clear canvas
    this.canvas.width = configuration.canvasWidth;
    this.canvas.height = configuration.canvasHeight;

    // handle spiral rotation
    if (isMouseDown) {
      var diff = (mouseX - pMouseX) * 0.01;
      spiralRotation += diff;
      spiralSpeed = diff * 2;
      pMouseX = mouseX;
    } else {
      spiralSpeed *= gravity;
      spiralRotation += spiralSpeed;
    }

    // render spirals
    for (var i = 0; i < numSpirals; ++i) {
      var points = spirals[i].rotate(spiralRotation, configuration, 10);
    }

    // position labels


    // auto stop frame request when idle
    if (isMouseDown || Math.abs(spiralSpeed) > 0.001) {
      frameReq = requestAnimationFrame(render);
    } else {
      frameReq = 0;
    }
  }
};


/////////////////////////////////////////////////////////////
////////////////////  SpiralConfig    ///////////////////////
/////////////////////////////////////////////////////////////

var SpiralConfig = function (canvas, numPoints) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.canvasWidth = this.canvas.clientWidth;
  this.canvasHeight = this.canvas.clientHeight;
  this.centerX = this.canvasWidth / 2;
  this.centerY = this.canvasHeight / 2;
  this.width = Math.min(this.centerX - 20, 200);
  this.height = Math.min(this.canvasHeight - 40, 600);
  this.nPoints = numPoints;
};

SpiralConfig.prototype.center = function () {
  this.canvasWidth = this.canvas.clientWidth;
  this.canvasHeight = this.canvas.clientHeight;
  this.centerX = this.canvasWidth / 2;
  this.centerY = this.canvasHeight / 2;
  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;
};


/////////////////////////////////////////////////////////////
//////////////////////   Spiral     /////////////////////////
/////////////////////////////////////////////////////////////

var Spiral = function (offset, length) {
  this.angleOffset = offset;
  this.length = length;
};

Spiral.prototype.rotate = function (rotation, config, numPoints) {
  var
    vectors = [],
    p = new Vec3(0, 0, 0),
    pointsDelay = Math.floor(config.nPoints / numPoints),
    pointsPos = 0,
    pointsNext = Math.floor(pointsDelay / 2) + 1,
    yStep = config.height / (config.nPoints - 1),
    angleStep = this.length / (config.nPoints - 1),
    middle = -config.nPoints / 2,
    angle = 0,
    z = 0;

  rotation += this.angleOffset;

  p.z = Math.cos(rotation) * 0.4 + 0.6;
  p.x = config.centerX + config.width * Math.sin(rotation);
  p.y = config.centerY + middle * yStep;// * p.z;
  config.context.lineCap = 'square';
  config.context.beginPath();
  config.context.moveTo(p.x, p.y);

  for (var i = 1; i < config.nPoints; ++i) {
    angle = rotation + i * angleStep;
    z = Math.cos(angle) * 0.4 + 0.6;
    p = new Vec3(
      config.centerX + config.width * Math.sin(angle),
      config.centerY + (i + middle) * yStep,// * z,
      z
    );
    config.context.lineWidth = z * 8 + 2;
    config.context.strokeStyle = 'rgba(255,255,255,' + z + ')';
    config.context.lineTo(p.x, p.y);
    config.context.stroke();
    config.context.beginPath();
    config.context.moveTo(p.x, p.y);

    if (i >= pointsNext) {
      vectors.push(p);
      pointsNext += pointsDelay;
    }
  }

  return vectors;
}

module.exports = SpiralMenu;

