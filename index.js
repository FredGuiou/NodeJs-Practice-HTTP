"use Strict";

// Import NodeJs dependencies
import fs from "node:fs/promises";
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
    const { body } = await request(url);
    const data = await body.json();

    return data;
  }
  catch (error) {
    throw new Error(`Request failed : status code ${error.status}`);
  }
}

// Récupérer la dernière version d'un package depuis le registre des versions npm.
async function getLatestVersion(Packageame) {
  try {
    const npmRegistryUrl = `https://registry.npmjs.org/${Packageame}`;
    const data = await fetchData(npmRegistryUrl);
    const latestVersion = data["dist-tags"].latest;
    console.log(latestVersion);

    return latestVersion;
  }
  catch (error) {
    throw new Error(`Request failed : status code ${error.status}`);
  }
}

// Comparer deux versions avec le module npm semver
async function compareVersions(latestVersion, localVersion) {
  try {
    const comparator = semver.gt(latestVersion, localVersion);

    if (comparator === true) {
      if (semver.major(localVersion) !== semver.major(latestVersion)) {
        const result = `Major version ${latestVersion} available !`;

        return result;
      }
      if (semver.minor(localVersion) !== semver.minor(latestVersion)) {
        const result = `Minor version ${latestVersion} available !`;

        return result;
      }
    }

    return null;
  }
  catch (error) {
    throw new Error("Error from compareVersions function");
  }
}


// Lire le fichier local package.json avec le module fs
async function readPackageJson() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const result = await fs.readFile(path.join(__dirname, "fixtures", `${kFile}`), { encoding: "utf-8" });
  const { dependencies } = JSON.parse(result);

  return dependencies;
}

// Lancement de la fonction
// getLatestVersion("pg"); // 8.11.0 soit la latest du package "pg"
// readPackageJson(); // rendu terminal d'un Objet Json des dépendances du fichier Package.json
// compareVersions("10.1.7", "9.8.7"); // Major version 10.1.7 available !
