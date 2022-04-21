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
        if(version !== audits[currAuditId].selectedVersion) {
            if(confirm(`Vous allez passer de la version ${audits[currAuditId].selectedVersion} à la version ${version} du référentiel. Les données d'audit saisies en version ${audits[currAuditId].selectedVersion} seront perdues. Souhaitez-vous poursuivre ?`)) {
                audits[currAuditId].byCriterion = {};
                audits[currAuditId].selectedVersion = version;
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
        audits[currAuditId].byCriterion[criterion.id] = {
            state: criterion.state
        };
        // Updates local save
        saveLocalAudits();


	}

    // Temp : uses localStorage for dev, then browser.storage
	function getLocalAudits() {
        const storedAudits = JSON.parse(localStorage.getItem('audit'));
        audits[currAuditId] = storedAudits[currAuditId];
	}

    // Temp : uses localStorage for dev, then browser.storage
	function saveLocalAudits() {
        localStorage.setItem('audit', JSON.stringify(audits));
	}

	function logError(error) {
		console.error(error);
	};

    openReferentiel(audits[currAuditId].selectedVersion);

</script>

	<VersionSelector {availableVersions} on:changed={(e) => switchToVersion(e.detail.versionToApply)} />
	<Audit {referential} on:updated={(e) => updateAudit(e)} />