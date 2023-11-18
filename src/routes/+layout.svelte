<slot />

<style>
	:global(body) {
		font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
			'Segoe UI Emoji', 'Segoe UI Symbol';
		margin: 0;

		--border: black;
		--border-light: #aaa;

		--text: #000;
		--text-light: #555;
		--text-light-big: #777;
		--text-link: blue;
		--text-red: red;

		--background: #fff;
		--background-selected: #eee;
		--background-sidebar: #ddd;
		--background-red: red;
		--background-yellow: yellow;
		--background-info: lightblue;

		--shadow-sidebar: #ccc;

		background-color: var(--background);
		color: var(--text);
	}
	:global(*) {
		box-sizing: border-box;
	}
	:global(a) {
		text-decoration: none;
		color: var(--text-link);
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			--border: #aaa;
			--border-light: #444;

			--text: #fff;
			--text-light: #aaa;
			--text-light-big: #777;
			--text-link: #00bbff;
			--text-red: red;

			--background: #222;
			--background-selected: #111;
			--background-sidebar: #111;
			--background-red: #770000;
			--background-yellow: #777700;
			--background-info: #000066;

			--shadow-sidebar: #000;
		}
	}
</style>
