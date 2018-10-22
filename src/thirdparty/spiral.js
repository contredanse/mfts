/////////////////////////////////////////////////////////////
//////////////////////    Vec3     //////////////////////////
/////////////////////////////////////////////////////////////

var Vec3 = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

/////////////////////////////////////////////////////////////
////////////////////   SpiralMenu     ///////////////////////
/////////////////////////////////////////////////////////////

var SpiralMenu = function(canvas, content, callback) {
    this.canvas = canvas;
    this.content = content;
    this.container = canvas.parentElement;
    this.labelContainer = document.getElementById('spiral-label-container');

    // visual elements
    var self = this;
    var configuration = new SpiralConfig(canvas, 50);
    var numSpirals = content.length;
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
    var labels = [];

    var navigationCallback = callback;

    // prepare startup content
    for (var i = 0; i < numSpirals; ++i) {
        prepareContent(content[i], 0);
        spirals.push(new Spiral(i * Math.PI, Math.PI * 0.8));
        var sl = [];
        var nn = content[i].content.length;
        for (var j = 0; j < nn; ++j) {
            var label = new SpiralLabel(content[i].content[j], this.labelContainer, configuration);
            sl.push(label);
        }
        labels.push(sl);
    }

    window.addEventListener('resize', onSpiralResize);
    this.container.addEventListener('mouseup', onContainerMouseUp);
    this.container.addEventListener('mousedown', onContainerMouseDown);

    render();

    function prepareContent(node, iterator) {
        node.open = false;
        node.level = iterator;
        if (node.hasOwnProperty('content')) {
            for (let child of node.content) {
                prepareContent(child, iterator + 1);
            }
        }
    }

    function updateMenu() {
        // clean current menu
        labels = [];
        self.labelContainer.innerHTML = '';

        // parse content and create labels
        for (var i = 0; i < numSpirals; ++i) {
            var sl = [];
            for (let node of content[i].content) {
                addToMenu(node, sl);
            }
            labels.push(sl);
        }
    }

    function addToMenu(node, array) {
        // create label for node
        var label = new SpiralLabel(node, self.labelContainer, configuration);
        array.push(label);
        // resurse for opened sections
        if (node.type == 'section' && node.open == true) {
            for (let child of node.content) {
                addToMenu(child, array);
            }
        }
    }

    function onSpiralResize(event) {
        configuration.center();
        if (frameReq == 0) {
            frameReq = requestAnimationFrame(render);
        }
    }

    function onContainerMouseDown(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (event.target.classList.contains('node')) {
            let node = event.target.__node;
            switch (node.type) {
                case 'section':
                    if (node.open) {
                        node.open = false;
                    } else {
                        openBranchForNode(node);
                    }
                    updateMenu();
                    spiralSpeed = -0.01;
                    if (frameReq == 0) {
                        frameReq = requestAnimationFrame(render);
                    }
                    break;
                case 'page':
                    // console.log("Sould open node : " + node.title_fr);
                    callback(node);
                    break;
            }
            // if ( node.type == "section" ) {
            //   node.open = !node.open;

            // }
            return;
        }

        isMouseDown = true;
        gravity = 0.9;
        pMouseX = event.pageX;
        mouseX = pMouseX;
        self.canvas.style.cursor = 'ew-resize';
        self.container.addEventListener('mousemove', onContainerMouseMove);
        if (frameReq == 0) {
            frameReq = requestAnimationFrame(render);
        }
    }

    function openBranchForNode(target) {
        for (let spiral of content) {
            //console.log("check : " + spiral.title_fr);
            for (let node of spiral.content) {
                //console.log("check : " + node.title_fr);
                if (node.type == 'section') {
                    node.open = checkSectionForNode(node, target);
                    //console.log("NODE open("+node.open+") : "+ node.title);
                }
            }
        }
    }

    function checkSectionForNode(node, target) {
        // node is target, should not be opened
        if (node == target) return true;

        let open = false;
        for (let child in node.content) {
            if (child == target) {
                open = true;
            }
        }
        return open;
    }

    // for ( var i = 0; i < numSpirals; ++i ) {
    //   var sl = [];
    //   for ( let node of content[i].content ) {
    //     addToMenu( node, sl );
    //   }
    //   labels.push( sl );
    // }
    //}

    function onContainerMouseMove(event) {
        mouseX = event.pageX;
    }

    function onContainerMouseUp(event) {
        if (isMouseDown) {
            isMouseDown = false;
            self.canvas.style.cursor = 'pointer';
            self.container.removeEventListener('mousemove', onContainerMouseMove);
        }
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
            var nl = labels[i].length;
            var points = spirals[i].rotate(spiralRotation, configuration, nl);

            configuration.context.beginPath();
            configuration.context.lineWidth = 2;
            configuration.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            for (var j = 0; j < nl; ++j) {
                labels[i][j].follow(points[j]);
            }
            configuration.context.stroke();

            // position labels
        }

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

var SpiralConfig = function(canvas, numPoints) {
    // Spiral properties
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.centerX = this.canvasWidth / 2;
    this.centerY = this.canvasHeight / 2;
    this.width = Math.min(this.centerX - 20, 200);
    this.height = Math.min(this.canvasHeight - 40, 600);
    this.nPoints = numPoints;

    // Label properties
    this.inertia = 0.5;
    this.k = 0.2;
    this.linkMargin = 5;
    this.scaleLimit = 0.5;
};

SpiralConfig.prototype.center = function() {
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

var Spiral = function(offset, length) {
    this.angleOffset = offset;
    this.length = length;
};

Spiral.prototype.rotate = function(rotation, config, numPoints) {
    var //vectors = [],
        p = new Vec3(0, 0, 0),
        //pointsDelay = Math.floor( config.nPoints / numPoints ),
        //pointsPos = 0,
        //pointsNext = Math.floor( pointsDelay / 2 ) + 1,
        yStep = config.height / (config.nPoints - 1),
        angleStep = this.length / (config.nPoints - 1),
        middle = -config.nPoints / 2,
        angle = 0,
        z = 0;

    rotation += this.angleOffset;

    p.z = Math.cos(rotation) * 0.4 + 0.6;
    p.x = config.centerX + config.width * Math.sin(rotation);
    p.y = config.centerY + middle * yStep; // * p.z;
    config.context.lineCap = 'square';
    config.context.beginPath();
    config.context.moveTo(p.x, p.y);

    for (var i = 1; i < config.nPoints; ++i) {
        angle = rotation + i * angleStep;
        z = Math.cos(angle) * 0.4 + 0.6;
        p = new Vec3(
            config.centerX + config.width * Math.sin(angle),
            config.centerY + (i + middle) * yStep, // * z,
            z
        );
        config.context.lineWidth = z * 8 + 2;
        config.context.strokeStyle = 'rgba(255,255,255,' + z + ')';
        config.context.lineTo(p.x, p.y);
        config.context.stroke();
        config.context.beginPath();
        config.context.moveTo(p.x, p.y);
    }

    return this.computePositions(rotation, config, numPoints);
    /*
      yStep = config.height / ( numPoints + 1 );
      middle = -numPoints / 2;
      for ( var i = 0; i < numPoints; ++i ) {
        angle = rotation + this.length / (numPoints + 1) * (i + 0.5);
        p = new Vec3(
          config.centerX + config.width * Math.sin( angle ),
          config.centerY + ( i + middle ) * yStep,// * z,
          Math.cos( angle ) * 0.4 + 0.6
        );
        vectors.push(p);
      }

      return vectors;
      */
};

Spiral.prototype.computePositions = function(rotation, config, numPoints) {
    var vectors = [],
        yStep = config.height / (numPoints + 1),
        middle = -numPoints / 2,
        angle = 0,
        p;

    for (var i = 0; i < numPoints; ++i) {
        angle = rotation + (this.length / (numPoints + 1)) * (i + 1);
        p = new Vec3(
            config.centerX + config.width * Math.sin(angle),
            config.centerY + (i + middle + 0.5) * yStep, // * z,
            Math.cos(angle) * 0.4 + 0.6
        );
        vectors.push(p);
    }

    return vectors;
};

/////////////////////////////////////////////////////////////
///////////////////   SpiralLabel     ///////////////////////
/////////////////////////////////////////////////////////////

var SpiralLabel = function(node, container, config) {
    this.config = config;
    this.node = node;
    this.posX = this.config.centerX;
    this.posY = this.config.centerY;
    this.speedX = 0;
    this.speedY = 0;
    this.offsetX = 0;
    // this.offsetY = 0;
    this.marginX = 20;
    // this.marginY = 0;
    this.isLeft = true;

    var e = document.createElement('span');
    e.className = 'spiral-flying-label';
    e.style.left = this.posX + 'px';
    e.style.top = this.posY + 'px';

    var ee = document.createElement('span');
    ee.className = 'node ' + node.type + (node.level > 1 ? ' sub' : '') + (node.open ? ' open' : '');
    ee.innerHTML = node.title_fr;
    ee.__node = node;
    e.appendChild(ee);
    container.appendChild(e);
    this.element = e;
};

SpiralLabel.prototype.setPosition = function(p) {
    this.posX = p.x;
    this.posY = p.y;
    this.speedX = 0;
    this.speedY = 0;
    this.offsetX = 0;
    // this.offsetY = 0;
};

SpiralLabel.prototype.follow = function(p) {
    // todo: import logic from FlyingLabel class

    if (p.x < this.config.centerX) {
        this.offsetX = -this.marginX * this.node.level;
        this.isLeft = true;
        this.element.classList.add('left');
    } else {
        this.offsetX = this.marginX * this.node.level;
        this.isLeft = false;
        this.element.classList.remove('left');
    }

    this.speedX *= this.config.inertia;
    this.speedX += (p.x + this.offsetX - this.posX) * this.config.k;
    this.posX += this.speedX;

    this.speedY *= this.config.inertia;
    this.speedY += (p.y - this.posY) * this.config.k;
    this.posY += this.speedY;

    this.element.style.left = this.posX + 'px';
    this.element.style.top = this.posY + 'px';
    this.element.style.opacity = p.z; // * 0.8 + 0.2;

    this.config.context.moveTo(this.posX + 15 * this.node.level * (this.isLeft ? -1 : 1), this.posY);
    this.config.context.lineTo(p.x, p.y);
};

module.exports = SpiralMenu;
