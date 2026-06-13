import { createContext } from 'svelte';
import type { Project } from '$lib/data';

export const [getProjectsContext, setProjectsContext] = createContext<Project[] | undefined>();
