import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  return { draws: url.searchParams.get("draws") };
}) satisfies PageServerLoad;
