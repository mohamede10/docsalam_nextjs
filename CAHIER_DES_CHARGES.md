# Cahier des Charges - DocSalam Platform

## 1. Présentation du Projet

### 1.1 Contexte
DocSalam est une plateforme de santé en ligne destinée à connecter les patients avec les médecins et professionnels de santé en Afrique, notamment en Guinée. La plateforme permet de prendre des rendez-vous en ligne, de consulter via vidéoconférence, et d'accéder à divers services médicaux.

### 1.2 Objectifs
- Faciliter l'accès aux soins de santé pour les patients
- Permettre aux médecins de gérer leurs consultations en ligne
- Offrir une expérience utilisateur moderne et intuitive
- Assurer la sécurité et la confidentialité des données médicales
- Rendre l'application accessible via PWA (Progressive Web App)

### 1.3 Technologies Utilisées
- **Frontend** : Next.js 16.4.3, React 19.3.0, TypeScript
- **Styling** : Tailwind CSS v4
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **ORM** : Prisma (en cours de configuration)
- **PWA** : @ducanh2912/next-pwa
- **Icons** : Font Awesome

---

## 2. Architecture de l'Application

### 2.1 Structure du Projet
```
docsalm_nextjs/
├── src/
│   ├── app/              # Pages et routes Next.js
│   ├── components/       # Composants réutilisables
│   ├── lib/              # Bibliothèques utilitaires
│   └── utils/            # Utilitaires Supabase
├── public/               # Assets statiques
├── prisma/               # Schéma de base de données
└── next.config.ts        # Configuration Next.js
```

### 2.2 Rôles Utilisateurs
- **PATIENT** : Peut rechercher des médecins, prendre rendez-vous, consulter en ligne
- **DOCTOR** : Peut gérer ses rendez-vous, consulter les patients, prescrire des médicaments
- **ADMIN** : Peut gérer l'ensemble de la plateforme (utilisateurs, rendez-vous, contenu)

---

## 3. Fonctionnalités Principales

### 3.1 Pages Publiques

#### 3.1.1 Page d'Accueil (`/`)
- **Contenu** :
  - Carousel d'images médicales
  - Personnage animé DocSalam
  - Section de recherche (spécialité, pays, ville)
  - Compteurs animés (médecins, consultations, patients)
  - Section "À propos" avec étapes visuelles
  - Section "Comment ça marche"
- **Fonctionnalités** :
  - Navigation vers les différentes sections
  - Bouton "Prendre Rendez-vous"

#### 3.1.2 Page À Propos (`/about`)
- **Contenu** :
  - Hero section avec image médicale
  - Grille d'images médicales
  - Description de DocSalam
  - Sections Objectifs, Missions, Vision
  - Valeurs (Empathie, Sécurité, Accessibilité, Innovation)

#### 3.1.3 Page Services (`/services`)
- **Contenu** :
  - Services pour les Patients (4 services)
  - Services pour les Professionnels (4 services)
  - Services pour les Établissements (3 services)
  - Section Urgences 24/7

#### 3.1.4 Page Contact (`/contact`)
- **Contenu** :
  - Formulaire de contact
  - Google Maps intégré (Conakry, Guinée)
  - Informations de contact
- **Fonctionnalités** :
  - Envoi de messages de contact
  - Validation du formulaire

#### 3.1.5 Page FAQ (`/faq`)
- **Contenu** :
  - Questions fréquentes
  - Réponses détaillées

#### 3.1.6 Page Mentions Légales (`/legal`)
- **Contenu** :
  - Conditions d'utilisation
  - Politique de confidentialité
  - Mentions légales

### 3.2 Authentification

#### 3.2.1 Inscription (`/auth/register`)
- **Champs** :
  - Nom, Prénom
  - Email
  - Mot de passe
  - Rôle (Patient/Docteur)
  - Pour les médecins : Spécialité, Hôpital, Licence
- **Fonctionnalités** :
  - Validation des données
  - Création du compte Supabase
  - Enregistrement dans la base de données

#### 3.2.2 Connexion (`/auth/login`)
- **Champs** :
  - Email
  - Mot de passe
- **Fonctionnalités** :
  - Authentification Supabase
  - Redirection selon le rôle
  - Gestion des erreurs

#### 3.2.3 Mot de passe oublié (`/auth/forgot-password`)
- **Champs** :
  - Email
- **Fonctionnalités** :
  - Envoi de lien de réinitialisation
  - Validation de l'email

#### 3.2.4 Réinitialisation du mot de passe (`/auth/reset-password`)
- **Champs** :
  - Nouveau mot de passe
  - Confirmation
- **Fonctionnalités** :
  - Mise à jour du mot de passe
  - Validation

### 3.3 Recherche de Médecins

#### 3.3.1 Liste des Médecins (`/doctors`)
- **Filtres** :
  - Spécialité
  - Pays
  - Ville (chargement dynamique selon le pays)
  - Statut (actif/en attente)
- **Fonctionnalités** :
  - Affichage des médecins avec photo, nom, spécialité
  - Recherche en temps réel
  - Compteur de résultats
  - Bouton "Réserver" et "Messagerie"

#### 3.3.2 Profil du Médecin (`/doctors/[id]`)
- **Contenu** :
  - Photo et informations du médecin
  - Spécialité, Hôpital, Licence
  - Description
  - Notes et avis
- **Fonctionnalités** :
  - Formulaire de réservation de rendez-vous
  - Sélection de la plateforme vidéo (Google Meet, Zoom, Teams, Jitsi)
  - Bouton de messagerie directe

### 3.4 Gestion des Rendez-vous

#### 3.4.1 Création de Rendez-vous
- **Champs** :
  - ID du médecin
  - Date
  - Heure
  - Notes
  - Plateforme vidéo
- **Fonctionnalités** :
  - Validation de la disponibilité
  - Génération automatique du lien vidéo
  - Confirmation par email
  - Création d'une référence unique

#### 3.4.2 Détails du Rendez-vous (`/appointments/[id]`)
- **Contenu** :
  - Informations du rendez-vous
  - Lien de vidéoconférence
  - Statut (PENDING, CONFIRMED, COMPLETED, CANCELLED)
  - Statut vidéo (PENDING, ACTIVE, ENDED)
- **Fonctionnalités** :
  - Bouton "Rejoindre la réunion"
  - Bouton "Terminer la réunion"
  - Copie du lien vidéo
  - Actions : Confirmer, Annuler
  - Contacter le médecin/patient

### 3.5 Consultations Médicales

#### 3.5.1 Page des Consultations (`/consultations`)
- **Fonctionnalités** :
  - Liste des consultations pour les médecins
  - Liste des consultations pour les patients
  - Création de nouvelles consultations (médecins seulement)
  - Filtres par date et statut

#### 3.5.2 Création de Consultation
- **Champs** :
  - ID du patient
  - Date
  - Diagnostic
  - Prescription
  - Notes
- **Fonctionnalités** :
  - Enregistrement dans la base de données
  - Association avec le rendez-vous

### 3.6 Vidéoconférence

#### 3.6.1 Plateformes Supportées
- Google Meet
- Zoom
- Microsoft Teams
- Jitsi Meet

#### 3.6.2 Fonctionnalités
- Génération automatique des liens vidéo
- Suivi du statut de la vidéo
- Intégration dans les rendez-vous
- Support du mode plein écran

### 3.7 Messagerie

#### 3.7.1 Page de Messagerie (`/messages`)
- **Fonctionnalités** :
  - Liste des conversations
  - Chat en temps réel
  - Notifications en temps réel
  - Support des pièces jointes (optionnel)

#### 3.7.2 API Messages
- GET : Récupérer les messages
- POST : Envoyer un nouveau message
- Support des conversations individuelles

### 3.8 Notifications

#### 3.8.1 Page des Notifications (`/notifications`)
- **Fonctionnalités** :
  - Liste des notifications de l'utilisateur
  - Marquage comme lu (individuel ou tout)
  - Suppression de notifications
  - Compteur de notifications non lues
  - Abonnement en temps réel avec Supabase

#### 3.8.2 Types de Notifications
- Nouveau rendez-vous
- Confirmation de rendez-vous
- Nouveau message
- Mise à jour de consultation
- Annonces importantes

### 3.9 Paiements

#### 3.9.1 Page des Paiements (`/payments`)
- **Contenu** :
  - Historique des paiements
  - Statistiques (total payé, en attente)
  - Méthodes de paiement
- **Fonctionnalités** :
  - Affichage des transactions
  - Filtres par date et statut

#### 3.9.2 Méthodes de Paiement
- Orange Money
- MTN Mobile Money
- Visa
- (Autres à ajouter selon les besoins)

#### 3.9.3 API Paiements
- GET : Récupérer les paiements d'un utilisateur
- POST : Créer un nouveau paiement avec référence unique

### 3.10 Formations Médicales

#### 3.10.1 Page des Formations (`/formations`)
- **Contenu** :
  - Liste des formations disponibles
  - Prix et dates
  - Description détaillée
- **Fonctionnalités** :
  - Inscription aux formations
  - Modal de confirmation
  - Vérification si déjà inscrit

#### 3.10.2 API Formations
- GET : Récupérer les formations (avec ou sans inscriptions)
- POST : Créer une nouvelle formation (admin seulement)

#### 3.10.3 API Inscriptions
- POST : S'inscrire à une formation

### 3.11 Services d'Urgence

#### 3.11.1 Page des Urgences (`/emergency`)
- **Contenu** :
  - Liste des services d'urgence
  - Pharmacies, Cliniques, Hôpitaux, Ambulances
  - Horaires, adresses, téléphones
- **Fonctionnalités** :
  - Filtres par type de service
  - Filtres par localisation
  - Alerte d'urgence (numéro 15)

#### 3.11.2 API Emergency
- GET : Récupérer les services d'urgence avec filtres
- POST : Créer un nouveau service d'urgence (admin seulement)

### 3.12 Annonces et News

#### 3.12.1 Page des Annonces (`/news`)
- **Contenu** :
  - Liste des annonces publiées
  - Titre, description, date d'expiration
- **Fonctionnalités** :
  - Affichage des annonces actives
  - Masquage des annonces expirées

### 3.13 Dashboard

#### 3.13.1 Dashboard Patient (`/dashboard/patient`)
- **Contenu** :
  - Résumé des rendez-vous
  - Statistiques
  - Rendez-vous à venir
  - Historique des consultations
- **Fonctionnalités** :
  - Navigation rapide
  - Actions rapides

#### 3.13.2 Dashboard Docteur (`/dashboard/doctor`)
- **Contenu** :
  - Résumé des rendez-vous
  - Patients à consulter
  - Statistiques
  - Consultations du jour
- **Fonctionnalités** :
  - Gestion rapide des rendez-vous
  - Accès aux consultations

#### 3.13.3 Dashboard Admin (`/dashboard/admin`)
- **Contenu** :
  - Statistiques globales
  - Médecins en attente d'activation
  - Rapports
- **Fonctionnalités** :
  - Navigation vers les pages admin

### 3.14 Administration

#### 3.14.1 Gestion des Médecins (`/admin/doctors`)
- **Fonctionnalités** :
  - Liste des médecins
  - Activation/Désactivation
  - Suppression
  - Filtres par statut

#### 3.14.2 Gestion des Patients (`/admin/patients`)
- **Fonctionnalités** :
  - Liste des patients
  - Suppression
  - Statistiques

#### 3.14.3 Gestion des Rendez-vous (`/admin/appointments`)
- **Fonctionnalités** :
  - Liste des rendez-vous
  - Modification de statut
  - Suppression
  - Filtres par date et statut

### 3.15 Profil Utilisateur

#### 3.15.1 Page de Profil (`/profile`)
- **Contenu** :
  - Informations personnelles
  - Photo de profil
  - Spécificités selon le rôle
- **Fonctionnalités** :
  - Modification des informations
  - Mise à jour de la photo
  - Changement de mot de passe

---

## 4. Progressive Web App (PWA)

### 4.1 Fonctionnalités PWA
- **Installation** : Bouton d'installation dans l'interface
- **Mode Offline** : Service worker pour le cache
- **Icône d'application** : Icône personnalisée
- **Mode Plein Écran** : Application native-like
- **Manifest** : Configuration complète du manifest

### 4.2 Configuration
- **Manifest** : `public/manifest.json`
- **Service Worker** : Généré automatiquement par @ducanh2912/next-pwa
- **Enregistrement** : Script dans le layout principal
- **Popup d'installation** : Composant PWAInstallPrompt

### 4.3 Conditions d'Installation
- Application servie via HTTPS ou localhost
- Navigateur supportant les PWA (Chrome, Edge, Safari iOS)
- Utilisateur n'ayant pas déjà installé l'application

---

## 5. Base de Données

### 5.1 Tables Principales

#### Users
- `id` : UUID (PK)
- `email` : String (unique)
- `password_hash` : String
- `first_name` : String
- `last_name` : String
- `role` : Enum (PATIENT, DOCTOR, ADMIN)
- `phone` : String
- `address` : String
- `city` : String
- `country` : String
- `avatar_url` : String
- `created_at` : Timestamp
- `updated_at` : Timestamp

#### Doctors (extension de Users)
- `user_id` : UUID (FK)
- `specialty` : String
- `hospital` : String
- `license_number` : String
- `experience_years` : Integer
- `consultation_fee` : Decimal
- `bio` : Text
- `status` : Enum (ACTIVE, PENDING, INACTIVE)

#### Appointments
- `id` : UUID (PK)
- `patient_id` : UUID (FK)
- `doctor_id` : UUID (FK)
- `date` : Date
- `time` : Time
- `status` : Enum (PENDING, CONFIRMED, COMPLETED, CANCELLED)
- `notes` : Text
- `reference` : String (unique)
- `video_platform` : Enum (GOOGLE_MEET, ZOOM, TEAMS, JITSI)
- `video_status` : Enum (PENDING, ACTIVE, ENDED)
- `video_link` : String
- `created_at` : Timestamp
- `updated_at` : Timestamp

#### Consultations
- `id` : UUID (PK)
- `appointment_id` : UUID (FK)
- `doctor_id` : UUID (FK)
- `patient_id` : UUID (FK)
- `diagnosis` : Text
- `prescription` : Text
- `notes` : Text
- `created_at` : Timestamp
- `updated_at` : Timestamp

#### Messages
- `id` : UUID (PK)
- `sender_id` : UUID (FK)
- `receiver_id` : UUID (FK)
- `content` : Text
- `read` : Boolean
- `created_at` : Timestamp

#### Payments
- `id` : UUID (PK)
- `user_id` : UUID (FK)
- `appointment_id` : UUID (FK)
- `amount` : Decimal
- `method` : String
- `status` : Enum (PENDING, COMPLETED, FAILED)
- `reference` : String (unique)
- `created_at` : Timestamp

#### Formations
- `id` : UUID (PK)
- `title` : String
- `description` : Text
- `price` : Decimal
- `start_date` : Date
- `end_date` : Date
- `max_participants` : Integer
- `created_at` : Timestamp

#### FormationRegistrations
- `id` : UUID (PK)
- `formation_id` : UUID (FK)
- `user_id` : UUID (FK)
- `registered_at` : Timestamp

#### EmergencyServices
- `id` : UUID (PK)
- `name` : String
- `type` : Enum (PHARMACY, CLINIC, HOSPITAL, AMBULANCE)
- `address` : String
- `phone` : String
- `hours` : String
- `city` : String
- `country` : String
- `latitude` : Decimal
- `longitude` : Decimal

#### Announcements
- `id` : UUID (PK)
- `title` : String
- `content` : Text
- `type` : Enum (INFO, WARNING, URGENT)
- `expires_at` : Timestamp
- `created_at` : Timestamp

#### Notifications
- `id` : UUID (PK)
- `user_id` : UUID (FK)
- `type` : String
- `title` : String
- `message` : Text
- `read` : Boolean
- `created_at` : Timestamp

#### Specialties
- `id` : UUID (PK)
- `name` : String
- `description` : Text

#### Cities
- `id` : UUID (PK)
- `name` : String
- `country` : String

### 5.2 Relations
- Users → Doctors (1:1)
- Users → Appointments (1:N as patient)
- Doctors → Appointments (1:N as doctor)
- Appointments → Consultations (1:1)
- Users → Messages (1:N as sender)
- Users → Messages (1:N as receiver)
- Users → Payments (1:N)
- Users → FormationRegistrations (1:N)
- Formations → FormationRegistrations (1:N)
- Users → Notifications (1:N)

---

## 6. API Routes

### 6.1 Authentification
- `POST /api/auth/register` : Inscription
- `POST /api/auth/login` : Connexion
- `POST /api/auth/logout` : Déconnexion
- `GET /api/auth/user` : Utilisateur courant

### 6.2 Rendez-vous
- `GET /api/appointments` : Liste des rendez-vous
- `POST /api/appointments` : Créer un rendez-vous
- `PATCH /api/appointments` : Mettre à jour un rendez-vous
- `DELETE /api/appointments/[id]` : Supprimer un rendez-vous

### 6.3 Consultations
- `GET /api/consultations` : Liste des consultations
- `POST /api/consultations` : Créer une consultation
- `PATCH /api/consultations/[id]` : Mettre à jour une consultation

### 6.4 Messages
- `GET /api/messages` : Liste des messages
- `POST /api/messages` : Envoyer un message

### 6.5 Paiements
- `GET /api/payments` : Liste des paiements
- `POST /api/payments` : Créer un paiement

### 6.6 Formations
- `GET /api/formations` : Liste des formations
- `POST /api/formations` : Créer une formation (admin)
- `POST /api/formations/register` : S'inscrire à une formation

### 6.7 Services d'Urgence
- `GET /api/emergency` : Liste des services d'urgence
- `POST /api/emergency` : Créer un service (admin)

### 6.8 Notifications
- `GET /api/notifications` : Liste des notifications
- `PATCH /api/notifications/[id]` : Marquer comme lu
- `DELETE /api/notifications/[id]` : Supprimer une notification

---

## 7. Sécurité

### 7.1 Authentification
- Utilisation de Supabase Auth
- JWT tokens pour les sessions
- Refresh tokens automatiques
- Protection des routes par middleware

### 7.2 Autorisation
- Vérification des rôles (PATIENT, DOCTOR, ADMIN)
- Middleware pour protéger les routes
- RLS (Row Level Security) sur Supabase

### 7.3 Validation
- Validation des formulaires avec Zod
- Validation côté serveur
- Sanitization des inputs

### 7.4 Données Sensibles
- Chiffrement des mots de passe avec bcrypt
- Protection des données médicales
- Logs d'audit pour les actions sensibles

---

## 8. Performance

### 8.1 Optimisation
- Next.js 16 avec Cache Components
- Partial Prefetching
- Optimisation des images avec Next.js Image
- Service Worker pour le cache PWA

### 8.2 SEO
- Métadonnées optimisées
- Sitemap (à implémenter)
- Open Graph tags (à implémenter)

---

## 9. Accessibilité

### 9.1 Standards
- Conformité WCAG 2.1
- Support des lecteurs d'écran
- Navigation au clavier
- Contraste des couleurs

### 9.2 Internationalisation
- Langue principale : Français
- Possibilité d'ajouter d'autres langues (à implémenter)

---

## 10. Déploiement

### 10.1 Environnement
- **Développement** : Localhost
- **Production** : Vercel, Netlify, ou autre hébergement Next.js
- **Base de données** : Supabase Cloud

### 10.2 Variables d'Environnement
- `NEXT_PUBLIC_SUPABASE_URL` : URL du projet Supabase
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` : Clé publique Supabase
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service (pour les opérations admin)

---

## 11. Maintenance

### 11.1 Monitoring
- Logs d'erreurs
- Analytics (à implémenter)
- Performance monitoring (à implémenter)

### 11.2 Sauvegardes
- Sauvegardes automatiques Supabase
- Logs d'audit

---

## 12. Roadmap Future

### 12.1 Fonctionnalités à venir
- Notifications push
- Intégration SMS pour les rappels
- Système d'avis et notes
- Système de recommandation
- Télémédecine avancée (partage de fichiers, examens)
- Intégration avec les systèmes de santé existants
- Application mobile native (React Native)

### 12.2 Améliorations
- Optimisation du SEO
- Internationalisation complète
- Tests automatisés
- CI/CD pipeline

---

## 13. Conclusion

DocSalam est une plateforme complète de santé en ligne qui répond aux besoins des patients et des médecins en Afrique. L'application est conçue pour être moderne, sécurisée, et accessible via PWA pour une expérience utilisateur optimale.

La plateforme utilise les technologies les plus récentes (Next.js 16, Supabase, Tailwind CSS) pour assurer performance et scalabilité.

---

**Document Version** : 1.0
**Date** : 2025
**Auteur** : Devin AI
