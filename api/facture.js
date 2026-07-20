// Envoi des factures acquittées FORM-ONN (Vercel Serverless Function).
// Appelée par form-onn.web.app après paiement : vérifie le jeton Firebase du centre
// connecté puis envoie la facture PDF par e-mail via Brevo (copie à ONN/OFF Studio).
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY; // clé Web publique form-onn (définie en variable d'env Vercel)

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://form-onn.web.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
    return;
  }
  if (!FIREBASE_API_KEY) {
    res.status(500).json({ ok: false, error: 'Configuration serveur incomplète (FIREBASE_API_KEY)' });
    return;
  }

  const { idToken = '', destinataire = '', nomCentre = '', numero = '',
          montant = '', designation = '', pdfBase64 = '' } = req.body || {};

  if (!idToken || !destinataire || !numero || !pdfBase64) {
    res.status(400).json({ ok: false, error: 'Champs manquants' });
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(destinataire)) {
    res.status(400).json({ ok: false, error: 'E-mail invalide' });
    return;
  }
  if (pdfBase64.length > 2_000_000) {
    res.status(413).json({ ok: false, error: 'PDF trop volumineux' });
    return;
  }

  // Authentification : seul un compte Firebase du projet form-onn peut envoyer
  const verif = await fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY,
    { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }) }
  );
  if (!verif.ok) {
    res.status(401).json({ ok: false, error: 'Jeton invalide' });
    return;
  }

  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'FORM-ONN — ONN/OFF Studio', email: 'contact@onn-off.fr' },
      to: [{ email: destinataire, name: nomCentre || destinataire }],
      bcc: [{ email: 'contact@onn-off.fr', name: 'ONN/OFF Studio' }],
      subject: 'FORM-ONN — Facture acquittée ' + numero + ' (' + montant + ' € HT)',
      htmlContent:
        '<p>Bonjour,</p>' +
        '<p>Merci pour votre commande sur <b>FORM-ONN</b>. Votre licence est active : ' +
        'vos apprenants ont accès à la formation dès maintenant.</p>' +
        '<p><b>Facture acquittée n° ' + numero + '</b> — ' + montant + ' € HT<br>' +
        designation + '</p>' +
        '<p>La facture PDF est jointe à ce message.</p>' +
        '<p>Rappel : vos apprenants se connectent sur ' +
        '<a href="https://form-onn.web.app/apprenant.html">form-onn.web.app/apprenant.html</a> ' +
        'avec leur e-mail et le code formation que vous leur communiquez.</p>' +
        '<p>— ONN/OFF Studio · contact@onn-off.fr</p>',
      attachment: [{ name: 'Facture-' + numero + '.pdf', content: pdfBase64 }],
    }),
  });

  if (!r.ok) {
    res.status(502).json({ ok: false, error: "L'envoi a échoué" });
    return;
  }
  res.status(200).json({ ok: true });
};
