window._util = {
	play: (instrument, key) => {
		$.play(instrument, key, true);
		setTimeout(function () {
			$.play(instrument, key, false);
		}, _config.noteLength);
	},
	parseCode: (code) => {
		let notes = [];
		let failed = [false, '', ''];
		code.split(':').forEach((c) => {
			c = c.split('-');
			try {
				notes.push([c[0].toUpperCase(), Number(c[1])]);
			} catch (e) {
				failed = [true, 'Parsing error.', e];
			}
		});

		if (notes.map((n) => Object.keys(_data.notes).includes(n[0])).includes(false))
			failed = [true, 'Unknown notes provided.', `Unknown notes: ${notes.map((n) => n[0]).join(', ')}`];
		if (notes.map((n) => !n[1] || n[1] < 0 || (_config.allowZeroDelay && n[1] !== 0)).includes(true))
			failed = [true, 'Invalid delay.', `Invalid delay: ${notes.map((n) => n[1]).join(', ')}`];

		return {
			failed: failed[0],
			error: failed[1],
			debug: failed[2],
			notes,
		};
	},
	playParsed(parsed) {
		let currentTime = 0;
		parsed.forEach((p) => {
			setTimeout(function () {
				_util.play(_data.notes[p[0]], p[0]);
			}, (currentTime += _config.waitForNotes ? p[1] + _config.noteLength : p[1]));
		});
	},
	playCode(code) {
		let parsed = _util.parseCode(code);
		if (parsed.failed) return parsed;
		else return _util.playParsed(parsed.notes);
	},
};
