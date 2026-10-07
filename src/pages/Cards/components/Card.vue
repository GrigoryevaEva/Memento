<script setup lang="ts">
    import { computed } from 'vue';

    import { ICard, useCardStore } from '@/stores/cards';

    import Badge from '@/shared/ui/components/Badge.vue';
    import CardContainer from '@/shared/ui/components/CardContainer.vue';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import { useModalController } from '@/composables';

    interface Props {
        card: ICard;
        whenGetUpdateCard: (card: ICard) => void;
    }
    const props = withDefaults(defineProps<Props>(), {});

    const cardStore = useCardStore();

    const { isOpen: isExpandedText, toggle } = useModalController();

    const status = computed(() => cardStore.getStatusCard(props.card));
    const statusText = computed(() => {
        if (status.value === 'ready') return 'Готова к повторению';
        if (status.value === 'overdue') return 'Просрочено';
        return status.value.value;
    });

    const handleEdit = () => props.whenGetUpdateCard(props.card);

    const handleDelete = () => cardStore.deleteCard(props.card.id);
</script>

<template>
    <CardContainer
        :theme="typeof status !== 'string' ? 'main' : status"
        :when-edit="handleEdit"
        :when-delete="handleDelete"
    >
        <div class="card">
            <div class="cardHeader">
                <Badge
                    :class="`${status}Badge`"
                    :text="statusText"
                    size="sm"
                />
                <CustomText
                    :text="card.name"
                    size="lg"
                />
            </div>
            <div class="textContainer">
                <div class="iconContianer">
                    <CustomButton
                        class="icon"
                        theme="transparent"
                        :shadow="false"
                        :icon="isExpandedText ? 'chevronDown' : 'chevronRight'"
                        :when-click="toggle"
                    />
                </div>
                <CustomText
                    class="cardText"
                    :class="{ collapsed: !isExpandedText }"
                    :text="card.text"
                    size="sm"
                    light-font
                />
            </div>
            <div class="progressContainer">
                <Badge
                    class="percentBadge"
                    :text="cardStore.getLevelPercentCard(card)"
                    class-text="percentText"
                />
                <Badge
                    class="repetitionInfo"
                    :text="
                        card.repeatInfo.level === 0
                            ? 'Новая'
                            : `Этап ${card.repeatInfo.level}. Повторение ${cardStore.getDateRepeatCard(card)}`
                    "
                />
            </div>
            <div class="infoContainer">
                <CustomText
                    class="infoText"
                    :text="`Создана: ${cardStore.getDateCreateCard(card)}`"
                    size="xs"
                />
                <CustomText
                    class="infoText"
                    text="•"
                    size="xs"
                />
                <CustomText
                    class="infoText"
                    :text="`Забыта: ${card.forgetCount}`"
                    size="xs"
                />
            </div>
        </div>
    </CardContainer>
</template>

<style scoped lang="scss">
    .card {
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);

        flex: 1;
    }
    .cardHeader {
        display: flex;
        align-items: center;
        gap: var(--gap-2);
        flex-wrap: wrap;

        .readyBadge {
            background-color: var(--bg-yellow-100);
            color: var(--text-yellow-700);
        }
        .overdueBadge {
            background-color: var(--bg-pink-100);
            color: var(--text-pink-700);
        }
    }
    .textContainer {
        display: flex;
        align-items: center;
        gap: var(--gap-4);

        overflow: hidden;

        .iconContianer {
            display: flex;
            align-items: center;
        }
        .icon {
            color: var(--text-purple-700);
        }

        .cardText {
            color: var(--text-purple-700);
            white-space: pre-wrap;
            overflow-wrap: break-word;
        }
    }
    .progressContainer {
        display: flex;
        gap: var(--gap-2);
        flex-wrap: wrap;

        .percentBadge {
            background-color: var(--bg-blue-50);
            color: var(--text-blue-600);
        }
        .repetitionInfo {
            background-color: var(--bg-purple-50);
            color: var(--text-purple-700);
        }
    }
    .infoContainer {
        display: flex;
        gap: var(--gap-2);
        flex-wrap: wrap;

        .infoText {
            color: var(--text-purple-630);
        }
    }
    .collapsed {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        line-clamp: 2;
    }
</style>
