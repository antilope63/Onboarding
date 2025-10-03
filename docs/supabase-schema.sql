-- Supabase schema & seed data for Pixelpay Onboarding
-- Run this script inside the SQL editor of your Supabase project.

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Formation sessions -------------------------------------------------------
create table if not exists formation_sessions (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text not null,
  description text not null,
  image text not null,
  formatter_name text not null,
  formatter_role text not null,
  formatter_image text not null,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_formation_sessions_updated
before update on formation_sessions
for each row execute function set_updated_at();

-- Formation schedule ------------------------------------------------------
create table if not exists formation_session_schedule (
  id text primary key default gen_random_uuid()::text,
  session_id text not null references formation_sessions(id) on delete cascade,
  slot text not null,
  scheduled_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uniq_session_schedule unique (session_id)
);

create trigger trg_formation_session_schedule_updated
before update on formation_session_schedule
for each row execute function set_updated_at();

-- Follow-up highlight -----------------------------------------------------
create table if not exists followup_highlights (
  id text primary key,
  titre text not null,
  type text,
  statut text not null check (statut in ('Obligatoire','Optionnel','Programmé')),
  date_label text not null,
  temps_restant text not null,
  progression integer not null check (progression between 0 and 100),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_followup_highlights_updated
before update on followup_highlights
for each row execute function set_updated_at();

-- Follow-up meetings ------------------------------------------------------
create table if not exists followup_meetings (
  id text primary key default gen_random_uuid()::text,
  titre text not null,
  type text,
  date_label text not null,
  statut text not null check (statut in ('Obligatoire','Optionnel','Programmé')),
  couleur text not null check (couleur in ('vert','violet','orange','gris')),
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_followup_meetings_updated
before update on followup_meetings
for each row execute function set_updated_at();

-- Task management ---------------------------------------------------------
create table if not exists task_phases (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  position integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint task_phases_position_unique unique (position)
);

create trigger trg_task_phases_updated
before update on task_phases
for each row execute function set_updated_at();

create table if not exists tasks (
  id text primary key default gen_random_uuid()::text,
  phase_id text not null references task_phases(id) on delete cascade,
  name text not null,
  description text not null,
  status text not null check (status in ('todo','in-progress','done','verified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_tasks_updated
before update on tasks
for each row execute function set_updated_at();

-- Team directory ----------------------------------------------------------
create table if not exists team_members (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text not null,
  team text not null,
  email text not null,
  avatar text,
  status text check (status is null or status in ('Actif','Arrive bientôt','En onboarding')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint team_members_email_unique unique (email)
);

create trigger trg_team_members_updated
before update on team_members
for each row execute function set_updated_at();

-- Documentation -----------------------------------------------------------
create table if not exists documentation_links (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text not null,
  href text not null,
  icon_key text not null,
  category text not null,
  external boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_documentation_links_updated
before update on documentation_links
for each row execute function set_updated_at();

create table if not exists project_folders (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text not null,
  summary text not null,
  drive_url text,
  accent_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_project_folders_updated
before update on project_folders
for each row execute function set_updated_at();

create table if not exists project_folder_documents (
  id text primary key default gen_random_uuid()::text,
  folder_id text not null references project_folders(id) on delete cascade,
  document_id text not null references documentation_links(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uniq_folder_document unique (folder_id, document_id)
);

create trigger trg_project_folder_documents_updated
before update on project_folder_documents
for each row execute function set_updated_at();

-- FAQ ---------------------------------------------------------------------
create table if not exists faq_items (
  id text primary key default gen_random_uuid()::text,
  question text not null,
  answer text not null,
  tags text[] default '{}',
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_faq_items_updated
before update on faq_items
for each row execute function set_updated_at();

-- Organigram --------------------------------------------------------------
create table if not exists org_nodes (
  id text primary key default gen_random_uuid()::text,
  parent_id text references org_nodes(id) on delete cascade,
  name text not null,
  title text not null,
  image text,
  team_size integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_org_nodes_updated
before update on org_nodes
for each row execute function set_updated_at();

-- Indexes ------------------------------------------------------------------
create index if not exists idx_tasks_phase_id on tasks (phase_id);
create index if not exists idx_documentation_links_category_title
  on documentation_links (category, title);
create index if not exists idx_project_folder_documents_folder
  on project_folder_documents (folder_id);
create index if not exists idx_project_folder_documents_document
  on project_folder_documents (document_id);
create index if not exists idx_faq_items_category_question on faq_items (category, question);
create index if not exists idx_org_nodes_parent on org_nodes (parent_id);
create index if not exists idx_team_members_team on team_members (team);

-- RLS policies -------------------------------------------------------------
do $$
declare
  table_name text;
  policy_name text;
begin
  for table_name in
    select unnest(
      array[
        'formation_sessions',
        'formation_session_schedule',
        'followup_highlights',
        'followup_meetings',
        'task_phases',
        'tasks',
        'team_members',
        'documentation_links',
        'project_folders',
        'project_folder_documents',
        'faq_items',
        'org_nodes'
      ]
    )
  loop
    policy_name := table_name || '_full_access';
    execute format('alter table %I enable row level security;', table_name);
    execute format('drop policy if exists %I on %I;', policy_name, table_name);
    execute format(
      'create policy %I on %I for all using (true) with check (true);',
      policy_name,
      table_name
    );
  end loop;
end
$$ language plpgsql;

-- -------------------------------------------------------------------------
-- Seed data
-- -------------------------------------------------------------------------

-- Formation sessions
insert into formation_sessions (id, title, subtitle, description, image, formatter_name, formatter_role, formatter_image, done) values
  ('session-1', 'Unity | Introduction à l''éditeur', 'Découvrir l''interface, projets et gestion des packages', 'Tour d''horizon de l''Editor, organisation d''un projet, import d''assets, gestion via Package Manager et bonnes pratiques de structure.', '/Formation/Unity1.jpg', 'Alexis Caron', 'Game Developer', '/Organigramme/homme5.jpeg', false),
  ('session-2', 'Unity | Scenes & GameObjects', 'Composer une scène et manipuler les composants', 'Création de scènes, hiérarchie, transforms, prefabs, matériaux et lights. Focus sur le workflow rapide et réutilisable.', '/Formation/Unity2.webp', 'Hugo Martin', 'Technical Artist', '/Organigramme/homme2.jpeg', true),
  ('session-3', 'Unity | Scripting C# (bases)', 'Cycle de vie MonoBehaviour et interactions simples', 'Variables, Update/Start, input utilisateur, collisions et communication entre objets. Exemples concrets orientés gameplay.', '/Formation/Unity3.webp', 'Sophie Chamberlain', 'Responsable Pédagogie', '/Organigramme/femme3.jpeg', true),
  ('session-4', 'GitHub | Introduction et configuration', 'Repos, README, issues et collaboration', 'Créer un dépôt, cloner, protections de branches, gestion des issues et règles de contribution pour un projet sain.', '/Formation/Github1.webp', 'Camille Bernard', 'Product Owner', '/Organigramme/femme7.jpeg', false),
  ('session-5', 'GitHub | Branches & Pull Requests', 'GitFlow simplifié et revues de code', 'Créer des branches, ouvrir une PR, demander une review, résoudre les conflits et fusionner proprement (squash/merge).', '/Formation/Github2.png', 'Thomas Leroy', 'Scrum Master', '/Organigramme/homme4.jpeg', false),
  ('session-6', 'GitHub | Actions (CI/CD)', 'Automatiser tests, builds et déploiements', 'Workflows YAML, déclencheurs, secrets, jobs et matrices. Mise en place d''une CI de base pour un projet web.', '/Formation/Github3.png', 'Lina Moretti', 'Data Analyst', '/Organigramme/femme1.jpeg', true),
  ('session-7', 'Trello | Introduction', 'Tableaux, listes et cartes pour s''organiser', 'Créer un board, inviter des membres, structurer des listes, cartes, labels et checklists. Méthodes pour rester clair.', '/Formation/Trello1.png', 'Nadia Lopez', 'Cheffe de projet', '/Organigramme/femme6.jpeg', false),
  ('session-8', 'Trello | Power-Ups & automatisations', 'Butler, règles et intégrations utiles', 'Configurer des règles automatiques, boutons, échéances, et connecter Trello à d''autres outils pour gagner du temps.', '/Formation/Trello2.webp', 'Ava Chen', 'Admin Outils', '/Organigramme/femme2.jpeg', true),
  ('session-9', 'Trello | Méthodes de travail', 'Kanban léger, priorisation et rituels', 'Mettre en place un flux simple, définir les priorités, suivre l''avancement et partager l''information efficacement.', '/Formation/Trello3.webp', 'Orlando Diggs', 'Customer Success Lead', '/Organigramme/homme4.jpeg', true),
  ('session-10', 'Jira | Bonnes pratiques & templates', 'Standardiser, documenter et accélérer vos projets', 'Naming, champs personnalisés, templates de projet, conventions d''équipe et astuces pour gagner en qualité et vitesse.', '/Formation/Jira1.png', 'Sarah Dupont', 'Conceptrice de processus', '/Organigramme/femme5.jpeg', false),
  ('session-11', 'Jira | Tableaux Scrum & Kanban', 'Configurer colonnes, WIP et quick filters', 'Mise en place de boards adaptés, limites de travaux en cours, swimlanes et routines quotidiennes pour un flux maîtrisé.', '/Formation/Jira2.png', 'Noah Patel', 'Responsable Formation', '/Organigramme/homme1.jpeg', false),
  ('session-12', 'Jira | Automatisations avancées', 'Chainer triggers, conditions et actions', 'Exemples concrets d''automatisation: assignations dynamiques, champs calculés, transitions conditionnelles et notifications ciblées.', '/Formation/Jira3.png', 'Ava Chen', 'Admin Jira', '/Organigramme/femme2.jpeg', false);

-- Follow-up highlight
insert into followup_highlights (id, titre, type, statut, date_label, temps_restant, progression, image_url)
values (
  'default',
  'Entretien avec le Manager',
  '',
  'Obligatoire',
  'Demain, 10:00',
  '23h 15m',
  8,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBgJaWaQHzAym7Myj6nKZmel-OIlHObEqruU_aBZqtXAtAcMxuGHbPy2gBcN1f1Uj_8nptyYrgbc7OHu9XKpSzRO1XN2yDIuSuEMPdeQGB901zDrRSMg-zKWTk7mgFHzEzbbKhs-3299GMhVNQi6HjnixHg0SdYrNhranA3cuAc_hMLwYF3ZzP8_ZkpCS-MatoxKn1dNhFNMWjf2blA3Ia5Qdejov0fBaVdYlnFd9dX73gv4A8Sg8fSOsLS9fanBViht-k-TyAyajNy'
);

-- Initial follow-up meetings
insert into followup_meetings (id, titre, type, date_label, statut, couleur)
values
  ('meeting-1', 'Entretien avec le Manager', 'Manager', 'Demain, 10:00', 'Obligatoire', 'vert'),
  ('meeting-2', 'Point RH', 'RH', 'La semaine prochaine, 14:00', 'Obligatoire', 'vert'),
  ('meeting-3', 'Synchronisation d''équipe', 'Suivi de projet', 'Dans 2 semaines, 11:00', 'Optionnel', 'orange');

-- Task phases
insert into task_phases (id, name, position) values
  ('phase-setup', 'Setup', 1),
  ('phase-ui', 'UI', 2),
  ('phase-features', 'Features', 3);

insert into tasks (id, phase_id, name, description, status) values
  ('task-setup-init-project', 'phase-setup', 'Init project', 'Créer app Next.js', 'verified'),
  ('task-setup-tailwind', 'phase-setup', 'Setup Tailwind', 'Configurer TailwindCSS', 'verified'),
  ('task-setup-github', 'phase-setup', 'GitHub repo', 'Mettre en place GitHub', 'done'),
  ('task-ui-mockups', 'phase-ui', 'Design mockups', 'Maquettes Figma', 'in-progress'),
  ('task-ui-navbar', 'phase-ui', 'Navbar component', 'Créer une navbar responsive', 'todo'),
  ('task-ui-hero', 'phase-ui', 'Hero section', 'Construire le hero en Bento grid', 'todo'),
  ('task-feature-progress', 'phase-features', 'Progress bar', 'Connecter avec tasks', 'todo'),
  ('task-feature-auth', 'phase-features', 'Auth system', 'Mettre en place Auth', 'todo');

-- Team members
insert into team_members (id, name, role, team, email, avatar, status) values
  ('people-alexandre', 'Alexandre Martin', 'stagiaire', 'Direction Technique', 'alexandre.martin@pixelplay.com', '/Organigramme/homme1.jpeg', 'En onboarding'),
  ('people-emma', 'Emma Dubois', 'Nouvelle recrue', 'Opérations', 'emma.dubois@pixelplay.com', '/Organigramme/femme2.jpeg', 'Actif'),
  ('people-isabelle', 'Isabelle Leroy', 'Nouvelle recrue', 'Ressources Humaines', 'isabelle.leroy@pixelplay.com', '/Organigramme/femme4.jpeg', 'Actif');

-- Documentation links
insert into documentation_links (id, title, description, href, icon_key, category, external) values
  ('doc-charte-graphique', 'Charte Graphique', 'Consultez la Charte Graphique de Pixelpay.', '/Charte Graphique.pdf', 'file', 'Direction Artistique', false),
  ('doc-normes-git', 'Normes Git', 'Consultez les normes sur les commits, les branches, les PRs et plus... de Pixelpay.', '/Normes_Git.pdf', 'laptop', 'Documentations techniques', false),
  ('doc-visuel-xarus', 'Visuel de Xarus', 'Tout les visuel pour le developpement de Xarus.', '/Visuel_de_Xarus.pdf', 'shield', 'Xarus', false),
  ('doc-tactile-xarus', 'Tactile de Xarus', 'Tout les tactile pour le developpement de Xarus.', '/Tactile_de_Xarus.pdf', 'shield', 'Xarus', false),
  ('doc-brainstorming-xarus', 'Brainstorming de Xarus', 'Tout le brainstorming sur le jeux Xarus.', '/Brainstorming_de_Xarus.pdf', 'shield', 'Xarus', false),
  ('doc-visuel-gysxo', 'Visuel de Gysxo', 'Tout les visuel pour le developpement de Gysxo.', '/Visuel_de_Gysxo.pdf', 'shield', 'Gysxo', false),
  ('doc-tactile-gysxo', 'Tactile de Gysxo', 'Tout les tactile pour le developpement de Gysxo.', '/Tactile_de_Gysxo.pdf', 'shield', 'Gysxo', false),
  ('doc-brainstorming-gysxo', 'Brainstorming de Gysxo', 'Tout le brainstorming sur le jeux Gysxo.', '/Brainstorming_de_Gysxo.pdf', 'shield', 'Gysxo', false),
  ('doc-visuel-support', 'Visuel de Support & Ops', 'Tout le visuel pour le developpement de Support & Ops.', '/Visuel_de_Support_&_Ops.pdf', 'shield', 'Support & Ops', false),
  ('doc-tactile-support', 'Tactile de Support & Ops', 'Tout le tactile pour le developpement de Support & Ops.', '/Tactile_de_Support_&_Ops.pdf', 'shield', 'Support & Ops', false),
  ('doc-brainstorming-support', 'Brainstorming de Support & Ops', 'Tout le brainstorming sur le jeux Support & Ops.', '/Brainstorming_de_Support_&_Ops.pdf', 'shield', 'Support & Ops', false);

-- Project folders
insert into project_folders (id, name, description, summary, drive_url, accent_color) values
  ('folder-xarus', 'Xarus', 'Jeux mobile', 'Xarus est un jeu mobile en développement qui mélange aventure et stratégie. Le joueur incarne un explorateur envoyé sur une planète inconnue, Xarus, où il doit survivre, découvrir des ressources et bâtir sa propre base. L’objectif est de progresser à travers différents environnements, affronter des créatures locales et débloquer de nouvelles technologies pour évoluer.\nLe jeu est pensé pour être accessible rapidement (sessions courtes, gameplay intuitif) mais avec une vraie profondeur grâce à des missions, des améliorations et une dimension multijoueur légère (coopération et petits défis entre amis).\nNotre but avec Xarus est de proposer une expérience immersive, fun et progressive, adaptée aux joueurs mobiles qui veulent à la fois se détendre et relever des défis.', 'https://drive.google.com/drive/folders/1bBX0g4-h4U7mK5pGwK_Z3W74Zv-zOo-9', 'from-bleu_fonce_2 to-violet_fonce_1'),
  ('folder-gysxo', 'Gysxo', 'Jeux PS5', 'Gysxo est un jeu d’action-aventure exclusif PS5 qui plonge le joueur dans un univers futuriste en pleine guerre des dimensions. On incarne un héros capable de manipuler la gravité et le temps pour explorer des mondes fragmentés, affronter des ennemis spectaculaires et résoudre des énigmes complexes.\nLe jeu mise sur la puissance graphique de la PS5 et l''immersion du DualSense pour offrir des combats dynamiques, des environnements vivants et une narration cinématographique.\nL''objectif avec Gysxo est de créer une expérience épique, intense et innovante, qui marie gameplay nerveux et scénario riche.', 'https://drive.google.com/drive/folders/1bBX0g4-h4U7mK5pGwK_Z3W74Zv-zOo-9', 'from-bleu_fonce_2 to-violet_fonce_1'),
  ('folder-support', 'Support & Ops', 'Support et Ops', 'Playbooks, scripts d''appels et matrices de décision pour accompagner les marchands Support & Ops. Inclut les procédures d''escalade et KPI clés.', 'https://drive.google.com/drive/folders/1bBX0g4-h4U7mK5pGwK_Z3W74Zv-zOo-9', 'from-bleu_fonce_1 to-violet');

insert into project_folder_documents (id, folder_id, document_id, note) values
  ('pfd-xarus-visuel', 'folder-xarus', 'doc-visuel-xarus', 'Visuel du jeux'),
  ('pfd-xarus-tactile', 'folder-xarus', 'doc-tactile-xarus', 'Tactile du jeux'),
  ('pfd-xarus-brainstorm', 'folder-xarus', 'doc-brainstorming-xarus', 'Notes de l''avancement et des réunions'),
  ('pfd-gysxo-visuel', 'folder-gysxo', 'doc-visuel-gysxo', 'Visuel du jeux'),
  ('pfd-gysxo-tactile', 'folder-gysxo', 'doc-tactile-gysxo', 'Tactile du jeux'),
  ('pfd-gysxo-brainstorm', 'folder-gysxo', 'doc-brainstorming-gysxo', 'Notes de l''avancement et des réunions'),
  ('pfd-support-visuel', 'folder-support', 'doc-visuel-support', 'Contacts partenaires'),
  ('pfd-support-tactile', 'folder-support', 'doc-tactile-support', 'Culture & ton'),
  ('pfd-support-brainstorm', 'folder-support', 'doc-brainstorming-support', 'Sessions de coaching');

-- FAQ items
insert into faq_items (id, question, answer, tags, category) values
  ('faq-structure-doc', 'Comment est structurée la documentation ?', 'La documentation est organisée par rubriques (Guides, Référence API, Exemples, FAQ) avec une navigation latérale et une recherche plein texte pour retrouver rapidement une information. Chaque rubrique contient des sous-sections structurées de manière progressive (de l''introduction aux cas avancés), avec des captures, des extraits de code annotés et des liens croisés vers les parties connexes.\n\nNous distinguons clairement les pages conceptuelles (le pourquoi) des pages de référence (le comment, exhaustif), et proposons des checklists de fin de section pour valider votre compréhension avant de passer à la suite.', ARRAY['général','navigation','documentation'], 'Documentation & Onboarding'),
  ('faq-exemples-code', 'Où trouver des exemples de code réutilisables ?', 'Des snippets sont disponibles dans chaque section ainsi que dans le dossier components/ui. Ils sont pensés pour être copiés-collés tels quels et personnalisés via des props et des classes utilitaires.\n\nNous proposons aussi des exemples complets (pages, flux utilisateur, intégrations API) avec des variantes d’implémentation lorsqu’il existe plusieurs approches possibles (simple vs. scalable). Chaque exemple précise ses prérequis, ses limites, et les pièges courants à éviter.', ARRAY['exemples','snippets','ui'], 'Documentation & Onboarding'),
  ('faq-contribuer', 'Comment contribuer ou signaler un problème ?', 'Pour un bug, ouvrez une issue GitHub en fournissant une description claire, des étapes de reproduction minimales, le comportement attendu/observé, la version de Node et des captures si utile. Les labels (bug, enhancement, docs) aident à prioriser.\n\nPour contribuer, forkez le dépôt, créez une branche nominative (feature/..., fix/...), suivez le template de PR et respectez les conventions de commit. Les PR doivent inclure des tests et/ou une note de migration si nécessaire, ainsi qu’un court résumé des impacts.', ARRAY['github','contribution','issues'], 'Documentation & Onboarding'),
  ('faq-env-setup', 'Comment installer et lancer le projet en local ?', 'Installez Node LTS et pnpm, puis exécutez pnpm install et pnpm dev. Copiez .env.example vers .env.local et renseignez les variables d’environnement (clés API, URL backend, secrets).\n\nSi vous utilisez macOS, vérifiez que les dépendances natives (ex: sharp) compilent correctement. En cas d’erreur, supprimez node_modules et le lockfile puis réinstallez. Lancez ensuite l’app sur http://localhost:3000 et testez les pages clés.', ARRAY['setup','local','env'], 'Documentation & Onboarding'),
  ('faq-styles-tailwind', 'Comment sont gérés les styles (Tailwind) ?', 'Nous utilisons TailwindCSS avec des utilitaires, des composants composables (shadcn/ui) et des helpers comme cn pour fusionner intelligemment les classes (évite les conflits). Les couleurs personnalisées (ex: bg-bleu_fonce_2) sont définies dans la config Tailwind pour uniformiser la charte.\n\nLes composants UI exposent des props de variant/size lorsque pertinent. Respectez la grille de spacing et la typographie par défaut afin de garantir la cohérence visuelle à l’échelle du projet.', ARRAY['tailwind','styles','shadcn'], 'UI & Frontend'),
  ('faq-icones', 'Quelles icônes utilisons-nous ?', 'Le set d''icônes principal est Lucide (lucide-react), moderne et léger. Importez seulement ce dont vous avez besoin (tree-shaking). Conservez des tailles cohérentes (16, 20, 24) et la même épaisseur de trait pour une apparence homogène.\n\nPour des pictos de marque (ex: Google Drive), préférez des assets dédiés (SVG/PNG) avec un alt explicite et un contrôle d’accessibilité approprié.', ARRAY['icônes','lucide'], 'UI & Frontend'),
  ('faq-link-externe', 'Dois-je utiliser Link de Next pour un lien externe ?', 'Ce n’est pas recommandé. Utilisez une balise <a> avec target="_blank" et rel="noopener noreferrer" pour les liens externes. Link est optimisé pour la navigation interne (préchargement, transitions) et n’apporte pas d’avantage pour un site externe.\n\nPensez à signaler visuellement qu’un lien s’ouvre dans un nouvel onglet (icône, texte d’accompagnement) pour améliorer l’UX.', ARRAY['nextjs','link','a'], 'UI & Frontend'),
  ('faq-securite-rel', 'À quoi servent noopener et noreferrer ?', 'noopener empêche la page ouverte via target="_blank" d’accéder à window.opener, ce qui neutralise les attaques de tabnabbing et isole mieux le contexte. noreferrer supprime l’en-tête Referer, améliorant la confidentialité (mais peut impacter l’attribution analytique).\n\nEn pratique, utilisez rel="noopener noreferrer" par défaut. Si vous avez besoin du Referer pour la mesure, gardez rel="noopener" seul.', ARRAY['sécurité','liens'], 'UI & Frontend'),
  ('faq-auth-workflow', 'Quel est le flux d''authentification ?', 'La page /login gère la saisie utilisateur et la validation de base (format d’e-mail, règles de mot de passe). Après soumission, le serveur vérifie les identifiants et renvoie un jeton/session. Côté client, nous stockons de manière sécurisée et attachons les en-têtes d’auth aux requêtes suivantes.\n\nLes rôles et permissions sont contrôlés au niveau des pages et des composants sensibles. Les routes critiques sont protégées, et des redirections sont appliquées si l’utilisateur n’a pas les droits.', ARRAY['auth','sécurité'], 'Architecture & Performance'),
  ('faq-perf-optim', 'Quelles sont les optimisations de performance clés ?', 'Nous utilisons le code splitting et le lazy-loading pour réduire le temps de chargement initial. Les composants très dynamiques sont mémorisés (memo/useMemo) pour limiter les re-rendus, et les longues listes sont virtualisées.\n\nLes images sont optimisées (formats modernes, dimensions explicites), le payload JS est surveillé, et les dépendances lourdes sont chargées de manière conditionnelle ou remplacées par des alternatives plus légères lorsque possible.', ARRAY['performance','optimisation'], 'Architecture & Performance'),
  ('faq-images-next', 'Quand utiliser next/image ?', 'Utilisez next/image dès que l’image est significative pour le rendu (photos, illustrations) afin de bénéficier du redimensionnement, du lazy-loading, des formats optimisés et du cache. Déclarez toujours width/height et un alt pertinent.\n\nPour des icônes ou pictos simples, un composant SVG inline peut être plus indiqué et plus léger qu’une image raster.', ARRAY['images','next/image'], 'UI & Frontend'),
  ('faq-deploy-vercel', 'Comment se passe le déploiement sur Vercel ?', 'Chaque push sur la branche principale déclenche un déploiement automatique. Les Pull Requests génèrent des Preview Deployments pour faciliter la revue visuelle et fonctionnelle.\n\nLes variables d’environnement sont gérées dans le dashboard Vercel par environnement (dev/preview/prod). Surveillez les logs et les métriques (Edge/Functions) pour diagnostiquer rapidement en cas d’échec.', ARRAY['vercel','deploy'], 'Ops & Qualité'),
  ('faq-tests', 'Comment sont gérés les tests ?', 'Les tests unitaires (Vitest/Jest) ciblent la logique pure et les composants isolés. Les tests d’intégration valident le dialogue entre modules, et les tests E2E (Playwright) simulent les parcours critiques utilisateur.\n\nNous visons des tests rapides, déterministes, avec des fixtures claires et une séparation nette entre mocks et vraies dépendances. Les PR qui modifient la logique métier doivent inclure des tests.', ARRAY['tests','qualité'], 'Ops & Qualité'),
  ('faq-accessibilite', 'Quelles bonnes pratiques d''accessibilité ?', 'Assurez des contrastes suffisants, des tailles de cible adéquates, un focus visible, et des libellés explicites. Utilisez des rôles/attributs ARIA uniquement en complément d’une sémantique HTML correcte.\n\nTestez systématiquement à la navigation clavier, avec un lecteur d’écran sur les pages importantes, et évitez les pièges (texte comme image, contenu uniquement au survol).', ARRAY['a11y','accessibilité'], 'Architecture & Performance'),
  ('faq-erreurs-communes', 'Erreurs courantes et solutions ?', '1) Chemins alias incorrects: vérifiez la config tsconfig/baseUrl/paths et importez via ''@/...''. 2) Classes Tailwind dynamiques: évitez les interpolations non déclaratives; préférez les variantes ou ajoutez une safelist si nécessaire. 3) Liens externes: toujours utiliser rel="noopener noreferrer" avec target="_blank".\n\nBonus: surveillez les warnings de build, contrôlez les tailles de bundles, et utilisez des ESLint rules adaptées pour prévenir les régressions.', ARRAY['debug','pièges'], 'Ops & Qualité');

-- Organigram
insert into org_nodes (id, parent_id, name, title, image, team_size, sort_order) values
  ('ceo', null, 'Clémence Moreau', 'CEO', '/Organigramme/femme1.jpeg', null, 1),
  ('cto', 'ceo', 'Alexandre Martin', 'CTO', '/Organigramme/homme1.jpeg', null, 1),
  ('vp-data', 'cto', 'Hervé Adam', 'VP Data', '/Organigramme/homme2.jpeg', null, 1),
  ('dir-data-a', 'vp-data', 'Sarah Colin', 'Director', '/Organigramme/femme7.jpeg', 8, 1),
  ('dir-data-b', 'vp-data', 'Nadia Lefèvre', 'Director', '/Organigramme/femme8.jpeg', 7, 2),
  ('coo', 'ceo', 'Emma Dubois', 'COO', '/Organigramme/femme2.jpeg', null, 2),
  ('vp-ops', 'coo', 'Jean Wright', 'VP Ops', '/Organigramme/homme3.jpeg', 18, 1),
  ('vp-hr', 'coo', 'Isabelle Leroy', 'VP HR', '/Organigramme/femme4.jpeg', 10, 2),
  ('vp-eng', 'coo', 'Sophie Clerc', 'VP Eng', '/Organigramme/femme3.jpeg', null, 3),
  ('dir-eng-a', 'vp-eng', 'Marc Évrard', 'Director', '/Organigramme/homme4.jpeg', 14, 1),
  ('dir-eng-b', 'vp-eng', 'Grace Millet', 'Director', '/Organigramme/femme5.jpeg', 12, 2),
  ('cfo', 'ceo', 'Alexis Giraud', 'CFO', '/Organigramme/homme6.jpeg', null, 3),
  ('vp-fin-a', 'cfo', 'Thérèse Vardon', 'VP Finance', '/Organigramme/femme6.jpeg', 9, 1),
  ('vp-sales', 'cfo', 'Victor Roussel', 'VP Sales', '/Organigramme/homme6.jpeg', null, 2),
  ('dir-sales-a', 'vp-sales', 'Sabrina Colin', 'Director', '/Organigramme/femme7.jpeg', 12, 1),
  ('vp-fin-b', 'cfo', 'Laurent Perrot', 'VP Finance', '/Organigramme/homme5.jpeg', 8, 3);
