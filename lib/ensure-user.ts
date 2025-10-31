import { prisma } from './db'

export async function ensureUserExists(email: string, name?: string | null, image?: string | null): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: name || undefined,
      image: image || undefined,
    },
    create: {
      email,
      name: name || undefined,
      image: image || undefined,
    },
  })
  return user.id
}
