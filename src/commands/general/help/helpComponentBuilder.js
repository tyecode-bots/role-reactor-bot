import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { COMMAND_CATEGORIES } from "./helpData.js";
import { EMOJIS } from "../../../config/theme.js";
import config from "../../../config/config.js";
import { getDefaultInviteLink } from "../../../utils/discord/invite.js";

/**
 * Builder class for creating help UI components
 */
export class HelpComponentBuilder {
  /**
   * Check if user has required permissions for a category
   * @param {import('discord.js').GuildMember} member
   * @param {string[]} requiredPermissions
   * @returns {boolean}
   */
  static hasCategoryPermissions(member, requiredPermissions) {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required
    }

    for (const permission of requiredPermissions) {
      if (permission === "DEVELOPER") {
        // Check if user is developer
        const developers = config.discord.developers;
        if (!developers || !developers.includes(member.user.id)) {
          return false;
        }
      } else {
        // Check Discord permissions
        const permissionFlag = PermissionFlagsBits[permission];
        if (permissionFlag && !member.permissions.has(permissionFlag)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Create main components for the help interface
   * @param {import('discord.js').GuildMember} member
   * @param {import('discord.js').Client} [client]
   * @returns {Promise<import('discord.js').ActionRowBuilder[]>}
   */
  static async createMainComponents(member = null, client = null) {
    const categoryMenu = this.createCategoryMenu(member);
    const buttons = await this.createCommandButtons(null, client);

    const menuRow = new ActionRowBuilder().addComponents(categoryMenu);
    return [menuRow, buttons].filter(Boolean);
  }

  /**
   * Create interactive category selection menu
   * @param {import('discord.js').GuildMember} member
   * @returns {import('discord.js').StringSelectMenuBuilder}
   */
  static createCategoryMenu(member = null) {
    const options = Object.entries(COMMAND_CATEGORIES)
      .filter(([_key, category]) => {
        // If no member provided, show all categories (for backward compatibility)
        if (!member) return true;

        // Check if user has permissions for this category
        return this.hasCategoryPermissions(
          member,
          category.requiredPermissions,
        );
      })
      .map(([key, category]) => ({
        label: category.name,
        description: category.description,
        value: `category_${key}`,
        emoji: category.emoji,
      }));

    return new StringSelectMenuBuilder()
      .setCustomId("help_category_select")
      .setPlaceholder(`${EMOJIS.ACTIONS.SEARCH} Choose a command category...`)
      .addOptions(options);
  }

  /**
   * Create command-specific navigation buttons
   * @param {string|null} category
   * @param {import('discord.js').Client} [client]
   * @returns {Promise<import('discord.js').ActionRowBuilder>}
   */
  static async createCommandButtons(_category = null, client = null) {
    const row = new ActionRowBuilder();

    // Determine invite link
    let inviteURL = config.discord?.inviteURL;
    if (!inviteURL && client) {
      inviteURL = client.inviteLink;
      if (!inviteURL) {
        try {
          inviteURL = await getDefaultInviteLink(client);
        } catch {
          inviteURL = null;
        }
      }
    }

    // External links
    const buttons = [];
    const links = config.externalLinks;
    if (links.guide) {
      buttons.push(
        new ButtonBuilder()
          .setLabel("Guide")
          .setURL(links.guide)
          .setEmoji(EMOJIS.CATEGORIES.GENERAL)
          .setStyle(ButtonStyle.Link),
      );
    }
    if (links.github) {
      buttons.push(
        new ButtonBuilder()
          .setLabel("GitHub")
          .setURL(links.github)
          .setEmoji(EMOJIS.ACTIONS.LINK)
          .setStyle(ButtonStyle.Link),
      );
    }
    if (links.support) {
      buttons.push(
        new ButtonBuilder()
          .setLabel("Support")
          .setURL(links.support)
          .setEmoji(EMOJIS.STATUS.INFO)
          .setStyle(ButtonStyle.Link),
      );
    }
    if (inviteURL || links.invite) {
      buttons.push(
        new ButtonBuilder()
          .setLabel("Invite")
          .setURL(inviteURL || links.invite)
          .setEmoji(EMOJIS.ACTIONS.LINK)
          .setStyle(ButtonStyle.Link),
      );
    }
    if (buttons.length === 0) {
      return undefined;
    }
    row.addComponents(...buttons);

    return row;
  }

  /**
   * Create back button for command detail view
   * @returns {import('discord.js').ActionRowBuilder}
   */
  static createBackButton() {
    const row = new ActionRowBuilder();
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("help_back_main")
        .setLabel("Back to Help")
        .setEmoji(EMOJIS.ACTIONS.BACK)
        .setStyle(ButtonStyle.Secondary),
    );
    return row;
  }

  /**
   * Create components for category view
   * @param {string} categoryKey
   * @param {import('discord.js').GuildMember} member
   * @param {import('discord.js').Client} [client]
   * @returns {Promise<import('discord.js').ActionRowBuilder[]>}
   */
  static async createCategoryComponents(
    categoryKey,
    member = null,
    client = null,
  ) {
    const categoryMenu = this.createCategoryMenu(member);
    const buttons = await this.createCommandButtons(categoryKey, client);

    const menuRow = new ActionRowBuilder().addComponents(categoryMenu);
    return [menuRow, buttons].filter(Boolean);
  }
}
