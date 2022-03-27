import { detail} from './config.js';

export class Grid {
	// static elements = [];

	constructor (isFilled = false) {
		// this.index = this.constructor.elements.size;
		this.cells = Array.from({ length: detail ** 2 }, () => isFilled);
	}
}