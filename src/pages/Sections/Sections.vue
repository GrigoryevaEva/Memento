<script setup lang="ts">
    import { ref } from 'vue';

    import { useCardStore } from '@/stores/cards';
    import { ISection, useSectionStore } from '@/stores/sections';

    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import { useBreakpoints, useModalController } from '@/composables';

    import Modal from './components/Modal.vue';
    import Section from './components/Section.vue';
    import TimeRepetitionLabel from './components/TimeRepetitionLabel.vue';

    const cardStore = useCardStore();
    const sectionStore = useSectionStore();

    const { isOpen: isOpenModal, open, close, toggle } = useModalController();
    const { isMobileAndTablet } = useBreakpoints();

    const typeModal = ref<'create' | 'update'>('create');
    const curUpdateSection = ref<ISection | null>(null);
    const handleToggleCreateModal = () => {
        if (isOpenModal.value && typeModal.value === 'update') {
            typeModal.value = 'create';
            return;
        }
        toggle();
    };

    const handleOpenUpdateModal = (section: ISection) => {
        typeModal.value = 'update';
        curUpdateSection.value = section;
        open();
    };

    const handleCloseModal = () => {
        if (curUpdateSection.value) curUpdateSection.value = null;
        close();
    };
</script>

<template>
    <div class="sectionsHeader">
        <TimeRepetitionLabel v-if="cardStore.isRepetitionCards" />
        <div class="controlContainer">
            <CustomText
                text="Мои разделы"
                :type="isMobileAndTablet ? 'text' : 'header'"
                size="lg"
            />
            <CustomButton
                icon="plus"
                :text="isMobileAndTablet ? '' : 'Новый раздел'"
                :when-click="handleToggleCreateModal"
            />
        </div>
    </div>
    <Modal
        v-if="isOpenModal"
        :class="cardStore.isRepetitionCards ? 'marginXl' : 'margin'"
        :type="typeModal"
        :section="curUpdateSection"
        :when-close="handleCloseModal"
    />
    <div
        v-if="sectionStore.isEmptySections && !isOpenModal"
        class="emptyContainer"
    >
        <IconSprite
            name="folderOpen"
            class="icon"
        />
        <CustomText
            class="emptyText"
            text="Создайте первый раздел для ваших карточек"
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
        class="sectionTile"
        :class="{
            ['margin']: !isOpenModal && !cardStore.isRepetitionCards,
            ['marginXl']: !isOpenModal && cardStore.isRepetitionCards,
        }"
    >
        <Section
            v-for="section in sectionStore.sections"
            :key="section.id"
            :section="section"
            :when-get-update-section="handleOpenUpdateModal"
        />
    </div>
</template>

<style scoped lang="scss">
    .sectionsHeader {
        position: absolute;
        left: 0;
        right: 0;

        display: flex;
        flex-direction: column;
        gap: var(--gap-6);

        padding: 0 2.5rem;
    }
    .controlContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .emptyContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--gap-6);

        height: 100%;

        .icon {
            width: 4rem;
            height: 4rem;

            color: var(--bg-purple-300);
        }

        .emptyText {
            text-align: center;
        }

        .createButton {
            border-radius: var(--radius-full);

            height: 4rem;
            width: 4rem;
        }
    }

    .sectionTile {
        display: flex;
        gap: var(--gap-4);
        flex-wrap: wrap;
    }

    .margin {
        margin-top: 5rem;
    }

    .marginXl {
        margin-top: 12rem;
    }
</style>
