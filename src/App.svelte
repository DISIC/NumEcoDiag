<script>

	"use strict";

	import VersionSelector from './components/VersionSelector.svelte';
	import Referential from './components/Referential.svelte';
	
	const availableVersions = ['beta'];
	let selectedVersion = 'beta';
	let referential;

	class Model {

		static readRGESN(versionToLoad) {
			return new Promise((resolve, reject) => {
				fetch(`/rgesn/${versionToLoad}.json`)
					.then(resp => { 
						if(resp.ok) {
							resp.text()
								.then(data => {
									try {
										// Only valid JSON can resolve promise
										resolve(JSON.parse(data));
									}
									catch(e) {
										reject('Unable to parse the selected RGESN');
									}	
								}
							)
						}
						else {
							reject('Unable to open the selected RGESN');
						}
					})
					.catch(e => reject(data));
				}
			);
		}

	};


	class Controller {

		static loadRGESN(versionToLoad) {
			Model.readRGESN(versionToLoad)
				.then(data => {
					referential = data;
				}
			)
			.catch(error => View.logError(error));
		}

		static switchRGESN(versionToApply) {console.e
			selectedVersion = versionToApply; // WARNING : is this relevant ?
			Controller.loadRGESN(versionToApply);
		}


	};

	class View {

		static logError(error) {
			console.error(error);
		}

	};

</script>

	<VersionSelector {availableVersions} on:versionChanged={e => Controller.switchRGESN(e.detail.versionToApply)} />
	<Referential {referential} />