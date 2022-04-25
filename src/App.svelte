<script>

    /* ### VARIABLES ### */

        import VersionSelect from './components/VersionSelect.svelte';
        import AuditForm from './components/AuditForm.svelte';
        import Stats from './components/Stats.svelte'
        
        const availableVersions = ['beta', '1.0']; // Available versions (stored in /public/rgesn)
        let referential; // RGESN content
        let auditIndex = 0; // Current audit index identifier
        let audits = [ // Audits progression (saved with localStorage for dev, then into browser.storage)
            {  
                byCriteria: {},
                byCounters: {
                    satisfied: 0,
                    rejected: 0,
                    notApplicable: 0
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
            else {
                alert(`Vous utilisez déjà la version ${version} du référentiel.`);
            }
        }

        function updateAudit(e) { 
            const criterion = {
                id: e.detail.criterionId,
                state: e.detail.criterionState
            }        
            // If already defined, removes 1 to the previous associated state counter 
            try {
                let previousCriterionState = audits[auditIndex].byCriteria[criterion.id].state;
                if(previousCriterionState !== undefined) {
                    switch (previousCriterionState) {
                        case 'satisfied':
                            audits[auditIndex].byCounters.satisfied--;
                            break;
                        case 'rejected':
                            audits[auditIndex].byCounters.rejected--;
                            break;
                        case 'not-applicable':
                            audits[auditIndex].byCounters.notApplicable--;
                            break;
                    }
                }
            }
            catch(e) { /* This criterion was not defined before */ }
            // In all cases, add 1 to the new associated state counter 
            finally {
                if(criterion.state !== undefined) {
                    audits[auditIndex].byCriteria[criterion.id] = {
                        state: criterion.state
                    };
                    switch (criterion.state) {
                        case 'satisfied':
                            audits[auditIndex].byCounters.satisfied++;
                            break;
                        case 'rejected':
                            audits[auditIndex].byCounters.rejected++;
                            break;
                        case 'not-applicable':
                            audits[auditIndex].byCounters.notApplicable++;
                            break;
                    }
                }
                else {
                    delete audits[auditIndex].byCriteria[criterion.id];
                }
            }
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
    <Stats
        bind:counters="{audits[auditIndex].byCounters}"
        bind:nbOfCriteria="{referential.criteres.length}" />
    <AuditForm 
        audit="{audits[auditIndex]}" 
        referential="{referential}" 
        on:updated="{updateAudit}" />
{/if}