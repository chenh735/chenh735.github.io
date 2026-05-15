(function () {
  let idleTimer = null;
  let messageTimer = null;
  let actionTimer = null;

  const actionClasses = ['is-idle', 'is-wave', 'is-blink'];

  function getTimeGreeting () {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 9) return '\u65e9\u4e0a\u597d\u5440\uff0c\u4eca\u5929\u4e5f\u8981\u5143\u6c14\u6ee1\u6ee1\uff01';
    if (hour >= 9 && hour < 12) return '\u4e0a\u5348\u597d\uff0c\u6211\u5728\u5de6\u4e0b\u89d2\u966a\u4f60\u770b\u535a\u5ba2\u3002';
    if (hour >= 12 && hour < 14) return '\u4e2d\u5348\u597d\uff0c\u8bb0\u5f97\u8ba9\u773c\u775b\u4f11\u606f\u4e00\u4e0b\u3002';
    if (hour >= 14 && hour < 18) return '\u4e0b\u5348\u597d\uff0c\u6765\u770b\u770b\u4eca\u5929\u6709\u4ec0\u4e48\u65b0\u5185\u5bb9\u5427\u3002';
    if (hour >= 18 && hour < 23) return '\u665a\u4e0a\u597d\uff0c\u6162\u6162\u901b\uff0c\u6211\u4f1a\u4e56\u4e56\u5f85\u5728\u8fd9\u91cc\u3002';
    return '\u591c\u6df1\u5566\uff0c\u65e9\u70b9\u4f11\u606f\uff0c\u6211\u5e2e\u4f60\u5b88\u7740\u535a\u5ba2\u3002';
  }

  function clearMessage () {
    const lamb = document.querySelector('.blog-lamb');
    if (lamb) lamb.classList.remove('has-message');
    if (messageTimer) {
      window.clearTimeout(messageTimer);
      messageTimer = null;
    }
  }

  function say (lamb, text) {
    const bubble = lamb.querySelector('.blog-lamb__bubble');
    if (!bubble) return;

    bubble.textContent = text;
    lamb.classList.add('has-message');

    if (messageTimer) window.clearTimeout(messageTimer);
    messageTimer = window.setTimeout(clearMessage, 4200);
  }

  function setAction (lamb, action, duration) {
    actionClasses.forEach(function (className) {
      lamb.classList.remove(className);
    });

    lamb.classList.add(action);

    if (actionTimer) window.clearTimeout(actionTimer);
    actionTimer = window.setTimeout(function () {
      lamb.classList.remove(action);
      lamb.classList.add('is-idle');
      actionTimer = null;
    }, duration);
  }

  function scheduleIdleAction (lamb) {
    if (idleTimer) window.clearTimeout(idleTimer);

    idleTimer = window.setTimeout(function () {
      const actions = [
        { name: 'is-blink', duration: 900 },
        { name: 'is-wave', duration: 1800 }
      ];
      const next = actions[Math.floor(Math.random() * actions.length)];

      setAction(lamb, next.name, next.duration);
      scheduleIdleAction(lamb);
    }, 6500 + Math.floor(Math.random() * 7000));
  }

  function mountLamb () {
    const existingLamb = document.querySelector('.blog-lamb');

    if (existingLamb) {
      scheduleIdleAction(existingLamb);
      return;
    }

    const lamb = document.createElement('div');
    lamb.className = 'blog-lamb is-idle';

    const button = document.createElement('button');
    button.className = 'blog-lamb__button';
    button.type = 'button';
    button.setAttribute('aria-label', '\u5c0f\u7f8a\u52a9\u624b\uff0c\u70b9\u51fb\u6253\u62db\u547c');

    const sprite = document.createElement('div');
    sprite.className = 'blog-lamb__sprite';

    const bubble = document.createElement('div');
    bubble.className = 'blog-lamb__bubble';
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-live', 'polite');

    button.appendChild(sprite);
    lamb.appendChild(button);
    lamb.appendChild(bubble);
    document.body.appendChild(lamb);

    button.addEventListener('click', function () {
      setAction(lamb, 'is-wave', 1800);
      say(lamb, getTimeGreeting());
      scheduleIdleAction(lamb);
    });

    scheduleIdleAction(lamb);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountLamb);
  } else {
    mountLamb();
  }

  document.addEventListener('pjax:complete', mountLamb);
})();
