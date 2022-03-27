///// READ ONLY
import { detail, colors } from './config.js';
import { pgs } from './graphics.js';
import { gridObserver as go } from './observers/gridObserver.js';
import { inputObserver as io } from './observers/inputObserver.js';
import { eventObserver as eo } from './observers/eventObserver.js';

let tmp;

export const drawer = {
	/////
	///// Uses a p5.Graphics for a low res version of a desired grid/cells
	/////
	///// Executes draw requests from the pgs
	/////
	initTmp() {
		tmp = new p5.Graphics(detail, detail, 'p2d', window);
		tmp.pixelDensity(1);
		tmp.noStroke();
		tmp.noFill();
	},
	initInputMap() {
		const w = go.dimensions.cell;
		const pg = pgs.idx;

		for (let j = 0; j < detail; j += 1) {
			for (let i = 0; i < detail; i += 1) {
				pg.fill(i + j * detail, 0, 0);
				pg.rect((i + 1) * w, j * w, w, w);
			}
		}

		for (let j = 0; j < detail; j += 1) {
			pg.fill(j, 255, 0);
			pg.rect(0, j * w, w, w);
		}
	},
	nav() {
		const w = go.dimensions.cell;
		const pg = pgs.nav;
		const ctx = pg.drawingContext;

		ctx.shadowColor = 'rgba(0, 0, 0, .5)';
		ctx.shadowBlur = 0;
		drawNavBackground(pg, w);

		ctx.shadowBlur = 8;
		drawNavMap(pg, w);
		drawNavSelection(pg, w);
	},
	gui() {
		const w = go.dimensions.cell;
		const pg = pgs.gui;

		pg.clear();
		pg.noStroke();
		pg.fill(...colors.dark, 92);
		pg.rect(io.col * w, io.row * w, w, w);
	},
	out() {
		const w = go.dimensions.cell;
		const pg = pgs.out;

		if (eo.exitEvent || eo.editEvent) {
			drawCurrentCells(pg, w);
			return;
		}

		if (eo.copyEvent) {
			updateTmp(go.copied);
			return;
		}

		if (io.action === 'paste' && !go.copied) {
			pg.noStroke();
			pg.fill(colors.light);
			pg.rect(io.col * w, io.row * w, w, w);
			return;
		}

		if (io.action === 'paste' && go.copied) {
			pg.erase();
			pg.rect(io.col * w, io.row * w, w, w);
			pg.noErase();
			pg.image(tmp, io.col * w, io.row * w, w, w);
			return;
		}

		if (io.action === 'clear') {
			pg.erase();
			pg.rect(io.col * w, io.row * w, w, w);
			pg.noErase();
			return;
		}
	}
};

function updateTmp(grid) {
	// @todo adjust pgs tmp width height > detail ???
	tmp.clear();
	tmp.loadPixels();
	for (const [idx, cell] of grid.cells.entries()) {
		if (!cell) continue;

		if (typeof cell === 'boolean') {
			for (const i of [0, 1, 2]) tmp.pixels[4 * idx + i] = 196;
		}
		else {
			for (const [i, v] of colors.blue.entries()) tmp.pixels[4 * idx + i] = v;
		}
		tmp.pixels[4 * idx + 3] = 255;
	}
	tmp.updatePixels();
}

function drawNavBackground(pg, w) {
	const a = (go.isMainGrid) ? 255 : 51;
	pg.background(90);
	pg.noStroke();

	pg.fill(...colors.blue, a);
	pg.rect(0, 4 * w, w, w);

	pg.fill(colors.green);
	pg.rect(0, 5 * w, w, w);

	pg.fill(...colors.yellow, a);
	pg.rect(0, 6 * w, w, w);

	pg.fill(colors.red);
	pg.rect(0, 7 * w, w, w);

	pg.background(20, 148);
}

function drawNavMap(pg, w) {
	updateTmp(go.main);
	pg.image(tmp, 0, 0, w, w);

	if (go.isMainGrid) return;

	updateTmp(go.current);
	pg.image(tmp, 0, w, w, w);
}

function drawNavSelection(pg, w) {
	if (!io.action) return;

	pg.noStroke();

	if (io.action === 'edit') {
		pg.fill(colors.blue);
		pg.rect(0, 4 * w, w, w);
	}
	if (io.action === 'paste') {
		pg.fill(colors.green);
		pg.rect(0, 5 * w, w, w);
	}
	if (go.copied) {
		updateTmp(go.copied);
		pg.image(tmp, 0, 5 * w, w, w);
	}
	if (io.action === 'copy') {
		pg.fill(colors.yellow);
		pg.rect(0, 6 * w, w, w);
	}
	if (io.action === 'clear') {
		pg.fill(colors.red);
		pg.rect(0, 7 * w, w, w);
	};
}

function drawCurrentCells(pg, w) {
	pg.clear();
	pg.noStroke();
	for (const [i, cell] of go.current.cells.entries()) {
		if (!cell) continue;

		let [x, y] = io.convert(i).map((v) => v * w);

		if (typeof cell === 'boolean') {
			pg.fill(colors.light);
			pg.rect(x, y, w, w);
		}

		if (!go.isMainGrid) continue;

		if (typeof cell === 'object') {
			updateTmp(cell);
			pg.image(tmp, x, y, w, w);

			for (let j = i + 1; j < go.current.cells.lengh; j += 1) {
				const next = go.current.cells[j];
				if (cell !== next) continue;
				let [x, y] = io.convert(j).map((v) => v * w);
				pg.image(tmp, x, y, w, w);
			}
		}
	}
}

function refreshOut() {
	// const cells = Grid.current.cells;

	// pgs.out.noStroke();
	// pgs.out.fill();
	// for (let idx = 0; idx < cells.length; idx += 1) {
	// 	if (typeof cells[idx] === 'undefined') continue;

	// 	if (typeof cells[idx] === 'boolean') {
	// 		const [x, y] = mo.convert(idx).map((v) => v *= go.dimensions.cell);
	// 		pgs.out.rect(x, y, go.dimensions.cell, go.dimensions.cell);
	// 		continue;
	// 	}

	// 	// const cell = cells[idx];
	// 	// refreshTmp(cell);
	// 	// for (let nxt = idx + 1; nxt < cells.length; nxt += 1) {
	// 	// 	console.log(cell === cells[nxt]);
	// 	// }
	// }


	// for (const [idx, cell] of Grid.current.cells.entries()) {
	// 	if (typeof cell === 'undefined') continue;

	// 	if (typeof cell === 'boolean') continue;

	// 	// for (let nxt = idx + 1; nxt)
	// 	console.log(typeof cell);
	// }
	// const [i, j] = mouseObserver.convert12(n);
	// pgs.out.image(pgs.tmp, i * cellDimension, j * cellDimension, cellDimension, cellDimension);

}