<script setup lang="ts">
    import { ICard, useCardStore } from '@stores/cards';

    import { ref } from 'vue';

    import IconSprite from '@/shared/ui/assets/icons/IconSprite.vue';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    import { useBreakpoints } from '@/composables';

    interface Props {
        card: ICard;
        whenNextCard: () => void;
    }
    const props = withDefaults(defineProps<Props>(), {});

    const cardStore = useCardStore();

    const { isMobileAndTablet } = useBreakpoints();

    const isTextVisible = ref(false);
    const handleCheckText = () => (isTextVisible.value = true);
    const handleHideText = () => (isTextVisible.value = false);

    const handleCompete = () => {
        cardStore.rememberCard(props.card);
        handleHideText();
    };
    const handleReturnCard = () => {
        cardStore.forgetCard(props.card);
        handleHideText();
        props.whenNextCard();
    };
</script>

<template>
    <div
        v-if="!isTextVisible"
        class="reviewCard"
        :class="{
            ['reviewCardMobile']: isMobileAndTablet,
        }"
    >
        <div class="nameContainer">
            <CustomText
                class="name"
                :text="card.name"
                type="header"
            />
        </div>
        <IconSprite
            class="icon"
            name="brain"
        />
        <CustomText
            class="hint"
            text="Постарайтесь вспомнить содержимое..."
            size="lg"
        />
        <div class="buttonContainer">
            <CustomButton
                class="button completeButton"
                icon="checkCircle"
                text="Я отлично помню текст"
                size="200"
                :when-click="handleCompete"
            />
            <CustomButton
                class="button checkTextButton"
                theme="transparent"
                :shadow="false"
                icon="eye"
                text="Проверить себя (показать текст)"
                size="200"
                :when-click="handleCheckText"
            />
        </div>
    </div>
    <div
        v-else
        class="reviewCardTextVisible"
        :class="{
            ['reviewCardTextVisibleMobile']: isMobileAndTablet,
        }"
    >
        <div class="nameContainer">
            <CustomText
                class="name"
                :text="card.name"
                type="header"
            />
        </div>
        <div class="contentContainer">
            <div class="textContainer">
                <CustomText
                    class="text"
                    :text="card.text"
                    size="lg"
                />
            </div>
            <CustomText
                class="hint"
                text="Как хорошо вы вспомнили?"
            />
            <div class="buttonContainer">
                <CustomButton
                    class="button returnCardButton"
                    theme="red"
                    :shadow="false"
                    icon="xCircle"
                    :text="isMobileAndTablet ? '' : 'Нужно повторить'"
                    size="200"
                    :when-click="handleReturnCard"
                />
                <CustomButton
                    class="button completeButton"
                    icon="checkCircle"
                    :text="isMobileAndTablet ? '' : 'Помню отлично'"
                    size="200"
                    :when-click="handleCompete"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .reviewCard,
    .reviewCardTextVisible {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 35rem;

        background-color: var(--bg-white);

        border-radius: var(--radius-3xl);
        padding: var(--padding-7) var(--padding-4);

        box-shadow: var(--shadow-lg);

        .nameContainer {
            max-height: 6rem;
            overflow: hidden;
            overflow-y: auto;

            line-height: var(--line-height-normal);

            width: 75%;

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
                background: linear-gradient(-30deg, var(--bg-purple-400), var(--bg-pink-500));
                border-radius: 10px;
            }

            .name {
                font-size: var(--text-3xl);
                text-align: center;
            }
        }

        .completeButton {
            background-image: linear-gradient(
                0.25turn,
                var(--bg-lazure-100),
                var(--bg-lazure-200),
                var(--bg-lazure-100)
            );

            background-size: 200% 100%;
            background-position: 0% 0%;
            transition: transform 0.2s ease;

            &:hover {
                transform: translateY(-5px);
                animation: spinGradient 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
        }

        @keyframes spinGradient {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 200% 0%;
            }
        }

        .icon,
        .hint {
            color: var(--text-purple-630);
        }

        .hint {
            text-align: center;
        }

        &Mobile {
            width: 90dvw;

            padding: var(--padding-5) var(--padding-4);

            .name {
                font-size: var(--text-3xl);
            }
        }
    }
    .reviewCard {
        gap: var(--gap-8);

        &Mobile {
            gap: var(--gap-6);
        }

        .icon {
            width: 2.5rem;
            height: 2.5rem;
        }

        .buttonContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--gap-4);

            .button {
                width: 100%;
                border-radius: var(--radius-3xl);
            }

            .checkTextButton {
                border: 2px var(--border-purple-200) solid;
            }
        }
    }

    .reviewCardTextVisible {
        gap: var(--gap-7);

        &Mobile {
            gap: var(--gap-4);
        }

        .contentContainer {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--gap-6);

            width: 100%;

            .textContainer {
                max-height: 17rem;
                overflow: hidden;
                overflow-y: auto;

                line-height: var(--line-height-normal);

                padding: var(--padding-2) var(--padding-7);

                &::-webkit-scrollbar {
                    width: 6px;
                }

                &::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }

                &::-webkit-scrollbar-thumb {
                    background: linear-gradient(-30deg, var(--bg-purple-400), var(--bg-pink-500));
                    border-radius: 10px;
                }

                .text {
                    white-space: pre-wrap;
                    overflow-wrap: break-word;
                }
            }

            .buttonContainer {
                display: flex;
                gap: var(--gap-4);

                width: 100%;

                .button {
                    flex: 1;
                    flex-direction: column;
                    border-radius: var(--radius-3xl);
                }

                .returnCardButton {
                    .text {
                        color: var(--text-red-600);
                    }
                }
            }
        }

        &Mobile {
            .contentContainer {
                .textContainer {
                    max-height: 10rem;
                }
            }
        }
    }
</style>
