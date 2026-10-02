import { signupSchema } from './auth.validators.js';

export function createUserSchema(body) {
  const result = signupSchema(body);
  if (result.error) return result;
  const role = String(body.role || '').toUpperCase();
  if (!['ADMIN', 'USER', 'OWNER'].includes(role))
    return { error: 'Role must be ADMIN, USER or OWNER.' };
  return { value: { ...result.value, role } };
}

export function createStoreSchema(body) {
  const { name, email, address, ownerId } = body || {};
  if (!name || String(name).trim().length < 2 || String(name).trim().length > 120)
    return { error: 'Store name must be between 2 and 120 characters.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim()))
    return { error: 'Enter a valid store email.' };
  if (!address || String(address).length > 400)
    return { error: 'Store address is required and cannot exceed 400 characters.' };
  return {
    value: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      ownerId: ownerId || null,
    },
  };
}
