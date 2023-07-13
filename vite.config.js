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
				src: "./logo.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "./logo.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "./logo.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "apple touch icon",
			},
			{
				src: "./logo.png",
				sizes: "225x225",
				type: "image/png",
				purpose: "any maskable",
			},
		],
		theme_color: "black",
		background_color: "black",
		display: "standalone",
		// scope: "/",
		start_url: ".",
		orientation: "portrait",
	},
};
// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	plugins: [react(), VitePWA(manifestForPlugin)],
});
