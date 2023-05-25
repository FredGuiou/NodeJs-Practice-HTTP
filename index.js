"use Strict";

// Import NodeJs dependencies
import fs from "node:fs/promises";
import path from "node:path";

// Import des third party dependencies
import { request } from "undici";

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
    console.log(data);
  }
  catch (error) {
    throw new Error(`Request failed : status code ${error.status}`);
  }
}

// Comparer les versions et voir si c'est mineur ou majeur.

// Actions sur Package.json (Principale fonction)
// prévoir d'utiliser la fonction de requête HTTP.
// prévoir d'utiliser la fonction de comparaison.

// lancement de la principale fonction.
getLatestVersion("pg");
