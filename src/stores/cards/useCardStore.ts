import Logger from 'js-logger';

import { defineStore } from 'pinia';
import { computed, ComputedRef, ref, toRaw } from 'vue';

import { useDateFormat, useNow, useTimeAgoIntl } from '@vueuse/core';

import { IApiError } from '@/api/base';
import { CardApi } from '@/api/card.api';
import { useDateFormatter, useRequestState } from '@/composables';

import {
    cardLevelsTSMap,
    FIRST_LEVEL,
    type ICard,
    type ICreateCardPayload,
    type IUpdateCardPayload,
    LAST_LEVEL,
    TCardLevels,
} from '../cards';

export const useCardStore = defineStore('cards', () => {
    const cards = ref<ICard[]>([]);
    const isEmptyCards = computed(() => cards.value.length === 0);
    const isRepetitionCards = computed(() =>
        cards.value.some((card) => {
            const status = getStatusCard(card);
            return status === 'ready' || status === 'overdue';
        })
    );

    const createState = useRequestState();
    const updateState = useRequestState();
    const deleteState = useRequestState();

    const now = useNow();
    const tsNowUTC = computed(() => now.value.getTime());

    const { getDateOnly, getTimeWithDate } = useDateFormatter();

    const getCard = (cardId: string): ICard | null => {
        const card = toRaw(cards.value.find((card) => card.id === cardId));
        if (!card) {
            Logger.error(`This card (${cardId}) does not exist`);
            return null;
        }
        Logger.info(`Get card (${cardId})`);
        return card;
    };

    const getSectionCards = (sectionId: string): ICard[] => {
        const sectionCards = cards.value
            .filter((card) => card.sectionId === sectionId)
            .sort((a, b) => b.create - a.create);
        Logger.info(`Get section (${sectionId}) cards`);
        return sectionCards;
    };

    const getWeekDay = (card: ICard) => {
        return useDateFormat(card.repeatInfo.nextRepeat, 'dddd').value;
    };

    const getNotNewCards = () => {
        return cards.value
            .filter((card) => card.repeatInfo.level !== FIRST_LEVEL)
            .sort((a, b) => b.repeatInfo.nextRepeat - a.repeatInfo.nextRepeat);
    };

    const getRepetitionCards = (): ICard[] => {
        if (!isRepetitionCards.value) return [];
        return cards.value.filter((card) => {
            const status = getStatusCard(card);
            return status === 'ready' || status === 'overdue';
        });
    };

    const getCountSectionCards = (sectionId: string) => {
        return cards.value.reduce((acc, card) => (card.sectionId === sectionId ? acc + 1 : acc), 0);
    };

    const getCountNewSectionCards = (sectionId: string) => {
        return cards.value.reduce((acc, card) => {
            if (card.sectionId === sectionId) {
                return card.repeatInfo.level === 0 ? acc + 1 : acc;
            }
            return acc;
        }, 0);
    };

    const getCountOverdueSectionCards = (sectionId: string) => {
        return cards.value.reduce((acc, card) => {
            if (card.sectionId === sectionId) {
                return getStatusCard(card) === 'overdue' ? acc + 1 : acc;
            }
            return acc;
        }, 0);
    };

    const getDateRepeatCard = (card: ICard) => {
        if (card.repeatInfo.level < 4) {
            return getTimeWithDate(card.repeatInfo.nextRepeat);
        } else {
            return getDateOnly(card.repeatInfo.nextRepeat);
        }
    };

    const getDateCreateCard = (card: ICard) => {
        return getDateOnly(card.create);
    };

    const getLevelPercentCard = (card: ICard) => {
        return `${cardLevelsTSMap[card.repeatInfo.level].percent}%`;
    };

    const getStatusCard = (card: ICard): 'ready' | 'overdue' | ComputedRef<string> => {
        const nextRepeat = card.repeatInfo.nextRepeat;
        const level = card.repeatInfo.level;

        if (level === 0) return 'ready';

        if (level < 4) {
            return nextRepeat < tsNowUTC.value
                ? 'overdue'
                : useTimeAgoIntl(nextRepeat, { locale: 'ru' });
        }

        const isToday =
            useDateFormat(nextRepeat, 'YYYY-MM-DD').value ===
            useDateFormat(now, 'YYYY-MM-DD').value;
        if (isToday) return 'ready';

        return nextRepeat < tsNowUTC.value
            ? 'overdue'
            : useTimeAgoIntl(nextRepeat, { locale: 'ru' });
    };

    const setCards = (newCards: ICard[]) => {
        // the main request is at the app level
        cards.value = newCards;
        Logger.info(`Cards initialized`);
    };

    const forgetCard = (card: ICard) => {
        const returnLevel = cardLevelsTSMap[card.repeatInfo.level].returnLevel;

        const payload = {
            forgetCount: card.repeatInfo.level === 0 ? 0 : card.forgetCount + 1,
            repeatInfo: {
                level: returnLevel,
                nextRepeat: cardLevelsTSMap[returnLevel].ts + tsNowUTC.value,
            },
        };
        updateCard(card.id, payload);
    };

    const rememberCard = (card: ICard) => {
        // TODO
        if (card.repeatInfo.level + 1 === LAST_LEVEL) return;

        const nextLevel = (card.repeatInfo.level + 1) as TCardLevels;

        const payload = {
            repeatInfo: {
                level: nextLevel,
                nextRepeat: cardLevelsTSMap[nextLevel].ts + tsNowUTC.value,
            },
        };
        updateCard(card.id, payload);
    };

    const createCard = async (payload: ICreateCardPayload) => {
        try {
            createState.startRequest();
            const response = await CardApi.createCard(payload);
            cards.value.push(response);

            Logger.info(`Card is successfully created: ${response.id}`);
            createState.successRequest();
        } catch (e) {
            const error = e as IApiError;
            createState.errorRequest(error.status);
            Logger.error(`Error api request createCard ${error.message}`);
        }
    };

    const updateCard = async (cardId: string, payload: IUpdateCardPayload) => {
        const card = getCard(cardId);
        if (!card) {
            Logger.error(`Failed update card (${cardId}) because: This card does not exist`);
            return null;
        }
        const index = cards.value.indexOf(card);

        try {
            updateState.startRequest();
            const response = await CardApi.updateCard(cardId, payload);
            cards.value[index] = response;
            Logger.info(`Cards is successfully updated: ${response.id}`);
            updateState.successRequest();
        } catch (e) {
            const error = e as IApiError;
            updateState.errorRequest(error.status);
            Logger.error(`Error api request updateCard ${error.message}`);
        }
    };

    const deleteCard = async (cardId: string) => {
        const card = getCard(cardId);
        if (!card) {
            Logger.error(`Failed delete card (${cardId}) because: This card does not exist`);
            return;
        }
        const index = cards.value.indexOf(card);
        try {
            deleteState.startRequest();
            await CardApi.deleteCard(cardId);
            cards.value.splice(index, 1);
            Logger.info(`Cards is successfully deleted: ${cardId}`);
            deleteState.successRequest();
        } catch (e) {
            const error = e as IApiError;
            deleteState.errorRequest(error.status);
            Logger.error(`Error api request deleteCard ${error.message}`);
        }
    };

    const deleteSectionCards = (sectionId: string) => {
        // The verification of the successful api of
        // the section deletion request is at
        // the Section store level, so here we assume that
        // the section has already been successfully deleted
        cards.value = cards.value.filter((card) => card.sectionId !== sectionId);
        Logger.info(`All section (${sectionId}) cards is deleted`);
    };

    return {
        isEmptyCards,
        tsNowUTC,
        isRepetitionCards,

        getSectionCards,
        getRepetitionCards,
        getCountSectionCards,
        getCountNewSectionCards,
        getCountOverdueSectionCards,
        getDateCreateCard,
        getDateRepeatCard,
        getLevelPercentCard,
        getStatusCard,
        getNotNewCards,
        getWeekDay,

        setCards,

        forgetCard,
        rememberCard,

        createCard,
        createState,

        updateCard,
        updateState,

        deleteCard,
        deleteState,

        deleteSectionCards,
    };
});
