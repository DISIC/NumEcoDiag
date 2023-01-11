const webAppMode = false; // Makes NumÉcoDiag able to be served as webApp and makes debugging easier (entry point: /public/index.html) 
const env = window.browser === undefined ? window.chrome : window.browser; // Makes NumÉcoDiag cross browser as webExtension

export const setLocalData = (name, value) => {
    return new Promise(
        (resolve) => {
            if(!webAppMode) { // Asynchronous
                env.storage.local.set({[name]: value})
                    .then(resolve());
            }
            else { // Synchronous
                localStorage.setItem(name, value);
                resolve();
            }
        }
    )
}

export const getLocalData = name => {
    return new Promise(
        (resolve) => { // Asynchronous
            if(!webAppMode) {
                env.storage.local.get(name)
                    .then(data => resolve(data[name]));
            }
            else { // Synchronous
                resolve(localStorage.getItem(name));
            }
        }
    )		
}


export function getAudits() {
    return new Promise((resolve ,reject) => {
        getLocalData('audits').then((data) =>
            (data !== null && data !== undefined) ? resolve(data): reject('Absence d\'historique')
        );
    });
}

export function getRGESN(versionToLoad) {
    return new Promise((resolve, reject) => {
        fetch(`./rgesn/${versionToLoad}.json`)
            .then((resp) => { 
                if(resp.ok) {
                    resp.text()
                        .then((data) => {
                            try {
                                resolve(JSON.parse(data));
                            }
                            catch(e) {
                                reject('Lecture du référentiel impossible');
                            }	
                        }	
                    )
                }
                else {
                    reject('Ouverture du référentiel impossible');
                }
            }
        )
    });	
}