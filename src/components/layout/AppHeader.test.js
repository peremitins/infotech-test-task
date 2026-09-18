import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AppHeader from './AppHeader.vue'

const RouterLinkStub = {
  template: '<a class="router-link"><slot /></a>',
}

describe('шапка приложения', () => {
  it('оставляет основную навигацию одной группой и отправляет событие выхода', async () => {
    const wrapper = mount(AppHeader, {
      props: {
        isAuthenticated: true,
        username: 'admin',
      },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })

    expect(wrapper.findAll('.app-header__nav .router-link')).toHaveLength(3)
    expect(wrapper.text()).toContain('Книги')
    expect(wrapper.text()).toContain('Авторы')
    expect(wrapper.text()).toContain('Отчёт')

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('logout')).toHaveLength(1)
  })
})
