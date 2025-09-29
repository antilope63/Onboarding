export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  category: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "structure-doc",
    question: "Comment est structurée la documentation ?",
    answer:
      "La documentation est organisée par rubriques (Guides, Référence API, Exemples, FAQ) avec une navigation latérale et une recherche plein texte pour retrouver rapidement une information. Chaque rubrique contient des sous-sections structurées de manière progressive (de l'introduction aux cas avancés), avec des captures, des extraits de code annotés et des liens croisés vers les parties connexes.\n\nNous distinguons clairement les pages conceptuelles (le pourquoi) des pages de référence (le comment, exhaustif), et proposons des checklists de fin de section pour valider votre compréhension avant de passer à la suite.",
    tags: ["général", "navigation", "documentation"],
    category: "Documentation & Onboarding",
  },
  {
    id: "exemples-code",
    question: "Où trouver des exemples de code réutilisables ?",
    answer:
      "Des snippets sont disponibles dans chaque section ainsi que dans le dossier components/ui. Ils sont pensés pour être copiés-collés tels quels et personnalisés via des props et des classes utilitaires.\n\nNous proposons aussi des exemples complets (pages, flux utilisateur, intégrations API) avec des variantes d’implémentation lorsqu’il existe plusieurs approches possibles (simple vs. scalable). Chaque exemple précise ses prérequis, ses limites, et les pièges courants à éviter.",
    tags: ["exemples", "snippets", "ui"],
    category: "Documentation & Onboarding",
  },
  {
    id: "contribuer-signalement",
    question: "Comment contribuer ou signaler un problème ?",
    answer:
      "Pour un bug, ouvrez une issue GitHub en fournissant une description claire, des étapes de reproduction minimales, le comportement attendu/observé, la version de Node et des captures si utile. Les labels (bug, enhancement, docs) aident à prioriser.\n\nPour contribuer, forkez le dépôt, créez une branche nominative (feature/..., fix/...), suivez le template de PR et respectez les conventions de commit. Les PR doivent inclure des tests et/ou une note de migration si nécessaire, ainsi qu’un court résumé des impacts.",
    tags: ["github", "contribution", "issues"],
    category: "Documentation & Onboarding",
  },
  {
    id: "env-setup",
    question: "Comment installer et lancer le projet en local ?",
    answer:
      "Installez Node LTS et pnpm, puis exécutez pnpm install et pnpm dev. Copiez .env.example vers .env.local et renseignez les variables d’environnement (clés API, URL backend, secrets).\n\nSi vous utilisez macOS, vérifiez que les dépendances natives (ex: sharp) compilent correctement. En cas d’erreur, supprimez node_modules et le lockfile puis réinstallez. Lancez ensuite l’app sur http://localhost:3000 et testez les pages clés.",
    tags: ["setup", "local", "env"],
    category: "Documentation & Onboarding",
  },
  {
    id: "styles-tailwind",
    question: "Comment sont gérés les styles (Tailwind) ?",
    answer:
      "Nous utilisons TailwindCSS avec des utilitaires, des composants composables (shadcn/ui) et des helpers comme cn pour fusionner intelligemment les classes (évite les conflits). Les couleurs personnalisées (ex: bg-bleu_fonce_2) sont définies dans la config Tailwind pour uniformiser la charte.\n\nLes composants UI exposent des props de variant/size lorsque pertinent. Respectez la grille de spacing et la typographie par défaut afin de garantir la cohérence visuelle à l’échelle du projet.",
    tags: ["tailwind", "styles", "shadcn"],
    category: "UI & Frontend",
  },
  {
    id: "icones",
    question: "Quelles icônes utilisons-nous ?",
    answer:
      "Le set d'icônes principal est Lucide (lucide-react), moderne et léger. Importez seulement ce dont vous avez besoin (tree-shaking). Conservez des tailles cohérentes (16, 20, 24) et la même épaisseur de trait pour une apparence homogène.\n\nPour des pictos de marque (ex: Google Drive), préférez des assets dédiés (SVG/PNG) avec un alt explicite et un contrôle d’accessibilité approprié.",
    tags: ["icônes", "lucide"],
    category: "UI & Frontend",
  },
  {
    id: "link-externe",
    question: "Dois-je utiliser Link de Next pour un lien externe ?",
    answer:
      "Ce n’est pas recommandé. Utilisez une balise <a> avec target=\"_blank\" et rel=\"noopener noreferrer\" pour les liens externes. Link est optimisé pour la navigation interne (préchargement, transitions) et n’apporte pas d’avantage pour un site externe.\n\nPensez à signaler visuellement qu’un lien s’ouvre dans un nouvel onglet (icône, texte d’accompagnement) pour améliorer l’UX.",
    tags: ["nextjs", "link", "a"],
    category: "UI & Frontend",
  },
  {
    id: "securite-rel",
    question: "À quoi servent noopener et noreferrer ?",
    answer:
      "noopener empêche la page ouverte via target=\"_blank\" d’accéder à window.opener, ce qui neutralise les attaques de tabnabbing et isole mieux le contexte. noreferrer supprime l’en-tête Referer, améliorant la confidentialité (mais peut impacter l’attribution analytique).\n\nEn pratique, utilisez rel=\"noopener noreferrer\" par défaut. Si vous avez besoin du Referer pour la mesure, gardez rel=\"noopener\" seul.",
    tags: ["sécurité", "liens"],
    category: "UI & Frontend",
  },
  {
    id: "auth-workflow",
    question: "Quel est le flux d'authentification ?",
    answer:
      "La page /login gère la saisie utilisateur et la validation de base (format d’e-mail, règles de mot de passe). Après soumission, le serveur vérifie les identifiants et renvoie un jeton/session. Côté client, nous stockons de manière sécurisée et attachons les en-têtes d’auth aux requêtes suivantes.\n\nLes rôles et permissions sont contrôlés au niveau des pages et des composants sensibles. Les routes critiques sont protégées, et des redirections sont appliquées si l’utilisateur n’a pas les droits.",
    tags: ["auth", "sécurité"],
    category: "Architecture & Performance",
  },
  {
    id: "perf-optim",
    question: "Quelles sont les optimisations de performance clés ?",
    answer:
      "Nous utilisons le code splitting et le lazy-loading pour réduire le temps de chargement initial. Les composants très dynamiques sont mémorisés (memo/useMemo) pour limiter les re-rendus, et les longues listes sont virtualisées.\n\nLes images sont optimisées (formats modernes, dimensions explicites), le payload JS est surveillé, et les dépendances lourdes sont chargées de manière conditionnelle ou remplacées par des alternatives plus légères lorsque possible.",
    tags: ["performance", "optimisation"],
    category: "Architecture & Performance",
  },
  {
    id: "images-next",
    question: "Quand utiliser next/image ?",
    answer:
      "Utilisez next/image dès que l’image est significative pour le rendu (photos, illustrations) afin de bénéficier du redimensionnement, du lazy-loading, des formats optimisés et du cache. Déclarez toujours width/height et un alt pertinent.\n\nPour des icônes ou pictos simples, un composant SVG inline peut être plus indiqué et plus léger qu’une image raster.",
    tags: ["images", "next/image"],
    category: "UI & Frontend",
  },
  {
    id: "deploy-vercel",
    question: "Comment se passe le déploiement sur Vercel ?",
    answer:
      "Chaque push sur la branche principale déclenche un déploiement automatique. Les Pull Requests génèrent des Preview Deployments pour faciliter la revue visuelle et fonctionnelle.\n\nLes variables d’environnement sont gérées dans le dashboard Vercel par environnement (dev/preview/prod). Surveillez les logs et les métriques (Edge/Functions) pour diagnostiquer rapidement en cas d’échec.",
    tags: ["vercel", "deploy"],
    category: "Ops & Qualité",
  },
  {
    id: "tests",
    question: "Comment sont gérés les tests ?",
    answer:
      "Les tests unitaires (Vitest/Jest) ciblent la logique pure et les composants isolés. Les tests d’intégration valident le dialogue entre modules, et les tests E2E (Playwright) simulent les parcours critiques utilisateur.\n\nNous visons des tests rapides, déterministes, avec des fixtures claires et une séparation nette entre mocks et vraies dépendances. Les PR qui modifient la logique métier doivent inclure des tests.",
    tags: ["tests", "qualité"],
    category: "Ops & Qualité",
  },
  {
    id: "accessibilite",
    question: "Quelles bonnes pratiques d'accessibilité ?",
    answer:
      "Assurez des contrastes suffisants, des tailles de cible adéquates, un focus visible, et des libellés explicites. Utilisez des rôles/attributs ARIA uniquement en complément d’une sémantique HTML correcte.\n\nTestez systématiquement à la navigation clavier, avec un lecteur d’écran sur les pages importantes, et évitez les pièges (texte comme image, contenu uniquement au survol).",
    tags: ["a11y", "accessibilité"],
    category: "Architecture & Performance",
  },
  {
    id: "erreurs-communes",
    question: "Erreurs courantes et solutions ?",
    answer:
      "1) Chemins alias incorrects: vérifiez la config tsconfig/baseUrl/paths et importez via '@/...'. 2) Classes Tailwind dynamiques: évitez les interpolations non déclaratives; préférez les variantes ou ajoutez une safelist si nécessaire. 3) Liens externes: toujours utiliser rel=\"noopener noreferrer\" avec target=\"_blank\".\n\nBonus: surveillez les warnings de build, contrôlez les tailles de bundles, et utilisez des ESLint rules adaptées pour prévenir les régressions.",
    tags: ["debug", "pièges"],
    category: "Ops & Qualité",
  },
];

