import $ from 'jquery';
import watcher from '../../watcher.js';
import twitch from '../../utils/twitch.js';
import ModeratorCard from './moderator-card.js';
import {PlatformTypes} from '../../constants.js';
import {loadModuleForPlatforms} from '../../utils/modules.js';

let openModeratorCard;

class ChatModeratorCardsModule {
  constructor() {
    watcher.on('chat.moderator_card.open', ($element) => this.onOpen($element));
    watcher.on('chat.moderator_card.close', () => this.onClose());
    $('body').on('keydown.modCard', (e) => this.onKeyDown(e));
  }

  onOpen($element) {
    const targetUser = twitch.getChatModeratorCardUser($element[0]);
    if (!targetUser) return;

    if (openModeratorCard && openModeratorCard.user.id === targetUser.id) {
      return;
    }

    this.onClose();

    let isOwner = false;
    let isModerator = false;
    const userMessages = twitch.getChatMessages(targetUser.id);
    if (userMessages.length) {
      const {message} = userMessages[userMessages.length - 1];
      isOwner = twitch.getUserIsOwnerFromTagsBadges(message.badges);
      isModerator = twitch.getUserIsModeratorFromTagsBadges(message.badges);
    }

    openModeratorCard = new ModeratorCard(
      $element,
      {
        id: targetUser.id,
        name: targetUser.login,
        isOwner,
        isModerator,
      },
      userMessages,
      () => this.onClose(false)
    );
    openModeratorCard.render();
  }

  onClose(cleanup = true) {
    if (cleanup && openModeratorCard) {
      openModeratorCard.cleanup();
    }
    openModeratorCard = null;
  }

  onKeyDown(e) {
    if (!openModeratorCard) return;
    openModeratorCard.onKeyDown(e);
  }
}

export default loadModuleForPlatforms([PlatformTypes.TWITCH, () => new ChatModeratorCardsModule()]);
