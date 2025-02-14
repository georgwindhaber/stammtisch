import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  const apiRegex = /\/api(?!\/auth)\b/;

  if (apiRegex.test(event.path)) {
    const session = await getServerSession(event);
    if (!session) {
      throw createError({
        statusMessage: "Unauthenticated",
        statusCode: 403,
      });
    }
  }
});
