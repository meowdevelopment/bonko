let version = 1;
if (version !== config.version) console.error('>- INCORRECT CONFIG VERSION. YOU MAY NEED TO UPDATE BONKO -<');

let main = async function () {
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
	/* #import util */

	/* #import BongoSet */
	/* #import BongoSoundboard */
	/* #import BongoComposer */

	if (_config.forceDark)
		!(async function () {
			let css = await (await fetch('/style/style.css')).text();
			css = css.replace(/prefers-color-scheme:dark/g, 'prefers-color-scheme:light');
			let style = document.createElement('style');
			style.innerHTML = css;
			document.head.appendChild(style);
		})();
}
	.toString()
	.replace(
		/\/\* \#import (.*) \*\//gim,
		`window.eval(await (await fetch("${_config.remote}/${_config.pluginsDir}/$1.js")).text())`
	);

window.eval(`!(${main})()`);
