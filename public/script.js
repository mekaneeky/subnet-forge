const faqQuestions = document.querySelectorAll('.faq-question');
const emissionShareRange = document.querySelector('#emission-share-range');
const emissionShareNumber = document.querySelector('#emission-share-number');
const ownerTaoOutput = document.querySelector('[data-owner-tao]');
const ownerUsdOutput = document.querySelector('[data-owner-usd]');
const taoPriceNoteElement = document.querySelector('[data-tao-price-note]');

const subnetEmissionPerDayTao = 7200;
const ownerEmissionShare = 0.18;
let taoUsdPrice = null;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const taoFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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

function clampShare(value) {
  return Math.min(15, Math.max(0, value));
}

function calculateOwnerTaoPerDay(sharePercent) {
  const totalEmissionsTaoPerDay = (sharePercent / 100) * subnetEmissionPerDayTao;
  return totalEmissionsTaoPerDay * ownerEmissionShare;
}

function renderOwnerCalculator(sharePercent) {
  if (!ownerTaoOutput || !ownerUsdOutput) {
    return;
  }

  const ownerTaoPerDay = calculateOwnerTaoPerDay(sharePercent);
  ownerTaoOutput.textContent = taoFormatter.format(ownerTaoPerDay);

  if (Number.isFinite(taoUsdPrice) && taoUsdPrice > 0) {
    ownerUsdOutput.textContent = usdFormatter.format(ownerTaoPerDay * taoUsdPrice);
  } else {
    ownerUsdOutput.textContent = 'Price unavailable';
  }
}

function syncInputsAndRender(rawValue) {
  const parsed = Number.parseFloat(rawValue);
  const sharePercent = clampShare(Number.isFinite(parsed) ? parsed : 0);

  if (emissionShareRange) {
    emissionShareRange.value = sharePercent.toFixed(1);
  }

  if (emissionShareNumber) {
    emissionShareNumber.value = sharePercent.toFixed(1);
  }

  renderOwnerCalculator(sharePercent);
}

async function loadTaoPriceAndRenderCalculator() {
  if (!emissionShareRange || !emissionShareNumber) {
    return;
  }

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bittensor&vs_currencies=usd',
      { cache: 'no-store' },
    );
    if (!response.ok) {
      throw new Error(`TAO price fetch failed with status ${response.status}`);
    }

    const payload = await response.json();
    taoUsdPrice = Number(payload?.bittensor?.usd);
    if (!Number.isFinite(taoUsdPrice) || taoUsdPrice <= 0) {
      throw new Error('Invalid TAO/USD price payload');
    }

    if (taoPriceNoteElement) {
      taoPriceNoteElement.textContent = `TAO/USD spot used: ${usdFormatter.format(taoUsdPrice)}.`;
    }
  } catch (_) {
    taoUsdPrice = null;
    if (taoPriceNoteElement) {
      taoPriceNoteElement.textContent = 'Unable to load TAO/USD spot price right now.';
    }
  }

  renderOwnerCalculator(Number.parseFloat(emissionShareRange.value));
}

if (emissionShareRange && emissionShareNumber) {
  emissionShareRange.addEventListener('input', (event) => {
    syncInputsAndRender(event.target.value);
  });

  emissionShareNumber.addEventListener('input', (event) => {
    syncInputsAndRender(event.target.value);
  });

  syncInputsAndRender(emissionShareRange.value);
}

loadTaoPriceAndRenderCalculator();
