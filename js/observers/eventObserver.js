///// READ ONLY
import { gridObserver as go } from './gridObserver.js';
import { inputObserver as io } from './inputObserver.js';

const events = 'exit select copy edit'.split(' ');

export const eventObserver = {
	/////
	///// listens/fires on mouse clicks (only relesead)
	/////
	event: false,
	get exitEvent() {
		return this.event === events[0];
	},
	get selectEvent() {
		return this.event === events[1];
	},
	get copyEvent() {
		return this.event === events[2];
	},
	get editEvent() {
		return this.event === events[3];
	},
	update() {
		this.event = getEvent();
		// @debug
		// console.log('event', this.event);
	}
};

function getEvent() {
	if (
		!go.isMainGrid &&
		io.isHoveringNav &&
		io.nav === 0
	) return events[0];

	if (
		!go.isMainGrid &&
		io.isHoveringNav &&
		(io.nav === 5 || io.nav === 7)
	) return events[1];

	if (
		go.isMainGrid &&
		io.isHoveringNav &&
		io.nav > 3
	) return events[1];

	if (
		go.isMainGrid &&
		!io.isHoveringNav &&
		io.action === 'copy'
	) return events[2];

	if (
		go.isMainGrid &&
		!io.isHoveringNav &&
		io.action === 'edit'
	) return events[3];

	return false;

	// return (io.isHoveringNav)
	// 		? (go.isMainGrid)
	// 			// available: select
	// 			? (io.nav > 3)
	// 				? events[1]
	// 				: false

	// 			// available: exit select
	// 			: (io.nav === 0)
	// 				? events[0]
	// 				: (io.nav === 4 || io.nav === 6)
	// 					? events[1]
	// 					: false

	// 		: (!go.isMainGrid)
	// 			? false
	// 			// available: copy edit
	// 			: (io.action === 'copy')
	// 				? events[3]
	// 				: (io.action === 'edit')
	// 					? events[4]
	// 					: false;
}