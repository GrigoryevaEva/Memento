<script setup lang="ts">
    import { onMounted, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import { useAppStore } from '@/stores/app';
    import { useAuthStore } from '@/stores/auth';

    import CustomButton from '@/shared/ui/components/CustomButton.vue';
    import CustomText from '@/shared/ui/components/CustomText.vue';
    import LogoContainer from '@/shared/ui/components/LogoContainer.vue';

    import { useBreakpoints } from '@/composables';

    import { AUTH_PATH, HOME_PATH } from './routing/constants';
    import Navigation from './routing/Navigation.vue';

    const { isMobileAndTablet } = useBreakpoints();

    const router = useRouter();

    const authStore = useAuthStore();
    const appStore = useAppStore();

    onMounted(() => authStore.checkAuth());

    watch(
        () => authStore.isAuth,
        (newValue) => {
            if (newValue) {
                appStore.initialize();
                router.push(HOME_PATH);
            }
        }
    );
</script>

<template>
    <header
        v-if="authStore.isAuth"
        :class="{ headerMobile: isMobileAndTablet }"
    >
        <LogoContainer />
        <Navigation v-if="!isMobileAndTablet" />
        <div class="user">
            <CustomText
                v-if="authStore.email"
                class="userName"
                :text="authStore.email"
            />
            <RouterLink :to="AUTH_PATH">
                <CustomButton
                    icon="logout"
                    theme="transparent"
                    :shadow="false"
                    :when-click="authStore.logout"
                />
            </RouterLink>
        </div>
    </header>

    <main :class="{ mainMobile: isMobileAndTablet }">
        <RouterView />
    </main>

    <footer v-if="isMobileAndTablet && authStore.isAuth">
        <Navigation />
    </footer>
</template>

<style scoped lang="scss">
    header {
        position: fixed;
        right: 0;
        left: 0;

        display: flex;
        align-items: center;
        gap: var(--gap-4);

        height: 4rem;
        max-width: 100vw;
        overflow: hidden;

        padding: 0 2rem;

        z-index: 100;

        .user {
            display: flex;
            align-items: center;
            gap: var(--gap-3);

            min-width: 0;

            color: var(--text-purple-700);

            &Name {
                color: var(--text-purple-700);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .headerMobile {
        padding: 0 1rem;

        .user {
            gap: 0;
        }
    }
    main {
        display: flex;
        flex-direction: column;
        gap: var(--gap-6);
        width: 100vw;
        min-height: max-content;
        height: 100vh;

        background-image: linear-gradient(
            -30deg,
            var(--bg-blue-50),
            var(--bg-pink-50),
            var(--bg-purple-100)
        );

        padding: 6.5rem 2.5rem;
    }
    .mainMobile {
        width: 100dvw;
        height: 100dvh;

        padding: 5.5rem 2.5rem;
    }
    footer {
        position: fixed;
        right: 0;
        left: 0;
        bottom: 0;

        display: flex;
        align-items: center;

        height: 4rem;

        padding: 0 var(--padding-2);
    }
    header,
    footer {
        background-color: var(--bg-white);
    }
</style>
