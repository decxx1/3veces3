// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://tresvecestres.com.ar',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  env: {
    schema: {
      WHATSAPP_PHONE: envField.string({ context: "client", access: "public", optional: true }),
      EMAIL: envField.string({ context: "client", access: "public", optional: true }),
      LINKEDIN_URL: envField.string({ context: "client", access: "public", optional: true }),
      INSTAGRAM_URL: envField.string({ context: "client", access: "public", optional: true }),
      FACEBOOK_URL: envField.string({ context: "client", access: "public", optional: true }),
      SECRET_KEY: envField.string({ context: "client", access: "public", optional: true }),
      SITE_KEY: envField.string({ context: "client", access: "public", optional: true }),
      ENDPOINT: envField.string({ context: "client", access: "public", optional: true }),
    }
  }
});