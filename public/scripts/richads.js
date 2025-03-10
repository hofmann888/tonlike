document.addEventListener('DOMContentLoaded', function() {
  const adBtn = document.getElementById('adBtn');
  if (adBtn) {
    window.TelegramAdsController = new TelegramAdsController();
    window.TelegramAdsController.initialize({
      pubId: richadsPubId,
      appId: richadsAppId,
      debug: richadsDebug,
    });
    
    adBtn?.addEventListener('click', () => {
      window.TelegramAdsController.triggerNativeNotification() // triggerInterstitialBanner
        .then((result) => {
          console.log(result);
        })
        .catch((result) => {
          console.error(result);
        });
    });
  }
});