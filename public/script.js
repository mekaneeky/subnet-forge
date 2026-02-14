const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';

    faqQuestions.forEach((otherButton) => {
      otherButton.setAttribute('aria-expanded', 'false');
      const otherAnswer = otherButton.nextElementSibling;
      if (otherAnswer) {
        otherAnswer.style.maxHeight = '0px';
      }
    });

    if (!expanded) {
      button.setAttribute('aria-expanded', 'true');
      const answer = button.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    }
  });
});
