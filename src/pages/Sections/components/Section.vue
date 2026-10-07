<script setup lang="ts">
    import { useRouter } from 'vue-router';

    import { CARDS_PATH } from '@/app/routing/constants';

    import { useCardStore } from '@/stores/cards';
    import { ISection, useSectionStore } from '@/stores/sections';

    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CardContainer from '@/shared/ui/components/CardContainer.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    interface Props {
        section: ISection;
        whenGetUpdateSection: (section: ISection) => void;
    }
    const props = withDefaults(defineProps<Props>(), {});

    const sectionStore = useSectionStore();
    const cardStore = useCardStore();

    const router = useRouter();

    const countNewCards = cardStore.getCountNewSectionCards(props.section.id);
    const countOverdueCards = cardStore.getCountOverdueSectionCards(props.section.id);

    const handleTransferToCards = (sectionId: string) => router.push(CARDS_PATH(sectionId));

    const handleUpdate = () => props.whenGetUpdateSection(props.section);

    const handleDelete = () => sectionStore.deleteSection(props.section.id);
</script>

<template>
    <CardContainer
        :when-edit="handleUpdate"
        :when-delete="handleDelete"
        @click="handleTransferToCards(section.id)"
    >
        <div class="section">
            <div>
                <div
                    class="iconContainer"
                    :class="`${section.color}BcgColor`"
                >
                    <IconSprite
                        name="folderOpen"
                        class="icon"
                    />
                </div>
            </div>
            <div class="sectionInfo">
                <CustomText
                    class="name"
                    :text="section.name"
                    size="xl"
                />
                <CustomText
                    class="count"
                    :text="`Карточек: ${cardStore.getCountSectionCards(section.id)}`"
                />
                <CustomText
                    v-if="countNewCards"
                    class="new"
                    :text="`Новые: ${countNewCards}`"
                />
                <CustomText
                    v-if="countOverdueCards"
                    class="overdue"
                    :text="`Просрочено: ${countOverdueCards}`"
                />
            </div>
        </div>
    </CardContainer>
</template>

<style scoped lang="scss">
    .section {
        display: flex;
        gap: var(--gap-4);

        min-width: 0;

        &Info {
            display: flex;
            flex-direction: column;
            gap: var(--gap-2);

            flex: 1;
            min-width: 0;

            .name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .count {
                color: var(--text-purple-650);
            }

            .new {
                color: var(--text-pink-600);
            }

            .overdue {
                color: var(--text-red-600);
            }

            p {
                font-size: var(--text-sm);
            }

            h3 {
                font-size: var(--text-lg);
            }
        }
    }
    .icon {
        width: 1.75rem;
        height: 1.75rem;

        color: var(--text-purple-700);
    }

    .iconContainer {
        padding: var(--padding-3);
        width: fit-content;
        border-radius: var(--radius-2xl);
    }

    $colors: purple, pink, blue, green, yellow, orange;
    @each $color in $colors {
        .#{$color}BcgColor {
            background-color: var(--bg-#{$color}-200);
        }
    }
</style>
