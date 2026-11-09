/**
 * KB PRASAC Bank Mobile Web App
 * Interactive Engine & Multi-Screen Banking Flow
 * Screens:
 *  0. Home Dashboard
 *  1. KHQR Camera Scanner & QR Code Auto-Detector
 *  2. Amount Entry Screen
 *  3. PIN Code Verification
 *  4. Transaction Success Receipt
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Screen Navigation Engine ---
  const screens = {
    home: document.getElementById('screenHome'),
    scanner: document.getElementById('screenScanner'),
    amount: document.getElementById('screenAmount'),
    pin: document.getElementById('screenPin'),
    success: document.getElementById('screenSuccess')
  };

  const showScreen = (screenName) => {
    Object.keys(screens).forEach(key => {
      if (screens[key]) {
        screens[key].classList.remove('app-screen-active');
      }
    });
    if (screens[screenName]) {
      screens[screenName].classList.add('app-screen-active');
      window.scrollTo(0, 0);
    }
    playClickSound();
  };

  // Support direct hash navigation (e.g. index.html#success or index.html#amount)
  const syncHashScreen = () => {
    const rawHash = window.location.hash.replace('#', '').toLowerCase();
    if (rawHash && screens[rawHash]) {
      showScreen(rawHash);
    }
  };
  window.addEventListener('hashchange', syncHashScreen);
  syncHashScreen();

  // --- Audio Feedback ---
  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch(e) {}
  };

  // --- App State ---
  let typedAmount = "0";
  let currentCurrency = "រៀល"; // Default to Khmer Riel
  let enteredPin = "";
  let isFlashOn = false;

  // Beneficiary state (dynamic from QR selection / scan)
  let currentBeneficiary = {
    name: "THOEUN THARY",
    account: "855 187 595 75",
    bank: "ACLEDA"
  };

  // Apply beneficiary to UI
  const applyBeneficiary = (beneficiary) => {
    if (!beneficiary) return;
    currentBeneficiary = beneficiary;
    const benName = document.getElementById('beneficiaryName');
    const benAcc = document.getElementById('beneficiaryAcc');
    const rcptToName = document.getElementById('receiptToName');
    const rcptToAcc = document.getElementById('receiptToAcc');
    const rcptToBank = document.getElementById('receiptToBank');

    if (benName) benName.textContent = beneficiary.name;
    if (benAcc) benAcc.textContent = `${beneficiary.account} | ${beneficiary.bank}`;
    if (rcptToName) rcptToName.textContent = beneficiary.name;
    if (rcptToAcc) rcptToAcc.textContent = beneficiary.account;
    if (rcptToBank) rcptToBank.textContent = beneficiary.bank;
  };

  // =========================================================================
  // VIEW 0: HOME SCREEN LOGIC (Swipeable Dual Currency Account Cards)
  // =========================================================================
  const centerQrBtn = document.getElementById('centerQrBtn');
  const khqrHeaderBtn = document.getElementById('khqrHeaderBtn');
  const transferActionBtns = document.querySelectorAll('.transfer-action-btn');
  const paymentActionBtns = document.querySelectorAll('.payment-action-btn');

  const openScanner = () => showScreen('scanner');
  if (centerQrBtn) centerQrBtn.addEventListener('click', openScanner);
  if (khqrHeaderBtn) khqrHeaderBtn.addEventListener('click', openScanner);

  // Transfer and Payment buttons on both USD and KHR cards
  transferActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.swipe-card-item');
      if (parentCard) {
        const cardCurr = parentCard.getAttribute('data-currency');
        if (cardCurr) currentCurrency = cardCurr;
      }
      openScanner();
    });
  });

  paymentActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.swipe-card-item');
      if (parentCard) {
        const cardCurr = parentCard.getAttribute('data-currency');
        if (cardCurr) currentCurrency = cardCurr;
      }
      openScanner();
    });
  });

  // Account Cards Carousel Swipe & Pagination
  const carousel = document.getElementById('accountCardsCarousel');
  const cardPagination = document.getElementById('cardPagination');
  const dots = cardPagination ? cardPagination.querySelectorAll('.dot') : [];
  const swipeCards = document.querySelectorAll('.swipe-card-item');

  // Auto-detect swipe on scroll
  if (carousel) {
    carousel.addEventListener('scroll', () => {
      const scrollPos = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth;
      const activeIndex = scrollPos > cardWidth / 3 ? 1 : 0;
      dots.forEach((dot, idx) => {
        dot.className = idx === activeIndex ? 'dot dot-active' : 'dot dot-inactive';
      });
    }, { passive: true });

    // Desktop mouse drag to swipe
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeftStart = carousel.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.4;
      carousel.scrollLeft = scrollLeftStart - walk;
    });
  }

  // Click on dots to slide between USD and KHR cards
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'));
      if (swipeCards[idx]) {
        swipeCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
      dots.forEach((d, i) => d.className = i === idx ? 'dot dot-active' : 'dot dot-inactive');
      playClickSound();
    });
  });

  // Balance visibility toggle for both USD and KHR cards
  const eyeToggleBtn = document.getElementById('eyeToggleBtn');
  let isBalanceHidden = false;
  if (eyeToggleBtn) {
    eyeToggleBtn.addEventListener('click', () => {
      isBalanceHidden = !isBalanceHidden;
      const eyeIcon = eyeToggleBtn.querySelector('svg');
      const usdBal = document.querySelector('#accountCardUSD .balance-amount');
      const khrBal = document.querySelector('#accountCardKHR .balance-amount');
      if (usdBal) usdBal.textContent = isBalanceHidden ? "••••" : "5,000";
      if (khrBal) khrBal.textContent = isBalanceHidden ? "••••" : "10,000,000";
      if (eyeIcon) {
        eyeIcon.innerHTML = isBalanceHidden
          ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>'
          : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      }
      playClickSound();
    });
  }

  // =========================================================================
  // VIEW 1: SCANNER SCREEN & QR PARSING (User Feature)
  // =========================================================================
  const closeScannerScreenBtn = document.getElementById('closeScannerScreenBtn');
  const scannerTargetBox = document.getElementById('scannerTargetBox');
  const scannerFlashBtn = document.getElementById('scannerFlashBtn');
  const scannerGalleryBtn = document.getElementById('scannerGalleryBtn');

  // QR Picker Sheet elements
  const qrPickerModal = document.getElementById('qrPickerModal');
  const qrPickerCloseBtn = document.getElementById('qrPickerCloseBtn');
  const qrUploadTriggerBtn = document.getElementById('qrUploadTriggerBtn');
  const qrFileInput = document.getElementById('qrFileInput');
  const qrPresetItems = document.querySelectorAll('.qr-preset-item');

  if (closeScannerScreenBtn) {
    closeScannerScreenBtn.addEventListener('click', () => showScreen('home'));
  }

  // Flashlight toggle
  if (scannerFlashBtn) {
    scannerFlashBtn.addEventListener('click', () => {
      isFlashOn = !isFlashOn;
      scannerFlashBtn.style.color = isFlashOn ? "#F6B304" : "#FFFFFF";
      playClickSound();
    });
  }

  // Proceed to Amount Screen helper
  const proceedToAmount = () => {
    typedAmount = currentBeneficiary && currentBeneficiary.amount ? currentBeneficiary.amount : "0";
    if (currentBeneficiary && currentBeneficiary.currency) {
      currentCurrency = currentBeneficiary.currency;
    }
    const currencyNameTxt = document.getElementById('currencyNameTxt');
    const coinSymbolTxt = document.getElementById('coinSymbolTxt');
    const sourceAccCurr = document.getElementById('sourceAccCurr');
    if (currencyNameTxt) currencyNameTxt.textContent = currentCurrency;
    if (coinSymbolTxt) coinSymbolTxt.textContent = currentCurrency === "ដុល្លារ" ? "$" : "៛";
    if (sourceAccCurr) sourceAccCurr.textContent = currentCurrency;
    updateAmountDisplay();
    showScreen('amount');
  };

  // Clicking scanner camera box opens QR Picker modal to scan/choose different QR
  if (scannerTargetBox) {
    scannerTargetBox.addEventListener('click', () => {
      if (qrPickerModal) {
        qrPickerModal.classList.add('modal-active');
      }
      playClickSound();
    });
  }

  // "ជ្រើសរើស QR" Button opens QR Picker Bottom Sheet
  if (scannerGalleryBtn) {
    scannerGalleryBtn.addEventListener('click', () => {
      if (qrPickerModal) {
        qrPickerModal.classList.add('modal-active');
      }
      playClickSound();
    });
  }

  if (qrPickerCloseBtn) {
    qrPickerCloseBtn.addEventListener('click', () => {
      if (qrPickerModal) qrPickerModal.classList.remove('modal-active');
    });
  }

  if (qrPickerModal) {
    qrPickerModal.addEventListener('click', (e) => {
      if (e.target === qrPickerModal) {
        qrPickerModal.classList.remove('modal-active');
      }
    });
  }

  // Quick Preset Bank selection (Works dynamically for ANY bank)
  const bindPresetItems = () => {
    document.querySelectorAll('.qr-preset-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.getAttribute('data-name');
        const acc = item.getAttribute('data-acc');
        const bank = item.getAttribute('data-bank');
        applyBeneficiary({ name, account: acc, bank });
        if (qrPickerModal) qrPickerModal.classList.remove('modal-active');
        proceedToAmount();
      });
    });
  };
  bindPresetItems();

  // Custom Beneficiary Form Submit
  const customBenApplyBtn = document.getElementById('customBenApplyBtn');
  if (customBenApplyBtn) {
    customBenApplyBtn.addEventListener('click', () => {
      const name = (document.getElementById('customBenName').value || '').trim() || 'SOK CHANTHA';
      const bank = (document.getElementById('customBenBank').value || '').trim() || 'ABA Bank';
      const acc = (document.getElementById('customBenAcc').value || '').trim() || '001 234 567';
      const curr = document.getElementById('customBenCurr').value || 'រៀល';
      applyBeneficiary({ name, account: acc, bank, currency: curr });
      if (qrPickerModal) qrPickerModal.classList.remove('modal-active');
      proceedToAmount();
    });
  }

  // Enhanced Multi-Scale Image QR Decoder
  function decodeQRFromImage(img) {
    const targetDims = [800, 1200, 600, img.width];
    for (let dim of targetDims) {
      const scale = Math.min(1, dim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imgData.data, w, h, { inversionAttempts: 'attemptBoth' });
        if (code && code.data) {
          return code.data;
        }
      }
    }
    return null;
  }

  // File Upload & QR Code Decoder
  if (qrUploadTriggerBtn && qrFileInput) {
    qrUploadTriggerBtn.addEventListener('click', () => {
      qrFileInput.click();
    });

    qrFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const qrData = decodeQRFromImage(img);
            if (qrData) {
              const parsed = parseKHQR(qrData);
              applyBeneficiary(parsed);
              if (parsed.currency) {
                currentCurrency = parsed.currency;
              }
              if (parsed.amount) {
                typedAmount = parsed.amount;
              }
              if (qrPickerModal) qrPickerModal.classList.remove('modal-active');
              proceedToAmount();
            } else {
              alert("មិនអាចអានកូដ QR ពីរូបភាពនេះបានទេ។ សូមជ្រើសរើសគំរូធនាគារ ឬបញ្ចូលឈ្មោះ/លេខគណនីដោយផ្ទាល់។");
            }
          } catch(err) {
            alert("មានបញ្ហាក្នុងការស្កេនរូបភាព QR សូមជ្រើសរើសគំរូធនាគារខាងក្រោម។");
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      qrFileInput.value = '';
    });
  }

  // --- Flexible KHQR / DeepLink / Text Decoder ---
  function parseKHQR(qrText) {
    if (!qrText || typeof qrText !== 'string') {
      return { name: "THOEUN THARY", account: "855 187 595 75", bank: "ACLEDA" };
    }

    const bankMap = {
      'acleda': 'ACLEDA', 'acly': 'ACLEDA', 'aclykhpp': 'ACLEDA',
      'prasac': 'KB PRASAC', 'kprs': 'KB PRASAC', 'kprskhpp': 'KB PRASAC',
      'aba': 'ABA Bank', 'abab': 'ABA Bank', 'ababkhpp': 'ABA Bank',
      'canadia': 'Canadia Bank', 'cadi': 'Canadia Bank', 'cadikhpp': 'Canadia Bank',
      'wing': 'Wing Bank', 'wingkhpp': 'Wing Bank',
      'ftb': 'FTB Bank', 'ftbb': 'FTB Bank', 'ftbbkhpp': 'FTB Bank',
      'phillip': 'Phillip Bank', 'cpbk': 'Phillip Bank', 'cpbkkhpp': 'Phillip Bank',
      'sathapana': 'Sathapana Bank', 'satp': 'Sathapana Bank', 'satpkhpp': 'Sathapana Bank',
      'hattha': 'Hattha Bank', 'hreb': 'Hattha Bank', 'hrebkhpp': 'Hattha Bank',
      'prince': 'Prince Bank', 'prbk': 'Prince Bank', 'prbkkhpp': 'Prince Bank',
      'shinhan': 'Shinhan Bank', 'chbk': 'Shinhan Bank', 'chbkkhpp': 'Shinhan Bank',
      'vattanac': 'Vattanac Bank', 'vckh': 'Vattanac Bank', 'vckhkhpp': 'Vattanac Bank',
      'bred': 'BRED Bank', 'bphk': 'BRED Bank', 'bphkkhpp': 'BRED Bank'
    };

    // 1. Check if URL format (e.g. bakong or bank payment link)
    if (qrText.startsWith('http://') || qrText.startsWith('https://')) {
      try {
        const url = new URL(qrText);
        const nameParam = url.searchParams.get('name') || url.searchParams.get('merchantName') || '';
        const accParam = url.searchParams.get('account') || url.searchParams.get('acc') || url.searchParams.get('phone') || '';
        const bankParam = url.searchParams.get('bank') || url.searchParams.get('bankName') || '';
        const currParam = url.searchParams.get('currency') || url.searchParams.get('curr') || '';
        const amtParam = url.searchParams.get('amount') || url.searchParams.get('amt') || '';
        if (nameParam || accParam) {
          return {
            name: nameParam || 'អតិថិជន KHQR',
            bank: bankMap[bankParam.toLowerCase()] || bankParam || 'KHQR Bank',
            account: accParam || '000 000 000',
            currency: currParam === 'KHR' || currParam === '116' ? 'រៀល' : (currParam === 'USD' || currParam === '840' ? 'ដុល្លារ' : ''),
            amount: amtParam
          };
        }
      } catch(e) {}
    }

    // 2. Check if JSON format
    if (qrText.startsWith('{') && qrText.endsWith('}')) {
      try {
        const obj = JSON.parse(qrText);
        return {
          name: obj.name || obj.merchantName || 'អតិថិជន KHQR',
          bank: bankMap[(obj.bank || '').toLowerCase()] || obj.bank || 'KHQR Bank',
          account: obj.account || obj.acc || obj.phone || '000 000 000',
          currency: obj.currency === 'KHR' || obj.currency === '116' ? 'រៀល' : '',
          amount: obj.amount || ''
        };
      } catch(e) {}
    }

    // 3. Standard EMVCo TLV Parser
    const tags = {};
    let i = 0;
    while (i < qrText.length) {
      if (i + 4 > qrText.length) break;
      const tag = qrText.substring(i, i + 2);
      const len = parseInt(qrText.substring(i + 2, i + 4), 10);
      if (isNaN(len) || len <= 0 || i + 4 + len > qrText.length) break;
      const val = qrText.substring(i + 4, i + 4 + len);
      tags[tag] = val;
      i += 4 + len;
    }

    let customerName = tags['59'] || '';
    let currencyCode = tags['53'] || '';
    let currency = currencyCode === '116' ? 'រៀល' : (currencyCode === '840' ? 'ដុល្លារ' : '');
    let amount = tags['54'] || '';
    let bankName = '';
    let accountNumber = '';

    // Check Tag 29 or Tag 30 for Bakong Merchant Info
    const tag30 = tags['30'] || tags['29'];
    if (tag30) {
      let j = 0;
      const subTags = {};
      while (j < tag30.length) {
        if (j + 4 > tag30.length) break;
        const subTag = tag30.substring(j, j + 2);
        const subLen = parseInt(tag30.substring(j + 2, j + 4), 10);
        if (isNaN(subLen) || subLen <= 0 || j + 4 + subLen > tag30.length) break;
        const subVal = tag30.substring(j + 4, j + 4 + subLen);
        subTags[subTag] = subVal;
        j += 4 + subLen;
      }

      const rawAccount = subTags['01'] || '';
      if (rawAccount) {
        if (rawAccount.includes('@')) {
          const parts = rawAccount.split('@');
          accountNumber = parts[0];
          const bankCode = parts[1].toLowerCase();
          bankName = bankMap[bankCode] || bankCode.toUpperCase();
        } else {
          accountNumber = rawAccount;
        }
      }
      if (subTags['02']) {
        const code = subTags['02'].toLowerCase();
        bankName = bankMap[code] || bankName || code.toUpperCase();
      }
    }

    // Check Tag 62 for mobile / account if not found
    const tag62 = tags['62'];
    if (tag62 && !accountNumber) {
      let k = 0;
      while (k < tag62.length) {
        if (k + 4 > tag62.length) break;
        const subTag = tag62.substring(k, k + 2);
        const subLen = parseInt(tag62.substring(k + 2, k + 4), 10);
        if (isNaN(subLen) || subLen <= 0 || k + 4 + subLen > tag62.length) break;
        const subVal = tag62.substring(k + 4, k + 4 + subLen);
        if (subTag === '02' || subTag === '01') {
          accountNumber = subVal;
        }
        k += 4 + subLen;
      }
    }

    // Format phone if Cambodia international format 855...
    if (accountNumber && accountNumber.startsWith('855') && accountNumber.length >= 11) {
      accountNumber = `${accountNumber.slice(0, 3)} ${accountNumber.slice(3, 6)} ${accountNumber.slice(6, 9)} ${accountNumber.slice(9)}`;
    }

    return {
      name: customerName || 'SOK CHANTHA',
      bank: bankName || 'ABA Bank',
      account: accountNumber || '001 234 567',
      currency: currency,
      amount: amount
    };
  }

  // =========================================================================
  // VIEW 2: AMOUNT INPUT SCREEN LOGIC (Image 3)
  // =========================================================================
  const amountBackBtn = document.getElementById('amountBackBtn');
  const amountTypedVal = document.getElementById('amountTypedVal');
  const currencyPillBtn = document.getElementById('currencyPillBtn');
  const currencyNameTxt = document.getElementById('currencyNameTxt');
  const coinSymbolTxt = document.getElementById('coinSymbolTxt');
  const sourceAccCurr = document.getElementById('sourceAccCurr');
  const paySubmitBtn = document.getElementById('paySubmitBtn');
  const amountBackspaceBtn = document.getElementById('amountBackspaceBtn');
  const amountKeypadButtons = document.querySelectorAll('.keypad-amount .kp-btn:not(.kp-backspace)');

  if (amountBackBtn) {
    amountBackBtn.addEventListener('click', () => showScreen('scanner'));
  }

  const updateAmountDisplay = () => {
    if (amountTypedVal) amountTypedVal.textContent = typedAmount;
    const num = parseFloat(typedAmount);
    if (paySubmitBtn) {
      if (!isNaN(num) && num > 0) {
        paySubmitBtn.disabled = false;
        paySubmitBtn.classList.add('btn-active');
      } else {
        paySubmitBtn.disabled = true;
        paySubmitBtn.classList.remove('btn-active');
      }
    }
  };

  // Currency Toggle: រៀល <-> ដុល្លារ
  if (currencyPillBtn) {
    currencyPillBtn.addEventListener('click', () => {
      if (currentCurrency === "រៀល") {
        currentCurrency = "ដុល្លារ";
        if (currencyNameTxt) currencyNameTxt.textContent = "ដុល្លារ";
        if (coinSymbolTxt) coinSymbolTxt.textContent = "$";
        if (sourceAccCurr) sourceAccCurr.textContent = "ដុល្លារ";
      } else {
        currentCurrency = "រៀល";
        if (currencyNameTxt) currencyNameTxt.textContent = "រៀល";
        if (coinSymbolTxt) coinSymbolTxt.textContent = "៛";
        if (sourceAccCurr) sourceAccCurr.textContent = "រៀល";
      }
      playClickSound();
    });
  }

  // Keypad
  amountKeypadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (typedAmount === "0") {
        if (val === "00") return;
        typedAmount = val;
      } else {
        if (typedAmount.length < 9) {
          typedAmount += val;
        }
      }
      updateAmountDisplay();
      playClickSound();
    });
  });

  if (amountBackspaceBtn) {
    amountBackspaceBtn.addEventListener('click', () => {
      if (typedAmount.length > 1) {
        typedAmount = typedAmount.slice(0, -1);
      } else {
        typedAmount = "0";
      }
      updateAmountDisplay();
      playClickSound();
    });
  }

  if (paySubmitBtn) {
    paySubmitBtn.addEventListener('click', () => {
      if (parseFloat(typedAmount) > 0) {
        enteredPin = "";
        updatePinDots();
        showScreen('pin');
      }
    });
  }

  // =========================================================================
  // VIEW 3: PIN VERIFICATION SCREEN LOGIC (Image 2)
  // =========================================================================
  const pinCloseBtn = document.getElementById('pinCloseBtn');
  const pinDots = document.querySelectorAll('.pin-dot');
  const pinKeypadButtons = document.querySelectorAll('.keypad-pin .pin-kp-btn');

  if (pinCloseBtn) {
    pinCloseBtn.addEventListener('click', () => showScreen('amount'));
  }

  const updatePinDots = () => {
    pinDots.forEach((dot, idx) => {
      if (idx < enteredPin.length) {
        dot.classList.add('dot-filled');
      } else {
        dot.classList.remove('dot-filled');
      }
    });
  };

  pinKeypadButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const digit = btn.getAttribute('data-pin');
      if (enteredPin.length < 6) {
        enteredPin += digit;
        updatePinDots();
        playClickSound();

        if (enteredPin.length === 6) {
          setTimeout(() => {
            proceedToSuccess();
          }, 300);
        }
      }
    });
  });

  // =========================================================================
  // VIEW 4: PAYMENT SUCCESS RECEIPT LOGIC (Image 4)
  // =========================================================================
  const receiptAmountVal = document.getElementById('receiptAmountVal');
  const receiptDateVal = document.getElementById('receiptDateVal');
  const receiptRefNum = document.getElementById('receiptRefNum');
  const receiptHash = document.getElementById('receiptHash');
  const copyHashBtn = document.getElementById('copyHashBtn');
  const doneFinishBtn = document.getElementById('doneFinishBtn');
  const receiptConnectorArrow = document.querySelector('.receipt-connector-arrow');

  const proceedToSuccess = () => {
    // Determine amount
    let rawAmount = typedAmount && typedAmount !== "0" ? typedAmount : (currentCurrency === "រៀល" ? "2585" : "0.01");
    let currDisplay = currentCurrency || "រៀល";

    // "ពេលទូរទាត់លុយ ខ្មែរ វានិងបន្ថែម .00 រៀល"
    let formattedAmount;
    if (currDisplay === "រៀល") {
      // Append .00 for Khmer Riel
      if (rawAmount.includes('.')) {
        const parts = rawAmount.split('.');
        formattedAmount = `${parts[0]}.${(parts[1] + '00').slice(0, 2)}`;
      } else {
        formattedAmount = `${rawAmount}.00`;
      }
    } else {
      // USD
      if (rawAmount.includes('.')) {
        const parts = rawAmount.split('.');
        formattedAmount = `${parts[0]}.${(parts[1] + '00').slice(0, 2)}`;
      } else {
        formattedAmount = `${rawAmount}.00`;
      }
    }

    if (receiptAmountVal) {
      receiptAmountVal.innerHTML = `<span class="rcpt-num">${formattedAmount}</span> <span class="rcpt-curr">${currDisplay}</span>`;
    }
    if (receiptDateVal) {
      receiptDateVal.textContent = "09 Nov 2026, 02:50 AM";
    }

    if (receiptRefNum) {
      receiptRefNum.innerHTML = "MB2600013944858<br>5";
    }
    if (receiptHash) {
      receiptHash.textContent = "89f0e3e4";
    }

    // Apply current beneficiary to receipt
    applyBeneficiary(currentBeneficiary);

    showScreen('success');
  };

  // Interactive bouncing arrow click feedback
  if (receiptConnectorArrow) {
    receiptConnectorArrow.addEventListener('click', () => {
      const svg = receiptConnectorArrow.querySelector('svg');
      if (svg) {
        svg.style.transform = 'translateY(10px) scale(1.25)';
        playClickSound();
        setTimeout(() => {
          svg.style.transform = '';
        }, 220);
      }
    });
  }

  if (copyHashBtn) {
    copyHashBtn.addEventListener('click', () => {
      if (receiptHash) {
        navigator.clipboard.writeText(receiptHash.textContent).then(() => {
          playClickSound();
        }).catch(() => {});
      }
    });
  }

  if (doneFinishBtn) {
    doneFinishBtn.addEventListener('click', () => {
      showScreen('home');
    });
  }
});
