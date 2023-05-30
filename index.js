"use Strict";

// Import NodeJs dependencies
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

// Import des third party dependencies
import { request } from "undici";
import semver from "semver";


// Import des constantes
const kFile = "package.json";

// Effectuer une requête HTTP avec Undici.
async function fetchData(url) {
  try {
    // Je récupère le body via destructuring avec la fonction request de Undici.
    const { statusCode, body } = await request(url);
    // Je stocke le body dans une constante data en tant qu'objet Javascript
    const bodyJson = await body.json();
    const data = { statusCode, body: bodyJson };

    return data;
  }
  catch (error) {
    // Si une erreur se déclenche dans le try je la throw  avec le code pour mieux l'identifier.
    throw new Error(`HTTP request failed : status code ${error}`);
  }
}

// Récupérer la dernière version d'un package depuis le registre des versions npm.
async function getLatestVersion(packageName) {
  try {
    // Je définis l'url à consulter (cf. documentation registry-api.md)
    const npmRegistryUrl = `https://registry.npmjs.org/${packageName}`;
    // Je récupère mes données en passant en argument à fetchData npmRegistryUrl
    const data = await fetchData(npmRegistryUrl);
    const latestVersion = data.body["dist-tags"].latest;

    return latestVersion;
  }
  catch (error) {
    // Si une erreur se déclenche dans le try je la throw  avec le code pour mieux l'identifier.
    throw new Error(`Npm request failed : status code ${error}`);
  }
}

// Comparer deux versions avec le module npm semver.
function compareVersions(latestVersion, localVersion) {
  try {
    // Grâce à semver et sa fonction gt je compare globalement les deux versions (celle en local et la laterst récupérée avec la fonction au dessus)
    // Je détermine si latestVersion est supérieur à localVersion. (NB: Attention à l'ordre des arguments) Renvoie un booléen true.
    const comparator = semver.gt(latestVersion, localVersion);

    // Je procède à la comaraison du major et du minor.
    if (comparator) {
      // Si le major local est inférieur au major latest alors je retourne un message de dispo d'une version majeure.
      if (semver.major(localVersion) < semver.major(latestVersion)) {
        const result = `Major ${latestVersion} available`;

        return result;
      }
      // Si le minor local est inférieur au minor latest alors je retourne un message de disponibilité d'une version mineure.
      if (semver.minor(localVersion) < semver.minor(latestVersion)) {
        const result = `Minor ${latestVersion} available`;

        return result;
      }
    }

    // Sinon je renvoie null car pas de version au minimum mineure à récupérer. (Cas du patch mais non demandé par l'énoncé)
    return "No update available";
  }
  catch (error) {
    // Si une erreur se déclenche dans le try je la throw.
    throw new Error("Function compareVersions Process error");
  }
}


// Lire le fichier local package.json avec le module fs.
function readPackageJson() {
  // Récupérer le chemin de fichier.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Avec la fonction readFile du module fs j'accède au fichier package.json définit dans kFile.
  const PackageJson = fs.readFileSync(path.join(__dirname, "fixtures", `${kFile}`), { encoding: "utf-8" });
  // Je récupère les dependencies qui sont en string que je transforme en objet Json avec parse.
  const { dependencies } = JSON.parse(PackageJson);

  return dependencies;
}

// Effectuer les requêtes en parallèle.
async function getPackages() {
  // J'accède au fichier package.json grâce à la fonction de lecture de fichier.
  const dependencies = await readPackageJson();

  // Je récupère dans un tableau la liste des noms des dépendances.
  // map sur chaque dependances pour interroger la npmRegistry et comparer avec le local.
  const requests = Object.keys(dependencies).map(
    async(packageName) => {
      const localVersion = dependencies[packageName].replace("^", "");
      const latestVersion = await getLatestVersion(packageName);

      const comparison = compareVersions(latestVersion, localVersion);

      return {
        packageName,
        localVersion,
        latestVersion,
        comparison
      };
    });

  // Avec Promise.allSettled le résultat est obtenu quand toutes les requêtes sont accomplies.
  const promisesResults = await Promise.allSettled(requests);

  return promisesResults;
}
// Afficher dans le terminal le résultat pour chaque package.
async function displayGetPackages() {
  const fetchPromisesResults = await getPackages();

  fetchPromisesResults.forEach((element) => {
    if (element.status === "fulfilled") {
      const { packageName, comparison } = element.value;
      if (comparison) {
        console.log(`${comparison} - for ${packageName}`);
      }
    }
    else {
      console.log("Error");
    }
  });
}

// Lancement de la fonction
// fetchData("https://registry.npmjs.org/");
// getLatestVersion("pg"); // 8.11.0 soit la latest du package "pg"
// readPackageJson(); // rendu terminal d'un Objet Json des dépendances du fichier Package.json
// compareVersions("10.1.7", "9.8.7"); // Major version 10.1.7 available !
// getPackages(); // retourne un tableau d'objet Json des dépendances avec versions et statuts de comparaison

displayGetPackages();

export default {
  kFile,
  fetchData,
  getLatestVersion,
  compareVersions,
  readPackageJson,
  getPackages,
  displayGetPackages
};
