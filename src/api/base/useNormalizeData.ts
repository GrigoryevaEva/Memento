import type { ICard, ICreateCardPayload, IUpdateCardPayload } from '@/stores/cards';
import type { ISection } from '@/stores/sections';

import type {
    ICardFromAPI,
    ICreateCardPayloadFromAPI,
    INormalizedData,
    ISectionFromAPI,
    IUpdateCardPayloadFromAPI,
} from './types';

export const useNormalizeData = () => {
    const normalizeSectionsData = (rawSections: ISectionFromAPI[]): INormalizedData => {
        const sections: ISection[] = [];
        const cards: ICard[] = [];

        for (const rawSection of rawSections) {
            sections.push(normalizeSection(rawSection));

            for (const rawCard of rawSection.cards) {
                cards.push(normalizeCard(rawCard));
            }
        }

        return { sections, cards };
    };

    const normalizeSection = (rawSection: ISectionFromAPI): ISection => {
        return {
            id: rawSection.id,
            name: rawSection.name,
            color: rawSection.color,
        };
    };

    const normalizeCard = (rawCard: ICardFromAPI): ICard => {
        return {
            id: rawCard.id,
            sectionId: rawCard.section_id,
            name: rawCard.name,
            text: rawCard.text,
            create: rawCard.created_at * 1000,
            forgetCount: rawCard.forget_count,
            repeatInfo: {
                level: rawCard.repeat_info.level as ICard['repeatInfo']['level'],
                nextRepeat: rawCard.repeat_info.next_repeat_at,
            },
        };
    };

    const denormalizeCard = (
        method: 'POST' | 'PATCH',
        rawCard: ICreateCardPayload | IUpdateCardPayload
    ): ICreateCardPayloadFromAPI | IUpdateCardPayloadFromAPI => {
        if (method === 'POST') {
            const card = rawCard as ICreateCardPayload;
            return {
                section_id: card.sectionId,
                name: card.name,
                text: card.text,
                forget_count: card.forgetCount,
                repeat_info: {
                    level: card.repeatInfo.level,
                    next_repeat_at: card.repeatInfo.nextRepeat,
                },
            };
        } else {
            const card = rawCard as IUpdateCardPayload;
            return Object.fromEntries(
                Object.entries({
                    section_id: card.sectionId,
                    name: card.name,
                    text: card.text,
                    forget_count: card.forgetCount,
                    repeat_info: card.repeatInfo && {
                        level: card.repeatInfo.level,
                        next_repeat_at: card.repeatInfo.nextRepeat,
                    },
                }).filter(([_, value]) => value !== undefined)
            );
        }
    };

    return {
        normalizeSectionsData,
        normalizeSection,
        normalizeCard,
        denormalizeCard,
    };
};
