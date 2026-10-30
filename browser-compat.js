/* Progressive browser fallbacks; no external services or device-specific URLs. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(root);
  else root.CampusBrowser = factory(root);
}(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
  'use strict';

  function createAdapter(key, getStorage) {
    var storage = null;
    var cached = null;
    try { storage = getStorage ? getStorage() : root.localStorage; } catch (_) {}
    return {
      read: function () {
        if (storage) {
          try { cached = storage.getItem(key); }
          catch (_) { storage = null; }
        }
        try { return JSON.parse(cached || 'null'); }
        catch (_) { storage = null; cached = null; return null; }
      },
      write: function (value) {
        var next = JSON.stringify(value);
        // A denied or full store must not silently accept a submission as saved.
        if (storage) storage.setItem(key, next);
        cached = next;
      },
      allowSession: function () { storage = null; },
      isPersistent: function () { return !!storage; }
    };
  }

  function decodeImage(file, environment) {
    var env = environment || root;
    function loadWithImage() {
      return new Promise(function (resolve, reject) {
        var image = new env.Image();
        var urlApi = env.URL || env.webkitURL;
        var objectUrl = '';
        function close() { if (objectUrl) { urlApi.revokeObjectURL(objectUrl); objectUrl = ''; } }
        function fail() { close(); reject(new Error('这张照片暂时无法读取，请换用JPG或PNG照片重试')); }
        image.onload = function () {
          var width = image.naturalWidth || image.width;
          var height = image.naturalHeight || image.height;
          if (!width || !height) { fail(); return; }
          resolve({ source: image, width: width, height: height, close: close });
        };
        image.onerror = fail;
        try {
          if (urlApi && typeof urlApi.createObjectURL === 'function') {
            objectUrl = urlApi.createObjectURL(file);
            image.src = objectUrl;
          } else {
            var reader = new env.FileReader();
            reader.onerror = fail;
            reader.onload = function () { image.src = reader.result; };
            reader.readAsDataURL(file);
          }
        } catch (_) { fail(); }
      });
    }
    if (typeof env.createImageBitmap === 'function') {
      try {
        return Promise.resolve(env.createImageBitmap(file)).then(function (bitmap) {
          return { source: bitmap, width: bitmap.width, height: bitmap.height,
            close: function () { if (typeof bitmap.close === 'function') bitmap.close(); } };
        }, loadWithImage);
      } catch (_) {}
    }
    return loadWithImage();
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else { dialog.classList.add('dialog-fallback'); dialog.setAttribute('open', ''); dialog.setAttribute('aria-modal', 'true'); }
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); dialog.removeAttribute('aria-modal'); dialog.classList.remove('dialog-fallback'); }
  }

  if (root.document) {
    var document = root.document;
    function syncInput() {
      var field = document.activeElement;
      var editing = field && (field.tagName === 'TEXTAREA' ||
        (field.tagName === 'INPUT' && /^(text|search|email|url|tel|password|number)$/.test(field.type)));
      document.documentElement.classList.toggle('phone-input-active', !!editing);
    }
    document.addEventListener('focusin', syncInput);
    document.addEventListener('focusout', function () { root.setTimeout(syncInput, 0); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        var dialog = document.querySelector('dialog.dialog-fallback[open]');
        if (dialog) closeDialog(dialog);
      }
    });
  }

  return { createAdapter: createAdapter, decodeImage: decodeImage, openDialog: openDialog, closeDialog: closeDialog };
}));
