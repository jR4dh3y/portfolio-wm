<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>RADHEY KALRA | Portfolio</title>
	<meta
		name="description"
		content="Portfolio of Radhey Kalra - Full-stack Ecosystems, Audio Filters, Linux Infrastructures"
	/>
</svelte:head>

<div
	id="top"
	class="flex min-h-screen w-full flex-col items-center bg-[var(--color-background)] text-foreground"
>
	<Hero />
	<About />
	<Projects />
	<Experience />
	<Skills />
	<Footer />
</div>
