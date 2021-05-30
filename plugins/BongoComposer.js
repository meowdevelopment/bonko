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