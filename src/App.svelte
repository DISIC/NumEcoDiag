<script>

    /* ### VARIABLES ### */

        import VersionSelect from './components/VersionSelect.svelte';
        import AuditForm from './components/AuditForm.svelte';
        import Results from './components/Results.svelte';
        
        const versions = ['beta', '1.0']; // Available versions (stored in /public/rgesn)
        let referential; // RGESN content
        let index = 0; // Current audit index identifier
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
            if(version !== audits[index].selectedVersion) {
                if(confirm(`Vous allez passer de la version ${audits[index].selectedVersion} à la version ${version} du référentiel. Les données d'audit saisies en version ${audits[index].selectedVersion} seront perdues. Souhaitez-vous poursuivre ?`)) {
                    resetProgression();
                    audits[index].selectedVersion = version;
                    getRGESN(version);
                }
            }
            else {
                alert(`Vous utilisez déjà la version ${version} du référentiel.`);
            }
        }

        function resetProgression() {
            audits[index].byCriteria = {};
            audits[index].byCounters.satisfied = 0;
            audits[index].byCounters.rejected = 0;
            audits[index].byCounters.notApplicable = 0;
            saveAudits();
        }

        function updateAudit(e) { 
            const criterion = {
                id: e.detail.criterionId,
                state: e.detail.criterionState
            }        
            // If already defined, removes 1 to the previous associated state counter 
            try {
                let previousCriterionState = audits[index].byCriteria[criterion.id].state;
                if(previousCriterionState !== undefined) {
                    switch (previousCriterionState) {
                        case 'satisfied':
                            audits[index].byCounters.satisfied--;
                            break;
                        case 'rejected':
                            audits[index].byCounters.rejected--;
                            break;
                        case 'not-applicable':
                            audits[index].byCounters.notApplicable--;
                            break;
                    }
                }
            }
            catch(e) { /* This criterion was not defined before */ }
            // In all cases, add 1 to the new associated state counter 
            finally {
                if(criterion.state !== undefined) {
                    audits[index].byCriteria[criterion.id] = {
                        state: criterion.state
                    };
                    switch (criterion.state) {
                        case 'satisfied':
                            audits[index].byCounters.satisfied++;
                            break;
                        case 'rejected':
                            audits[index].byCounters.rejected++;
                            break;
                        case 'not-applicable':
                            audits[index].byCounters.notApplicable++;
                            break;
                    }
                }
                else {
                    delete audits[index].byCriteria[criterion.id];
                }
            }
            saveAudits();
        }
    
        // Temp : uses localStorage for dev, then browser.storage
        function saveAudits() {
            localStorage.setItem('audits', JSON.stringify(audits));
            localStorage.setItem('index', index);
        }	

        // Temp : uses localStorage for dev, then browser.storage
        function getAudits() {
            const storedAudits = JSON.parse(localStorage.getItem('audits'));
            const storedindex = JSON.parse(localStorage.getItem('index'));
            if(storedAudits !== null && storedindex !== null) {
                index = storedindex;
                audits = storedAudits;
            }
        }

        function logError(error) {
            console.error(error);
        };

    /* ### PROCEDURAL ### */

        getAudits();
        getRGESN(audits[index].selectedVersion);

</script>

<main class="app">
    <h1>Référentiel Général d'écoconception de Services Numériques</h1>
    <VersionSelect versions="{versions}" on:changed="{(e) => changeRGESN(e.detail.versionToApply)}" />
    {#if referential}
        {#key audits[index].selectedVersion}
            <Results bind:counters="{audits[index].byCounters}" bind:nbOfCriteria="{referential.criteres.length}" />
            <AuditForm audit="{audits[index]}" referential="{referential}" on:updated="{updateAudit}" />
        {/key}
    {/if}
</main>

<style>
    .app {
        max-width: 65ch;
    }
</style>