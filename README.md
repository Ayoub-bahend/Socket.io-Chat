# Socket.io : Chat

Cette application est une adaptation et reprend les sources du tutoriel [tutoriel officiel](http://socket.io/get-started/chat/) de socket.io.

Cette version introduit des améliorations par rapport à la version originale du tutoriel. Voici les nouvelles fonctionnalités intégrées:


* Prise en charge des noms d'utilisateurs
* Affichage de messages de connexion/déconnexion
* Affichage de la liste des utilisateurs connectés
* Historique des messages persistant
* Affichage de l'indicateur "typing"

## Installation

Si Bower n'est pas encore installé sur votre machine, veuillez le faire au préalable en suivant ces étapes :
```
npm install -g bower
```

Pour installer l'application, téléchargez les sources (zip ou git clone) et exécutez la commande suivante depuis la racine du projet.
```
npm install
bower install
```

## Démarrer l'application

Pour démarrer l'application, exécutez la commande suivante depuis la racine du projet.
```
node server
```

L'application est désormais accesssible à l'url **http://localhost:3000/**.

