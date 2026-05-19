<script lang="ts">
	import { skills } from '$lib/data';

	type TokenKind = 'comment' | 'keyword' | 'variable' | 'string' | 'punctuation' | 'decorator';
	type Token = { text: string; kind: TokenKind };

	const kindClasses: Record<TokenKind, string> = {
		comment: 'text-dim',
		keyword: 'text-highlight',
		variable: 'text-accent',
		string: 'text-fg/90',
		punctuation: 'text-dim/70',
		decorator: 'text-caution'
	};

	const t = (text: string, kind: TokenKind): Token => ({ text, kind });

	const toPythonVar = (title: string) =>
		title
			.toLowerCase()
			.replaceAll('&', 'and')
			.replaceAll(/[^a-z0-9]+/g, '_')
			.replaceAll(/^_+|_+$/g, '');

	const MAX_SKILLS_PER_LINE = 6;

	const lines: Token[][] = [
		[],
		...skills.flatMap((group) => {
			const comment: Token[] = [t(`# ${group.title}`, 'comment')];
			const chunks: Token[][] = [];
			const varName = toPythonVar(group.title);
			const indent = ' '.repeat(varName.length + ' = ['.length);

			for (let i = 0; i < group.skills.length; i += MAX_SKILLS_PER_LINE) {
				const slice = group.skills.slice(i, i + MAX_SKILLS_PER_LINE);
				const isFirst = i === 0;
				const isLast = i + MAX_SKILLS_PER_LINE >= group.skills.length;
				const line: Token[] = [];

				if (isFirst) {
					line.push(t(varName, 'variable'));
					line.push(t(' = ', 'punctuation'));
					line.push(t('[', 'keyword'));
				} else {
					line.push(t(indent, 'punctuation'));
				}

				slice.forEach((entry, si) => {
					line.push(t(`'${entry.name}'`, 'string'));
					if (!(isLast && si === slice.length - 1)) {
						line.push(t(', ', 'punctuation'));
					}
				});

				if (isLast) {
					line.push(t(']', 'keyword'));
				}

				chunks.push(line);
			}

			return [comment, ...chunks];
		})
	];
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="min-h-0 flex-1 border border-border/70 bg-bg/40">
		<div class="font-mono text-[13px] leading-[1.65]">
			<div class="grid grid-cols-[3rem_minmax(0,1fr)]">
				{#each lines as lineTokens, index (`line-${index}`)}
					<div class="border-r border-border/70 pr-2 text-right text-dim/50 select-none">
						{index + 1}
					</div>
					<div class="pl-3 whitespace-pre">
						{#each lineTokens as tok, ti (`tok-${index}-${ti}`)}
							<span class={kindClasses[tok.kind]}>{tok.text}</span>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
