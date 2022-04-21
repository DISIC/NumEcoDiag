<script>

	"use strict";

	import VersionSelector from './components/VersionSelector.svelte';
	import Audit from './components/Audit.svelte';
	
	const availableVersions = ['beta', '1.0']; // Available versions (stored in /public/rgesn)
	let referential; // RGESN content
	let currAuditId = 0; // Audit index identifier
	let audits = [ // Audit progression (saved with localStorage for dev, then into browser.storage)
		{  
			selectedVersion: 'beta',
			status: {
				total: 0,
				evaluated: 0,
			},
			score: {
				valid: 0,
				rejected: 0,
				notApplicable: 0
			},
			byCriterion: {}
		}
	];

	function openReferentiel(versionToLoad) {
		return new Promise((resolve, reject) => {
			fetch(`/rgesn/${versionToLoad}.json`)
				.then((resp) => { 
					if(resp.ok) {
						resp.text()
							.then((data) => {
								try {
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
				}
			)
		})
		.then((data) => referential = data)
		.catch((error) => logError(error));	
	}

	function switchToVersion(version) {
		audits[currAuditId].selectedVersion = version;
		openReferentiel(version);
	}

	function updateAudit(e) {


	}

	function getAudit() {


	}

	function saveAudit() {


	}

	function logError(error) {
		console.error(error);
	};

</script>

	<VersionSelector {availableVersions} on:changed={(e) => switchToVersion(e.detail.versionToApply)} />
	<Audit {referential} on:updated={(e) => updateAudit(e)} />