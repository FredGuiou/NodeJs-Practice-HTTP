"use Strict";

// Import NodeJs dependencies
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

// Import des third party dependencies
import { request } from "undici";

// Import des constantes
const file = "package.json";

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

    return data["dist-tags"].latest;
  }
  catch (error) {
    throw new Error(`Request failed : status code ${error.status}`);
  }
}

// Lire le fichier local package.json avec le module fs
async function readPackageJson() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const result = await fs.readFile(path.join(__dirname, "fixtures", `${file}`), { encoding: "utf-8" });
  const { dependencies } = JSON.parse(result);
  console.log({ dependencies });
}

readPackageJson();
