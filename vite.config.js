import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
const manifestForPlugin = {
	registerType: "prompt",
	includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
	manifest: {
		name: "Checkably",
		short_name: "Checkably",
		description: "A checklist app.",
		icons: [
			{
				src: "./pwa/maskable_icon_x192.png",
				sizes: "192x192",
				type: "image/png",
        purpose: "maskable",
			},
			{
				src: "./pwa/maskable_icon_x512.png",
				sizes: "512x512",
				type: "image/png",
        purpose: "maskable",
			},
			{
				src: "./pwa/maskable_icon_x384.png",
				sizes: "384x384",
				type: "image/png",
				purpose: "maskable",
			},
      {
				src: "./logo.png",
				sizes: "512x512",
				type: "image/png"
			},
		],
		theme_color: "black",
		background_color: "black",
		display: "standalone",
		start_url: ".",
		orientation: "portrait",
	},
};
// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	plugins: [react(), VitePWA(manifestForPlugin)],
});
