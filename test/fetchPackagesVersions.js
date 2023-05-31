// Import des nodeJs dependencies
import { describe, it, after } from "node:test";
import assert from "node:assert";

// Import des third party dependencies
import { MockAgent, setGlobalDispatcher } from "undici";

// Import des constantes et fonctions à tester
// "*" permet de tout importer
// "as" permet d'encapsuler l'ensemble.
import * as utils from "../utils.js";

// Import des constantes
const kNpmApiUrl = "https://registry.npmjs.org";

// Paramétrage du MockAgent
// Le mockAgent intercepte les requête HTTP réalisées avec Undici et renvoie la réponse.

// J'instancie l'agent mockagent depuis la classe.
const mockAgent = new MockAgent();
// Annule les appels API "en ligne".
mockAgent.disableNetConnect();
// Crée et récupère les instances avec pour argument l'adresse interrogée.
const mockPool = mockAgent.get(kNpmApiUrl);

// Permet de définir les règles d'interception. (persist permet de garder la règle en mémoire pour une excution future)
mockPool.intercept({ path: "/foo" }).reply(200, { "dist-tags": { latest: "5.3.6" } }, {
  headers: { "Content-Type": "application/json" }
}).persist();
mockPool.intercept({ path: "/bar" }).reply(200, { "dist-tags": { latest: "5.7.1" } }, {
  headers: { "Content-Type": "application/json" }
}).persist();


// Injection du Mockagent dans le code pour les appels HTTP avec la méthode setGlobalDispatcher.
setGlobalDispatcher(mockAgent);

after(async() => {
  await mockAgent.close();
});

describe("fetchPackagesVersions function", () => {
  it("Should return promises results", async() => {
    const result = await utils.fetchPackagesVersions({ foo: "4.3.6", bar: "5.7.1" });
    const expectedResult = [
      {
        status: "fulfilled",
        value: {
          packageName: "foo",
          localVersion: "4.3.6",
          latestVersion: "5.3.6"
        }
      },
      {
        status: "fulfilled",
        value: {
          packageName: "bar",
          localVersion: "5.7.1",
          latestVersion: "5.7.1"
        }
      }
    ];
    assert.deepEqual(result, expectedResult);
  });
});
