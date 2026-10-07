import Auth from '@pages/Auth/Auth.vue';
import Cards from '@pages/Cards/Cards.vue';
import Plan from '@pages/Plan/Plan.vue';
import Repetition from '@pages/Repetition/Repetition.vue';
import Sections from '@pages/Sections/Sections.vue';

import {
    createRouter,
    createWebHistory,
    type NavigationGuardNext,
    type RouteLocationNormalized,
} from 'vue-router';

import { useAuthStore } from '@/stores/auth';
import { useSectionStore } from '@/stores/sections';

const routes = [
    {
        path: '/',
        component: Sections,
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        component: Auth,
        meta: { requiresAuth: false, isPublic: true },
        beforeEnter: async (
            _to: RouteLocationNormalized,
            _from: RouteLocationNormalized,
            next: NavigationGuardNext
        ) => {
            const authStore = useAuthStore();

            if (authStore.isAuth) {
                next({
                    path: '/',
                });
            } else {
                next();
            }
        },
    },
    {
        path: '/sections/:id/cards',
        component: Cards,
        meta: { requiresAuth: true },
        beforeEnter: async (
            to: RouteLocationNormalized,
            _from: RouteLocationNormalized,
            next: NavigationGuardNext
        ) => {
            const sectionId = to.params.id;
            const store = useSectionStore();

            if (typeof sectionId !== 'string' || !store.hasSection(sectionId)) {
                next({
                    path: '/',
                    query: { error: 'section_not_found' },
                });
                return;
            }
            next();
        },
    },
    {
        path: '/repetition',
        component: Repetition,
        meta: { requiresAuth: true },
    },
    {
        path: '/plan',
        component: Plan,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(
    async (
        to: RouteLocationNormalized,
        _from: RouteLocationNormalized,
        next: NavigationGuardNext
    ) => {
        if (!to.meta.requiresAuth) {
            return next();
        }

        const authStore = useAuthStore();

        if (authStore.isAuth) {
            next();
        } else {
            next('/login');
        }
    }
);

export default router;
