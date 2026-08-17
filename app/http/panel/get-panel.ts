import * as bg from "@bgord/bun";
import * as Panel from "+panel";

type Dependencies = { RemoteFileStorage: bg.RemoteFileStoragePort };

export const GetPanel =
  (deps: Dependencies): bg.EndpointPort<bg.HasRequestHeaders & bg.HasMiddlewareLanguage> =>
  async (context) => {
    const headers = context.request.headers();

    const key = Panel.VO.PanelKeyFactory.stable(context.middleware.language());

    const head = await deps.RemoteFileStorage.head(key);
    if (!head.exists) return new Response(null, { status: 404 });

    const ifNoneMatchHeader = headers.get("if-none-match");

    if (ifNoneMatchHeader && bg.Hash.fromString(ifNoneMatchHeader).matches(head.etag)) {
      return bg.CacheFileMustRevalidate.notModified(head);
    }

    const stream = await deps.RemoteFileStorage.getStream(key);
    if (!stream) return new Response(null, { status: 404 });

    return new Response(stream, { headers: bg.CacheFileMustRevalidate.fresh(head) });
  };
