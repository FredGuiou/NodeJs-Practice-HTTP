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
async function getLatestVersion(name) {
  try {
    const npmRegistryUrl = `https://registry.npmjs.org/${name}`;
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
  const comparator = semver.gt(latestVersion, localVersion);
  console.log(comparator);
}


// Lire le fichier local package.json avec le module fs
async function readPackageJson() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const result = await fs.readFile(path.join(__dirname, "fixtures", `${kFile}`), { encoding: "utf-8" });
  const { dependencies } = JSON.parse(result);
  console.log(dependencies);

  return dependencies;
}

// Lancement de la fonction
// getLatestVersion("pg");
// readPackageJson();
compareVersions("9.8.7", "1.2.3");
