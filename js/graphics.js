///// READ ONLY
import { gridObserver as go } from './observers/gridObserver.js';
///// EXECUTE
import { drawer } from './drawer.js';

const keys = 'nav out idx gui'.split(' ');

export const pgs = {
	/////
	///// Draws p5.Graphics elements onto the canvas
	/////
	///// Collects all draw requests
	///// And passes them to the drawer
	/////
	requests: {},
	init() {
		const { dimensions } = go;

		for (const key of keys) {
			const w = (key === 'nav') ? dimensions.cell : (key === 'idx') ? dimensions.grid + dimensions.cell : dimensions.grid;
			const h = dimensions.grid;
			this[key] = new p5.Graphics(w, h, 'p2d', window);
			this[key].pixelDensity(1);
			this[key].noStroke();
			this[key].noFill();

			this.requests[key] = false;
		}

		drawer.initTmp();
		drawer.initInputMap(this.idx);

		drawer.nav();
		this.nav.noSmooth();

		this.out.noSmooth();
	},

	resetRequests() {
		for (const key of keys) this.requests[key] = false;
	},
	fulfillRequests() {
		for (const [key, execute] of Object.entries(this.requests)) {
			if (!drawer[key] || !execute) continue;
			drawer[key](this[key]);
			// @debug
			// console.log('executed', key);
		}
	},

	debug(ctx = window) {
		ctx.image(this.idx, 0, 0);
	},
	show(ctx = window) {
		ctx.image(this.nav, 0, 0);
		ctx.image(this.out, this.nav.width, 0);
		ctx.image(this.gui, this.nav.width, 0);
	},
};