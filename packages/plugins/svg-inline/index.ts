import { createUnplugin } from 'unplugin'

function toDataUrl (code: string) {
  var mime = 'image/svg+xml'
  var buffer = Buffer.from(code, 'utf-8')
  var encoded = buffer.toString('base64')
  return ("'data:" + mime + ";base64," + encoded + "'")
}

type UserOptions = {
  base64: boolean;
};

export const unplugin = createUnplugin((options: UserOptions) => {
  return {
    name: '@pixso/svg-inline',
    transformInclude(id) {
      return id.endsWith('.svg')
    },
    transform(code) {
      var content = code.trim();
      var encoded = options?.base64 ? toDataUrl(content) : JSON.stringify(content);

      return { code: ("export default " + encoded), map: { mappings: '' } }
    }
  }
});

export const vitePlugin = unplugin.vite
export const rollupPlugin = unplugin.rollup
export const webpackPlugin = unplugin.webpack
export const rspackPlugin = unplugin.rspack
export const esbuildPlugin = unplugin.esbuild