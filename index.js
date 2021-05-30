window._config = {
	noteLength: 100, // length each instrument should be in the playing state
	allowZeroDelay: false, // allow note delays of 0
	defaultDelay: 1000, // default delay for notes
	waitForNotes: false, // waits for a note to finish the playing state before starting the next delay
	pushVars: ['_config', '_data', '_util', 'InstrumentEnum', 'InstrumentPerKeyEnum', 'BongoSet', 'BongoSoundboard'], // variables to push to BongoComposer, you shouldnt need to change this
	forceDark: true, // forces dark theme
	remote: 'https://github.com/itzTheMeow/bonko/raw/master/index_old.js', // the remote script to run
};
!async function () {
	// fetches and runs the script
	window.eval(await (await fetch(_config.remote)).text());
};
