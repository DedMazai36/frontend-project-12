const saveToken = (token, username) => {
  localStorage.setItem('token', token);
  localStorage.setItem('login', username);
};

export default saveToken;
