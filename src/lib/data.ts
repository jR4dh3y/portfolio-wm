export const profile = {
	name: 'RADHEY',
	lastName: 'KALRA',
	photo: '/assets/about.jpg',
	role: 'Full-stack Ecosystems / Audio Filters / Linux Infrastructures',
	tagline:
		'I engineer full-stack ecosystems, architect ML audio filters, and command Linux infrastructures. Creating digital experiences from the metal up.',
	about: [
		"I'm a Computer Science Engineering student who loves messing around with tech, open source, and building cool stuff. I'm always curious about how things work and end up learning best by experimenting and trying new projects.",
		"I'm efficient at leading groups, with experience gained through bootcamps, hackathons, and team projects. These opportunities have helped me improve my communication and leadership skills, manage responsibilities under pressure, and deliver results.",
		"When I'm not coding, you'll usually find me listening to or creating music. I love breaking it down and sometimes make my own. I also enjoy exploring new tools, research, and open source projects."
	]
};

export const experience = [
	{
		company: 'GDGoC MIET Jammu',
		role: 'Cloud Lead',
		period: 'Aug 2025 - Present',
		description:
			'Led cloud learning initiatives by organizing hands-on workshops focused on Google Cloud technologies.\nBuilt and maintained a tutorial website hosting video walkthroughs of Google Cloud Study Jam labs along with detailed notes to help students complete skill badges.',
		skills: ['GCP', 'TypeScript', 'Linux', 'Docker', 'Terraform'],
		links: [
			{ label: 'Tutorial Website', href: 'https://gcp-tutorial.vercel.app' },
			{ label: 'Github Repository', href: 'https://github.com/gdgoc-miet/gcp-tutorial-ui' }
		]
	},
	{
		company: 'AWS Cloud Club MIET Jammu',
		role: 'Cloud and DevOps Lead',
		period: 'Jan 2026 - Present',
		description:
			'Leading cloud and DevOps initiatives as part of the core team.\nDriving adoption of AWS cloud technologies and implementing DevOps best practices through workshops, projects, and mentoring.',
		skills: ['AWS', 'DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Terraform'],
		links: []
	}
];

export const projects = [
	{
		title: 'UNet Audio Filter',
		desc: 'Research project on audio enhancement using a custom U-Net-inspired architecture with an end-to-end training pipeline for denoising and source separation.',
		image:
			'https://raw.githubusercontent.com/jR4dh3y/unet-audiofilter/refs/heads/master/presentation/audio_comparison.png',
		tags: ['Python', 'PyTorch', 'U-Net', 'Streamlit', 'Audio DSP', 'ML'],
		githubUrl: 'https://github.com/jR4dh3y/unet-audiofilter'
	},
	{
		title: 'BoxBox',
		desc: 'Fast, lightweight file manager for Linux servers with multi-mount browsing, chunked transfers, and real-time updates. Supports live media preview, streaming, downloads, and Monaco Editor integration for in-browser file editing.',
		image: '/assets/files.png',
		tags: ['SvelteKit', 'Go', 'Docker', 'WebSocket', 'Monaco Editor'],
		githubUrl: 'https://github.com/jR4dh3y/boxbox',
		liveUrl: 'https://boxbox.radhey.dev/'
	},
	{
		title: 'Pico32',
		desc: 'Custom ESP32 wireless security firmware built around a serial TUI interface. Implements WiFi reconnaissance, packet capture, protocol-level attacks, and BLE device enumeration; all optimized to run on bare ESP32 dev boards.',
		image: 'https://raw.githubusercontent.com/jR4dh3y/Pico32/master/assets/ss.png',
		tags: ['ESP32', 'C++', 'PlatformIO', 'IoT', 'Firmware', 'WiFi', 'BLE'],
		liveUrl: 'https://pico32.radhey.dev',
		githubUrl: 'https://github.com/jR4dh3y/Pico32'
	},
	{
		title: 'Niri Dotfiles',
		desc: 'Reproducible NiriWM rice with automation setup; a single-command bootstrapper that provisions packages, symlinks configs, copies assets, and enables desktop services on Arch Linux.',
		image: '/assets/dots-niri.png',
		tags: ['Niri', 'Wayland', 'Arch Linux', 'Shell', 'Ricing', 'Unix-Porn'],
		liveUrl: 'https://rice.jr4.in',
		githubUrl: 'https://github.com/jR4dh3y/dots-niri'
	},
	{
		title: 'WallpyGui',
		desc: 'Wallpaper manager for Wayland compositors with support for Video as Wallpaper.',
		image: '/assets/wall.png',
		tags: ['Linux', 'GTK', 'Wayland', 'Python'],
		githubUrl: 'https://github.com/jR4dh3y/wallpygui'
	},
	{
		title: 'iwd-applet',
		desc: 'Lightweight system tray applet for iwd (iNet wireless daemon) with a menu-driven UX.',
		image: '/assets/iwd-applet.png',
		tags: ['Python', 'GTK', 'Linux', 'iwd'],
		githubUrl: 'https://github.com/jR4dh3y/iwd-applet'
	},
	{
		title: 'Terminal Doom',
		desc: 'Doom styled game that runs in terminal using ncurses library.',
		image: '/assets/doom.png',
		tags: ['C++', 'ncurses', 'cmake', 'Game Dev'],
		githubUrl: 'https://github.com/jR4dh3y/doom-in-terminal'
	},
	{
		title: 'Community Leaderboard',
		desc: 'Community management dashboard with user profiles, event tracking, points system, leaderboards, and admin controls',
		image: '/assets/dash.png',
		tags: ['React', 'Node.js', 'Express', 'ConvexDB', 'Clerk Auth'],
		liveUrl: 'https://dash.radhey.dev/',
		githubUrl: 'https://github.com/jR4dh3y/unidash'
	},
	{
		title: 'Hotel Booking',
		desc: 'Full-stack booking app with auth & admin panel written in Svelte & Node.js, uses MySQL database.',
		image: 'https://raw.githubusercontent.com/jR4dh3y/hotel-booking/refs/heads/main/ss/landing.png',
		tags: ['Svelte', 'Node.js', 'Express', 'MySQL'],
		githubUrl: 'https://github.com/jR4dh3y/hotel-booking'
	},
	{
		title: 'vidown',
		desc: 'Self-hosted video downloader supporting 1000+ sites with a beautiful SvelteKit UI.',
		image: '/assets/vidown.png',
		tags: ['SvelteKit', 'Docker', 'Python', 'shadcn-svelte'],
		githubUrl: 'https://github.com/jR4dh3y/vidown'
	},
	{
		title: 'TL;DR AI',
		desc: 'Summarize WhatsApp Groups Chats using AI. Uses your openrouter API key to process data(you can you free models).',
		image: 'https://github.com/jR4dh3y/tldr-desktop/raw/master/img/ss.png',
		tags: ['React', 'Electron', 'TypeScript', 'OpenRouter'],
		githubUrl: 'https://github.com/jR4dh3y/tldr-desktop'
	},
	{
		title: 'Tenant Manager',
		desc: 'A mobile app to manage tenant and log their electricity usages.',
		image: 'https://github.com/jR4dh3y/tennet-manager/raw/master/photo.png',
		tags: ['React Native', 'Expo', 'TypeScript'],
		githubUrl: 'https://github.com/jR4dh3y/tennet-manager'
	},
	{
		title: 'HowTo',
		desc: 'Minimal technical tutorials and guides site built with Astro and Tailwind CSS.',
		image: '/assets/howto.png',
		tags: ['Astro', 'Tailwind CSS', 'TypeScript', 'Guides'],
		githubUrl: 'https://github.com/jR4dh3y/howTo',
		liveUrl: 'https://howto.jr4.in'
	}
];

export const skills = [
	{
		category: 'Languages',
		items: ['Python', 'TypeScript', 'C/C++', 'Go', 'Rust', 'SQL', 'Lua', 'LaTeX']
	},
	{ category: 'Frameworks', items: ['Next.js', 'SvelteKit', 'Astro', 'Expo', 'Tailwind', 'QML'] },
	{ category: 'AI/ML', items: ['PyTorch', 'TensorFlow'] },
	{
		category: 'Cloud & DevOps',
		items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Linux']
	}
];

export const socialLinks = [
	{ icon: 'Github', href: 'https://github.com/jr4dh3y', label: 'Github' },
	{ icon: 'Linkedin', href: 'https://linkedin.com/in/radheykalra', label: 'LinkedIn' },
	{ icon: 'XIcon', href: 'https://x.com/jr4dh3y', label: 'X' },
	{ icon: 'Mail', href: 'mailto:radheykalra901@gmail.com', label: 'Email' },
	{
		icon: 'Download',
		href: 'https://raw.githubusercontent.com/jR4dh3y/cv/main/main.pdf',
		label: 'Download CV'
	}
];
