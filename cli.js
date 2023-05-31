#!/usr/bin/env node

// Import des fonctions de utils
import * as utils from "./utils.js";

// Lancement de la fonction
async function main() {
  const dependencies = await utils.getDependenciesFromPackageJson();

  if (!dependencies) {
    const error = "No dependencies found in package.json";
    console.log(error);

    return null;
  }

  const packagesVersionsPromises = await utils.fetchPackagesVersions(dependencies);

  for (const packageVersionsPromise of packagesVersionsPromises) {
    if (packageVersionsPromise.status !== "fulfilled") {
      console.log("Error");

      continue;
    }

    const { packageName, localVersion, latestVersion } = packageVersionsPromise.value;

    const comparison = utils.compareVersions(latestVersion, localVersion);

    if (comparison) {
      console.log(`${comparison} - for ${packageName}`);
    }
  }

  return null;
}

main();
