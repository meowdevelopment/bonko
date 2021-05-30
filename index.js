window._config = {
	noteLength: 100, // length each instrument should be in the playing state
	allowZeroDelay: false, // allow note delays of 0
	defaultDelay: 1000, // default delay for notes
	waitForNotes: false, // waits for a note to finish the playing state before starting the next delay
	pushVars: ['_config', '_data', '_util', 'InstrumentEnum', 'InstrumentPerKeyEnum', 'BongoSet', 'BongoSoundboard'], // variables to push to BongoComposer, you shouldnt need to change this
	forceDark: true, // forces dark theme
};
window._data = {
	instruments: Object.keys(InstrumentEnum).reduce((obj, ins) => {
		obj[ins.toLowerCase()] = InstrumentEnum[ins];
		return obj;
	}, {}),
	notes: Object.keys(InstrumentPerKeyEnum).reduce((obj, note) => {
		obj[note] = InstrumentPerKeyEnum[note];
		return obj;
	}, {}),
};
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
window.BongoSet = function () {
	let set = this;
	this.notes = [];

	this.toString = () => {
		let str = [];
		this.notes.forEach((n) => {
			str.push(`${n.key}-${n.delay}`);
		});
		return str.join(':');
	};

	this.note = (key, delay = _config.defaultDelay) => {
		let noteID = Math.floor(Date.now() * Math.random());
		this.notes.push({
			key,
			delay,
			id: noteID,
		});
		return {
			delay: function (num) {
				set.notes.find((n) => (n.id = noteID)).delay = num;
				return this;
			},
		};
	};

	this.play = () => {
		return _util.playCode(this.toString());
	};
};
window.BongoSoundboard = function () {
	this.note = (key, delay = _config.defaultDelay) => {
		let note = {
			key,
			delay,
		};
		return {
			delay: function (num) {
				note.delay = num;
				return this;
			},
			play: function () {
				return _util.playCode(this.toString());
			},
			toString() {
				return `${note.key}-${note.delay}`;
			},
		};
	};
};
window.openBongoComposer = function (external) {
	window.name = 'hostwin';
	let bwin = external
		? window.open('', '', `width=${screen.width},height=${screen.height}`)
		: window.open('', '', '');
	const BCSS = `<style>
.btn {
  background-color: #2a92f9;
  border: 1px solid black;
  display: inline-block;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background-color: #2483e0;
}
.btn:active {
  background-color: #1e75c9;
}
#new-dialog {
  display: none;
  position: absolute;
  top: 10px;
  left: 10px;
  width: 40vw;
  height: 60vh;
  background-color: grey;
  border: 2px solid black;
  border-radius: 6px;
}
[id^="newnote-"] {
  display: inline-block;
  padding: 2px;
  background-color: #821ec9;
  font-weight: bold;
  border-radius: 6px;
  margin: 2px;
  cursor: pointer;
  box-sizing: border-box;
  width: 1.5em;
  height: 1.5em;
  text-align: center;
}
[id^="newnote-"]:hover {
  background-color: #6c18a8;
}
[id^="newnote-"]:active {
  background-color: #621599;
}
</style>`;
	const BHTML = `${BCSS}
<div id="new-note" class="btn">New Note</div>
<div id="play-notes" class="btn">Play Notes</div>
<div id="clear-notes" class="btn">Clear Notes</div>
<div id="new-dialog"></div>
<div id="note-code"></div>`;
	const _ = (bwin.window._ = (id) => bwin.document.getElementById(id));
	let noteCode = [];

	_config.pushVars.forEach((v) => {
		bwin.window[v] = window[v];
	});

	bwin.document.write(BHTML);
	bwin.window.document.title = 'BongoComposer';
	bwin.window.document.head.innerHTML += `<link rel="icon" href="${window.location.protocol}//${window.location.hostname}/meta/favicon-16x16.png">`;

	Object.keys(_data.notes)
		.sort()
		.forEach((n) => {
			_('new-dialog').innerHTML += `<div id="newnote-${n}" onclick="addNote('${n}')">${
				n.trim() || '\u2423'
			}</div>`;
		});

	_('new-note').onclick = function () {
		_('new-dialog').style.display = 'block';
	};

	bwin.window.addNote = function (note) {
		let delay = Number(bwin.window.prompt('Delay?', _config.defaultDelay));
		if (!delay || delay < 0) delay = _config.allowZeroDelay ? 0 : _config.defaultDelay;
		noteCode.push(`${note}-${delay}`);
		_('note-code').innerHTML = noteCode.join(':');
		_('new-dialog').style.display = 'none';
	};
	_('clear-notes').onclick = function () {
		_('note-code').innerHTML = '';
		noteCode = [];
	};

	_('play-notes').onclick = function () {
		_util.playCode(noteCode.join(':'));
		bwin.window.open('', 'hostwin').focus();
	};
};

if (_config.forceDark)
	!(async function () {
		let css = await (await fetch('/style/style.css')).text();
		css = css.replace(/prefers-color-scheme:dark/g, 'prefers-color-scheme:light');
		let style = document.createElement('style');
		style.innerHTML = css;
		document.head.appendChild(style);
	})();
