import postcssNested from 'postcss-nesting';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-nesting': postcssNested(),
  },
}
