<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    import { ICard, useCardStore } from '@/stores/cards';
    import { useSectionStore } from '@/stores/sections';

    import { sectionColors } from '@/shared/constants/ui.ts';
    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import { useBreakpoints, useModalController } from '@/composables';

    import Card from './components/Card.vue';
    import Modal from './components/Modal.vue';

    const route = useRoute();
    const router = useRouter();

    const sectionStore = useSectionStore();
    const cardStore = useCardStore();

    const { isMobileAndTablet } = useBreakpoints();

    const sectionId = route.params['id'] as string;
    const section = sectionStore.getSection(sectionId);
    const sectionCards = computed(() => cardStore.getSectionCards(sectionId));

    const { isOpen: isOpenModal, open, close, toggle } = useModalController();
    const typeModal = ref<'create' | 'update'>('create');
    const curUpdateCard = ref<ICard | null>(null);
    const handleToggleCreateModal = () => {
        if (isOpenModal.value && typeModal.value === 'update') {
            typeModal.value = 'create';
            return;
        }
        toggle();
    };

    const handleOpenUpdateModal = (card: ICard) => {
        typeModal.value = 'update';
        curUpdateCard.value = card;
        open();
    };

    const handleCloseModal = () => {
        if (curUpdateCard.value) curUpdateCard.value = null;
        close();
    };
</script>

<template>
    <div class="cardsHeader">
        <div class="cardsHeaderLeft">
            <CustomButton
                theme="transparent"
                :shadow="false"
                icon="arrowLeft"
                :when-click="router.back"
            />
            <div class="sectionInfo">
                <div
                    class="sectionIconContainer"
                    :class="`${section?.color ?? sectionColors[0]}BcgColor`"
                >
                    <IconSprite
                        name="folderOpen"
                        class="sectionIcon"
                    />
                </div>
                <CustomText
                    class="name"
                    :text="section?.name ?? ''"
                    type="header"
                />
            </div>
        </div>
        <CustomButton
            icon="plus"
            :text="isMobileAndTablet ? '' : 'Новая карточка'"
            :when-click="handleToggleCreateModal"
        />
    </div>
    <Modal
        v-if="isOpenModal"
        class="modal"
        :section-id="sectionId"
        :type="typeModal"
        :card="curUpdateCard"
        :when-close="handleCloseModal"
    />
    <div
        v-if="!sectionCards.length && !isOpenModal"
        class="emptyContainer"
    >
        <IconSprite
            name="fileText"
            class="icon"
        />
        <CustomText
            text="Создайте свою первую карточку"
            size="lg"
        />
        <CustomButton
            icon="plus"
            class="createButton"
            size="200"
            :when-click="open"
        />
    </div>
    <div
        v-else
        class="cardsTile"
        :class="{
            ['margin']: !isOpenModal,
        }"
    >
        <Card
            v-for="card in sectionCards"
            :key="card.id"
            :card="card"
            :when-get-update-card="handleOpenUpdateModal"
        />
    </div>
</template>

<style scoped lang="scss">
    .cardsHeader {
        position: absolute;
        left: 0;
        right: 0;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--gap-4);

        padding: 0 2.5rem;

        &Left {
            display: flex;
            align-items: center;
            gap: var(--gap-3);

            min-width: 0;
        }

        .sectionInfo {
            display: flex;
            align-items: center;
            gap: var(--gap-2);

            min-width: 0;
            max-width: 100%;

            .sectionIconContainer {
                padding: var(--padding-3);
                width: fit-content;
                border-radius: var(--radius-2xl);

                background-color: var(--bg-green-200);

                .sectionIcon {
                    width: 1.75rem;
                    height: 1.75rem;

                    color: var(--text-purple-700);
                }
            }

            .name {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .emptyContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--gap-6);

        width: 100%;
        height: 100%;

        .icon {
            width: 4rem;
            height: 4rem;

            color: var(--bg-purple-300);
        }

        .createButton {
            border-radius: var(--radius-full);

            height: 4rem;
            width: 4rem;
        }
    }
    .cardsTile {
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);
    }

    .margin,
    .modal {
        margin-top: 5rem;
    }
</style>
