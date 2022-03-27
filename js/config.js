export const detail = 8;

const palette = {
	keys: 'bg dark light red yellow green blue'.split(' '),
	vals: '141414 666666 c4c4c4 961d1f edea15 72db02 559e9d'.split(' ')
}

const hex2rgb = (hex) => {
	let h = hex.slice(hex.startsWith('#') ? 1 : 0);
	if (h.length === 3) h = [...h].map(x => x + x).join('');
	h = parseInt(h, 16);
	return [
	 h >>> 16,
	 (h & 0x00ff00) >>> 8,
	 (h & 0x0000ff) >>> 0,
 ];
};

export const colors = palette.keys.reduce((o, k, i) => {
	o[k] = hex2rgb(palette.vals[i]);
	return o;
}, {});