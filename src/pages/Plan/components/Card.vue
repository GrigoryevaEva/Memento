<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';

    import { useTimeAgoIntl } from '@vueuse/core';

    import { CARDS_PATH } from '@/app/routing/constants';

    import { ICard, useCardStore } from '@/stores/cards';
    import { useSectionStore } from '@/stores/sections';

    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CardContainer from '@/shared/ui/components/CardContainer.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import { useDateFormatter } from '@/composables';

    interface Props {
        card: ICard;
    }
    const props = withDefaults(defineProps<Props>(), {});

    const cardStore = useCardStore();
    const sectionStore = useSectionStore();
    const router = useRouter();

    const { getDayMonth } = useDateFormatter();

    const handleTransferToCards = () => router.push(CARDS_PATH(props.card.sectionId));

    const status = computed(() => cardStore.getStatusCard(props.card));
    const statusText = computed(() => {
        if (status.value === 'ready') return 'Готова к повторению';
        if (status.value === 'overdue') return 'Просрочено';
        return status.value.value;
    });

    const sectionName = computed(() => sectionStore.getSection(props.card.sectionId)?.name ?? '');
</script>

<template>
    <CardContainer
        :hover="false"
        :theme="typeof status !== 'string' ? 'main' : status"
    >
        <div class="planCard">
            <div class="topContent">
                <div
                    class="iconContainer"
                    :class="typeof status !== 'string' ? 'main' : status"
                >
                    <IconSprite
                        name="calendar"
                        class="icon"
                    />
                </div>
                <div
                    class="textContainer"
                    :class="typeof status !== 'string' ? 'main' : status"
                >
                    <CustomText
                        class="date"
                        :text="getDayMonth(card.repeatInfo.nextRepeat)"
                        size="xl"
                    />
                    <CustomText
                        class="dateInfo"
                        text="•"
                        size="sm"
                    />
                    <CustomText
                        class="dateInfo"
                        :text="cardStore.getWeekDay(card)"
                        size="sm"
                    />
                    <CustomText
                        v-if="status === 'overdue'"
                        class="dateInfo"
                        text="•"
                        size="sm"
                    />
                    <CustomText
                        v-if="status === 'overdue'"
                        class="dateInfo"
                        :text="statusText"
                        size="sm"
                    />
                </div>
            </div>
            <div
                class="bottomContent"
                @click="handleTransferToCards"
            >
                <div class="cardInfo">
                    <CustomText
                        class="name"
                        :text="card.name"
                        size="xl"
                    />
                    <CustomText
                        class="sectionName"
                        :text="sectionName"
                        size="xs"
                    />
                </div>
                <CustomText
                    class="dateAgo"
                    :text="`${useTimeAgoIntl(card.repeatInfo.nextRepeat).value}`"
                    size="sm"
                />
            </div>
        </div>
    </CardContainer>
</template>

<style scoped lang="scss">
    .planCard {
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);

        .topContent {
            display: flex;
            align-items: center;
            gap: var(--gap-3);
            flex: 1;

            .iconContainer {
                background-color: var(--bg-purple-100);
                border-radius: var(--radius-xl);
                padding: var(--padding-3);

                .icon {
                    color: var(--text-purple-650);
                }

                &.ready {
                    background-color: var(--bg-yellow-100);

                    .icon {
                        color: var(--text-yellow-700);
                    }
                }

                &.overdue {
                    background-color: var(--bg-pink-100);

                    .icon {
                        color: var(--text-pink-700);
                    }
                }
            }

            .textContainer {
                display: flex;
                align-items: end;
                gap: var(--gap-2);
                flex: 1;
                flex-wrap: wrap;

                .dateInfo {
                    color: var(--text-purple-650);
                }

                &.ready {
                    .date {
                        color: var(--text-yellow-900);
                    }

                    .dateInfo {
                        color: var(--text-yellow-700);
                    }
                }

                &.overdue {
                    .date {
                        color: var(--text-pink-900);
                    }

                    .dateInfo {
                        color: var(--text-pink-700);
                    }
                }
            }
        }

        .bottomContent {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--gap-3);

            border: 2px var(--border-purple-200) solid;
            border-radius: var(--radius-2xl);

            padding: var(--padding-4);

            transition: all 0.2s;

            cursor: pointer;

            &:hover {
                border-color: var(--border-purple-400);
                padding: var(--padding-5);
            }

            .cardInfo {
                display: flex;
                flex-direction: column;
                gap: var(--gap-3);

                .sectionName {
                    color: var(--text-purple-500);
                }
            }

            .dateAgo {
                background-color: var(--bg-purple-100);
                color: var(--text-purple-500);
                padding: var(--padding-2);
                border-radius: var(--radius-2xl);
            }
        }
    }
</style>
