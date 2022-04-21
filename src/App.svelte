<script>

	"use strict";

	import VersionSelector from './components/VersionSelector.svelte';
	import Audit from './components/Audit.svelte';
	
	const availableVersions = ['beta', '1.0']; // Available versions (stored in /public/rgesn)
	let referential; // RGESN content
	let auditIndex = 0; // Audit index identifier
	let audits = [ // Audit progression (saved with localStorage for dev, then into browser.storage)
		{  
			selectedVersion: 'beta',
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
		if(version !== audits[auditIndex].selectedVersion) {
			if(confirm(`Vous allez passer de la version ${audits[auditIndex].selectedVersion} à la version ${version} du référentiel. Les données d'audit saisies en version ${audits[auditIndex].selectedVersion} seront perdues. Souhaitez-vous poursuivre ?`)) {
				audits[auditIndex].byCriterion = {};
				audits[auditIndex].selectedVersion = version;
				saveLocalAudits();
				openReferentiel(version);
			}
		}
	}

	function updateAudit(e) {
		const criterion = {
			id: e.detail.criterionId,
			state: e.detail.criterionState
		}
		// Updates screen
		audits[auditIndex].byCriterion[criterion.id] = {
			state: criterion.state
		};
		// Updates local save
		saveLocalAudits();

	}
  
	// Temp : uses localStorage for dev, then browser.storage
	function saveLocalAudits() {
		localStorage.setItem('audits', JSON.stringify(audits));
		localStorage.setItem('auditIndex', auditIndex);
	}	

	// Temp : uses localStorage for dev, then browser.storage
	function getLocalAudits() {
		const storedAudits = JSON.parse(localStorage.getItem('audits'));
		const storedAuditIndex = JSON.parse(localStorage.getItem('auditIndex'));
		if(storedAudits !== null && storedAuditIndex !== null) {
			auditIndex = storedAuditIndex;
			audits[auditIndex] = storedAudits[auditIndex];
		}
	}

	function logError(error) {
		console.error(error);
	};

	getLocalAudits();
	openReferentiel(audits[auditIndex].selectedVersion); // WARNING TEMP ?

</script>

	<VersionSelector {availableVersions} on:changed={(e) => switchToVersion(e.detail.versionToApply)} />
	<Audit {referential} on:updated={(e) => updateAudit(e)} />