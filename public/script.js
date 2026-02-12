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
  const applicantTypeInputs = form.querySelectorAll('input[name="applicant_type"]');
  const teamOnlyFields = form.querySelectorAll('[data-team-only]');
  const teamInputs = Array.from(teamOnlyFields).flatMap((field) =>
    Array.from(field.querySelectorAll('input, select, textarea')),
  );
  const teamSizeInput = form.querySelector('input[name="team_size"]');

  const syncTeamFields = () => {
    const applicantType = form.querySelector('input[name="applicant_type"]:checked')?.value ?? 'individual';
    const isTeam = applicantType === 'team';

    teamOnlyFields.forEach((field) => {
      field.hidden = !isTeam;
    });

    if (teamSizeInput) {
      teamSizeInput.required = isTeam;
    }

    if (!isTeam) {
      teamInputs.forEach((input) => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          input.value = '';
        }
        if (input instanceof HTMLSelectElement) {
          input.selectedIndex = 0;
        }
      });
    }
  };

  if (applicantTypeInputs.length) {
    applicantTypeInputs.forEach((input) => input.addEventListener('change', syncTeamFields));
    syncTeamFields();
  }

  form.addEventListener('submit', (event) => {
    syncTeamFields();

    if (!form.checkValidity()) {
      event.preventDefault();
      formMessage.textContent = 'Please fill out the required fields highlighted below.';
      formMessage.classList.add('error');
      formMessage.classList.remove('success');
      form.reportValidity();
      return;
    }

    formMessage.textContent = 'Submitting application...';
    formMessage.classList.remove('error');
    formMessage.classList.remove('success');

    // Native form submit continues to configured endpoint.
  });
}
