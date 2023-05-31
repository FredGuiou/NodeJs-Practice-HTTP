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
// Le mock qui sera renvoyé i.e. la réponse fictive.
const mockResult = { result: "ok" };
// Permet de définir les règles d'interception. (persist permet de garder la règle en mémoire pour une excution future)
// Pour les cas #1 statut 200 et #2 retour d'un body
mockPool.intercept({ path: "/pg" }).reply(200, mockResult, {
  headers: { "Content-Type": "application/json" }
}).persist();
// Pour le cas #3 erreur si la requête échoue. (Serveur indisponible statut 500)
mockPool.intercept({ path: "/toto" }).reply(500, {}, {
  headers: { "Content-Type": "application/json" }
}).persist();

// Injection du Mockagent dans le code pour les appels HTTP avec la méthode setGlobalDispatcher.
setGlobalDispatcher(mockAgent);

after(async() => {
  await mockAgent.close();
});

describe("fetchData function", () => {
  it("Should return a status Code 200 for \"OK\"", async() => {
    const result = await utils.fetchData(`${kNpmApiUrl}/pg`);
    assert.equal(result.statusCode, 200);
  });
  it("Should return a body", async() => {
    const result = await utils.fetchData(`${kNpmApiUrl}/pg`);
    assert.deepEqual(result.body, mockResult);
  });
  it("Should throw an error if request failed", async() => {
    await assert.rejects(async() => {
      await utils.fetchData(`${kNpmApiUrl}/toto`);
    }, {
      name: "Error",
      message: "HTTP request failed : status code 500"
    });
  });
});

