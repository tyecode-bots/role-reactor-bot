import { PermissionFlagsBits } from "discord.js";
import config from "../../config/config.js";

const DEVELOPER_IDS = config.discord.developers || [];

const BOT_PERMISSIONS = [
  PermissionFlagsBits.ManageRoles,
  PermissionFlagsBits.ManageMessages,
  PermissionFlagsBits.AddReactions,
  PermissionFlagsBits.ReadMessageHistory,
  PermissionFlagsBits.ViewChannel,
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks,
];

/**
 * Checks if a user is a developer.
 * @param {string} userId The user's ID.
 * @returns {boolean}
 */
export function isDeveloper(userId) {
  return DEVELOPER_IDS.includes(userId);
}

/**
 * Checks if a member has administrator-level permissions.
 * @param {import("discord.js").GuildMember} member The guild member.
 * @returns {boolean}
 */
export function hasAdminPermissions(member) {
  if (!member) return false;
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

/**
 * Checks if a member has permission to manage roles.
 * @param {import("discord.js").GuildMember} member The guild member.
 * @returns {boolean}
 */
export function hasManageRolesPermission(member) {
  if (!member) return false;
  return member.permissions.has(PermissionFlagsBits.ManageRoles);
}

/**
 * Checks if the bot has all required permissions in a guild.
 * @param {import("discord.js").Guild} guild The guild to check.
 * @returns {boolean}
 */
export function botHasRequiredPermissions(guild) {
  if (!guild || !guild.members.me) return false;
  const botMember = guild.members.me;
  return BOT_PERMISSIONS.every(perm => botMember.permissions.has(perm));
}

/**
 * Gets a list of missing permissions for the bot in a guild.
 * @param {import("discord.js").Guild} guild The guild to check.
 * @returns {string[]} An array of missing permission names.
 */
export function getMissingBotPermissions(guild) {
  if (!guild || !guild.members.me) return [];
  const botMember = guild.members.me;
  return BOT_PERMISSIONS.filter(perm => !botMember.permissions.has(perm)).map(
    formatPermissionName,
  );
}

/**
 * Formats a permission flag into a human-readable string.
 * @param {import("discord.js").PermissionFlagsBits} permission The permission flag.
 * @returns {string} The formatted permission name.
 */
export function formatPermissionName(permission) {
  const permissionName = Object.keys(PermissionFlagsBits).find(
    key => PermissionFlagsBits[key] === permission,
  );

  if (!permissionName) {
    return "Unknown Permission";
  }

  return permissionName.replace(/([A-Z])/g, " $1").trim();
}
