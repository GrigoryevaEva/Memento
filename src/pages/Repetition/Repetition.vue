<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useRouter } from 'vue-router';

    import { HOME_PATH } from '@/app/routing/constants.ts';

    import { useCardStore } from '@/stores/cards';
    import { useSectionStore } from '@/stores/sections';

    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import { useBreakpoints } from '@/composables';

    import ProgressBar from './components/ProgressBar.vue';
    import ReviewCard from './components/ReviewCard.vue';

    const sectionStore = useSectionStore();
    const cardStore = useCardStore();
    const router = useRouter();

    const { isMobileAndTablet } = useBreakpoints();

    const handleTransferToHome = () => router.push(HOME_PATH);

    const cards = computed(() => cardStore.getRepetitionCards());

    const curIndexCard = ref(0);
    const curCard = computed(() => cards.value[curIndexCard.value] ?? null);
    const curSectionName = computed(
        () => sectionStore.getSection(curCard.value?.sectionId ?? '')?.name ?? ''
    );

    const handleNextCard = () => {
        if (curIndexCard.value + 1 > cards.value.length - 1) {
            curIndexCard.value = 0;
        } else {
            curIndexCard.value = curIndexCard.value + 1;
        }
    };
</script>

<template>
    <div
        v-if="!isMobileAndTablet"
        class="repetitionHeader"
    >
        <CustomButton
            theme="transparent"
            :shadow="false"
            icon="arrowLeft"
            :when-click="router.back"
        />
        <CustomText
            text="Повторение"
            type="header"
        />
    </div>
    <div
        class="repetition"
        :class="{
            ['repetitionMobile']: isMobileAndTablet,
        }"
    >
        <div
            v-if="curCard"
            class="content"
        >
            <div class="progressContainer">
                <CustomText
                    :text="`Из раздела «${curSectionName}»`"
                    size="xl"
                />
                <ProgressBar :count-cards="cards.length" />
            </div>
            <ReviewCard
                :card="curCard"
                :when-next-card="handleNextCard"
            />
        </div>
        <div
            v-else
            class="emptyContainer"
        >
            <IconSprite
                name="checkCircle"
                class="icon"
            />
            <CustomText
                text="Все выучено!"
                type="header"
            />
            <CustomText
                class="emptyText"
                text="На данный момент нет карточек для повторения"
                size="lg"
            />
            <CustomButton
                text="На главную"
                size="200"
                :when-click="handleTransferToHome"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
    .repetitionHeader {
        position: fixed;

        display: flex;
        align-items: center;
        gap: var(--gap-6);
    }
    .repetition {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 100%;

        .content {
            display: flex;
            flex-direction: column;
            gap: var(--gap-4);

            .progressContainer {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
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
        }
    }
</style>
