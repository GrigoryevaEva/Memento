<script setup lang="ts">
    import { useBreakpoints } from '@/composables';

    import CustomButton from './CustomButton.vue';

    type Theme = 'main' | 'ready' | 'overdue';
    interface Props {
        hover?: boolean;
        theme?: Theme;
        whenEdit?: () => void;
        whenDelete?: () => void;
    }

    const props = withDefaults(defineProps<Props>(), {
        hover: true,
        theme: 'main',
        whenEdit: undefined,
        whenDelete: undefined,
    });

    const { isMobileAndTablet } = useBreakpoints();
</script>

<template>
    <div
        class="customButton"
        :class="{
            ['rootHover']: hover,
            [theme]: theme !== 'main',
        }"
    >
        <div class="content">
            <slot></slot>
        </div>
        <div
            v-if="hover"
            class="buttonsContainer"
            :class="{
                ['buttonsContainerMobile']: isMobileAndTablet,
            }"
        >
            <CustomButton
                theme="blue"
                icon="edit"
                :shadow="false"
                :when-click="whenEdit"
            />
            <CustomButton
                theme="red"
                icon="trash"
                :shadow="false"
                :when-click="whenDelete"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
    .customButton {
        // width: fit-content;
        // max-width: 100%;
        flex: 1;
        min-width: fit-content;
        background-color: var(--bg-white);
        padding: var(--padding-6);

        border-radius: var(--radius-3xl);

        box-shadow: var(--shadow-md);

        .buttonsContainer {
            display: flex;
            gap: var(--gap-2);

            width: fit-content;
            height: fit-content;

            opacity: 0;
            transition: opacity 0.2s;

            &Mobile {
                opacity: 1;
                flex-direction: column;
            }
        }
    }
    .ready {
        border: 1px var(--bg-yellow-300) solid;
    }

    .overdue {
        border: 1px var(--bg-pink-300) solid;
    }
    .rootHover {
        display: flex;
        gap: var(--gap-2);
        .content {
            flex: 1;
            min-width: 0;
            display: flex;
            align-items: center;
        }
        &:hover {
            box-shadow: var(--shadow-lg);
        }
        &:hover .buttonsContainer {
            opacity: 1;
        }
        transition: all 0.2s;
    }
</style>
