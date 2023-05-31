// Import des nodeJs dependencies
import { describe, it, after } from "node:test";
import assert from "node:assert";

// Import des third party dependencies
import { MockAgent, setGlobalDispatcher } from "undici";

// Import des constantes et fonctions à tester
// "*" permet de tout importer
// "as" permet d'encapsuler l'ensemble.
import * as npmTest from "../index.js";

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

mockPool.intercept({ path: "/foo" }).reply(200, { "dist-tags": { latest: "1.2.3" } }, {
  headers: { "Content-Type": "application/json" }
}).persist();

mockPool.intercept({ path: "/bar" }).reply(500, {}, {
  headers: { "Content-Type": "application/json" }
}).persist();
// Injection du Mockagent dans le code pour les appels HTTP avec la méthode setGlobalDispatcher.
setGlobalDispatcher(mockAgent);

after(async() => {
  await mockAgent.close();
});

describe("getLatestVersion function", () => {
  it("Should return the latest version from foo", async() => {
    const result = await npmTest.getLatestVersion("foo");
    assert.equal(result, "1.2.3");
  });
  it("Should throw an error if request fail", async() => {
    await assert.rejects(async() => {
      await npmTest.getLatestVersion("bar");
    }, {
      name: "Error",
      message: "Npm request failed"
    });
  });
});

