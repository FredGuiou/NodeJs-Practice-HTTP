import * as utils from "./utils.js";

// Lancement de la fonction
// fetchData("https://registry.npmjs.org/");
// getLatestVersion("pg"); // 8.11.0 soit la latest du package "pg"
// readPackageJson(); // rendu terminal d'un Objet Json des dépendances du fichier Package.json
// compareVersions("10.1.7", "9.8.7"); // Major version 10.1.7 available !
// getPackages(); // retourne un tableau d'objet Json des dépendances avec versions et statuts de comparaison

// displayGetPackages();

async function main() {
  const dependencies = await utils.getDependenciesFromPackageJson();

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
}

main();
