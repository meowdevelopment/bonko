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
