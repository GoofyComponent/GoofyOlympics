# GoofyOlympics

## Demo

Le site est disponible à l'adresse suivante : [https://goofyolympics.stroyco.eu/](https://goofyolympics.stroyco.eu/)

## Comment lancer le projet

```bash
docker compose -f local.docker-compose.yml -p "local_goofyolympics" up -d --build
```

## Contexte

La première partie du projet répond au critere mentionnée sur ce fichier [projet.pdf](./projet.pdf)

## Conventions

### Commits

Nous utilisont commitlint, les messages de commit doivent donc suivre la convention suivante :

```sh
type(scope?): subject  #scope est facultatif; des scope simultanés sont possible (pour les delimiter : "/", "\" et ",")
```

La liste des types disponibles est :

- `build`: Changements qui affectent le système de construction ou les dépendances externes (exemples de champs d'application : gulp, broccoli, npm)
- `ci`: Changements dans nos fichiers de configuration et scripts CI (exemples : Travis, Circle, BrowserStack, SauceLabs)
- `docs`: Changements dans la documentation uniquement
- `feat`: Une nouvelle fonctionnalité
- `fix`: Correction d'un bogue
- `perf`: une modification du code qui améliore les performances
- `refactor`: une modification du code qui ne corrige pas de bogue et n'ajoute pas de fonctionnalité
- `style`: Changements qui n'affectent pas la signification du code (espaces blancs, formatage, points-virgules manquants, etc.)
- `test`: Ajout de tests manquants ou correction de tests existants
- `wip`: Travail en cours
- `chore`
- `revert`

## Stack technique

- ReactJS
- TypeScript
- ESLint
- Prettier
- Vite
- Lucide (icons)
- TailwindCSS
- commitlint (conventional commits)
- Husky (pre-commit)
- shadcn/UI
