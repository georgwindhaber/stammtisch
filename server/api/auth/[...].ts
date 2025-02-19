import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import { users } from "~/server/database/schema";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        throw new Error(
          "Auth provider did not return a user email address on login"
        );
      }

      const membersAndAdmins = await useDrizzle()
        .select({ name: users.name, role: users.role, email: users.email })
        .from(users)
        .where(or(eq(users.role, "member"), eq(users.role, "admin")));

      return membersAndAdmins.some((member) => member.email === user.email);
    },
    async session({ session }) {
      if (!session.user?.email) {
        throw new Error("Session does not contain an email address");
      }

      const databaseUser = await useDrizzle()
        .select()
        .from(tables.users)
        .where(eq(users.email, session.user.email));

      return {
        ...session,
        user: {
          ...session.user,
          userId: databaseUser[0].userId,
        },
      };
    },
  },
});
