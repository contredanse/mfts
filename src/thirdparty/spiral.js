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
/*
  settings = {
    "container": div element containing the canvas and the labels container
    "content": json object containing menu structure
    "callback": function called when clicking on a page node
    "language": locale string
    "selectedNodeId": ID for pre-selected node upon startup
  }
*/
var SpiralMenu = function(settings) {
    this.content = settings.content;
    this.container = settings.container;
    this.canvas = this.container.querySelector('#spiral-canvas');
    this.labelContainer = this.container.querySelector('#spiral-label-container');

    // visual elements
    var self = this;
    this.configuration = new SpiralConfig(this.canvas, 50);
    this.configuration.language = settings.language || 'en';
    var numSpirals = this.content.length;
    var spirals = [];

    // Spiral drag properties
    var isMouseDown = false;
    var pMouseX = 0;
    var mouseX = 0;
    var gravity = 1;
    var spiralRotation = 0;
    var spiralSpeed = settings.selectedNodeId ? 0.0035 : 0.012;
    var frameReq = 0;
    var lastOpen = null;

    // labels
    var labelPool = [];
    this.labels = [];

    var navigationCallback = settings.callback;

    var onSpiralResize = function(event) {
        self.configuration.center();
        if (frameReq == 0) {
            frameReq = requestAnimationFrame(render);
        }
    };

    function onContainerMouseDown(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        // stop automatic rotation at first click
        gravity = 0.915;

        // check if clicked on node label
        if (event.target.classList.contains('node')) {
            let label = event.target.__slobject;
            switch (label.node.type) {
                case 'section':
                    if (label.node.open) {
                        closeLabel(label);
                    } else {
                        openLabel(label);
                    }
                    //updateMenu();
                    spiralSpeed = -0.01;
                    if (frameReq == 0) {
                        frameReq = requestAnimationFrame(render);
                    }
                    break;
                case 'page':
                    // console.log("Should open node : " + node[ "title_" + this.config.language ]);
                    navigationCallback(label.node);
                    break;
            }
            // if ( node.type == "section" ) {
            //   node.open = !node.open;

            // }
            return;
        }

        // else start spiral drag operation
        isMouseDown = true;
        pMouseX = event.pageX;
        mouseX = pMouseX;
        self.canvas.style.cursor = 'ew-resize';
        self.container.addEventListener('mousemove', onContainerMouseMove);
        if (frameReq == 0) {
            frameReq = requestAnimationFrame(render);
        }
    }

    function closeLabel(label) {
        if (label.node.open == false) return;

        label.node.open = false;
        for (let node of label.node.content) {
            closeLabel(node.label);
            node.label.remove();
            let index = self.labels[node.spiral].indexOf(node.label);
            if (index > -1) {
                self.labels[node.spiral].splice(index, 1);
            }
        }
        lastOpen = null;
    }

    function openLabel(label) {
        if (label.node.open == true) return;

        label.node.open = true;
        let index = self.labels[label.node.spiral].indexOf(label);
        //let nodes = [];
        for (let node of label.node.content) {
            // TODO: position element at parent position
            self.labelContainer.appendChild(node.label.element);

            // Added by seb to get 'open class'
            node.label.element.className = node.label.element.className + ' open';

            self.labels[node.spiral].splice(index + 1, 0, node.label);
            ++index;
        }

        // close other spiral
        closeLabel(self.content[(label.node.spiral + 1) % 2].label);

        // close last ?
        if (lastOpen && lastOpen.node.level > 1) {
            closeLabel(lastOpen);
        }

        lastOpen = label;
    }

    function onContainerMouseWheel(event) {
        // stop automatic rotation at first interaction
        gravity = 0.915;
        // speed up spiral according to wheel direction
        spiralSpeed = 0.1 * (event.deltaY > 0 ? 1 : -1);
        if (frameReq == 0) {
            frameReq = requestAnimationFrame(render);
        }
    }

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
        self.canvas.width = self.configuration.canvasWidth;
        self.canvas.height = self.configuration.canvasHeight;

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
            var nl = self.labels[i].length;
            var points = spirals[i].rotate(spiralRotation, self.configuration, nl);

            // position labels
            self.configuration.context.beginPath();
            self.configuration.context.lineWidth = 2;
            self.configuration.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            for (var j = 0; j < nl; ++j) {
                self.labels[i][j].follow(points[j]);
            }
            self.configuration.context.stroke();
        }

        // auto stop frame request when idle
        if (isMouseDown || Math.abs(spiralSpeed) > 0.001) {
            frameReq = requestAnimationFrame(render);
        } else {
            frameReq = 0;
        }
    }

    this.clear = function() {
        // clear canvas
        self.canvas.width = self.configuration.canvasWidth;
        self.canvas.height = self.configuration.canvasHeight;
        // remove listeners
        window.removeEventListener('resize', onSpiralResize);
        self.container.removeEventListener('mouseup', onContainerMouseUp);
        self.container.removeEventListener('mousedown', onContainerMouseDown);
        self.container.removeEventListener('mousewheel', onContainerMouseWheel);
        isMouseDown = false;
        spiralSpeed = 0;
        self.configuration = null;

        // cancel animation frame
        if (frameReq) {
            cancelAnimationFrame(frameReq);
            frameReq = 0;
        }

        // remove circular references
        for (let spiral of self.content) {
            clean(spiral);
        }

        // clear elements
        self.spirals = null;
        self.labels = null;
        self.labelContainer.innerHTML = '';
        self.content = null;
    };

    function clean(node) {
        if (node.content) {
            for (let child of node.content) {
                clean(child);
            }
        }

        node.label.clear();
        delete node.label;
    }

    function prepareContent(node, iterator, spiralID) {
        node.id = node.id || node.page_id;
        node.open = node.open || false;
        node.level = iterator;
        node.spiral = spiralID;
        node.label = new SpiralLabel(node, self.labelContainer, self.configuration);

        if (node.hasOwnProperty('content')) {
            for (let child of node.content) {
                prepareContent(child, iterator + 1, spiralID);
            }
        }
    }

    function findIdInNode(id, node, path) {
        if (node.id == id) return true;

        if (node.content) {
            for (let child of node.content) {
                if (child.id == id) {
                    path.push(node);
                    return true;
                }
                if (findIdInNode(id, child, path)) {
                    path.unshift(node);
                }
            }
        }

        return false;
    }

    // prepare startup content
    for (var i = 0; i < numSpirals; ++i) {
        prepareContent(self.content[i], 1, i);
        spirals.push(new Spiral(i * Math.PI, Math.PI * 0.8));
        let rootLabel = self.content[i].label;
        self.labelContainer.appendChild(rootLabel.element);
        self.labels.push([rootLabel]);
    }

    // find auto-selected node
    var pathNodes = [];
    if (settings.selectedNodeId) {
        //console.log('spiral.js::selectedNodeId', settings.selectedNodeId);
        //console.log('spiral.js::self.content', self.content);
        for (let node of self.content) {
            findIdInNode(settings.selectedNodeId, node, pathNodes);
        }
        //console.log('spiral.js::pathNodes', pathNodes);
    }

    for (let node of pathNodes) {
        //console.log('spiral.js::openLabel', node.label);
        openLabel(node.label);
    }

    window.addEventListener('resize', onSpiralResize);
    self.container.addEventListener('mouseup', onContainerMouseUp);
    self.container.addEventListener('mousedown', onContainerMouseDown);
    self.container.addEventListener('mousewheel', onContainerMouseWheel);

    // updateMenu();
    render();
};

SpiralMenu.prototype.setLanguage = function(lang) {
    if (this.configuration.language == lang) return;
    this.configuration.language = lang;
    for (let spiral of this.labels) {
        for (let label of spiral) {
            label.updateLabel();
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
    this.nPoints = numPoints;
    this.center();

    // Label properties
    this.inertia = 0.7;
    this.k = 0.1;
    this.linkMargin = 5;
    this.scaleLimit = 0.5;
    this.language = 'en';
};

SpiralConfig.prototype.center = function() {
    this.canvasWidth = this.canvas.clientWidth;
    this.canvasHeight = this.canvas.clientHeight;
    this.centerX = this.canvasWidth / 2;
    this.centerY = this.canvasHeight / 2;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.width = (this.canvasHeight - 140) / 5; //Math.min( this.centerX - 20, 200 );
    this.height = this.canvasHeight - 140; //Math.min( this.canvasHeight - 40, 600 );
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
        config.context.lineWidth = z * 4 + 1;
        config.context.strokeStyle = 'rgba(255,255,255,' + z + ')';
        config.context.lineTo(p.x, p.y);
        config.context.stroke();
        config.context.beginPath();
        config.context.moveTo(p.x, p.y);
    }

    return this.computePositions(rotation - this.angleOffset, config, numPoints);
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
    rotation += this.angleOffset;
    for (var i = 0; i < numPoints; ++i) {
        angle = rotation + (this.length / (numPoints + 1)) * (i + 1);
        p = new Vec3(
            config.centerX + config.width * Math.sin(angle),
            config.centerY + (i + middle + 0.4) * yStep, // * z,
            Math.cos(angle) * 0.5 + 0.5
        );
        vectors.push(p);
    }

    return vectors;
};

/////////////////////////////////////////////////////////////
///////////////////   SpiralLabel     ///////////////////////
/////////////////////////////////////////////////////////////

var SpiralLabel = function(node, container, config, p) {
    this.config = config;
    this.node = node;
    this.marginX = 20;
    this.isLeft = p ? p.x < this.config.centerX : false;
    this.offsetX = this.marginX * this.node.level * (this.isLeft ? -1 : 1);
    this.posX = p ? p.x + this.offsetX : this.config.centerX;
    this.posY = p ? p.y : this.config.centerY;
    this.speedX = 0;
    this.speedY = 0;
    // this.offsetY = 0;
    // this.marginY = 0;

    var e = document.createElement('span');
    e.className = 'spiral-flying-label';
    e.style.left = this.posX + 'px';
    e.style.top = this.posY + 'px';
    if (this.isLeft) e.classList.add('left');

    var ee = document.createElement('span');
    ee.className = 'node ' + node.type + (node.level > 1 ? ' sub' : '') + (node.open ? ' open' : '');

    ee.innerHTML = node['title_' + this.config.language];
    ee.__slobject = this;
    e.appendChild(ee);
    //container.appendChild(e);
    this.element = e;
};

SpiralLabel.prototype.clear = function() {
    this.remove();
    delete this.element.childNodes[0].__slobject;
    this.config = null;
    this.node = null;
    this.element = null;
};

SpiralLabel.prototype.remove = function() {
    if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
    }
};

SpiralLabel.prototype.updateLabel = function() {
    this.element.firstElementChild.innerHTML = this.node['title_' + this.config.language];
};

SpiralLabel.prototype.setPosition = function(p) {
    this.posX = p.x;
    this.posY = p.y;
    this.speedX = 0;
    this.speedY = 0;
    this.offsetX = 0;
    // this.offsetY = 0;

    // this.element.style.left = this.posX + 'px';
    // this.element.style.top = this.posY + 'px';
    // this.element.style.opacity = p.z;// * 0.8 + 0.2;
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
    let easedZ = easeInOutQuad(p.z);
    this.element.style.opacity = easedZ * 0.85 + 0.15; // * 0.8 + 0.2;
    easedZ = p.z * 0.3 + 0.7;
    //this.element.style.transform = "scale3d(" + easedZ + ", " + easedZ + ", 1)";

    this.config.context.moveTo(this.posX + 15 * this.node.level * (this.isLeft ? -1 : 1), this.posY);
    this.config.context.lineTo(p.x, p.y); // + (this.isLeft ? -10 : 10)
};

function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default SpiralMenu;
