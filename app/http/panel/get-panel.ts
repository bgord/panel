import * as bg from "@bgord/bun";
import type hono from "hono";
import type * as infra from "+infra";
import * as Panel from "+panel";

type Dependencies = { RemoteFileStorage: bg.RemoteFileStoragePort };

export const GetPanel = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const headers = context.request.headers();

  const language = c.get("language");

  const key = Panel.VO.PanelKeyFactory.stable(language);

  const head = await deps.RemoteFileStorage.head(key);
  if (!head.exists) return c.notFound();

  const ifNoneMatchHeader = headers.get("if-none-match");

  if (ifNoneMatchHeader && bg.Hash.fromString(ifNoneMatchHeader).matches(head.etag)) {
    return bg.CacheFileMustRevalidate.notModified(head);
  }

  const stream = await deps.RemoteFileStorage.getStream(key);
  if (!stream) return c.notFound();

  return new Response(stream, { headers: bg.CacheFileMustRevalidate.fresh(head) });
};
