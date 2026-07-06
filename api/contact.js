// Fonction serveur du formulaire de contact (Vercel Serverless Function).
// Reçoit la demande du visiteur et l'envoie par email via Brevo.
// La clé API Brevo reste secrète côté serveur (variable d'environnement BREVO_API_KEY).
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
    return;
  }

  const { nom = '', email = '', message = '', website = '' } = req.body || {};

  // Champ piège invisible : un humain le laisse vide, un robot le remplit.
  if (website) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!nom.trim() || !email.trim() || !message.trim()) {
    res.status(400).json({ ok: false, error: 'Champs manquants' });
    return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ ok: false, error: 'Email invalide' });
    return;
  }

  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Site ONN/OFF Studio', email: 'contact@onn-off.fr' },
      to: [{ email: 'contact@onn-off.fr', name: 'ONN/OFF Studio' }],
      replyTo: { email: email, name: nom },
      subject: 'Demande via le site — ' + nom,
      textContent: 'Nom / entreprise : ' + nom + '\nEmail : ' + email + '\n\n' + message,
    }),
  });

  if (!r.ok) {
    res.status(502).json({ ok: false, error: "L'envoi a échoué" });
    return;
  }
  res.status(200).json({ ok: true });
};
