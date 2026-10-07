<script setup lang="ts">
    import { computed, ref, toRaw, useTemplateRef, watch } from 'vue';

    import { ICard, ICreateCardPayload, IUpdateCardPayload, useCardStore } from '@/stores/cards';

    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomInput from '@/shared/ui/components/CustomInput.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    interface Props {
        sectionId: string;
        card: ICard | null;
        type: 'create' | 'update';
        whenClose: () => void;
    }

    const props = withDefaults(defineProps<Props>(), {});

    const cardStore = useCardStore();

    const isTypeUpdate = computed(() => props.type === 'update');

    const cardForm = useTemplateRef('cardForm');
    const formData = ref({
        sectionId: props.sectionId,
        name: props.card?.name || '',
        text: props.card?.text || '',
        forgetCount: 0,
        repeatInfo: {
            level: 0,
            nextRepeat: 0,
        },
    });
    watch(
        () => props.type,
        (newValue) => {
            if (newValue === 'create') {
                formData.value.name = '';
                formData.value.text = '';
            } else {
                formData.value.name = props.card?.name || '';
                formData.value.text = props.card?.text || '';
            }
        }
    );

    const handleClose = () => {
        formData.value.name = '';
        formData.value.text = '';
        props.whenClose();
    };

    const submitForm = () => {
        if (cardForm.value) cardForm.value.requestSubmit();
    };

    const handleSubmit = async () => {
        if (props.type === 'create') {
            const data = {
                ...toRaw(formData.value),
            };
            await cardStore.createCard(data as ICreateCardPayload);
        } else {
            if (!props.card) return;
            console.log(formData.value.text);
            const data = {
                name: formData.value.name,
                text: formData.value.text,
            };
            await cardStore.updateCard(props.card.id, data as IUpdateCardPayload);
        }
        if (cardStore.createState.isSuccess || cardStore.updateState.isSuccess) handleClose();
    };
</script>

<template>
    <div class="modal">
        <CustomText
            :text="isTypeUpdate ? 'Редактировать карточку' : 'Новая карточка'"
            size="lg"
        />
        <form
            ref="cardForm"
            class="cardForm"
            @submit.prevent="handleSubmit"
        >
            <CustomInput
                id="cardName"
                v-model="formData.name"
                type="text"
                placeholder="Название (например: А.С. Пушкин - Зимнее утро)"
                required
            />
            <CustomInput
                id="sectionName"
                v-model="formData.text"
                is-textarea
                type="text"
                placeholder="Текст для запоминания..."
                required
            />
        </form>
        <!-- TODO -->
        <!-- <div v-if="!isTypeUpdate">
            <div></div>
            <p>Карточка уже проходила повторения</p>
        </div> -->
        <div class="buttonsContainer">
            <CustomButton
                class="button"
                :text="isTypeUpdate ? 'Сохранить' : 'Создать'"
                :when-click="submitForm"
            />
            <CustomButton
                class="button cancel"
                text="Отмена"
                theme="transparent"
                :shadow="false"
                :when-click="handleClose"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
    .modal {
        display: flex;
        flex-direction: column;
        gap: var(--gap-4);

        background-color: var(--bg-white);

        padding: var(--padding-6);

        border-radius: var(--radius-3xl);

        box-shadow: var(--shadow-lg);

        .cardForm {
            display: flex;
            flex-direction: column;
            gap: var(--gap-3);
        }

        .buttonsContainer {
            display: flex;
            gap: var(--gap-3);

            .button {
                border-radius: var(--radius-3xl);

                padding: var(--padding-3) var(--padding-5);
            }

            .cancel {
                border: 2px var(--border-purple-200) solid;
            }
        }
    }
</style>
