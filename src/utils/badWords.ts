// src/utils/badWords.ts

export const BAD_WORDS = [
  'puta', 'puto', 'pendejo', 'pendeja', 'chinga', 'chingar',
  'verga', 'vergas', 'mierda', 'caca', 'coño', 'coña',
  'maricon', 'maricona', 'joto', 'jota', 'cabron', 'cabrona',
  'hijueputa', 'gonorrea', 'malparido', 'malparida',
  'estupido', 'estupida', 'imbecil', 'idiota', 'pelotudo',
  'boludo', 'weon', 'weona', 'culiao', 'culiado',
  'fuck', 'fucking', 'shit', 'bitch', 'asshole',
];

export const containsBadWords = (text: string): boolean => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return BAD_WORDS.some(word => lowerText.includes(word));
};

export const filterBadWords = (text: string): string => {
  let filtered = text;
  BAD_WORDS.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
};