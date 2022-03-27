///// READ ONLY
import { detail } from '../config.js';
import { pgs } from '../graphics.js';
import { eventObserver as eo } from './eventObserver.js';
import { gridObserver as go } from './gridObserver.js';

const actions = 'edit paste copy clear'.split(' ');

export const inputObserver = {
	/////
	///// uses a p5.Graphics element to
	///// convert mouse position to cell index/col/row
	/////
	///// listens/fires on mouse move & press events
	/////
	_rgb: [],
	nav: -1,
	prvNav: -1,
	cell: -1,
	prvCell: -1,
	col: -1,
	row: -1,
	action: actions[1],
	convert(...args) {
		return (args.length === 1)
			? [args[0] % detail, ~~(args[0] / detail)]
			: args[0] + args[1] * detail;
	},
	get isOutOfBounds() {
		return (
			mouseX < 0 ||
			mouseX > pgs.idx.width ||
			mouseY < 0 ||
			mouseY > pgs.idx.height
		);
	},
	get isHoveringNav() {
		return this._rgb[1] > 0;
	},
	get triggerMoveEvent() {
		return (this.prvNav !== this.nav || this.prvCell !== this.cell);
	},
	get triggerPressEvent() {
		return (!this.isOutOfBounds && !this.isHoveringNav && (this.action === 'paste' || this.action === 'clear'));
	},
	onmove() {
		this.prvNav = this.nav;
		this.prvCell = this.cell;

		if (this.isOutOfBounds) return;
		this._rgb = pgs.idx.get(mouseX, mouseY);

		if (this.isHoveringNav) {
			this.nav = this._rgb[0];
			this.cell = -1;
		}
		else {
			this.nav = -1;
			this.cell = this._rgb[0];
			this.col = (this.cell % detail);
			this.row = Math.floor(this.cell / detail);
		};
	},
	update() {
		this.action = getAction();
		// @debug
		// console.log('action', this.action);
	},
};

function getAction() {
	// edit paste copy clear
	if (eo.selectEvent) return (inputObserver.nav > 3) ? actions[inputObserver.nav - 4] : false;

	if (eo.copyEvent) return (go.current.cells[inputObserver.cell]) ? actions[1] : actions[3];

	if (eo.editEvent || eo.exitEvent) return actions[1];
}