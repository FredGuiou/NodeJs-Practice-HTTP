# NodeJs-Practice-HTTP

L'objectif de cet atelier est de récupérer les dernières versions disponibles sur le registre npm pour un ensemble de packages référencé dans un fichier package.json.

Si une mise à jour est nécessaire afficher dans la sortie standard (stdout) si celle-ci est minor or major (SemVer).

Les liens des documentations utilses : </br>
<https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md></br>
<https://semver.org/lang/fr/>

## En contrainte

- Utiliser le package npm Undici (lien ci-dessous) pour effectuer les requêtes HTTP :</br>
<https://undici.nodejs.org/#/>

## Bonus

- Ecrire des test unitaires en utilisant le MockAgent.
- Faire un CLI pour executer l'utilitaire dans différents projets en exploitant le current working dir.

## Installation et utilisation

- Commencez par cloner le projet
- Exécuter, depuis la racine du projet la commande `npm install` pour installer les dépendances.
- Le programme étant exécutable en tant que CLI, il est nécessaire de le "linker" à votre environnement système : exécuter `npm link` dans le terminal à la racine du projet.
- Enfin, pour exécuter le projet, depuis le terminal, positionnez vous sur le répertoire du projet pour lequel vous souhaitez vérfier les mises à jours disponibles de vos dépendances et exécuter la commande `packver` : le programme s'execute et vous renvoie le message adéquat.
