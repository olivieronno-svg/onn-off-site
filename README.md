# ONN/OFF — Site officiel

Portfolio des applications mobiles d'**Onn-Off Studio**, studio indépendant de développement basé à Béziers (France).

🔗 **Site en ligne** : [onnoff.github.io](https://olivieronno-svg.github.io/onn-off-site/)

---

## 📱 Applications présentées

| App | Type | Statut |
|-----|------|--------|
| **Ambu Time** | Calcul heures + salaire ambulanciers (vocal) | ✅ Google Play |
| **Medblocks** | Jeu éducatif de puzzles — gestes de secours | ✅ Google Play + App Store |
| **Vital IA** | Assistant IA d'urgence pour soignants (bilan SAMU vocal, doses, O2) | 🟡 Beta — Test fermé |

---

## 🧰 Stack technique du site

- HTML / CSS vanilla (single-file)
- Polices : Unbounded, Outfit, JetBrains Mono (Google Fonts)
- Pas de framework, pas de build step, pas de dépendances JS
- Hébergement : GitHub Pages
- ~30 KB compressé + 4 assets PNG/SVG

---

## 📂 Structure

```
.
├── index.html          # Page principale
├── favicon.svg         # Favicon vectoriel
└── assets/
    ├── onnoff-logo.png      # Logo principal du studio
    ├── ambutime-icon.png    # Logo Ambu Time
    ├── medblocks-icon.png   # Logo Medblocks
    └── vitalia-icon.png     # Logo Vital IA
```

---

## 🚀 Déploiement

Le site est déployé via **GitHub Pages**.

### Première mise en ligne

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/olivieronno-svg/onn-off-site.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Source : `main` / `(root)` → Save**.

Le site sera live à `https://olivieronno-svg.github.io/onn-off-site/` en 1-2 minutes.

### Mises à jour suivantes

```bash
git add .
git commit -m "Description du changement"
git push
```

---

## 📋 À mettre à jour quand les apps évoluent

- **Vital IA publié en production** → dans `index.html`, remplacer le bloc `store-btn beta` par `store-btn active live` et y ajouter l'URL Play Store réelle
- **Ambu Time sur App Store** → remplacer le bloc `store-btn disabled` (avec le badge "Soon") par `store-btn active live` + URL réelle
- **Nouvelle app** → dupliquer une `<article class="app-card ...">` existante, ajuster `app-tag`, `app-desc`, logo dans `assets/`, et ajouter la couleur d'accent dans le CSS (`--accent` par classe `.app-xxx`)

---

## 📧 Contact

**Olivier Onno** — onnoff1975@gmail.com  
Auto-entrepreneur · APE 62.01Z (programmation informatique)  
Béziers · Occitanie · France

---

## ⚖️ Licence

© 2026 ONN/OFF — Tous droits réservés.

Le code de ce site est privé et propriétaire. Les noms et logos des applications présentées (Ambu Time, Medblocks, Vital IA) sont des marques de Onn-Off Studio.
