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
    // Dans la doc de npm registry
    console.log(data["dist-tags"]);
  }
  catch (error) {
    throw new Error(`Request failed : status code ${error.status}`);
  }
}

getLatestVersion("pg");
