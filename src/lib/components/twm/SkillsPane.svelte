<script lang="ts">
	import { skills } from '$lib/data';

	type TokenKind = 'brace' | 'key' | 'string' | 'punctuation';
	type JsonToken = {
		text: string;
		kind: TokenKind;
	};

	const tokenClasses: Record<TokenKind, string> = {
		brace: 'text-fg',
		key: 'text-accent',
		string: 'text-fg',
		punctuation: 'text-dim'
	};

	const token = (text: string, kind: TokenKind): JsonToken => ({ text, kind });
	const topPaddingLines = 3;
	const bottomPaddingLines = 6;

	const toPythonVariable = (title: string) =>
		title
			.toLowerCase()
			.replaceAll('&', 'and')
			.replaceAll(/[^a-z0-9]+/g, '_')
			.replaceAll(/^_+|_+$/g, '');

	const jsonLines: JsonToken[][] = [
		...Array.from({ length: topPaddingLines }, () => [] as JsonToken[]),
		...skills.flatMap((group, groupIndex) => {
			const assignmentLine: JsonToken[] = [
				token(toPythonVariable(group.title), 'key'),
				token(' = [', 'punctuation'),
				...group.skills.flatMap((entry, skillIndex) => [
					token(`'${entry.name}'`, 'string'),
					token(skillIndex === group.skills.length - 1 ? '' : ', ', 'punctuation')
				]),
				token(']', 'brace')
			];

			if (groupIndex === skills.length - 1) {
				return [assignmentLine];
			}

			return [assignmentLine, []];
		}),
		...Array.from({ length: bottomPaddingLines }, () => [] as JsonToken[])
	];
</script>

<div class="flex h-full w-full flex-col">
	<div class="min-h-0 flex-1 overflow-auto border border-border/70 bg-bg/40">
		<div class="min-w-max font-mono text-[13px] leading-5">
			<div class="grid grid-cols-[3.5rem_minmax(0,1fr)]">
				{#each jsonLines as lineTokens, index (`json-line-${index}`)}
					<div class="h-5 border-r border-border/70 pr-2 text-right text-dim/70 select-none">
						{index + 1}
					</div>
					<div class="h-5 pl-3 whitespace-pre">
						{#each lineTokens as token, tokenIndex (`json-token-${index}-${tokenIndex}`)}
							<span class={tokenClasses[token.kind]}>{token.text}</span>
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
