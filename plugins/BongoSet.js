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
