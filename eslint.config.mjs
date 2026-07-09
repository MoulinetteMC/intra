// @ts-check

import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
	files: ["**/*.{js,ts}"],
	extends: [
		tseslint.configs.strictTypeChecked,
		tseslint.configs.stylisticTypeChecked,
	],
	languageOptions: {
		parserOptions: {
			projectService: true,
		},
	},
});
