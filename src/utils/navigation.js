export const getSafeRedirect = (redirect) => {
  if (!redirect || !redirect.startsWith('/')) {
    return '/';
  }

  if (redirect.startsWith('//')) {
    return '/';
  }

  return redirect;
};
