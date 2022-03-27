///// READ ONLY
import { colors } from './config.js';
///// WRITE / EXECUTE
import { pgs } from './graphics.js';
import { inputObserver as io } from './observers/inputObserver.js';
import { eventObserver as eo } from './observers/eventObserver.js';
import { gridObserver as go } from './observers/gridObserver.js';

document.body.style.backgroundColor = 'hsl(0, 0%, 4%)';
go.init(document.getElementById('canvas-wrap'));

window.setup = () => {
	const { dimensions } = go;

	createCanvas(dimensions.grid + dimensions.cell, dimensions.grid);
	drawingContext.shadowColor = 'rgba(0, 0, 0, .5)';
	drawingContext.shadowBlur = 12;

	pgs.init();
};

window.draw = () => {
	background(...colors.bg);
	// pgs.debug();
	pgs.show();
};

window.mouseMoved = () => {
	io.onmove();

	if (!io.triggerMoveEvent) return;

	pgs.requests.gui = true;
	pgs.fulfillRequests();
	pgs.resetRequests();
	// (io.isHoveringNav && io.nav > 4) ? cursor('pointer'): cursor('default');
};

window.mouseDragged = () => {
	io.onmove();

	if (!io.triggerMoveEvent) return;

	go[io.action]();
	pgs.requests.nav = true;
	pgs.requests.out = true;
	pgs.requests.gui = true;
	pgs.fulfillRequests();
	pgs.resetRequests();
};

window.mousePressed = () => {
	if (!io.triggerPressEvent) return;
	eo.event = false;
	go[io.action]();
	pgs.requests.nav = true;
	pgs.requests.out = true;
	pgs.fulfillRequests();
	pgs.resetRequests();
};

window.mouseClicked = () => {
	// @todo unselect when clicked outside
	if (io.isOutOfBounds) return;
	eo.update();

	if (!eo.event) return;

	go[eo.event]();
	io.update();

	if (eo.editEvent || eo.exitEvent) pgs.requests.out = true;
	pgs.requests.nav = true;
	pgs.fulfillRequests();
	pgs.resetRequests();
};

document.addEventListener('contextmenu', (e) => e.preventDefault());
