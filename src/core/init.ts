import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  $debug,
  init as initSDK,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Mount all components used in the project.
  backButton.isSupported() && !backButton.isMounted() && backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  !viewport.isMounting() && !viewport.isMounted() && void viewport.mount().then(() => {
    !viewport.isCssVarsBound() && viewport.bindCssVars();
  }).catch(e => {
    console.error('Something went wrong mounting the viewport.', e); // TODO: Error - Something went wrong mounting the viewport ir: The viewport component is already mounting
  });

  // Define components-related CSS variables.
  !miniApp.isCssVarsBound() && miniApp.bindCssVars();
  !themeParams.isCssVarsBound() && themeParams.bindCssVars();

  // Add Eruda if needed.
  debug && import('eruda')
    .then((lib) => lib.default.init())
    .catch(console.error);
}