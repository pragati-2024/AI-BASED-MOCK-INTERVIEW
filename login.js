function showLogin() {
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("signupForm").classList.remove("active");
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("signupTab").classList.remove("active");
}

function showSignup() {
  document.getElementById("signupForm").classList.add("active");
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("signupTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}