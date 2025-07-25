import { getStorageManager } from "../storage/storageManager.js";
import { getLogger } from "../logger.js";

/**
 * Adds a temporary role to a user.
 * @param {string} guildId
 * @param {string} userId
 * @param {string} roleId
 * @param {Date} expiresAt
 * @returns {Promise<boolean>}
 */
export async function addTemporaryRole(guildId, userId, roleId, expiresAt) {
  const logger = getLogger();
  try {
    const storageManager = await getStorageManager();
    return await storageManager.addTemporaryRole(
      guildId,
      userId,
      roleId,
      expiresAt,
    );
  } catch (error) {
    logger.error("Failed to add temporary role", error);
    return false;
  }
}

/**
 * Removes a temporary role from a user.
 * @param {string} guildId
 * @param {string} userId
 * @param {string} roleId
 * @returns {Promise<boolean>}
 */
export async function removeTemporaryRole(guildId, userId, roleId) {
  const logger = getLogger();
  try {
    const storageManager = await getStorageManager();
    return await storageManager.removeTemporaryRole(guildId, userId, roleId);
  } catch (error) {
    logger.error("Failed to remove temporary role", error);
    return false;
  }
}

/**
 * Gets all temporary roles for a user.
 * @param {string} guildId
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserTemporaryRoles(guildId, userId) {
  const logger = getLogger();
  try {
    const storageManager = await getStorageManager();
    const tempRoles = await storageManager.getTemporaryRoles();
    return tempRoles[guildId]?.[userId]
      ? Object.entries(tempRoles[guildId][userId]).map(([roleId, data]) => ({
          roleId,
          ...data,
        }))
      : [];
  } catch (error) {
    logger.error("Failed to get user temporary roles", error);
    return [];
  }
}

/**
 * Gets all temporary roles for a guild.
 * @param {string} guildId
 * @returns {Promise<Object>}
 */
export async function getTemporaryRoles(guildId) {
  const logger = getLogger();
  try {
    const storageManager = await getStorageManager();
    const tempRoles = await storageManager.getTemporaryRoles();
    return tempRoles[guildId] || {};
  } catch (error) {
    logger.error("Failed to get temporary roles for guild", error);
    return {};
  }
}

/**
 * Parses a duration string (e.g., "1h30m") into milliseconds.
 * @param {string} durationStr
 * @returns {number|null}
 */
export function parseDuration(durationStr) {
  const regex = /(\d+)\s*(w|d|h|m)/g;
  let totalMs = 0;
  let match;
  while ((match = regex.exec(durationStr)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case "w":
        totalMs += value * 7 * 24 * 60 * 60 * 1000;
        break;
      case "d":
        totalMs += value * 24 * 60 * 60 * 1000;
        break;
      case "h":
        totalMs += value * 60 * 60 * 1000;
        break;
      case "m":
        totalMs += value * 60 * 1000;
        break;
    }
  }
  return totalMs > 0 ? totalMs : null;
}

/**
 * Formats a duration string into a human-readable format.
 * @param {string} durationStr
 * @returns {string}
 */
export function formatDuration(durationStr) {
  const ms = parseDuration(durationStr);
  if (!ms) return "Invalid duration";

  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  return parts.join(", ");
}

/**
 * Formats the remaining time until a date.
 * @param {Date|string} expiresAt
 * @returns {string}
 */
export function formatRemainingTime(expiresAt) {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);

  let remaining = "";
  if (days > 0) remaining += `${days}d `;
  if (hours > 0) remaining += `${hours}h `;
  if (minutes > 0) remaining += `${minutes}m`;
  return remaining.trim() || "Less than a minute";
}
