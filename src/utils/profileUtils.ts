// Fonction pour obtenir l'image de profil avec fallback
export const getProfileImage = (user: any): string | null => {
  // Priorité: profilePicture (Google) > avatar > logo (entreprise)
  if (user?.profilePicture) return user.profilePicture;
  if (user?.avatar) return user.avatar;
  if (user?.role === 'enterprise' && user?.logo) return user.logo;
  return null;
};