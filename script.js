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

const form = document.querySelector('.application-form');
const formMessage = document.querySelector('.form-message');

if (form && formMessage) {
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      formMessage.textContent = 'Please complete all required fields before submitting.';
      formMessage.classList.add('error');
      formMessage.classList.remove('success');
      form.reportValidity();
      return;
    }

    formMessage.textContent = 'Submitting application...';
    formMessage.classList.remove('error');
    formMessage.classList.remove('success');

    // Native form submit continues to configured endpoint.
    setTimeout(() => {
      formMessage.textContent = 'Application submitted. Please check your inbox for confirmation.';
      formMessage.classList.add('success');
    }, 800);
  });
}
