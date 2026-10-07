<script setup lang="ts">
    import IconSprite from '../assets/icons/IconSprite.vue';
    import type { TIconName } from '../assets/icons/types';
    import CustomText from './CustomText.vue';

    type Themes = 'main' | 'secondary' | 'transparent' | 'blue' | 'red' | 'green';
    interface Props {
        icon?: TIconName;
        text?: string;
        theme?: Themes;
        shadow?: boolean;
        size?: '100' | '200';
        whenClick?: () => void;
    }

    const props = withDefaults(defineProps<Props>(), {
        icon: undefined,
        text: undefined,
        theme: 'main',
        shadow: true,
        size: '100',
        whenClick: () => {},
    });
</script>

<template>
    <button
        class="container"
        :class="{
            [theme]: theme,
            ['shadow']: shadow,
            [`container${size}`]: size,
        }"
        @click.stop="whenClick"
    >
        <IconSprite
            v-if="icon"
            :name="icon"
            class="icon"
            width="16"
        />
        <CustomText
            v-if="text"
            :text="text"
            class="text"
        />
    </button>
</template>

<style scoped lang="scss">
    .container {
        display: flex;
        gap: var(--gap-2);
        align-items: center;
        justify-content: center;

        width: fit-content;

        border-radius: var(--radius-3xl);

        font-size: var(--text-base);

        cursor: pointer;

        transition: all 0.2s;

        &100 {
            padding: var(--padding-2) var(--padding-3);

            .icon {
                width: 1.2rem;
            }
        }

        &200 {
            padding: var(--padding-4);

            .icon {
                height: 2rem;
                width: 2rem;
            }
        }

        .text {
            white-space: nowrap;
        }
    }

    .shadow {
        box-shadow: var(--shadow-md);
    }

    .main {
        background-color: var(--bg-purple-400);
        &:hover {
            background-color: var(--bg-purple-500);
        }
        .icon,
        .text {
            color: var(--text-white);
        }
    }
    .blue {
        background-color: var(--bg-blue-100);
        border-radius: var(--radius-full);
        &:hover {
            background-color: var(--bg-blue-200);
        }
        .icon,
        .text {
            color: var(--text-blue-600);
        }
    }
    .red {
        background-color: var(--bg-red-100);
        border-radius: var(--radius-full);
        &:hover {
            background-color: var(--bg-red-200);
        }
        .icon,
        .text {
            color: var(--text-red-600);
        }
    }
    .transparent {
        border-radius: var(--radius-full);
        background-color: transparent;
        &:hover {
            background-color: var(--bg-purple-50);
        }
        .icon,
        .text {
            color: var(--text-purple-700);
        }
    }
</style>
