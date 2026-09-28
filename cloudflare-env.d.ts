declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    BAIDU_MAP_BROWSER_AK?: string;
    BAIDU_MAP_ENABLED?: string;
  }
}
