// Build-time Shiki theme matching the syntax colours in global.css (--color-syn-*).
export const editorTheme = {
  name: 'modelshelf-dark',
  type: 'dark' as const,
  colors: { 'editor.background': '#1e1f22', 'editor.foreground': '#bcbec4' },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#868a91', fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'keyword.operator.expression', 'constant.language', 'variable.language'],
      settings: { foreground: '#cf8e6d' },
    },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#6aab73' } },
    { scope: ['constant.numeric', 'constant.character.escape'], settings: { foreground: '#2aacb8' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call.generic'], settings: { foreground: '#56a8f5' } },
    {
      scope: ['meta.object-literal.key', 'support.type.property-name', 'variable.other.property', 'variable.parameter', 'entity.other.attribute-name', 'variable.other.constant.property'],
      settings: { foreground: '#c77dbb' },
    },
    { scope: ['entity.name.type', 'entity.name.class', 'support.class', 'support.type'], settings: { foreground: '#bcbec4' } },
    { scope: ['variable.other.readwrite', 'variable.other.object', 'variable.other.constant'], settings: { foreground: '#bcbec4' } },
  ],
};
