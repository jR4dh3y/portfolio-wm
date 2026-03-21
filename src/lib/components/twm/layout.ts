import type { Component } from 'svelte';

import AboutPane from '$lib/components/twm/AboutPane.svelte';
import ExperiencePane from '$lib/components/twm/ExperiencePane.svelte';
import HeroPane from '$lib/components/twm/HeroPane.svelte';
import HomelabPane from '$lib/components/twm/HomelabPane.svelte';
import ProjectsPane from '$lib/components/twm/ProjectsPane.svelte';
import SkillsPane from '$lib/components/twm/SkillsPane.svelte';
import TerminalPane from '$lib/components/twm/TerminalPane.svelte';

export type PaneId =
	| 'homelab'
	| 'terminal'
	| 'hero'
	| 'about'
	| 'skills'
	| 'projects'
	| 'experience';
export type WorkspaceId = 'workspace-1' | 'workspace-2' | 'workspace-3';
export type Direction = 'left' | 'right' | 'up' | 'down';

export type PaneMeta = {
	id: PaneId;
	title: string;
	shortcut: string;
	component: Component;
	className?: string;
};

export type WorkspaceColumn = {
	id: string;
	className: string;
	panes: PaneMeta[];
};

export type WorkspaceMeta = {
	id: WorkspaceId;
	label: string;
	hint: string;
	columns: WorkspaceColumn[];
};

export type BottomBarAppletId =
	| 'identity'
	| 'role'
	| 'active-pane'
	| 'workspaces'
	| 'wallpaper'
	| 'help'
	| 'time';

export type BottomBarZone = 'left' | 'right';

export type BottomBarAppletPlacement = {
	id: BottomBarAppletId;
	zone: BottomBarZone;
	order: number;
};

export const panes: Record<PaneId, PaneMeta> = {
	homelab: {
		id: 'homelab',
		title: 'homelab.sh',
		shortcut: '1',
		component: HomelabPane,
		className: 'h-full min-h-0'
	},
	terminal: {
		id: 'terminal',
		title: 'terminal',
		shortcut: '',
		component: TerminalPane,
		className: 'h-full min-h-0'
	},
	hero: {
		id: 'hero',
		title: 'profile.svelte',
		shortcut: '2',
		component: HeroPane,
		className: 'h-full'
	},
	about: {
		id: 'about',
		title: 'about.txt',
		shortcut: '3',
		component: AboutPane,
		className: 'h-full min-h-0'
	},
	skills: {
		id: 'skills',
		title: 'skills.py',
		shortcut: '4',
		component: SkillsPane,
		className: 'h-full min-h-0'
	},
	projects: {
		id: 'projects',
		title: 'projects.dir',
		shortcut: '5',
		component: ProjectsPane,
		className: 'h-full'
	},
	experience: {
		id: 'experience',
		title: 'experience.md',
		shortcut: '6',
		component: ExperiencePane,
		className: 'h-full'
	}
};

export const workspaces: WorkspaceMeta[] = [
	{
		id: 'workspace-1',
		label: '1',
		hint: 'intro / context',
		columns: [
			{
				id: 'hero-column',
				className: 'w-[50%] min-w-[50%] max-w-[50%]',
				panes: [panes.hero]
			},
			{
				id: 'info-column',
				className: 'workspace-column-stack w-[50%] min-w-[50%] max-w-[50%]',
				panes: [panes.about, panes.skills]
			},
			{
				id: 'homelab-column',
				className:
					'workspace-column-stack workspace-column-stack-homelab w-[50%] min-w-[50%] max-w-[50%]',
				panes: [panes.homelab, panes.terminal]
			}
		]
	},
	{
		id: 'workspace-2',
		label: '2',
		hint: 'build log',
		columns: [
			{
				id: 'projects-column',
				className: 'w-[50%] min-w-[50%] max-w-[50%]',
				panes: [panes.projects]
			},
			{
				id: 'experience-column',
				className: 'w-[50%] min-w-[50%] max-w-[50%]',
				panes: [panes.experience]
			}
		]
	},
	{
		id: 'workspace-3',
		label: '3',
		hint: 'wallpaper',
		columns: []
	}
];

// Bottom bar applet layout (edit this to reorder or move applets across left/right sections).
export const bottomBarAppletPlacements: BottomBarAppletPlacement[] = [
	{ id: 'identity', zone: 'left', order: 1 },
	{ id: 'workspaces', zone: 'left', order: 2 },
	{ id: 'active-pane', zone: 'left', order: 3 },
	{ id: 'help', zone: 'right', order: 1 },
	{ id: 'wallpaper', zone: 'right', order: 2 },
	{ id: 'role', zone: 'right', order: 3 },
	{ id: 'time', zone: 'right', order: 4 }
];

export const mobilePaneOrder: PaneMeta[] = [
	panes.hero,
	panes.projects,
	panes.homelab,
	panes.terminal,
	panes.experience,
	panes.about,
	panes.skills
];

export const shortcutToPaneId: Record<string, PaneId> = Object.fromEntries(
	Object.values(panes).map((pane) => [pane.shortcut, pane.id])
) as Record<string, PaneId>;

const workspaceIdsByPane = new Map<PaneId, WorkspaceId>(
	workspaces.flatMap((workspace) =>
		workspace.columns.flatMap((column) =>
			column.panes.map((pane) => [pane.id, workspace.id] as const)
		)
	)
);

export function getWorkspaceIdForPane(paneId: PaneId): WorkspaceId {
	return workspaceIdsByPane.get(paneId) ?? 'workspace-1';
}

export function getWorkspaceById(workspaceId: WorkspaceId): WorkspaceMeta {
	return workspaces.find((workspace) => workspace.id === workspaceId) ?? workspaces[0];
}

export function getFirstPaneIdForWorkspace(workspaceId: WorkspaceId): PaneId | null {
	const workspace = getWorkspaceById(workspaceId);
	return workspace.columns[0]?.panes[0]?.id ?? null;
}

const paneNeighbors: Record<PaneId, Partial<Record<Direction, PaneId>>> = {
	homelab: {
		right: 'hero',
		down: 'terminal'
	},
	terminal: {
		right: 'hero',
		up: 'homelab',
		down: 'projects'
	},
	hero: {
		left: 'terminal',
		right: 'about',
		down: 'projects'
	},
	about: {
		left: 'hero',
		down: 'skills'
	},
	skills: {
		left: 'hero',
		up: 'about',
		down: 'experience'
	},
	projects: {
		up: 'hero',
		right: 'experience'
	},
	experience: {
		left: 'projects',
		up: 'skills'
	}
};

export function getNeighborPaneId(paneId: PaneId, direction: Direction): PaneId {
	return paneNeighbors[paneId][direction] ?? paneId;
}
