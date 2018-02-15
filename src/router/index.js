import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login';
import SelectProject from '../components/SelectProject';
import Themes from '../components/Themes';
import Exam from '../components/Exam';
import Storage from 'vue-local-storage';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '*',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/project',
            name: 'project',
            component: SelectProject,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/exams',
            name: 'exams',
            component: Themes,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/exam/:theme_id',
            name: 'exam',
            component: Exam,
            meta: {
                requiresAuth: true
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        Storage.set("AuthStorage", undefined);
    }
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && Storage.get("AuthStorage") === undefined || Storage.get("AuthStorage") === null) {
        next('/login');
    } else {
        next();
    }
});

export default router;