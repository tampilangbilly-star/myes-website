import prisma from './prisma';

// Get translated field
export function t(item, field, lang = 'en') {
  if (!item) return '';
  const idField = field + 'Id';
  const enField = field + 'En';
  if (lang === 'id' && item[idField]) return item[idField];
  return item[enField] || '';
}

// Get setting value
export async function getSetting(key, lang = 'en') {
  const s = await prisma.setting.findUnique({ where: { key } });
  if (!s) return '';
  return lang === 'id' ? (s.valueId || s.valueEn || '') : (s.valueEn || '');
}

// Get all settings by group
export async function getSettings(group, lang = 'en') {
  const items = await prisma.setting.findMany({ where: { group } });
  const result = {};
  for (const s of items) {
    result[s.key] = lang === 'id' ? (s.valueId || s.valueEn || '') : (s.valueEn || '');
  }
  return result;
}

// Get social links
export async function getSocialLinks() {
  const items = await prisma.setting.findMany({ where: { group: 'social' } });
  const result = {};
  for (const s of items) {
    result[s.key.replace('social_', '')] = s.valueEn || '';
  }
  return result;
}
