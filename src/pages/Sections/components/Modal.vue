<script setup lang="ts">
    import { computed, ref, useTemplateRef, watch } from 'vue';

    import { ISection, useSectionStore } from '@/stores/sections';

    import { sectionColors } from '@/shared/constants';
    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomInput from '@/shared/ui/components/CustomInput.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';

    interface Props {
        section: ISection | null;
        type: 'create' | 'update';
        whenClose: () => void;
    }
    const props = withDefaults(defineProps<Props>(), {});

    const sectionStore = useSectionStore();

    const sectionForm = useTemplateRef('sectionForm');
    const formData = ref({
        name: props.section?.name || '',
        color: props.section?.color || sectionColors[0],
    });
    watch(
        () => props.type,
        (newValue) => {
            if (newValue === 'create') {
                formData.value.name = '';
                formData.value.color = sectionColors[0];
            } else {
                formData.value.name = props.section?.name || '';
                formData.value.color = props.section?.color || sectionColors[0];
            }
        }
    );

    const isTypeUpdate = computed(() => props.type === 'update');

    const handleClose = () => {
        formData.value.name = '';
        formData.value.color = sectionColors[0];
        props.whenClose();
    };

    const submitForm = () => {
        if (sectionForm.value) sectionForm.value.requestSubmit();
    };

    const handleSubmit = async () => {
        const data = {
            ...formData.value,
        };
        if (props.type === 'create') {
            await sectionStore.createSection(data);
        } else {
            if (!props.section) return;
            await sectionStore.updateSection(props.section.id, data);
        }
        if (sectionStore.createState.isSuccess || sectionStore.updateState.isSuccess) handleClose();
    };

    const handleSelectColor = (color: string) => {
        formData.value.color = color;
    };
</script>

<template>
    <div class="modal">
        <CustomText
            :text="isTypeUpdate ? 'Редактировать раздел' : 'Новый раздел'"
            size="lg"
        />
        <form
            ref="sectionForm"
            @submit.prevent="handleSubmit"
        >
            <CustomInput
                id="sectionName"
                v-model="formData.name"
                type="text"
                placeholder="Название раздела"
                required
            />
        </form>
        <div class="colorContainer">
            <CustomText
                class="label"
                text="Цвет:"
                size="sm"
            />
            <div class="colorTile">
                <div
                    v-for="color in sectionColors"
                    :key="color"
                    class="color"
                    :class="{
                        [color]: true,
                        ['select']: color === formData.color,
                    }"
                    @click="() => handleSelectColor(color)"
                ></div>
            </div>
        </div>
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
        gap: var(--gap-5);

        background-color: var(--bg-white);

        padding: var(--padding-6);

        border-radius: var(--radius-3xl);

        box-shadow: var(--shadow-lg);

        .colorContainer {
            display: flex;
            flex-direction: column;
            gap: var(--gap-2);

            .label {
                color: var(--text-purple-650);
            }

            .colorTile {
                display: flex;
                gap: var(--gap-2);
                flex-wrap: wrap;

                .color {
                    width: 3rem;
                    height: 3rem;

                    border-radius: var(--radius-full);
                }

                $colors: purple, pink, blue, green, yellow, orange;
                @each $color in $colors {
                    .#{$color} {
                        background-color: var(--bg-#{$color}-200);
                    }
                }

                .select {
                    border: 4px var(--border-purple-400) solid;

                    transition: all 0.1s;
                }
            }
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
