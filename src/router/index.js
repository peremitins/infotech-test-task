import { createRouter, createWebHashHistory } from 'vue-router'
import AuthorEditView from '../views/AuthorEditView.vue'
import AuthorView from '../views/AuthorView.vue'
import AuthorsView from '../views/AuthorsView.vue'
import BookEditView from '../views/BookEditView.vue'
import BookView from '../views/BookView.vue'
import BooksView from '../views/BooksView.vue'
import LoginView from '../views/LoginView.vue'
import ReportView from '../views/ReportView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/books' },
    { path: '/books', name: 'books', component: BooksView },
    {
      path: '/books/new',
      name: 'book-create',
      component: BookEditView,
      meta: { requiresAuth: true },
    },
    { path: '/books/:id', name: 'book', component: BookView, props: true },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookEditView,
      props: true,
      meta: { requiresAuth: true },
    },
    { path: '/authors', name: 'authors', component: AuthorsView },
    {
      path: '/authors/new',
      name: 'author-create',
      component: AuthorEditView,
      meta: { requiresAuth: true },
    },
    { path: '/authors/:id', name: 'author', component: AuthorView, props: true },
    {
      path: '/authors/:id/edit',
      name: 'author-edit',
      component: AuthorEditView,
      props: true,
      meta: { requiresAuth: true },
    },
    { path: '/reports/top-authors', name: 'report', component: ReportView },
    { path: '/login', name: 'login', component: LoginView },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('infotech-book-token'))
    return { name: 'login', query: { next: to.fullPath } }
  return true
})

export default router
