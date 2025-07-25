/**
 * Unescapes HTML entities in a string.
 * @param {string} str The string to unescape.
 * @returns {string} The unescaped string.
 */
function unescapeHtml(str) {
  return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

/**
 * Parses a string of roles into an array of role objects.
 * @param {string} roleString The string to parse.
 * @returns {{roles: Array<object>, errors: Array<string>}} The parsed roles and any errors.
 */
export function parseRoleString(roleString) {
  const roles = [];
  const errors = [];
  const input = unescapeHtml(roleString.trim());

  const parts = input.split(/\s*(?:,|;|\n)\s*/).filter(Boolean);
  for (const part of parts) {
    let str = part.trim();

    const emojiMatch = str.match(
      /^(<a?:.+?:\d+>|[\p{Emoji_Presentation}\p{Emoji}\uFE0F])/u,
    );
    if (!emojiMatch) {
      errors.push(`Invalid or missing emoji in part: "${part}"`);
      continue;
    }
    const emoji = emojiMatch[0];
    str = str.slice(emoji.length).trim();

    if (str.startsWith(":")) str = str.slice(1).trim();

    let limit = null;
    const limitMatch = str.match(/(?::|\s)(\d+)$/);
    if (limitMatch) {
      limit = parseInt(limitMatch[1], 10);
      str = str.slice(0, limitMatch.index).trim();
    }

    let roleName = null;
    let roleId = null;
    if (str.startsWith('"')) {
      const quoteMatch = str.match(/^"([^"]+)"$/);
      if (quoteMatch) {
        roleName = quoteMatch[1];
      } else {
        errors.push(`Invalid quoted role name in part: "${part}"`);
        continue;
      }
    } else if (str.match(/^<@&\d+>$/)) {
      roleName = str;
      roleId = str.match(/^<@&(\d+)>$/)[1];
    } else if (str.match(/^@&\d+$/)) {
      roleName = `<${str}>`;
      roleId = str.match(/^@&(\d+)$/)[1];
    } else {
      roleName = str;
    }

    if (!roleName) {
      errors.push(`Invalid role name in part: "${part}"`);
      continue;
    }

    if (limit !== null && (isNaN(limit) || limit < 1 || limit > 1000)) {
      errors.push(`Invalid user limit in part: "${part}" (must be 1-1000)`);
      continue;
    }

    const existingRole = roles.find(r => r.emoji === emoji);
    if (existingRole) {
      errors.push(
        `Duplicate emoji ${emoji} found for roles: "${
          existingRole.roleName || existingRole.roleId
        }" and "${roleName || roleId}"`,
      );
      continue;
    }

    roles.push({ emoji, roleName, roleId, limit });
  }
  return { roles, errors };
}
