import $ from 'jquery';
import extension from '../../utils/extension.js';
import {PlatformTypes} from '../../constants.js';
import {getPlatform} from '../../utils/window.js';
import {loadModuleForPlatforms} from '../../utils/modules.js';

class GlobalCSSModule {
  constructor() {
    loadModuleForPlatforms(
      [PlatformTypes.TWITCH, () => import('./twitch.js')],
      [PlatformTypes.YOUTUBE, () => import('./youtube.js')]
    );
  }

  loadGlobalCSS() {
    // TODO: this is a crazy hack to enable youtube-specific rsuite overrides
    // we should find a better way
    if (getPlatform() === PlatformTypes.YOUTUBE) {
      $('body').toggleClass('bttv-youtube', true);
    }

    return new Promise((resolve) => {
      const css = document.createElement('link');
      css.setAttribute('href', extension.url('betterttv.css', true));
      css.setAttribute('type', 'text/css');
      css.setAttribute('rel', 'stylesheet');
      css.addEventListener('load', () => resolve());
      $('body').append(css);
    });
  }
}

export default new GlobalCSSModule();
