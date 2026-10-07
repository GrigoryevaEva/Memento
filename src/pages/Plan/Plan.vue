<script setup lang="ts">
    import { computed } from 'vue';
    import { useRouter } from 'vue-router';

    import { HOME_PATH } from '@/app/routing/constants';

    import { useCardStore } from '@/stores/cards';

    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import Card from './components/Card.vue';

    const cardStore = useCardStore();

    const router = useRouter();
    const handleTransferToHome = () => router.push(HOME_PATH);

    const cards = computed(() => cardStore.getNotNewCards());
</script>

<template>
    <div class="planHeader">
        <CustomButton
            theme="transparent"
            :shadow="false"
            icon="arrowLeft"
            :when-click="router.back"
        />
        <CustomText
            text="План повторений"
            type="header"
        />
    </div>
    <div
        v-if="!cards.length"
        class="emptyContainer"
    >
        <IconSprite
            name="checkCircle"
            class="icon"
        />
        <CustomText
            class="emptyText"
            text="Нет запланированных повторений"
            size="lg"
        />
        <CustomButton
            text="На главную"
            size="200"
            :when-click="handleTransferToHome"
        />
    </div>
    <div
        v-else
        class="cardsTile"
    >
        <Card
            v-for="card in cards"
            :key="card.id"
            :card="card"
        />
    </div>
</template>

<style scoped lang="scss">
    .planHeader {
        position: absolute;

        display: flex;
        align-items: center;
        gap: var(--gap-6);
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

    .cardsTile {
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);

        margin-top: 5rem;
    }
</style>
