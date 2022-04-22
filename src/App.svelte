<script>

    /* ### VARIABLES ### */

        import VersionSelect from './components/VersionSelect.svelte';
        import AuditForm from './components/AuditForm.svelte';
        
        const availableVersions = ['beta', '1.0']; // Available versions (stored in /public/rgesn)
        let referential; // RGESN content
        let auditIndex = 0; // Current audit index identifier
        let audits = [ // Audits progression (saved with localStorage for dev, then into browser.storage)
            {  
                byCriteria: {},
                stats: {
                    assessed: 0, // Total count of evaluated criteria (conform / rejected / not-applicable)
                },
                selectedVersion: 'beta',
            }
        ];

    /* ### FUNCTIONS ### */

        function getRGESN(versionToLoad) {
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

        function changeRGESN(version) {
            if(version !== audits[auditIndex].selectedVersion) {
                if(confirm(`Vous allez passer de la version ${audits[auditIndex].selectedVersion} à la version ${version} du référentiel. Les données d'audit saisies en version ${audits[auditIndex].selectedVersion} seront perdues. Souhaitez-vous poursuivre ?`)) {
                    audits[auditIndex].byCriteria = {};
                    audits[auditIndex].selectedVersion = version;
                    saveAudits();
                    getRGESN(version);
                }
            }
        }

        function updateAudit(e) {
            const criterion = {
                id: e.detail.criterionId,
                state: e.detail.criterionState
            }
            if(criterion.state !== undefined) {
                audits[auditIndex].byCriteria[criterion.id] = {
                    state: criterion.state
                };
            }
            else {
                delete audits[auditIndex].byCriteria[criterion.id];
            }
            audits[auditIndex].stats.assessed = Object.keys(audits[auditIndex].byCriteria).length;
            saveAudits();
        }
    
        // Temp : uses localStorage for dev, then browser.storage
        function saveAudits() {
            localStorage.setItem('audits', JSON.stringify(audits));
            localStorage.setItem('auditIndex', auditIndex);
        }	

        // Temp : uses localStorage for dev, then browser.storage
        function getAudits() {
            const storedAudits = JSON.parse(localStorage.getItem('audits'));
            const storedAuditIndex = JSON.parse(localStorage.getItem('auditIndex'));
            if(storedAudits !== null && storedAuditIndex !== null) {
                auditIndex = storedAuditIndex;
                audits = storedAudits;
            }
        }

        function logError(error) {
            console.error(error);
        };

    /* ### PROCEDURAL ### */

        getAudits();
        getRGESN(audits[auditIndex].selectedVersion);

</script>

<VersionSelect 
    availableVersions="{availableVersions}" 
    on:changed="{(e) => changeRGESN(e.detail.versionToApply)}" />
{#if referential}
    <AuditForm 
        audit="{audits[auditIndex]}" 
        referential="{referential}" 
        on:updated="{updateAudit}" />
{/if}