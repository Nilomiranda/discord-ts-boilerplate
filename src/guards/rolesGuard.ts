import Discord from 'discord.js'

export enum UserRole {
  ADMIN = 'Administrators',
  SUPPORT = 'Support',
  MODERATORS = 'Administrators',
}

// Administrators, Support, Moderators

export const validateRoleOfRequestingUser = (roles: Discord.Collection<string, Discord.Role>, allowedRoles: UserRole | UserRole[]): boolean => {
  const mappedRoles = roles?.map((role) => role.name)

  if (Array.isArray(allowedRoles)) {
    return !!allowedRoles.filter((allowedRole) => mappedRoles.includes((allowedRole as unknown) as string))?.length
  }

  return mappedRoles?.includes(allowedRoles)
}
