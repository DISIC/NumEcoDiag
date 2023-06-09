import { webAppMode } from './webAppMode.mjs';
import { env } from './env.mjs';

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
    );
};

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
    );	
};

export const getAudits = () => {
    return new Promise(
        (resolve ,reject) => {
            getLocalData('audits')
                .then((data) => {
                    if((data !== null && data !== undefined)) {
                        resolve(data);
                    }
                    else {
                        reject('Absence d\'historique');
                    }
                }
            );
        }
    );
};

export const getRGESN = (versionToLoad) => {
    return new Promise(
        (resolve, reject) => {
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
                        );
                    }
                    else {
                        reject('Ouverture du référentiel impossible');
                    }
                }
            );
        }
    );	
};