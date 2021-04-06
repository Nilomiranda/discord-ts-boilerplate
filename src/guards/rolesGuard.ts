import Discord, { Message } from 'discord.js'

export enum UserRole {
  ADMIN = 'Administrators',
  SUPPORT = 'Support',
  MODERATOR = 'Moderator',
  DEVS = 'Devs',
}

export const validateRole = (roles: Discord.Collection<string, Discord.Role>, allowedRoles: UserRole | UserRole[]): boolean => {
  const mappedRoles = roles?.map((role) => role.name)

  if (Array.isArray(allowedRoles)) {
    return !!allowedRoles.filter((allowedRole) => mappedRoles.includes((allowedRole as unknown) as string))?.length
  }

  return mappedRoles?.includes(allowedRoles)
}

const replyFunction = (message) => {
  return message.reply('Sorry, you are not allowed to use this command. Please ask a staff member for assistance adding links.')
}

export const guardedFunctionWrapper = <ArgType, ReturnType>(
  message: Message,
  allowedRoles: UserRole | UserRole[],
  callback: (...args: ArgType[]) => ReturnType
): ((...args: ArgType[]) => ReturnType) => {
  if (validateRole(message?.member?.roles?.cache, allowedRoles)) {
    return callback
  }

  return replyFunction
}
