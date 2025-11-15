// main.js — upgraded lock-in alarm
// features: custom sound upload, cookie persistence, right speech bubble, strobe flash effect

(() => {
  const intervalInput = document.getElementById('intervalInput');
  const msgInput = document.getElementById('msgInput');
  const imgInput = document.getElementById('imgInput');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  const popup = document.getElementById('popup');
  const popupImg = document.getElementById('popupImg');
  const speech = document.getElementById('speechBubble');
  const beep = document.getElementById('beep');

  // custom audio element
  const userSound = new Audio();
  userSound.preload = 'auto';

  let timerId = null;
  let animTimeout = null;

  const DEFAULT_SOUND = './vine-boom.mp3';

  // set default sound on boot
  beep.dataset.userSrc = DEFAULT_SOUND;
  userSound.src = DEFAULT_SOUND;

  function saveCookies() {
    document.cookie = `lockin_interval=${intervalInput.value}; path=/; max-age=31536000`;
    document.cookie = `lockin_msg=${encodeURIComponent(msgInput.value)}; path=/; max-age=31536000`;
    document.cookie = `lockin_img=${encodeURIComponent(imgInput.value)}; path=/; max-age=31536000`;
  }

  function loadCookies() {
    const map = Object.fromEntries(
      document.cookie.split('; ').map(x => x.split('='))
    );
    if (map.lockin_interval) intervalInput.value = map.lockin_interval;
    if (map.lockin_msg) msgInput.value = decodeURIComponent(map.lockin_msg);
    if (map.lockin_img) imgInput.value = decodeURIComponent(map.lockin_img);
  }

  loadCookies();

  function strobeFlash(message, imageUrl) {
    popupImg.src = imageUrl;
    speech.textContent = message;

    popup.classList.remove('hidden');

    let flashes = 5;
    let delay = 400;

    function flashStep() {
      if (flashes <= 0) {
        popup.classList.add('hidden');
        return;
      }

      popup.style.visibility = flashes % 2 === 0 ? 'visible' : 'hidden';

      try {
        userSound.currentTime = 0;
        userSound.play().catch(()=>{});
      } catch {}

      flashes--;
      delay += 25;
      animTimeout = setTimeout(flashStep, delay);
    }

    flashStep();
  }

  function tick() {
    const sec = Number(intervalInput.value);
    if (!sec || sec <= 0) return stop();

    const msg = msgInput.value.trim() || `${sec}s`;
    const img = imgInput.value.trim() || '';

    strobeFlash(msg, img);
  }

  function start() {
    stop();
    const sec = Number(intervalInput.value);
    if (!sec || sec <= 0) {
      alert('interval must be > 0');
      return;
    }

    userSound.src = beep.dataset.userSrc || DEFAULT_SOUND;

    saveCookies();
    tick();
    timerId = setInterval(tick, sec * 60000);

    startBtn.disabled = true;
    stopBtn.disabled = false;
  }

  function stop() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    clearTimeout(animTimeout);
    popup.classList.add('hidden');

    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  // Load custom sound via file input if present
  const soundInput = document.getElementById('soundInput');
  if (soundInput) {
    soundInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        beep.dataset.userSrc = url;
      }
    });
  }

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
})();
