function getStorageUsers() {
    const users = localStorage.getItem('users');
    return JSON.parse(users) || [];
}

export const storageUsers = getStorageUsers();
export const userInSession = storageUsers.find(user => user.status === true);