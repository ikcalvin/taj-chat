/**
 * TAJ Assistant Chat Widget - Embeddable Script
 *
 * Usage: Add this to your website:
 *   <script src="https://YOUR_TAJ_CHAT_DOMAIN/embed.js" data-taj-chat></script>
 *
 * Options (data attributes on the script tag):
 *   data-taj-url    - Base URL of the TAJ Chat app (default: auto-detected from script src)
 *   data-taj-position - "right" (default) or "left"
 *   data-taj-color   - Launcher button color (default: "#b45309")
 *   data-taj-size    - Widget size "compact" | "default" | "large" (default: "default")
 */
(function () {
  'use strict';

  // Prevent double-init
  if (window.__tajChatLoaded) return;
  window.__tajChatLoaded = true;

  // Read config from script tag
  var script =
    document.currentScript ||
    document.querySelector('script[data-taj-chat]');
  var baseUrl = (script && script.getAttribute('data-taj-url')) || '';
  var position = (script && script.getAttribute('data-taj-position')) || 'right';
  var color = (script && script.getAttribute('data-taj-color')) || '#b45309';
  var sizePreset = (script && script.getAttribute('data-taj-size')) || 'default';

  // Auto-detect base URL from script src if not explicitly set
  if (!baseUrl && script && script.src) {
    var url = new URL(script.src);
    baseUrl = url.origin;
  }

  // Fallback
  if (!baseUrl) {
    console.warn('[TAJ Chat] Could not determine base URL. Set data-taj-url on the script tag.');
    return;
  }

  // Size presets
  var sizes = {
    compact: { width: 360, height: 520 },
    default: { width: 400, height: 600 },
    large: { width: 440, height: 680 },
  };
  var size = sizes[sizePreset] || sizes['default'];

  // Create container
  var container = document.createElement('div');
  container.id = 'taj-chat-widget';
  container.style.cssText =
    'position:fixed;bottom:20px;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
    (position === 'left' ? 'left:20px;' : 'right:20px;');

  // Chat panel (iframe container)
  var panel = document.createElement('div');
  panel.style.cssText =
    'display:none;width:' +
    size.width +
    'px;height:' +
    size.height +
    'px;margin-bottom:12px;border-radius:16px;overflow:hidden;' +
    'box-shadow:0 8px 40px rgba(0,0,0,0.12),0 2px 12px rgba(0,0,0,0.08);' +
    'transition:opacity 0.25s ease,transform 0.25s ease;opacity:0;transform:translateY(16px) scale(0.96);';

  // Responsive: on small screens, go full-width
  var mq = window.matchMedia('(max-width: 480px)');
  function applyResponsive(e) {
    if (e.matches) {
      panel.style.width = 'calc(100vw - 24px)';
      panel.style.height = 'calc(100dvh - 100px)';
      panel.style.borderRadius = '16px';
      container.style.left = '12px';
      container.style.right = '12px';
      container.style.bottom = '12px';
    } else {
      panel.style.width = size.width + 'px';
      panel.style.height = size.height + 'px';
      container.style.left = position === 'left' ? '20px' : '';
      container.style.right = position === 'right' ? '20px' : '';
      container.style.bottom = '20px';
    }
  }
  mq.addEventListener('change', applyResponsive);
  applyResponsive(mq);

  // Iframe
  var iframe = document.createElement('iframe');
  iframe.src = baseUrl + '?embed=true';
  iframe.style.cssText =
    'width:100%;height:100%;border:none;border-radius:inherit;background:transparent;';
  iframe.setAttribute('title', 'TAJ Assistant Chat');
  iframe.setAttribute('allow', 'clipboard-write');
  panel.appendChild(iframe);

  // Launcher button
  var launcher = document.createElement('button');
  launcher.setAttribute('aria-label', 'Open TAJ Assistant chat');
  launcher.style.cssText =
    'display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:50%;' +
    'border:none;cursor:pointer;background:' +
    color +
    ';color:#fff;' +
    'box-shadow:0 4px 16px rgba(0,0,0,0.15);transition:transform 0.2s ease,box-shadow 0.2s ease;' +
    (position === 'left' ? '' : 'margin-left:auto;');
  launcher.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';

  launcher.addEventListener('mouseenter', function () {
    launcher.style.transform = 'scale(1.08)';
    launcher.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)';
  });
  launcher.addEventListener('mouseleave', function () {
    launcher.style.transform = 'scale(1)';
    launcher.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
  });

  // Close icon SVG
  var closeIcon =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var chatIcon =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>';

  var isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      panel.style.display = 'block';
      // Trigger reflow, then animate in
      panel.offsetHeight; // force reflow
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0) scale(1)';
      launcher.innerHTML = closeIcon;
      launcher.setAttribute('aria-label', 'Close TAJ Assistant chat');
      // Notify iframe
      iframe.contentWindow &&
        iframe.contentWindow.postMessage({ type: 'taj-chat-open' }, '*');
    } else {
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(16px) scale(0.96)';
      launcher.innerHTML = chatIcon;
      launcher.setAttribute('aria-label', 'Open TAJ Assistant chat');
      // Notify iframe
      iframe.contentWindow &&
        iframe.contentWindow.postMessage({ type: 'taj-chat-close' }, '*');
      setTimeout(function () {
        if (!isOpen) panel.style.display = 'none';
      }, 250);
    }
  }

  launcher.addEventListener('click', toggleChat);

  // Assemble
  container.appendChild(panel);
  container.appendChild(launcher);

  // Inject when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(container);
    });
  } else {
    document.body.appendChild(container);
  }

  // Expose API for programmatic control
  window.TajChat = {
    open: function () {
      if (!isOpen) toggleChat();
    },
    close: function () {
      if (isOpen) toggleChat();
    },
    toggle: toggleChat,
  };
})();
