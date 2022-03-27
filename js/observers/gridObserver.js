///// READ ONLY
import { detail } from '../config.js';
import { inputObserver as io } from './inputObserver.js';
// import { eventObserver as eo } from './eventObserver.js';

import { Grid } from '../grid.js';

export const gridObserver = {
	/////
	/////	Stores grid data/dimensions
	/////
	main: undefined,
	wrap: undefined,
	current: undefined,
	copied: undefined,
	dimensions: {
		grid: 0,
		cell: 0,
	},
	init(element) {
		this.main = new Grid();
		this.wrap = element;
		this.current = this.main;
		this.setDimensions();
	},
	setDimensions: function () {
		this.dimensions.grid = ~~(0.8 * Math.min(this.wrap.offsetWidth, this.wrap.offsetHeight) / detail) * detail;
		this.dimensions.cell = ~~(this.dimensions.grid / detail);
	},

	get isMainGrid() {
		return this.current === this.main;
	},
	get cellHasGrid() {
		return typeof this.current.cells[io.cell] !== 'boolean';
	},

	///// EVENTS
	exit() {
		this.current = this.main;
		this.copied = undefined;

		// @todo
		// check if edited cell is filled or emtpy

		// @debug
		// console.log('exited cell');
	},
	select() {
		// @debug
		console.log('selected action');
	},
	copy() {
		this.copied = (!this.cellHasGrid) ? undefined : this.current.cells[io.cell];

		// @debug
		console.log('copied cell', this.copied);
	},
	edit() {
		if (!this.cellHasGrid) this.current.cells[io.cell] = new Grid(this.current.cells[io.cell]);
		this.current = this.current.cells[io.cell];
		this.copied = undefined;

		// @debug
		// console.log('editing cell');
	},

	///// ACTIONS
	paste() {
		if (this.copied) {
			this.current.cells[io.cell] = this.copied;
		}
		else {
			this.current.cells[io.cell] = true;
		}
	},
	clear() {
		this.current.cells[io.cell] = false;
	},
};