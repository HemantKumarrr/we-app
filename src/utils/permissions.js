export const canDeletePost = (user, postAuthorId) => {
  return user?.role === "admin" || user?._id === postAuthorId;
};

export const canDeleteComment = (user, commentAuthorId) => {
  return user?.role === "admin" || user?._id === commentAuthorId;
};

export const canDeleteUser = (user) => user?.role === "admin";
