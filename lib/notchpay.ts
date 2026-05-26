export function detectPaymentMethod(phone: string): {
  channel: 'cm.mtn' | 'cm.orange' | null;
  formattedPhone: string;
} {
  // Supprime tous les caractères non numériques
  let clean = phone.replace(/\D/g, '');

  // Supprime l'éventuel préfixe pays
  if (clean.startsWith('00237')) {
    clean = clean.substring(5);
  } else if (clean.startsWith('237')) {
    clean = clean.substring(3);
  }

  // Supprime un 0 de tête si présent sur un numéro à 10 chiffres (format camerounais standard sans indicatif)
  if (clean.length === 10 && clean.startsWith('0')) {
    clean = clean.substring(1);
  }

  // Un numéro camerounais local valide doit avoir exactement 9 chiffres
  if (clean.length !== 9) {
    return { channel: null, formattedPhone: phone };
  }

  const prefix3 = clean.substring(0, 3);
  const prefix2 = clean.substring(0, 2);

  let channel: 'cm.mtn' | 'cm.orange' | null = null;

  const mtnPrefixes3 = ['650', '651', '652', '653', '654'];
  const mtnPrefixes2 = ['67', '68'];

  const orangePrefixes3 = ['655', '656', '657', '658', '659'];
  const orangePrefixes2 = ['69', '64'];

  if (mtnPrefixes3.includes(prefix3) || mtnPrefixes2.includes(prefix2)) {
    channel = 'cm.mtn';
  } else if (orangePrefixes3.includes(prefix3) || orangePrefixes2.includes(prefix2)) {
    channel = 'cm.orange';
  }

  return {
    channel,
    formattedPhone: `+237${clean}`,
  };
}
