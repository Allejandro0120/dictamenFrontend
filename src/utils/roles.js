export const getRoles = () => {
  const roles = localStorage.getItem('roles');
  return roles ? JSON.parse(roles) : [];
};

export const hasRole = (...rolesPermitidos) => {
  const userRoles = getRoles();
  return userRoles.some(r => rolesPermitidos.includes(r));
};
