# basculer-adresse-paris.ps1 — passe le siege de Beziers a Paris sur studio.onn-off.fr.
#
# POURQUOI. La domiciliation a change : le siege est desormais
# 59 rue de Ponthieu, Bureau 326, 75008 Paris. L'adresse figurait a 52 endroits
# repartis sur 10 pages — mentions legales, CGV, confidentialite, mais aussi les
# titres, les descriptions, le pied de page repete partout et le JSON-LD que
# Google lit pour situer l'entreprise. En oublier un seul laisse Google croire
# que le studio est toujours dans l'Herault.
#
# CE QU'ON NE TOUCHE PAS : « RCS Beziers ». Le greffe reste celui de Beziers
# tant que le Kbis n'est pas arrive. C'est aussi ce qu'affichent onn-off.fr et
# site-onn.fr aujourd'hui — les trois sites restent donc coherents entre eux.
# Le jour ou le Kbis arrive, c'est une passe separee sur les trois.
#
# SIMULATION par defaut : rien n'est ecrit sans -Apply.
#
#   .\basculer-adresse-paris.ps1
#   .\basculer-adresse-paris.ps1 -Apply
#
# Le depot git fait office de sauvegarde : `git checkout .` annule tout.

param([switch]$Apply)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

# Jeton de protection : « RCS Beziers » et « R.C.S. de Beziers » doivent
# survivre au remplacement general de « Beziers » qui vient ensuite.
$GARDE = '@@RCS_GREFFE@@'

$remplacements = [ordered]@{
  # 1. Protection du greffe (retiree en fin de parcours)
  # Le jeton ne remplace QUE le nom de ville : le prefixe « RCS » doit rester
  # dans le texte, sinon la restauration finale le perd. Paye au premier essai,
  # ou le pied de page est devenu « Onn-Off (EI) · Beziers 490 649 233 ».
  'RCS Béziers'                    = "RCS $GARDE"
  'R.C.S. de Béziers'              = "R.C.S. de $GARDE"

  # 2. Adresse postale complete
  'Résidence la Petite Odyssée, 537 Chemin Rural Trois, 34500 Béziers, France' =
    '59 rue de Ponthieu, Bureau 326, 75008 Paris, France'

  # 3. JSON-LD : localite, code postal, region, zone couverte
  '"addressLocality": "Béziers", "postalCode": "34500", "addressRegion": "Occitanie"' =
    '"streetAddress": "59 rue de Ponthieu, Bureau 326", "addressLocality": "Paris", "postalCode": "75008", "addressRegion": "Île-de-France"'
  '["Hérault", "Aude", "Pyrénées-Orientales", "Occitanie", "France"]' =
    '["Paris", "Île-de-France", "France"]'

  # 4. Mentions redactionnelles
  'Béziers, Occitanie'             = 'Paris, Île-de-France'
}

$fichiers = Get-ChildItem $root -Filter '*.html' -File
$total = 0
$detail = @()

foreach ($f in $fichiers) {
  $txt = [System.IO.File]::ReadAllText($f.FullName)
  $avant = $txt
  $n = 0

  foreach ($k in $remplacements.Keys) {
    $c = ([regex]::Matches($txt, [regex]::Escape($k))).Count
    if ($c -gt 0) { $n += $c; $txt = $txt.Replace($k, $remplacements[$k]) }
  }

  # 5. Tout « Béziers » restant est une mention de ville, pas le greffe :
  #    titres, descriptions, pied de page, texte courant.
  $c = ([regex]::Matches($txt, 'Béziers')).Count
  if ($c -gt 0) { $n += $c; $txt = $txt.Replace('Béziers', 'Paris') }

  # 6. On rend son nom au greffe.
  $txt = $txt.Replace($GARDE, 'Béziers')

  if ($txt -ne $avant) {
    $total += $n
    $detail += [pscustomobject]@{ Fichier = $f.Name; Occurrences = $n }
    if ($Apply) {
      # UTF-8 sans BOM : c'est ce que sont deja ces fichiers, et un BOM
      # ajoute se verrait en tete de page dans certains navigateurs.
      [System.IO.File]::WriteAllText($f.FullName, $txt,
        (New-Object System.Text.UTF8Encoding($false)))
    }
  }
}

$detail | Format-Table -AutoSize
Write-Host ""
if ($Apply) {
  Write-Host "$total occurrence(s) remplacee(s) dans $($detail.Count) fichier(s)."
  Write-Host "Verifie, puis : git add -A ; git commit ; git push  (Vercel publie tout seul)"
} else {
  Write-Host "SIMULATION — $total occurrence(s) seraient remplacees dans $($detail.Count) fichier(s)."
  Write-Host "Relance avec -Apply pour ecrire."
}
