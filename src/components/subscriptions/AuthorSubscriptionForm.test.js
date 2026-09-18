import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AuthorSubscriptionForm from './AuthorSubscriptionForm.vue'

const authors = [
  { id: 1, full_name: 'Роберт Мартин' },
  { id: 2, full_name: 'Мартин Фаулер' },
]

describe('форма подписки на автора', () => {
  it('подписывает гостя на всех выбранных по умолчанию авторов книги', async () => {
    const wrapper = mount(AuthorSubscriptionForm, { props: { authors } })

    await wrapper.get('input[type="tel"]').setValue('+79991234567')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('subscribe')).toEqual([[{ phone: '+79991234567', authorIds: [1, 2] }]])
  })
})
