function toggleFAQ(element) {
  const answer = element.nextElementSibling;
  const toggleIcon = element.querySelector('.toggle-icon');

  // Toggle the open class for the answer
  answer.classList.toggle('open');

  // Change the toggle icon between + and -
  if (toggleIcon.textContent === '+') {
    toggleIcon.textContent = '-';
  } else {
    toggleIcon.textContent = '+';
  }
}