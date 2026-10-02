export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordPattern = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function validateUserForm(form, includeRole = false) {
  const name = form.name.trim();

  if (name.length < 20 || name.length > 60) {
    return 'Name should be between 20 and 60 characters.';
  }

  if (!emailPattern.test(form.email.trim())) {
    return 'Enter a valid email address.';
  }

  if (form.address.length > 400) {
    return 'Address cannot exceed 400 characters.';
  }

  if (!passwordPattern.test(form.password)) {
    return 'Password must be 8-16 characters with one uppercase letter and one special character.';
  }

  if (includeRole && !form.role) {
    return 'Select a role.';
  }

  return '';
}
