# Gestion des rôles (prototype)

Ce prototype stocke l'utilisateur courant dans le `localStorage` pour différencier l'accès Manager / RH / User. Aucun backend n'est requis.

## Attribution du rôle

Lors du login (page `/login`):

- `manager@pixelplay.com` → rôle `"manager"`
- `rh@pixelplay.com` → rôle `"rh"`
- Toute autre adresse `@pixelplay.com` → rôle `"user"`

Les informations sont stockées dans `localStorage` sous la clé `pixelplay:auth`.

## Utilisation côté UI

1. **Importer le hook**
   ```tsx
   import { useAuth } from "@/contexts/AuthContext"
   ```

2. **Lire l'état courant**
   ```tsx
   const { email, role, isManager, isRh, isUser, clearAuth } = useAuth()

   if (!isManager) {
     return <p>Accès réservé aux managers</p>
   }
   ```

3. **Changer / réinitialiser le rôle**
   ```tsx
   const { setAuth, updateRole, clearAuth } = useAuth()

   // Exemple: déconnexion
   clearAuth()

   // Exemple: forcer un rôle (utile dans un panneau debug)
   updateRole("manager")
   ```

### États exposés par `useAuth`

| Propriété   | Type                 | Description                                |
|-------------|----------------------|--------------------------------------------|
| `email`     | `string \| null`     | Email connecté (ou `null` si invité)       |
| `role`      | `"manager" \| "rh" \| "user"` | Rôle actuel                               |
| `isManager` | `boolean`            | Raccourci pour `role === "manager"`        |
| `isRh`      | `boolean`            | Raccourci pour `role === "rh"`             |
| `isUser`    | `boolean`            | Raccourci pour `role === "user"`           |
| `setAuth`   | `(state) => void`    | Écrase `email` + `role` et persiste        |
| `updateRole`| `(role) => void`     | Change le rôle en conservant l'email       |
| `clearAuth` | `() => void`         | Supprime les infos `localStorage`          |

## Ajout automatique dans l'arbre React

Le `AuthProvider` est injecté dans `src/app/layout.tsx`. Il n'y a donc rien à faire pour les pages : `useAuth()` est immédiatement disponible.

## Astuces

- En mode dev, vous pouvez ouvrir l'onglet "Application" des DevTools pour modifier à la main la clé `pixelplay:auth`.
- Pour protéger une page complète, vous pouvez retourner une redirection si `!isManager` (ou `!isRh`).
